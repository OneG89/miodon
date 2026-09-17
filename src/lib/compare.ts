import { compareGroups } from '../data/comparisons';
import { diseaseMap, vaccineMap, vaccines } from '../data';
import type { Vaccine } from '../types';

/** 某疫苗所属的「免费 vs 自费」对比组 */
export function groupForVaccine(vaccineId: string) {
  return compareGroups.find((g) => g.vaccineIds.includes(vaccineId));
}

export interface RelatedVaccine {
  vaccine: Vaccine;
  reason: string;
  groupId?: string;
}

/**
 * 自动推导与某疫苗「预防疾病有重叠」的其他疫苗（用于详情页对比引导）。
 * 依据 diseaseIds 交集：如脊灰 ↔ 五联、百白破 ↔ 五联/四联、一类流脑 ↔ 自费流脑。
 */
export function relatedVaccines(vaccineId: string): RelatedVaccine[] {
  const me = vaccineMap[vaccineId];
  if (!me) return [];
  const myGroup = groupForVaccine(vaccineId)?.id;
  const out: RelatedVaccine[] = [];

  for (const v of vaccines) {
    if (v.id === vaccineId) continue;
    const shared = v.diseaseIds.filter((d) => me.diseaseIds.includes(d));
    if (shared.length === 0) continue;
    const names = shared.map((d) => diseaseMap[d]?.name).filter(Boolean).join('、');

    let reason: string;
    if (v.id === 'v-pentavalent') {
      reason = `五联是联合疫苗，一针含${names}等组分，可替代对应免费针次、大幅减少针次`;
    } else if (v.id === 'v-quadrivalent') {
      reason = `四联是联合疫苗，含${names}组分，可替代百白破免费针并同时防 Hib`;
    } else if (v.id === 'v-hib') {
      reason = 'Hib 单苗（五联/四联也含该组分），免费程序不覆盖 Hib';
    } else if (v.id === 'v-meningo-self') {
      reason = '自费结合/四价流脑：覆盖相同疾病且保护更广（结合工艺 2 岁以下有效），可替代免费程序';
    } else if (v.id === 'v-meningo-nip') {
      reason = '免费流脑程序（A 群/AC 多糖），自费结合疫苗可替代升级';
    } else if (v.category === 'nip') {
      reason = `免费程序疫苗，覆盖${names}`;
    } else {
      reason = `预防疾病重叠：${names}`;
    }

    out.push({ vaccine: v, reason, groupId: groupForVaccine(v.id)?.id ?? myGroup });
  }
  return out;
}
