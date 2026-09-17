import { ShieldAlert } from 'lucide-react';

/** 全站常驻免责声明 */
export function Disclaimer({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <p className="text-center text-xs text-stone-400 px-6 leading-relaxed">
        苗懂 Miodon 仅提供疫苗数据查询与接种安排参考，不在线问诊、不售卖疫苗，不替代接种门诊医生判断。
        接种以门诊评估和疫苗说明书为准。
      </p>
    );
  }
  return (
    <div className="card border-brand-100 bg-brand-50/60 p-4 flex gap-3">
      <ShieldAlert className="w-5 h-5 text-brand-500 shrink-0 mt-0.5" />
      <div className="text-sm text-stone-600 leading-relaxed">
        <p className="font-medium text-stone-700 mb-1">温馨提示</p>
        <p>
          本应用的接种程序依据国家免疫规划（2021 版）与疫苗说明书整理，价格与供应各地不同，以接种门诊公示为准。
          苗懂不做在线问诊、不售卖疫苗，<b>不能替代接种门诊医生的专业判断</b>。宝宝生病、早产或有特殊健康状况时，请提前告知接种医生。
        </p>
      </div>
    </div>
  );
}
