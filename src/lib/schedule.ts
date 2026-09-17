import { vaccines } from '../data';
import type { CalendarDose, VaccinationRecord, Vaccine } from '../types';
import { buildPlanCalendar, type PlanChoices } from './planner';

export type { PlanChoices };

/**
 * 由宝宝出生日期 + 方案选择 + 接种记录，生成全程接种日历。
 * 联合疫苗替换、同日可接种提示、流感年度提醒均由排针引擎处理（见 lib/planner.ts）。
 */
export function buildCalendar(
  birthDate: string,
  records: VaccinationRecord[],
  choices: PlanChoices | null = null,
  now: Date = new Date(),
): CalendarDose[] {
  return buildPlanCalendar(birthDate, records, choices, now);
}

export function nextDueDoses(doses: CalendarDose[], limit = 3): CalendarDose[] {
  return doses.filter((d) => d.status !== 'done').slice(0, limit);
}

/** 完成进度：已种剂次 / 全部剂次 */
export function progressStats(doses: CalendarDose[]): { done: number; total: number; pct: number } {
  const countable = doses.filter((d) => !d.reminder);
  const done = countable.filter((d) => d.status === 'done').length;
  const total = countable.length;
  return { done, total, pct: total === 0 ? 0 : Math.round((done / total) * 100) };
}

export function vaccinesForCompare(): Vaccine[] {
  return vaccines.filter((v) => v.productIds.length > 1);
}
