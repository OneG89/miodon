/**
 * 免费（一类）vs 自费（二类）方案对比数据。
 * 用于「免费 vs 自费对比」模块，以及疫苗详情页的「相关疫苗对比」引导。
 * 价格为各地挂网/门诊参考价区间，以当地门诊公示为准。
 */

export type CompareTone = 'free' | 'self' | 'combo';

export interface CompareOption {
  /** 方案名 */
  title: string;
  /** 角标文案，如「免费」「自费」「联合·自费」 */
  badge: string;
  badgeTone: CompareTone;
  /** 关联疫苗（可跳详情） */
  vaccineIds?: string[];
  cost: string;
  doses: string;
  covers: string;
  pros: string[];
  cons: string[];
}

export interface CompareAddition {
  vaccineId: string;
  price: string;
  highlight: string;
}

export interface CompareGroup {
  id: string;
  title: string;
  subtitle: string;
  /** 组内涉及的疫苗 id，用于详情页自动匹配到本组 */
  vaccineIds: string[];
  /** 并列方案（联合疫苗组/流脑组） */
  options?: CompareOption[];
  /** 纯增量自费苗列表（免费程序不覆盖的疾病） */
  additions?: CompareAddition[];
  additionNote?: string;
  /** 选择建议 */
  verdict: string;
}

export const compareGroups: CompareGroup[] = [
  {
    id: 'g-combo',
    title: '百白破 + 脊灰 + Hib：联合疫苗 vs 免费单苗',
    subtitle: '五联/四联把多个免费针和自费 Hib 合并成一针，核心差异是针次、费用和脊灰工艺',
    vaccineIds: ['v-pentavalent', 'v-quadrivalent', 'v-hib', 'v-dtap', 'v-polio'],
    options: [
      {
        title: '免费单苗（国家程序）',
        badge: '免费',
        badgeTone: 'free',
        cost: '¥0 免费',
        doses: '百白破 5 剂 + 脊灰 4 剂（2 针灭活 IPV + 2 次口服 bOPV）',
        covers: '百日咳、白喉、破伤风、脊髓灰质炎；不含 Hib',
        pros: ['全程免费，门诊保证供应', '前 2 剂脊灰为灭活 IPV，疫苗相关麻痹风险已极低'],
        cons: [
          '不预防 Hib（b 型流感嗜血杆菌，可致婴幼儿脑膜炎、肺炎、会厌炎）',
          '18 月龄前针次多、跑门诊次数多',
          '后 2 剂为口服减毒 bOPV，免疫缺陷等特殊状况宝宝需医生评估',
        ],
      },
      {
        title: '免费程序 + Hib 单苗',
        badge: '自费',
        badgeTone: 'self',
        vaccineIds: ['v-hib'],
        cost: 'Hib 约 ¥45–160/剂，4 剂约 ¥180–640（国产呵儿贝等最低约 ¥45/剂）',
        doses: '免费针照打 + Hib 4 剂（2 月龄起 3+1 程序）',
        covers: '同免费程序，另加 Hib 保护',
        pros: ['补上免费程序缺失的 Hib 保护', '比联合疫苗便宜，国产 Hib 最低约 ¥45/剂'],
        cons: ['针次最多（Hib 与百白破/脊灰常需同日多针或分次前往）', '仍需多次跑门诊'],
      },
      {
        title: '四联疫苗（百白破 + Hib）',
        badge: '联合·自费',
        badgeTone: 'combo',
        vaccineIds: ['v-quadrivalent'],
        cost: '约 ¥260–400/剂，4 剂约 ¥1,040–1,600',
        doses: '4 针替代百白破前 4 剂 + Hib 4 剂；脊灰仍走免费程序（2 剂 IPV + 2 剂 bOPV）',
        covers: '百日咳、白喉、破伤风 + Hib',
        pros: ['比「免费 + Hib」少打 4 针', '供应比五联稳定，五联缺货时的首选衔接方案'],
        cons: ['不含脊灰，减针幅度不如五联'],
      },
      {
        title: '五联疫苗（百白破 + IPV + Hib）',
        badge: '联合·自费',
        badgeTone: 'combo',
        vaccineIds: ['v-pentavalent'],
        cost: '约 ¥600–700/剂，4 剂约 ¥2,400–2,800',
        doses: '4 针替代百白破前 4 剂 + 脊灰全程 4 剂（2 剂 IPV、2 剂 bOPV 均免种）+ Hib 4 剂（约 12 个剂次合为 4 针）',
        covers: '百日咳、白喉、破伤风、脊髓灰质炎（全程灭活）、Hib',
        pros: [
          '针次最少、跑门诊最少',
          '脊灰全程灭活 IPV，无口服减毒 bOPV，免疫缺陷宝宝也更安全；完成 4 剂即视为脊灰全程，4 岁 bOPV 也免服',
          '2 月龄起尽早获得完整保护',
        ],
        cons: ['最贵', '2025 年批签发同比减少约三成、部分城市预约紧张（2026 上半年批签发已回升），缺货时可四联 + 免费脊灰衔接', '国产五联尚未上市，仅赛诺菲潘太欣一家'],
      },
    ],
    verdict:
      '预算充足、想少折腾：首选五联（针次最少、脊灰全程灭活）；五联缺货或兼顾性价比：四联 + 免费脊灰；无论选哪条线，Hib 保护别落下——免费程序里没有它。联合疫苗不影响 13 价肺炎、轮状等其他自费苗的接种安排。',
  },
  {
    id: 'g-meningo',
    title: '流脑疫苗：免费多糖 vs 自费结合',
    subtitle: '差异在工艺（多糖/结合，决定 2 岁以下是否有效）和覆盖血清群（A/C vs A/C/Y/W135）',
    vaccineIds: ['v-meningo-nip', 'v-meningo-self'],
    options: [
      {
        title: '免费流脑（A 群多糖 + AC 多糖）',
        badge: '免费',
        badgeTone: 'free',
        cost: '¥0 免费',
        doses: 'A 群多糖 6、9 月龄各 1 剂；AC 多糖 3 岁、6 岁各 1 剂，共 4 剂',
        covers: 'A 群、C 群脑膜炎球菌',
        pros: ['免费', '覆盖国内既往最常见的 A、C 群'],
        cons: [
          '多糖工艺在 2 岁以下免疫效果差、不产生免疫记忆',
          '不覆盖 Y、W135 群（近年检出占比上升）',
        ],
      },
      {
        title: 'AC 结合疫苗',
        badge: '自费',
        badgeTone: 'self',
        vaccineIds: ['v-meningo-self'],
        cost: '约 ¥100–200/剂，1 岁内约 ¥200–600',
        doses: '3 月龄起 3 剂或 6 月龄起 2 剂（依产品说明书）；3 岁、6 岁仍需接种含 A、C 群成分的疫苗（四价多糖或免费 AC 多糖）',
        covers: 'A 群、C 群',
        pros: ['结合工艺，2 岁以下也能产生高抗体和免疫记忆', '可直接替代免费 A 群多糖程序'],
        cons: ['仍只覆盖 A、C 两群', '需自费，且不含 3 岁/6 岁加强'],
      },
      {
        title: '四价结合曼海欣（ACYW135）',
        badge: '自费·覆盖最全',
        badgeTone: 'combo',
        vaccineIds: ['v-meningo-self'],
        cost: '约 ¥420–470/剂，3 月龄起始全程约 ¥1,700–1,800',
        doses: '3–5 月龄基础 3 剂 + 12 月龄加强；大月龄按说明书 1–2 剂；3 岁、6 岁加强可直接覆盖一类 AC 多糖剂次（2021 年获批 3 月龄–3 岁，2026-02 年龄上限扩至 6 周岁）',
        covers: 'A、C、Y、W135 四群，结合工艺',
        pros: [
          '覆盖血清群最全（含 Y、W135）',
          '结合工艺，最小 3 月龄即可接种',
          '可替代整个免费流脑程序',
        ],
        cons: ['最贵', '仅康希诺一家，部分门诊可能缺货'],
      },
      {
        title: '四价多糖（ACYW135，2 岁起）',
        badge: '自费',
        badgeTone: 'self',
        vaccineIds: ['v-meningo-self'],
        cost: '约 ¥80–200/剂（西林瓶/预灌封规格不同）',
        doses: '2 岁起接种，3 岁、6 岁可替代免费 AC 多糖',
        covers: 'A、C、Y、W135 四群',
        pros: ['四群覆盖、价格便宜', '适合 2 岁后补种或加强'],
        cons: ['多糖工艺，2 岁以下无效、无免疫记忆', '不能替代小月龄基础免疫'],
      },
    ],
    verdict:
      '想在小月龄升级：预算够选曼海欣四价结合（覆盖最全，3 岁/6 岁加强也能一并覆盖），性价比选 AC 结合；2 岁后可用四价多糖以低价补上 Y、W135 群。注意：1 岁内只打 AC 结合者，3 岁、6 岁仍需接种含 A、C 群成分的疫苗（曼海欣加强、四价多糖或免费 AC 多糖均视同完成）。同一剂次自费与免费不要重复接种。',
  },
  {
    id: 'g-addition',
    title: '免费程序里「没有」的疫苗：纯增量自费苗',
    subtitle: '这些疫苗不替代任何免费针，防的是国家免费程序尚未覆盖的疾病',
    vaccineIds: ['v-pcv13', 'v-rotavirus', 'v-ev71', 'v-flu', 'v-varicella'],
    additions: [
      {
        vaccineId: 'v-pcv13',
        price: '4 剂约 ¥1,850–2,900',
        highlight:
          '防肺炎球菌引起的脑膜炎、菌血症、肺炎、中耳炎；6 周龄起尽早接种，窗口至 5 岁，小月龄重症风险最高',
      },
      {
        vaccineId: 'v-rotavirus',
        price: '3 剂约 ¥660–1,000',
        highlight:
          '防婴幼儿重症腹泻首位病原；时间窗严格：首剂 6–12/13 周龄，32–36 周龄前服完，超龄永久不能补种',
      },
      {
        vaccineId: 'v-ev71',
        price: '2 剂约 ¥360–560',
        highlight: '防 EV71 所致重症手足口（脑炎、肺出血）；6 月龄起、1 岁前完成保护最好',
      },
      {
        vaccineId: 'v-flu',
        price: '每年约 ¥150–330/剂（首季 2 剂）',
        highlight: '6 月龄起每年秋季接种；部分城市已对儿童免费；全家接种可给小月龄宝宝形成「免疫茧」',
      },
      {
        vaccineId: 'v-varicella',
        price: '2 剂约 ¥280–400',
        highlight: '防水痘及成年后带状疱疹风险；1 岁、4 岁各 1 剂；多地已纳入地方免费免疫规划',
      },
    ],
    additionNote:
      'HPV 疫苗 2025 年 11 月起已为满 13 周岁女孩免费接种 2 剂国产二价（不在 0–6 岁接种窗口，家有女儿可提前了解）。',
    verdict:
      '优先级建议：轮状（硬窗口，错过不能补）≈ 13 价肺炎（小月龄重症风险最高）＞ EV71 ＞ 流感（每年秋季）＞ 水痘（1 岁起）。可结合家庭预算和门诊供应，与接种医生商量安排。',
  },
];
