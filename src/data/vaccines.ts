import type { Vaccine } from '../types';

/**
 * 疫苗免疫程序知识库
 * 一类程序依据《国家免疫规划疫苗儿童免疫程序及说明（2026 年版）》（国疾控卫免发〔2026〕16 号）；
 * 百白破程序自 2025-01-01 起调整为 2/4/6/18 月龄 + 6 周岁共 5 剂（国疾控卫免发〔2024〕20 号），
 * HPV 疫苗自 2025-11-10 起纳入国家免疫规划（13 岁女孩免费 2 剂国产双价）。
 * 二类程序依据各疫苗说明书，接种窗口与程序以门诊和最新说明书为准。
 */
export const vaccines: Vaccine[] = [
  /* ================= 一类（免疫规划，免费） ================= */
  {
    id: 'v-hepb',
    name: '乙型病毒性肝炎疫苗',
    shortName: '乙肝疫苗',
    category: 'nip',
    diseaseIds: ['hepatitis-b'],
    productIds: ['p-hepb-yeast', 'p-hepb-engerix'],
    doses: [
      { doseIndex: 1, ageLabel: '出生 24 小时内', ageMonths: 0, note: '出生后尽早接种；HBsAg 阳性母亲所生宝宝需同时注射乙肝免疫球蛋白' },
      { doseIndex: 2, ageLabel: '1 月龄', ageMonths: 1 },
      { doseIndex: 3, ageLabel: '6 月龄', ageMonths: 6 },
    ],
    reactions: [
      { severity: 'common', items: [
        { symptom: '注射部位红肿、硬结、疼痛', rate: '约 10%–25%', handling: '保持干燥，24 小时内可冷敷，一般 1–3 天自行消退' },
        { symptom: '低热（<38.5℃）、轻微烦躁', rate: '约 1%–5%', handling: '多饮水、适当减少包被，监测体温；≥38.5℃ 或持续发热按医嘱用退热药' },
      ]},
      { severity: 'rare', items: [
        { symptom: '过敏性皮疹、过敏性休克等严重过敏', rate: '极罕见', handling: '接种后留观 30 分钟；出现喘憋、全身风团、面色苍白立即呼叫医护' },
      ]},
    ],
    contraindications: ['对疫苗中任何成分（包括酵母）严重过敏者禁用', '发热、急性疾病期暂缓接种', '早产儿生命体征稳定后即可按程序接种，无需推迟'],
    notes: ['第 1 剂与卡介苗可在出生时同时接种（不同部位）', 'HBsAg 阳性/不详母亲所生新生儿应在 12 小时内接种并联合乙肝免疫球蛋白'],
  },
  {
    id: 'v-bcg',
    name: '皮内注射用卡介苗（BCG）',
    shortName: '卡介苗',
    category: 'nip',
    diseaseIds: ['tb'],
    productIds: ['p-bcg'],
    doses: [
      { doseIndex: 1, ageLabel: '出生时', ageMonths: 0, note: '出生后接种；3 月龄前可直接补种，3 月龄–3 岁需先做 PPD 试验阴性再补种' },
    ],
    reactions: [
      { severity: 'common', items: [
        { symptom: '接种部位 2–3 周出现红肿→化脓→结痂→留卡疤', rate: '多数儿童', handling: '正常反应过程！不要挤压、挑破或涂药膏；保持清洁干燥，穿宽松衣服，痂皮自然脱落即可' },
        { symptom: '接种侧腋下淋巴结轻微肿大', rate: '少数', handling: '小于 1cm 可观察；明显增大或化脓需就医' },
      ]},
      { severity: 'rare', items: [
        { symptom: '局部溃疡长期不愈、淋巴结明显肿大/脓肿、播散性感染', rate: '极罕见', handling: '及时就医；播散性卡介菌病多见于免疫缺陷儿童' },
      ]},
    ],
    contraindications: ['免疫缺陷、免疫功能低下或正在使用免疫抑制剂者禁用', '早产儿体重 <2000g 暂缓，达标后接种', '湿疹或其他皮肤病全身严重发作期暂缓', '可疑传染病发热期暂缓'],
    notes: ['卡介苗只打左上臂皮内，会留下永久卡疤，属正常现象'],
  },
  {
    id: 'v-polio',
    name: '脊髓灰质炎疫苗',
    shortName: '脊灰疫苗',
    category: 'nip',
    diseaseIds: ['polio'],
    productIds: ['p-ipv-kunming', 'p-ipv-sanofi', 'p-bopv'],
    doses: [
      { doseIndex: 1, ageLabel: '2 月龄', ageMonths: 2, note: '注射灭活疫苗 IPV' },
      { doseIndex: 2, ageLabel: '3 月龄', ageMonths: 3, note: '注射灭活疫苗 IPV' },
      { doseIndex: 3, ageLabel: '4 月龄', ageMonths: 4, note: '口服二价减毒活疫苗 bOPV（滴剂）' },
      { doseIndex: 4, ageLabel: '4 岁', ageMonths: 48, note: '口服 bOPV 加强' },
    ],
    reactions: [
      { severity: 'common', items: [
        { symptom: 'IPV 注射部位疼痛、发红', rate: '约 5%–15%', handling: '观察即可，1–2 天消退' },
        { symptom: '口服 bOPV 后轻微腹泻、低热、烦躁', rate: '少数', handling: '口服后 30 分钟内避免喂奶/热水；轻微症状自行缓解' },
      ]},
      { severity: 'veryRare', items: [
        { symptom: '疫苗相关麻痹型脊灰（VAPP）', rate: '极罕见（主要见于首剂使用减毒活疫苗、免疫缺陷者）', handling: '现行程序先打 2 剂 IPV 已大幅降低风险；免疫缺陷儿童应全程使用 IPV，接种前告知医生家族免疫病史' },
      ]},
    ],
    contraindications: ['对疫苗成分严重过敏者禁用', '免疫缺陷或使用免疫抑制剂者禁用减毒活疫苗（bOPV），应全程接种 IPV', '发热、急性疾病期暂缓', '口服疫苗前后 30 分钟避免热饮热食'],
    notes: [
      '全程「2 剂 IPV + 2 剂 bOPV」为现行免费程序；经济条件允许也可选择含 IPV 的五联疫苗',
      '按 2026 版免疫程序：已按说明书完成 4 剂含 IPV 成分疫苗接种（如全程五联）的儿童，即视为完成脊灰全程，4 月龄、4 岁的 bOPV 均无需再接种',
    ],
  },
  {
    id: 'v-dtap',
    name: '百白破联合疫苗（DTaP，全程 5 剂）',
    shortName: '百白破',
    category: 'nip',
    diseaseIds: ['diphtheria', 'pertussis', 'tetanus'],
    productIds: ['p-dtap-nip'],
    doses: [
      { doseIndex: 1, ageLabel: '2 月龄', ageMonths: 2 },
      { doseIndex: 2, ageLabel: '4 月龄', ageMonths: 4, intervalMonths: 2 },
      { doseIndex: 3, ageLabel: '6 月龄', ageMonths: 6, intervalMonths: 2 },
      { doseIndex: 4, ageLabel: '18 月龄', ageMonths: 18, note: '百白破加强' },
      { doseIndex: 5, ageLabel: '6 岁', ageMonths: 72, note: '第 5 剂百白破（<7 周岁完成）；2025 年起 6 周岁由白破改为百白破，含百日咳组分' },
    ],
    reactions: [
      { severity: 'common', items: [
        { symptom: '注射部位红肿、硬结（百白破相对多见）', rate: '约 20%–40%', handling: '24 小时内冷敷、之后可温敷；硬结可能持续数周，会自行吸收' },
        { symptom: '低热、烦躁、嗜睡、食欲下降', rate: '约 10%–20%', handling: '多饮水、多休息，1–2 天恢复；≥38.5℃ 按医嘱用对乙酰氨基酚' },
      ]},
      { severity: 'rare', items: [
        { symptom: '持续哭闹 ≥3 小时、高热惊厥', rate: '罕见', handling: '立即就医评估；有热性惊厥史需提前告知医生' },
        { symptom: '严重过敏反应', rate: '极罕见', handling: '留观 30 分钟，出现喘憋/全身皮疹立即呼救' },
      ]},
    ],
    contraindications: ['对疫苗成分严重过敏或前剂接种后出现严重反应者禁用', '癫痫未控制或进行性神经系统疾病者慎用/禁用（咨询医生）', '发热、急性疾病期暂缓'],
    notes: [
      '2025 年 1 月起程序调整：首剂由 3 月龄提前至 2 月龄，全程 5 剂百白破（2/4/6/18 月龄 + 6 周岁），6 周岁不再种白破；白破仅用于 7–11 岁漏种补种',
      '按说明书接种五联/四联等含百白破组分联合疫苗，可视为完成相应剂次；6 周岁第 5 剂仍需接种百白破',
      '接种百白破后发热在宝宝疫苗中相对常见，不必恐慌，但持续高热或精神差要就医',
    ],
  },
  {
    id: 'v-mmr',
    name: '麻腮风联合减毒活疫苗',
    shortName: '麻腮风',
    category: 'nip',
    diseaseIds: ['measles', 'mumps', 'rubella'],
    productIds: ['p-mmr-nip'],
    doses: [
      { doseIndex: 1, ageLabel: '8 月龄', ageMonths: 8 },
      { doseIndex: 2, ageLabel: '18 月龄', ageMonths: 18 },
    ],
    reactions: [
      { severity: 'common', items: [
        { symptom: '接种后 6–12 天出现低热、轻微皮疹', rate: '约 5%–15%', handling: '减毒活疫苗的「轻症模拟」反应，皮疹 1–2 天自行消退；对症护理' },
        { symptom: '面颊/颈部淋巴结轻微肿大', rate: '少数', handling: '观察即可，自行消退' },
      ]},
      { severity: 'rare', items: [
        { symptom: '高热惊厥、一过性关节痛（多见于成人）', rate: '罕见', handling: '有惊厥史提前告知医生；高热对症退热处理并就医' },
        { symptom: '严重过敏', rate: '极罕见', handling: '对新霉素/明胶严重过敏者禁用；留观 30 分钟' },
      ]},
    ],
    contraindications: ['免疫缺陷、免疫抑制治疗期、恶性肿瘤患者禁用（减毒活疫苗）', '妊娠期禁用（备孕女性接种后 3 个月内避免怀孕）', '对新霉素、明胶等成分严重过敏者禁用', '发热、急性疾病期暂缓'],
    notes: ['育龄女性接种可保护未来胎儿免于先天性风疹综合征'],
  },
  {
    id: 'v-je',
    name: '流行性乙型脑炎疫苗',
    shortName: '乙脑疫苗',
    category: 'nip',
    diseaseIds: ['je'],
    productIds: ['p-je-live', 'p-je-inactivated'],
    doses: [
      { doseIndex: 1, ageLabel: '8 月龄', ageMonths: 8, note: '减毒活疫苗 1 剂（灭活疫苗为 2 剂，间隔 7–10 天）' },
      { doseIndex: 2, ageLabel: '2 岁', ageMonths: 24, note: '减毒活疫苗加强 1 剂（灭活程序 2 岁、6 岁各加强 1 剂）' },
    ],
    reactions: [
      { severity: 'common', items: [
        { symptom: '注射部位疼痛、发红', rate: '约 5%–15%', handling: '观察即可' },
        { symptom: '低热、一过性皮疹', rate: '少数（减毒活疫苗偶见）', handling: '对症护理，1–2 天消退' },
      ]},
      { severity: 'rare', items: [
        { symptom: '严重过敏', rate: '极罕见', handling: '留观 30 分钟' },
      ]},
    ],
    contraindications: ['减毒活疫苗：免疫缺陷/免疫抑制者禁用，可选择灭活疫苗', '发热、急性疾病期暂缓', '对疫苗成分严重过敏者禁用'],
    notes: [
      '夏秋季为乙脑流行季，建议在流行季前（春季）完成接种',
      '减毒活疫苗免费程序为 2 剂；灭活疫苗为自费/部分地区免费，程序 4 剂',
      '2026 年 3 月起，西藏、青海、新疆及新疆生产建设兵团将乙脑减毒活疫苗纳入常规接种（此前为应急/重点人群接种）',
    ],
  },
  {
    id: 'v-meningo-nip',
    name: '流行性脑脊髓膜炎疫苗（一类程序）',
    shortName: '流脑疫苗(一类)',
    category: 'nip',
    diseaseIds: ['meningococcal'],
    productIds: ['p-mena-polysaccharide', 'p-menac-polysaccharide'],
    doses: [
      { doseIndex: 1, ageLabel: '6 月龄', ageMonths: 6, note: 'A 群多糖第 1 剂' },
      { doseIndex: 2, ageLabel: '9 月龄', ageMonths: 9, note: 'A 群多糖第 2 剂（两剂间隔 ≥3 个月）' },
      { doseIndex: 3, ageLabel: '3 岁', ageMonths: 36, note: 'A+C 群多糖第 1 剂' },
      { doseIndex: 4, ageLabel: '6 岁', ageMonths: 72, note: 'A+C 群多糖第 2 剂（间隔 ≥3 年，且与上剂 A 群间隔 ≥1 年）' },
    ],
    reactions: [
      { severity: 'common', items: [
        { symptom: '注射部位疼痛、红肿', rate: '约 5%–15%', handling: '观察即可' },
        { symptom: '低热、烦躁', rate: '少数', handling: '对症护理，1–2 天消退' },
      ]},
      { severity: 'rare', items: [
        { symptom: '严重过敏', rate: '极罕见', handling: '留观 30 分钟' },
      ]},
    ],
    contraindications: ['对疫苗成分严重过敏者禁用', '发热、急性疾病期暂缓', '癫痫、脑部疾病者慎用并告知医生'],
    notes: [
      '多糖疫苗在 2 岁以下免疫效果有限，自费的 AC 结合疫苗在婴幼儿中免疫原性更好，可考虑替代（见二类流脑疫苗）',
      '1 岁内用自费结合疫苗替代 A 群多糖后，3 岁、6 岁仍需接种含 A、C 群成分的疫苗：四价结合（曼海欣）加强、四价多糖或免费 AC 多糖均视同完成程序',
    ],
  },
  {
    id: 'v-hepa',
    name: '甲型病毒性肝炎疫苗',
    shortName: '甲肝疫苗',
    category: 'nip',
    diseaseIds: ['hepatitis-a'],
    productIds: ['p-hepa-live', 'p-hepa-inactivated'],
    doses: [
      { doseIndex: 1, ageLabel: '18 月龄', ageMonths: 18, note: '减毒活疫苗 1 剂完成；灭活疫苗第 1 剂' },
      { doseIndex: 2, ageLabel: '24 月龄', ageMonths: 24, note: '仅灭活疫苗：第 2 剂（间隔 ≥6 个月）' },
    ],
    reactions: [
      { severity: 'common', items: [
        { symptom: '注射部位疼痛、红肿', rate: '约 5%–10%', handling: '观察即可' },
        { symptom: '低热、食欲下降', rate: '少数', handling: '对症护理' },
      ]},
      { severity: 'rare', items: [
        { symptom: '严重过敏', rate: '极罕见', handling: '留观 30 分钟' },
      ]},
    ],
    contraindications: ['减毒活疫苗：免疫缺陷/免疫抑制者禁用，可选灭活疫苗', '发热、急性疾病期暂缓', '对疫苗成分严重过敏者禁用'],
    notes: [
      '减毒活疫苗免费 1 剂；灭活疫苗 2 剂（部分地区免费、部分自费），在售主力为科兴孩尔来福',
      '进口甲肝灭活疫苗已全部退市：GSK 贺福立适 2024 年注销、默沙东维康特 2025 年 10 月注销；已打第 1 剂进口苗者可用孩尔来福续种，或间隔 ≥6 个月接种 1 剂减毒活疫苗完成程序',
    ],
  },

  /* ================= 二类（自费自愿） ================= */
  {
    id: 'v-pcv13',
    name: '13 价肺炎球菌多糖结合疫苗',
    shortName: '13价肺炎',
    category: 'selfPaid',
    diseaseIds: ['pneumococcal'],
    productIds: ['p-pcv13-pfizer', 'p-pcv13-walvax', 'p-pcv13-minhai', 'p-pcv13-cansino'],
    doses: [
      { doseIndex: 1, ageLabel: '2 月龄', ageMonths: 2, minAgeMonths: 1.5, note: '6 周龄即可开始；四款产品接种窗口均为 6 周龄–5 岁（6 周岁生日前），大月龄可按说明书补种' },
      { doseIndex: 2, ageLabel: '4 月龄', ageMonths: 4, intervalMonths: 2 },
      { doseIndex: 3, ageLabel: '6 月龄', ageMonths: 6, intervalMonths: 2 },
      { doseIndex: 4, ageLabel: '12–15 月龄', ageMonths: 14, intervalMonths: 2, note: '加强针；7–11 月龄起始 3 剂、12–23 月龄 2 剂、2–5 岁 1 剂' },
    ],
    reactions: [
      { severity: 'common', items: [
        { symptom: '注射部位红肿、硬结、疼痛', rate: '约 20%–40%', handling: '冷敷，1–3 天消退' },
        { symptom: '发热（可达 38.5℃ 以上）、烦躁、食欲下降、嗜睡', rate: '约 10%–30%', handling: '结合疫苗反应相对常见，多在接种后 1–2 天出现；≥38.5℃ 按医嘱用对乙酰氨基酚，持续 >48 小时就医' },
      ]},
      { severity: 'rare', items: [
        { symptom: '高热惊厥、严重过敏', rate: '极罕见', handling: '有惊厥史提前告知；留观 30 分钟' },
      ]},
    ],
    contraindications: ['对疫苗成分（含白喉/破伤风类毒素载体）严重过敏者禁用', '发热、急性疾病期暂缓', '起始月龄不同剂次不同，晚开始需与门诊确认可行程序'],
    notes: [
      '自费疫苗中优先级很高的一种：2 岁以下是侵袭性肺炎球菌疾病高发年龄',
      '国内已上市 4 款：辉瑞沛儿 13（CRM197，2023 年扩龄至 5 岁）、沃森沃安欣（TT 载体）、民海维民菲宝（TT/DT 双载体）、康希诺优佩欣（CRM197/TT 双载体，2025 年 6 月获批）；窗口均为 6 周龄–5 岁，可接种年龄内尽早开始',
      '23 价肺炎多糖疫苗（PPV23）用于 2 岁以上高危人群及老年人，不替代 13 价结合疫苗，常规健康儿童不接种',
    ],
  },
  {
    id: 'v-pentavalent',
    name: '五联疫苗（百白破-脊灰-Hib 联合）',
    shortName: '五联疫苗',
    category: 'selfPaid',
    diseaseIds: ['diphtheria', 'pertussis', 'tetanus', 'polio', 'hib'],
    productIds: ['p-pentaxim'],
    doses: [
      { doseIndex: 1, ageLabel: '2 月龄', ageMonths: 2, minAgeMonths: 2, note: '可选 2-3-4 月龄或 3-4-5 月龄起始' },
      { doseIndex: 2, ageLabel: '3 月龄', ageMonths: 3, intervalMonths: 1 },
      { doseIndex: 3, ageLabel: '4 月龄', ageMonths: 4, intervalMonths: 1 },
      { doseIndex: 4, ageLabel: '18 月龄', ageMonths: 18, intervalMonths: 6, note: '加强针' },
    ],
    reactions: [
      { severity: 'common', items: [
        { symptom: '注射部位红肿、硬结', rate: '约 20%–35%', handling: '冷敷，观察即可' },
        { symptom: '低热、烦躁、哭闹、食欲下降', rate: '约 10%–20%', handling: '1–2 天自行缓解；≥38.5℃ 对症退热' },
      ]},
      { severity: 'rare', items: [
        { symptom: '持续哭闹 ≥3 小时、高热惊厥、严重过敏', rate: '罕见/极罕见', handling: '立即就医；留观 30 分钟' },
      ]},
    ],
    contraindications: ['对疫苗中任何组分（含百日咳、脊灰、Hib、新霉素/链霉素/多粘菌素 B 残留）严重过敏者禁用', '进行性神经系统疾病（未控制癫痫等）禁用百日咳组分相关疫苗', '发热、急性疾病期暂缓'],
    notes: [
      '1 针替代「百白破 + IPV 脊灰 + Hib」3 类疫苗，18 月龄前约 12 个剂次（含 2 次口服 bOPV）合并为 4 针',
      '4 剂五联均含灭活脊灰（IPV），完成全程即视为完成脊灰免疫——4 月龄、4 岁的 bOPV 均无需再服；免费百白破前 4 剂、Hib 也不再重复接种；6 周岁仍需接种第 5 剂百白破',
      '五联说明书程序为 2/3/4 月龄 + 18 月龄，按说明书接种视同完成国家程序相应剂次',
      '2025 年五联批签发同比减少约三成、部分城市预约紧张（非全国断供），2026 年上半年批签发已回升；断货时可按门诊安排用「四联 + 免费脊灰」衔接，保护效果相当。国产五联（康泰民海）2025-12 进入 III 期临床，上市前仍仅赛诺菲潘太欣一家',
    ],
  },
  {
    id: 'v-quadrivalent',
    name: '四联疫苗（百白破-Hib 联合）',
    shortName: '四联疫苗',
    category: 'selfPaid',
    diseaseIds: ['diphtheria', 'pertussis', 'tetanus', 'hib'],
    productIds: ['p-dtap-hib'],
    doses: [
      { doseIndex: 1, ageLabel: '3 月龄', ageMonths: 3, minAgeMonths: 3 },
      { doseIndex: 2, ageLabel: '4 月龄', ageMonths: 4, intervalMonths: 1 },
      { doseIndex: 3, ageLabel: '5 月龄', ageMonths: 5, intervalMonths: 1 },
      { doseIndex: 4, ageLabel: '18 月龄', ageMonths: 18, intervalMonths: 6, note: '加强针' },
    ],
    reactions: [
      { severity: 'common', items: [
        { symptom: '注射部位红肿、硬结、发热、烦躁', rate: '约 10%–25%', handling: '与百白破单苗类似，对症护理，1–2 天缓解' },
      ]},
      { severity: 'rare', items: [
        { symptom: '严重过敏、持续哭闹', rate: '极罕见/罕见', handling: '立即就医；留观 30 分钟' },
      ]},
    ],
    contraindications: ['对疫苗组分严重过敏者禁用', '进行性神经系统疾病者禁用/慎用', '发热、急性疾病期暂缓'],
    notes: [
      '比五联少脊灰组分（脊灰仍按免费程序接种），费用约为五联一半，是折中选择',
      '四联说明书程序为 3/4/5 月龄 + 18 月龄，按说明书接种视同完成国家程序相应百白破剂次；6 周岁仍需接种第 5 剂百白破',
    ],
  },
  {
    id: 'v-hib',
    name: 'b 型流感嗜血杆菌结合疫苗（Hib）',
    shortName: 'Hib 疫苗',
    category: 'selfPaid',
    diseaseIds: ['hib'],
    productIds: ['p-hib-acthib', 'p-hib-domestic'],
    doses: [
      { doseIndex: 1, ageLabel: '2 月龄', ageMonths: 2, minAgeMonths: 2, note: '6 月龄前开始效果最好；起始年龄不同总剂次不同（<6 月龄 3+1 剂、6–12 月龄 2+1 剂、1–5 岁 1 剂）' },
      { doseIndex: 2, ageLabel: '4 月龄', ageMonths: 4, intervalMonths: 2 },
      { doseIndex: 3, ageLabel: '6 月龄', ageMonths: 6, intervalMonths: 2 },
      { doseIndex: 4, ageLabel: '18 月龄', ageMonths: 18, intervalMonths: 6, note: '加强针' },
    ],
    reactions: [
      { severity: 'common', items: [
        { symptom: '注射部位红肿、疼痛', rate: '约 10%–20%', handling: '观察即可' },
        { symptom: '低热、烦躁', rate: '约 5%–10%', handling: '对症护理' },
      ]},
      { severity: 'rare', items: [
        { symptom: '严重过敏', rate: '极罕见', handling: '留观 30 分钟' },
      ]},
    ],
    contraindications: ['对疫苗成分（含破伤风类毒素载体）严重过敏者禁用', '发热、急性疾病期暂缓'],
    notes: ['选择五联/四联疫苗即包含 Hib，无需重复接种'],
  },
  {
    id: 'v-rotavirus',
    name: '轮状病毒疫苗（口服）',
    shortName: '轮状疫苗',
    category: 'selfPaid',
    diseaseIds: ['rotavirus'],
    productIds: ['p-rotavirus-hexa', 'p-rotateq', 'p-rotavirus-trivalent', 'p-rotavirus-lanzhou'],
    doses: [
      { doseIndex: 1, ageLabel: '6–12 周龄', ageMonths: 2, minAgeMonths: 1.5, note: '多价轮状（三价/五价/六价）首剂须在 6–12 周龄（三价可放宽至 13 周龄）服用，超龄不能开始！' },
      { doseIndex: 2, ageLabel: '4 月龄', ageMonths: 4, intervalMonths: 1, note: '多价第 2 剂，与首剂间隔 ≥4 周' },
      { doseIndex: 3, ageLabel: '6 月龄', ageMonths: 6, intervalMonths: 1, note: '多价第 3 剂：五价/三价须 32 周龄前完成，六价可至 36 周龄' },
    ],
    reactions: [
      { severity: 'common', items: [
        { symptom: '轻微腹泻、呕吐、烦躁', rate: '约 5%–10%', handling: '口服给药无痛；症状轻微自限，注意补水防脱水' },
      ]},
      { severity: 'rare', items: [
        { symptom: '肠套叠（阵发性剧烈哭闹、屈膝缩腹、果酱样血便、呕吐）', rate: '极罕见（每 10 万剂约 1–5 例，风险远低于重症腹泻本身）', handling: '出现上述肠套叠红旗症状立即急诊！' },
      ]},
    ],
    contraindications: ['严重联合免疫缺陷（SCID）等免疫缺陷禁用口服减毒活轮状疫苗', '有肠套叠病史者慎用并告知医生', '发热、急性腹泻期暂缓', '口服后 30 分钟内避免喂奶/热饮'],
    notes: [
      '多价轮状时间窗口极严：首剂 12 周龄（三价 13 周龄）前不开始就永远错过；五价/三价 32 周龄、六价 36 周龄前必须服完 3 剂',
      '四款产品怎么选：六价「武生儿轮宝」（武汉所，2025 年上市）覆盖 G1/G2/G3/G4/G8/G9，唯一覆盖近年国内增多的 G8 型，窗口至 36 周龄最宽；五价「乐儿德」（默沙东）有 7 万例 REST 研究和全球多年使用经验；三价「瑞特威」（兰州所，2024 年上市）价格较低；单价「罗特威」窗口最宽（2 月龄–3 岁每年 1 剂）但效力证据较弱，适合错过多价窗口的宝宝',
      '轮状病毒腹泻重在预防脱水，疫苗显著降低重症和住院；各地到苗情况不同，接种前先电话咨询门诊',
    ],
  },
  {
    id: 'v-ev71',
    name: 'EV71 灭活疫苗（手足口病）',
    shortName: 'EV71 手足口',
    category: 'selfPaid',
    diseaseIds: ['ev71'],
    productIds: ['p-ev71-sinovac', 'p-ev71-wuhan', 'p-ev71-km'],
    doses: [
      { doseIndex: 1, ageLabel: '6 月龄', ageMonths: 6, minAgeMonths: 6, note: '满 6 月龄尽早接种，在手足口高发年龄（1–2 岁）前获得保护' },
      { doseIndex: 2, ageLabel: '7 月龄', ageMonths: 7, intervalMonths: 1, note: '第 2 剂间隔 ≥28 天；5 岁前完成' },
    ],
    reactions: [
      { severity: 'common', items: [
        { symptom: '注射部位疼痛、红肿、硬结', rate: '约 10%–25%', handling: '观察即可' },
        { symptom: '发热、腹泻、烦躁、食欲下降', rate: '约 5%–15%', handling: '1–3 天自行缓解；≥38.5℃ 对症退热' },
      ]},
      { severity: 'rare', items: [
        { symptom: '严重过敏', rate: '极罕见', handling: '留观 30 分钟' },
      ]},
    ],
    contraindications: ['对疫苗成分严重过敏者禁用', '发热、急性疾病期暂缓', '血小板减少或出血性疾病者肌注需谨慎告知医生'],
    notes: [
      '只防 EV71 型（手足口重症/死亡的主要病原），不防柯萨奇等其他型别——接种后仍可能得轻症手足口，但几乎不转为重症',
      '三家国产疫苗 III 期保护效力约 90%–97%（科兴 94.8%、武汉所 90.0%、昆明所 97.3%），对重症/住院保护均接近 100%，是数据非常扎实的国产疫苗',
      '接种年龄窗口以说明书为准：科兴益尔来福、武汉所依维乐为 6 月龄–71 月龄（≈6 周岁前），昆明所宜维福为 6 月龄–5 岁；均建议 12 月龄前完成 2 剂',
    ],
  },
  {
    id: 'v-flu',
    name: '流行性感冒疫苗',
    shortName: '流感疫苗',
    category: 'selfPaid',
    diseaseIds: ['influenza'],
    productIds: ['p-flu-iiv', 'p-flu-live'],
    doses: [
      { doseIndex: 1, ageLabel: '6 月龄起（每年 9–11 月）', ageMonths: 6, minAgeMonths: 6, note: '6 月龄–8 岁首次接种打 2 剂，间隔 ≥4 周' },
      { doseIndex: 2, ageLabel: '首季第 2 剂（间隔 4 周）', ageMonths: 7, intervalMonths: 1, note: '之后每年秋季接种 1 剂即可；苗懂会在每年流感季自动生成年度提醒' },
    ],
    reactions: [
      { severity: 'common', items: [
        { symptom: '注射部位疼痛、红肿', rate: '约 10%–20%', handling: '观察即可' },
        { symptom: '低热、肌肉酸痛、乏力 1–2 天', rate: '约 5%–10%', handling: '对症护理，很快恢复' },
      ]},
      { severity: 'rare', items: [
        { symptom: '严重过敏；吉兰-巴雷综合征（GBS）', rate: '极罕见', handling: '留观 30 分钟；GBS 风险远低于流感本身导致的 GBS 风险' },
      ]},
    ],
    contraindications: ['对疫苗成分（鸡蛋蛋白严重过敏者需告知医生评估）严重过敏者禁用', '鼻喷减毒活疫苗：免疫缺陷、使用阿司匹林的儿童禁用', '发热、急性疾病期暂缓'],
    notes: ['每年都要打！毒株每年更新，上一年的保护会衰减', '6 月龄–3 岁用儿童剂型（0.25mL）；3 岁以上用成人剂量', '全家一起接种可给 6 月龄前不能接种的小宝宝形成「免疫茧」保护'],
  },
  {
    id: 'v-varicella',
    name: '水痘减毒活疫苗',
    shortName: '水痘疫苗',
    category: 'selfPaid',
    diseaseIds: ['varicella'],
    productIds: ['p-varicella'],
    doses: [
      { doseIndex: 1, ageLabel: '1 岁', ageMonths: 12, minAgeMonths: 12, note: '满 1 岁尽早接种' },
      { doseIndex: 2, ageLabel: '4 岁', ageMonths: 48, intervalMonths: 12, note: '第 2 剂（2 剂程序保护率约 95%+）' },
    ],
    reactions: [
      { severity: 'common', items: [
        { symptom: '注射部位疼痛', rate: '约 10%–20%', handling: '观察即可' },
        { symptom: '接种后 1–3 周出现少量皮疹、低热', rate: '约 5%–10%', handling: '减毒活疫苗轻症反应，皮疹少而轻，自行消退' },
      ]},
      { severity: 'rare', items: [
        { symptom: '严重过敏、高热惊厥', rate: '极罕见', handling: '留观 30 分钟' },
      ]},
    ],
    contraindications: ['免疫缺陷/免疫抑制治疗期禁用（减毒活疫苗）', '妊娠期禁用；接种后 3 个月内避免怀孕', '对新霉素/明胶严重过敏者禁用', '发热、急性疾病期暂缓'],
    notes: [
      '地方免费政策（中疾控 2026-06 口径）：上海、天津、江苏已纳入省级免费免疫规划，深圳等城市也已免费，四川雅安等地有半价补贴；其他地区仍需自费，以当地门诊公示为准',
      '得过水痘通常终身免疫，无需接种',
    ],
  },
  {
    id: 'v-meningo-self',
    name: '自费流脑疫苗（AC 结合 / 四价多糖替代）',
    shortName: '流脑疫苗(自费替代)',
    category: 'selfPaid',
    diseaseIds: ['meningococcal'],
    productIds: ['p-mcv4', 'p-menac-conjugate', 'p-menacwy'],
    doses: [
      { doseIndex: 1, ageLabel: '3–6 月龄起（替代 A 群多糖）', ageMonths: 6, note: '结合疫苗程序因产品而异：曼海欣/AC 结合 3 月龄起打 3 剂或 6 月龄起打 2 剂，具体依说明书' },
      { doseIndex: 2, ageLabel: '9 月龄（结合程序第 2 剂）', ageMonths: 9, intervalMonths: 3 },
      { doseIndex: 3, ageLabel: '3 岁（四价替代）', ageMonths: 36, note: '曼海欣（四价结合）或 ACYW135 四价多糖可替代一类 AC 多糖，多覆盖 Y、W135 群；2 岁以下优选结合疫苗' },
      { doseIndex: 4, ageLabel: '6 岁（四价加强）', ageMonths: 72 },
    ],
    reactions: [
      { severity: 'common', items: [
        { symptom: '注射部位疼痛、红肿、低热', rate: '约 5%–15%', handling: '观察即可' },
      ]},
      { severity: 'rare', items: [
        { symptom: '严重过敏', rate: '极罕见', handling: '留观 30 分钟' },
      ]},
    ],
    contraindications: ['对疫苗成分严重过敏者禁用', '发热、急性疾病期暂缓', '癫痫、脑部疾病者告知医生'],
    notes: [
      '三类自费产品：①曼海欣（康希诺四价结合 MCV4，覆盖 A/C/Y/W135；2021-12 获批用于 3 月龄–3 岁，2026 年 2 月年龄上限扩至 6 周岁，保护最全面、最贵）；②AC 结合（智飞盟纳康/罗益/欧林，覆盖 A/C，2 岁以下优选）；③ACYW135 四价多糖（2 岁以上用）',
      '结合疫苗在 2 岁以下宝宝体内免疫效果优于多糖疫苗，且有免疫记忆；选择自费替代后，对应剂次的一类流脑疫苗不再重复接种',
      '关键衔接：1 岁内只打 AC 结合疫苗者，3 岁、6 岁仍需接种含 A、C 群成分的疫苗——曼海欣加强、四价多糖或回免费程序打 AC 多糖均可，视同完成',
      '智飞绿竹四价结合疫苗（MCV4）2025 年已申报生产、纳入优先审评，截至 2026 年 9 月尚未获批，届时可关注',
    ],
  },
  {
    id: 'v-hpv',
    name: 'HPV 疫苗（人乳头瘤病毒疫苗）',
    shortName: 'HPV 疫苗',
    category: 'selfPaid',
    diseaseIds: ['hpv'],
    productIds: ['p-hpv-cervarix', 'p-hpv-bivalent-wantai', 'p-hpv-zerun', 'p-hpv-gardasil4', 'p-hpv-aiweijia', 'p-hpv-gardasil9', 'p-hpv-wantai9'],
    doses: [
      { doseIndex: 1, ageLabel: '9 岁起', ageMonths: 108, note: '9–14 岁为最佳接种年龄（免疫应答最强），多数产品可 2 剂程序' },
      { doseIndex: 2, ageLabel: '首剂后 6 个月', ageMonths: 114, intervalMonths: 6, note: '9–14 岁 2 剂（间隔 ≥6 个月；馨可宁 9 可覆盖至 17 岁 2 剂）；≥15 岁为 3 剂（0、1–2、6 月，因产品而异）' },
    ],
    reactions: [
      { severity: 'common', items: [
        { symptom: '注射部位疼痛、红肿', rate: '约 20%–40%', handling: '观察即可' },
        { symptom: '低热、头痛、乏力', rate: '约 5%–15%', handling: '对症休息，1–2 天缓解' },
      ]},
      { severity: 'rare', items: [
        { symptom: '接种后晕厥（青少年紧张多见）、严重过敏', rate: '罕见/极罕见', handling: '接种后必须留观 30 分钟；坐下/躺下接种防跌倒' },
      ]},
    ],
    contraindications: ['对疫苗成分严重过敏者禁用', '妊娠期暂缓（哺乳期可接种）', '发热、急性疾病期暂缓'],
    notes: [
      '超出 0–6 岁范围，仅供家长了解或为家中年长女孩/自身安排',
      '国内已上市 7 款：二价（GSK 希瑞适、万泰馨可宁、沃森沃泽惠）、四价（默沙东佳达修、中国生物爱薇佳 2025 年获批）、九价（默沙东佳达修 9、万泰馨可宁 9，2025 年 6 月获批、定价 499 元/剂）',
      '2025 年 11 月起 HPV 疫苗纳入国家免疫规划：满 13 周岁女孩可免费接种 2 剂国产双价疫苗（馨可宁、沃泽惠双入围，第 1 剂 <14 周岁完成，第 2 剂在首剂后 12 个月内），18 周岁前补齐；同一程序建议使用同一厂家',
      '二价/四价/九价覆盖型别不同，越早接种保护越好，不要为等九价而拖延；男性目前仅进口四价（9–26 岁）、九价（16–26 岁）有适应证',
    ],
  },
];

export const vaccineMap: Record<string, Vaccine> = Object.fromEntries(
  vaccines.map((v) => [v.id, v]),
);
