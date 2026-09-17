import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft, Check, Lightbulb, Minus, Scale, Wand2,
} from 'lucide-react';
import { compareGroups } from '../data/comparisons';
import { vaccineMap } from '../data';
import { CategoryBadge } from '../components/Badge';
import { Disclaimer } from '../components/Disclaimer';
import type { CompareTone } from '../data/comparisons';

const toneCls: Record<CompareTone, string> = {
  free: 'bg-sage-50 text-sage-700 border border-sage-200',
  self: 'bg-amber-50 text-amber-700 border border-amber-200',
  combo: 'bg-brand-50 text-brand-600 border border-brand-100',
};

export function ComparePlansPage() {
  const [params] = useSearchParams();
  const g = params.get('g');

  useEffect(() => {
    if (!g) return;
    const el = document.getElementById(g);
    if (el) {
      // 等 sticky 头部渲染完再滚动，并留出头部偏移
      setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
    }
  }, [g]);

  return (
    <div className="pb-10">
      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm px-4 lg:px-5 pt-3 lg:pt-4 pb-4 sticky top-2 lg:top-4 z-20">
        <div className="flex items-center gap-2 mb-2">
          <Link to="/library" className="p-1 -ml-1 text-stone-500" aria-label="返回">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-lg font-bold flex items-center gap-2">
            <Scale className="w-5 h-5 text-brand-500" />
            免费 vs 自费怎么选
          </h1>
        </div>
        <p className="text-xs text-stone-500 leading-relaxed">
          一类（免费）和二类（自费）是费用承担方式，不是重要性排序。以下按预防疾病分组对比，
          价格为各地参考价区间，以当地门诊公示为准。
        </p>
      </div>

      <div className="mt-4 space-y-6">
        {compareGroups.map((group) => (
          <section key={group.id} id={group.id} className="card p-4 scroll-mt-24">
            <h2 className="font-bold text-stone-800">{group.title}</h2>
            <p className="text-sm text-stone-500 mt-1 leading-relaxed">{group.subtitle}</p>

            {/* 并列方案 */}
            {group.options && (
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4 mt-4">
                {group.options.map((opt) => (
                  <div
                    key={opt.title}
                    className={`rounded-xl border p-3.5 flex flex-col ${
                      opt.badgeTone === 'combo'
                        ? 'border-brand-200 bg-brand-50/40'
                        : 'border-stone-200 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <p className="font-semibold text-stone-800 text-sm leading-snug">{opt.title}</p>
                      <span className={`shrink-0 text-[11px] font-medium rounded-full px-2 py-0.5 ${toneCls[opt.badgeTone]}`}>
                        {opt.badge}
                      </span>
                    </div>

                    <dl className="text-xs space-y-1.5 text-stone-600 mb-2.5">
                      <div className="flex gap-1">
                        <dt className="text-stone-400 shrink-0 w-14">费用</dt>
                        <dd className="font-medium text-stone-700">{opt.cost}</dd>
                      </div>
                      <div className="flex gap-1">
                        <dt className="text-stone-400 shrink-0 w-14">针次</dt>
                        <dd>{opt.doses}</dd>
                      </div>
                      <div className="flex gap-1">
                        <dt className="text-stone-400 shrink-0 w-14">覆盖</dt>
                        <dd>{opt.covers}</dd>
                      </div>
                    </dl>

                    <ul className="space-y-1 text-xs mb-2">
                      {opt.pros.map((p) => (
                        <li key={p} className="flex gap-1.5 text-sage-700 leading-relaxed">
                          <Check className="w-3.5 h-3.5 shrink-0 mt-0.5 text-sage-500" />
                          {p}
                        </li>
                      ))}
                      {opt.cons.map((c) => (
                        <li key={c} className="flex gap-1.5 text-stone-500 leading-relaxed">
                          <Minus className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-500" />
                          {c}
                        </li>
                      ))}
                    </ul>

                    {opt.vaccineIds && (
                      <div className="mt-auto pt-2 flex flex-wrap gap-1.5">
                        {opt.vaccineIds.map((vid) => (
                          <Link
                            key={vid}
                            to={`/vaccine/${vid}`}
                            className="inline-flex items-center text-[11px] text-brand-600 bg-white border border-brand-100 rounded-full px-2 py-0.5 hover:bg-brand-50"
                          >
                            {vaccineMap[vid]?.shortName}详情 →
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* 纯增量自费苗 */}
            {group.additions && (
              <>
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3 mt-4">
                  {group.additions.map((a) => {
                    const v = vaccineMap[a.vaccineId];
                    if (!v) return null;
                    return (
                      <Link
                        key={a.vaccineId}
                        to={`/vaccine/${a.vaccineId}`}
                        className="rounded-xl border border-stone-200 bg-white p-3.5 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <p className="font-semibold text-sm text-stone-800">{v.shortName}</p>
                          <CategoryBadge category={v.category} />
                        </div>
                        <p className="text-xs font-medium text-brand-600 mb-1">{a.price}</p>
                        <p className="text-xs text-stone-500 leading-relaxed">{a.highlight}</p>
                      </Link>
                    );
                  })}
                </div>
                {group.additionNote && (
                  <p className="text-xs text-stone-400 mt-3 leading-relaxed">{group.additionNote}</p>
                )}
              </>
            )}

            {/* 选择建议 */}
            <div className="mt-4 rounded-xl bg-brand-50 border border-brand-100 p-3.5 flex gap-2.5">
              <Lightbulb className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
              <p className="text-sm text-stone-700 leading-relaxed">{group.verdict}</p>
            </div>
          </section>
        ))}

        {/* CTA */}
        <Link
          to="/plan"
          className="card p-4 flex items-center justify-between hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-3">
            <Wand2 className="w-5 h-5 text-brand-500" />
            <div>
              <p className="font-semibold text-sm text-stone-800">拿不定主意？</p>
              <p className="text-xs text-stone-500">去方案规划器，按宝宝生日生成自费接种日历和费用估算</p>
            </div>
          </div>
          <span className="text-sm text-brand-500 shrink-0">去规划 →</span>
        </Link>

        <Disclaimer compact />
      </div>
    </div>
  );
}
