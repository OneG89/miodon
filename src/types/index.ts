/** 疫苗类别：nip = 一类（国家免疫规划，免费）；selfPaid = 二类（自费自愿） */
export type VaccineCategory = 'nip' | 'selfPaid';

/** 临床数据可信度：published = 已发表研究；label = 疫苗说明书；pending = 待补充核实 */
export type DataQuality = 'published' | 'label' | 'pending';

export interface ClinicalStudy {
  /** 终点指标，如「侵袭性肺炎球菌疾病保护效力」「血清阳转率」 */
  endpoint: string;
  /** 结果描述，如「≥95% 婴幼儿达到保护性抗体水平」 */
  result: string;
  /** 样本量与研究人群 */
  population: string;
  /** 研究设计：III 期随机双盲对照、免疫原性桥接等 */
  design: string;
  followUp?: string;
  /** 数据来源说明 */
  source: string;
  sourceUrl?: string;
  quality: DataQuality;
}

export interface VaccineProduct {
  id: string;
  vaccineId: string;
  /** 商品名，如「沛儿 13」「潘太欣」 */
  tradeName: string;
  manufacturer: string;
  /** 工艺：灭活 / 减毒 / 重组酵母 / 多糖结合 … */
  technology: string;
  /** 是否作为免疫规划（免费）疫苗采购供应 */
  nipSupplied: boolean;
  /** 参考价格说明，以门诊公示为准 */
  priceNote?: string;
  clinical?: ClinicalStudy[];
}

export interface ScheduleDose {
  doseIndex: number;
  /** 展示用年龄，如「出生 24 小时内」「2 月龄」「6 岁」 */
  ageLabel: string;
  /** 标准应种月龄（出生 = 0；6 岁 = 72） */
  ageMonths: number;
  /** 最早可接种月龄 */
  minAgeMonths?: number;
  /** 与上一剂最小间隔（月） */
  intervalMonths?: number;
  /** 该剂次的特别说明，如 IPV / bOPV 选择 */
  note?: string;
}

export interface ReactionItem {
  symptom: string;
  /** 估计发生比例描述，如「约 10%–20%」 */
  rate?: string;
  handling: string;
}

export interface ReactionGroup {
  /** 常见 / 罕见 / 极罕见 */
  severity: 'common' | 'rare' | 'veryRare';
  items: ReactionItem[];
}

export interface Vaccine {
  id: string;
  name: string;
  shortName: string;
  category: VaccineCategory;
  /** 预防疾病 id 列表 */
  diseaseIds: string[];
  doses: ScheduleDose[];
  productIds: string[];
  reactions: ReactionGroup[];
  contraindications: string[];
  notes?: string[];
}

export interface Disease {
  id: string;
  name: string;
  intro: string;
  transmission: string;
  severity: string;
}

/** 接种后反应处理指南条目 */
export interface ReactionGuideItem {
  symptom: string;
  homeCare: string[];
  /** 出现以下情况需就医 */
  redFlags: string[];
}

/* ---------- 本地存储数据 ---------- */

export interface ChildProfile {
  id: string;
  name: string;
  birthDate: string; // ISO yyyy-mm-dd
  gender?: 'M' | 'F';
  createdAt: string;
}

export type DoseStatus = 'upcoming' | 'done' | 'skipped';

export interface VaccinationRecord {
  id: string;
  childId: string;
  vaccineId: string;
  productId?: string;
  doseIndex: number;
  status: DoseStatus;
  plannedDate?: string;
  actualDate?: string;
  clinic?: string;
  batchNo?: string;
  price?: number;
  note?: string;
}

export interface ReactionRecord {
  id: string;
  childId: string;
  vaccineId?: string;
  date: string;
  symptoms: string[];
  temperature?: number;
  handling: string;
  note?: string;
}

/** 日历上的一剂（由疫苗程序 + 宝宝生日 + 记录计算得出） */
export interface CalendarDose {
  vaccineId: string;
  vaccineName: string;
  shortName: string;
  category: VaccineCategory;
  doseIndex: number;
  ageLabel: string;
  dueDate: string;       // 应种日期 ISO
  earliestDate: string;  // 最早可种日期 ISO
  status: 'done' | 'upcoming' | 'dueSoon' | 'overdue';
  record?: VaccinationRecord;
  /** 年度循环提醒（如每年流感季），非常规剂次 */
  reminder?: boolean;
  /** 同一天还可同时接种的其他疫苗短名 */
  coScheduled?: string[];
}
