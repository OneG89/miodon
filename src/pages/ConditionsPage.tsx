import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronDown, Search, Stethoscope } from 'lucide-react';
import { conditions, VERDICT_META } from '../data/conditions';
import { Disclaimer } from '../components/Disclaimer';

export function ConditionsPage() {
  const navigate = useNavigate();
  const [q, setQ] = useState('');

  const list = useMemo(() => {
    const kw = q.trim();
    if (!kw) return conditions;
    return conditions.filter((c) => c.name.includes(kw) || c.detail.includes(kw));
  }, [q]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <button onClick={() => navigate(-1)} className="p-1 -ml-1 text-stone-500" aria-label="返回">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold">这种情况能不能打？</h1>
      </div>

      <div className="card border-brand-100 bg-brand-50/60 p-4 flex gap-3">
        <Stethoscope className="w-5 h-5 text-brand-500 shrink-0 mt-0.5" />
        <p className="text-sm text-stone-600 leading-relaxed">
          依据中华医学会儿科学分会《特殊健康状态儿童预防接种专家共识》整理。
          结论供快速参考，每个宝宝情况不同，<b>接种时请主动告知接种医生宝宝的健康状况，由门诊医生最终判断</b>。
        </p>
      </div>

      <div className="flex items-center gap-2 bg-white rounded-xl border border-stone-200 px-3 py-2.5">
        <Search className="w-4 h-4 text-stone-400" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="搜状况，如「湿疹」「黄疸」「早产」「发烧」"
          className="flex-1 outline-none text-sm"
        />
      </div>

      <div className="space-y-3">
        {list.map((c) => {
          const meta = VERDICT_META[c.verdict];
          return (
            <details key={c.id} className="card group">
              <summary className="flex items-center gap-3 p-4 cursor-pointer list-none">
                <span className={`tag shrink-0 ${meta.cls}`}>{meta.label}</span>
                <span className="flex-1 font-medium text-stone-800">{c.name}</span>
                <ChevronDown className="w-5 h-5 text-stone-300 group-open:rotate-180 transition-transform shrink-0" />
              </summary>
              <div className="px-4 pb-4 space-y-2.5">
                <p className="text-sm text-stone-700 leading-relaxed">{c.detail}</p>
                {c.tips && (
                  <ul className="space-y-1">
                    {c.tips.map((t, i) => (
                      <li key={i} className="text-sm text-stone-600 flex gap-2 leading-relaxed">
                        <span className="text-brand-400 shrink-0">✓</span>
                        {t}
                      </li>
                    ))}
                  </ul>
                )}
                <p className="text-xs text-stone-400">依据：{c.source}</p>
              </div>
            </details>
          );
        })}
        {list.length === 0 && <p className="text-center text-stone-400 py-10">没有找到相关状况，请咨询接种医生</p>}
      </div>

      <Disclaimer compact />
    </div>
  );
}
