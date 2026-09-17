import { vaccines, vaccineMap } from '../data';
import type { CalendarDose, VaccinationRecord, Vaccine } from '../types';
import { dateAtAge, daysFromNow } from './age';
import { format, parseISO } from 'date-fns';

/** 方案选择：启用的二类疫苗 id 列表（一类始终包含，受替换规则影响） */
export interface PlanChoices {
  /** 启用的自费疫苗 id */
  enabled: string[];
  presetId?: string;
}

/**
 * 联合疫苗替换规则：启用某自费疫苗后，被覆盖的一类/其他自费剂次不再出现在日历中。
 * doseIndices 缺省 = 替换该疫苗全部剂次。
 */
export const REPLACEMENTS: Record<
  string,
  { replaces: { vaccineId: string; doseIndices?: number[] }[]; note: string }
> = {
  'v-pentavalent': {
    note: '五联 4 剂均含灭活脊灰(IPV)，完成全程即视为完成脊灰免疫（4 月龄、4 岁的 bOPV 均无需再服）；同时覆盖免费百白破前 4 剂与 Hib，四联不再重复接种；6 周岁仍需接种第 5 剂百白破',
    replaces: [
      { vaccineId: 'v-dtap', doseIndices: [1, 2, 3, 4] },
      { vaccineId: 'v-polio' },
      { vaccineId: 'v-hib' },
      { vaccineId: 'v-quadrivalent' },
    ],
  },
  'v-quadrivalent': {
    note: '四联含百白破 + Hib，免费百白破前 4 剂与单独 Hib 不再接种（脊灰仍按免费程序）',
    replaces: [
      { vaccineId: 'v-dtap', doseIndices: [1, 2, 3, 4] },
      { vaccineId: 'v-hib' },
    ],
  },
  'v-hib': {
    note: '已单独接种 Hib 即无需四联/五联覆盖该组分',
    replaces: [{ vaccineId: 'v-quadrivalent' }],
  },
  'v-meningo-self': {
    note: '自费 AC 结合 / 四价流脑替代一类 A 群、A+C 多糖程序',
    replaces: [{ vaccineId: 'v-meningo-nip' }],
  },
};

/** 互斥组：组内只能选一个（五联/四联/Hib 三选一覆盖百白破+Hib 需求） */
export const MUTUALLY_EXCLUSIVE: string[][] = [
  ['v-pentavalent', 'v-quadrivalent', 'v-hib'],
];

export const SELF_PAID_PRICES: Record<string, { min: number; max: number; doses: string }> = {
  'v-pentavalent': { min: 2400, max: 2800, doses: '4 剂' },
  'v-quadrivalent': { min: 1040, max: 1600, doses: '4 剂' },
  'v-hib': { min: 180, max: 640, doses: '4 剂（国产/进口）' },
  'v-pcv13': { min: 1850, max: 2900, doses: '4 剂' },
  'v-rotavirus': { min: 660, max: 1000, doses: '3 剂（三价/五价/六价）' },
  'v-ev71': { min: 360, max: 560, doses: '2 剂' },
  'v-flu': { min: 300, max: 1500, doses: '每年 1 剂（至 6 岁）' },
  'v-varicella': { min: 280, max: 400, doses: '2 剂' },
  'v-meningo-self': { min: 200, max: 1800, doses: '约 2–4 剂（AC 结合 / 四价结合）' },
};

export interface PlanPreset {
  id: string;
  name: string;
  slogan: string;
  enabled: string[];
  highlight: string;
}

export const PLAN_PRESETS: PlanPreset[] = [
  {
    id: 'basic',
    name: '免费基础方案',
    slogan: '只打免疫规划内的一类疫苗',
    enabled: [],
    highlight: '0 自费支出，覆盖国家要求的全部免费疫苗；肺炎球菌、Hib、轮状、手足口等二类疾病无保护',
  },
  {
    id: 'recommended',
    name: '安心精选方案',
    slogan: '疾病负担重 + 有硬窗口的优先',
    enabled: ['v-pcv13', 'v-rotavirus', 'v-ev71', 'v-flu', 'v-varicella'],
    highlight: '优先覆盖 2 岁前高发重症：13 价肺炎、轮状、手足口，加上每年流感和水痘；免费针照打',
  },
  {
    id: 'premium',
    name: '省心联合方案',
    slogan: '五联少打针，重点自费苗全选',
    enabled: ['v-pentavalent', 'v-pcv13', 'v-rotavirus', 'v-ev71', 'v-flu', 'v-varicella', 'v-meningo-self'],
    highlight: '五联把 18 月龄前约 12 个剂次（含 2 次口服脊灰）合并为 4 针，脊灰全程灭活、4 岁 bOPV 也免服；流脑升级结合/四价；防护最全、跑门诊次数最少',
  },
];

const DUE_SOON_DAYS = 30;
/** 流感年度提醒：每年 10 月 1 日（流感季开始），覆盖出生后第 2 个流感季起 */
const FLU_REMINDER_MONTH = 10; // 10 月
const FLU_REMINDER_DAY = 1;
const PAST_REMINDER_GRACE_DAYS = 150; // 超过流感季太久的过期提醒不再生成

function enabledSelfPaid(choices: PlanChoices | null): Set<string> {
  if (!choices) {
    // 未定制方案：默认展示全部（与旧行为一致）
    return new Set(vaccines.filter((v) => v.category === 'selfPaid').map((v) => v.id));
  }
  return new Set(choices.enabled);
}

/** 某疫苗某剂是否被启用的联合疫苗替换覆盖 */
function isReplaced(vaccineId: string, doseIndex: number, enabled: Set<string>): boolean {
  for (const id of enabled) {
    const rule = REPLACEMENTS[id];
    if (!rule) continue;
    for (const r of rule.replaces) {
      if (r.vaccineId === vaccineId && (!r.doseIndices || r.doseIndices.includes(doseIndex))) {
        return true;
      }
    }
  }
  return false;
}

function doseStatus(dueDate: string, record: VaccinationRecord | undefined, now: Date): CalendarDose['status'] {
  if (record) return 'done';
  const diff = daysFromNow(dueDate, now);
  if (diff < 0) return 'overdue';
  if (diff <= DUE_SOON_DAYS) return 'dueSoon';
  return 'upcoming';
}

/** 流感年度提醒剂次（出生后第 2 个流感季起，每年 10 月 1 日） */
function fluReminders(
  birthDate: string,
  records: VaccinationRecord[],
  doneMap: Map<string, VaccinationRecord>,
  now: Date,
): CalendarDose[] {
  const birth = parseISO(birthDate);
  const out: CalendarDose[] = [];
  let doseIndex = 3; // 首季 2 剂之后
  // 出生后第 2 个日历年起，连续提醒到 6 岁
  for (let year = birth.getFullYear() + 1; year <= birth.getFullYear() + 7; year++) {
    const dueISO = format(new Date(year, FLU_REMINDER_MONTH - 1, FLU_REMINDER_DAY), 'yyyy-MM-dd');
    const diff = daysFromNow(dueISO, now);
    if (diff < -PAST_REMINDER_GRACE_DAYS) { doseIndex++; continue; } // 太久远的过去流感季不再提示
    const key = `v-flu:${doseIndex}`;
    out.push({
      vaccineId: 'v-flu',
      vaccineName: vaccineMap['v-flu'].name,
      shortName: `流感疫苗（${year} 年流感季）`,
      category: 'selfPaid',
      doseIndex,
      ageLabel: `${year} 年秋季`,
      dueDate: dueISO,
      earliestDate: dueISO,
      status: doseStatus(dueISO, doneMap.get(key), now),
      record: records.find((r) => r.vaccineId === 'v-flu' && r.doseIndex === doseIndex && r.status === 'done'),
      reminder: true,
    });
    doseIndex++;
  }
  return out;
}

/**
 * 智能排针：由生日 + 方案选择 + 记录生成无冲突日历。
 * - 一类疫苗始终包含（被联合疫苗覆盖的剂次自动移除）
 * - 二类疫苗按方案选择包含
 * - 同一天多剂自动标注「可同时接种」
 * - 流感疫苗追加每年流感季提醒
 */
export function buildPlanCalendar(
  birthDate: string,
  records: VaccinationRecord[],
  choices: PlanChoices | null,
  now: Date = new Date(),
): CalendarDose[] {
  const enabled = enabledSelfPaid(choices);
  const doneMap = new Map(
    records.filter((r) => r.status === 'done').map((r) => [`${r.vaccineId}:${r.doseIndex}`, r]),
  );
  const skippedSet = new Set(
    records.filter((r) => r.status === 'skipped').map((r) => `${r.vaccineId}:${r.doseIndex}`),
  );

  const doses: CalendarDose[] = [];
  for (const v of vaccines) {
    if (v.category === 'selfPaid' && !enabled.has(v.id)) continue;
    for (const d of v.doses) {
      const key = `${v.id}:${d.doseIndex}`;
      if (skippedSet.has(key)) continue;
      if (isReplaced(v.id, d.doseIndex, enabled)) continue;
      const dueDate = dateAtAge(birthDate, d.ageMonths);
      doses.push({
        vaccineId: v.id,
        vaccineName: v.name,
        shortName: v.shortName,
        category: v.category,
        doseIndex: d.doseIndex,
        ageLabel: d.ageLabel,
        dueDate,
        earliestDate: dateAtAge(birthDate, d.minAgeMonths ?? d.ageMonths),
        status: doseStatus(dueDate, doneMap.get(key), now),
        record: doneMap.get(key),
      });
    }
  }

  // 流感年度提醒（仅在流感疫苗启用/未定制方案时）
  if (enabled.has('v-flu')) {
    doses.push(...fluReminders(birthDate, records, doneMap, now));
  }

  doses.sort((a, b) => a.dueDate.localeCompare(b.dueDate));

  // 同一天多剂 → 可同时接种提示
  const byDate = new Map<string, CalendarDose[]>();
  for (const d of doses) {
    if (d.status === 'done') continue;
    const list = byDate.get(d.dueDate) ?? [];
    list.push(d);
    byDate.set(d.dueDate, list);
  }
  for (const list of byDate.values()) {
    if (list.length > 1) {
      for (const d of list) {
        d.coScheduled = list.filter((x) => x !== d).map((x) => x.shortName);
      }
    }
  }
  return doses;
}

/** 方案统计：剂次、自费费用区间、预防疾病数 */
export function planStats(choices: PlanChoices): {
  doses: number;
  selfPaidDoses: number;
  costMin: number;
  costMax: number;
  diseases: number;
} {
  const enabled = enabledSelfPaid(choices);
  let doses = 0;
  let selfPaidDoses = 0;
  const diseaseSet = new Set<string>();
  for (const v of vaccines) {
    const isSelf = v.category === 'selfPaid';
    if (isSelf && !enabled.has(v.id)) continue;
    for (const d of v.doses) {
      if (isReplaced(v.id, d.doseIndex, enabled)) continue;
      doses++;
      if (isSelf) selfPaidDoses++;
    }
    if (!isSelf || enabled.has(v.id)) v.diseaseIds.forEach((id) => diseaseSet.add(id));
  }
  let costMin = 0;
  let costMax = 0;
  for (const id of enabled) {
    const p = SELF_PAID_PRICES[id];
    if (p) {
      costMin += p.min;
      costMax += p.max;
    }
  }
  return { doses, selfPaidDoses, costMin, costMax, diseases: diseaseSet.size };
}

/** 互斥检查：返回某疫苗被谁锁定（选中五联后，四联/Hib 禁用） */
export function lockReason(vaccineId: string, enabled: Set<string>): string | null {
  for (const group of MUTUALLY_EXCLUSIVE) {
    if (!group.includes(vaccineId)) continue;
    const other = group.find((id) => id !== vaccineId && enabled.has(id));
    if (other) return `已选择「${vaccineMap[other].shortName}」，二者覆盖内容重叠`;
  }
  return null;
}

/** 启用某疫苗的替换说明（用于 UI 提示） */
export function replacementNote(vaccineId: string): string | null {
  return REPLACEMENTS[vaccineId]?.note ?? null;
}

export function selfPaidVaccines(): Vaccine[] {
  return vaccines.filter((v) => v.category === 'selfPaid' && v.id !== 'v-hpv');
}
