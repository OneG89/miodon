import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  AlertTriangle, ArrowLeft, Ban, CalendarRange, ChevronRight, FlaskConical, GitCompareArrows,
  Info, ShieldPlus,
} from 'lucide-react';
import { diseaseMap, productMap, vaccineMap } from '../data';
import { groupForVaccine, relatedVaccines } from '../lib/compare';
import { CategoryBadge } from '../components/Badge';
import { Disclaimer } from '../components/Disclaimer';
import { ProductTable } from '../components/ProductTable';

export function VaccineDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const vaccine = id ? vaccineMap[id] : undefined;

  if (!vaccine) {
    return (
      <div className="p-8 text-center">
        <p className="text-stone-500">未找到该疫苗</p>
        <Link to="/library" className="text-brand-500">返回疫苗库</Link>
      </div>
    );
  }

  return (
    <div className="pb-24">
      {/* 头部 */}
      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm px-4 lg:px-5 pt-3 lg:pt-4 pb-4 sticky top-2 lg:top-4 z-20">
        <div className="flex items-center gap-2 mb-3">
          <button onClick={() => navigate(-1)} className="p-1 -ml-1 text-stone-500" aria-label="返回">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <span className="text-sm text-stone-400">疫苗详情</span>
        </div>
        <h1 className="text-xl font-bold">{vaccine.name}</h1>
        <div className="mt-2 flex items-center gap-2 flex-wrap">
          <CategoryBadge category={vaccine.category} />
          {vaccine.diseaseIds.map((did) => (
            <span key={did} className="tag bg-stone-100 text-stone-600">
              {diseaseMap[did]?.name}
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-4 mt-4 lg:mt-6">
        {vaccine.notes && (
          <div className="card border-brand-100 bg-brand-50/60 p-4 flex gap-3">
            <Info className="w-5 h-5 text-brand-500 shrink-0 mt-0.5" />
            <div className="text-sm text-stone-700 space-y-1.5">
              {vaccine.notes.map((n, i) => (
                <p key={i}>{n}</p>
              ))}
            </div>
          </div>
        )}

        {/* 相关疫苗对比（免费 vs 自费自动引导） */}
        <CompareHint vaccineId={vaccine.id} />

        {/* 防什么病 */}
        <Section icon={<ShieldPlus className="w-4 h-4" />} title="这针防什么病">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {vaccine.diseaseIds.map((did, i) => {
              const d = diseaseMap[did];
              if (!d) return null;
              const n = vaccine.diseaseIds.length;
              const isLast = i === n - 1;
              // 末卡跨列补齐，避免网格右侧留白
              let span = '';
              if (n === 1) {
                span = 'sm:col-span-2 xl:col-span-3'; // 单一疾病：卡片占满整行
              } else if (isLast && n % 2 === 1) {
                span = n === 5 ? 'sm:col-span-2 xl:col-span-2' : 'sm:col-span-2 xl:col-span-1';
              } else if (isLast && n === 4) {
                span = 'xl:col-span-3';
              }
              const info = (
                <>
                  <p className="text-sm text-stone-600 leading-relaxed">{d.intro}</p>
                  <p className="text-sm text-stone-500 leading-relaxed">
                    <span className="text-stone-400">传播途径：</span>{d.transmission}
                  </p>
                  <p className="text-sm text-stone-500 leading-relaxed">
                    <span className="text-stone-400">为什么要防：</span>{d.severity}
                  </p>
                </>
              );
              return (
                <div key={did} className={`rounded-xl bg-stone-50 p-3.5 ${span}`}>
                  <p className="font-semibold text-stone-800 mb-2">{d.name}</p>
                  {n === 1 ? (
                    // 单一疾病：三段信息横向排满整行
                    <div className="grid gap-3 md:grid-cols-3 [&>p]:m-0">{info}</div>
                  ) : (
                    <div className="space-y-2">{info}</div>
                  )}
                </div>
              );
            })}
          </div>
        </Section>

        {/* 接种程序 */}
        <Section icon={<CalendarRange className="w-4 h-4" />} title="接种程序">
          <ol className="relative border-l-2 border-brand-100 ml-2 space-y-4 max-w-xl">
            {vaccine.doses.map((d) => (
              <li key={d.doseIndex} className="ml-4">
                <span className="absolute -left-[9px] w-4 h-4 rounded-full bg-brand-500 border-2 border-white" />
                <p className="font-semibold">
                  第 {d.doseIndex} 剂 · {d.ageLabel}
                </p>
                {d.note && <p className="text-sm text-stone-500 mt-0.5 leading-relaxed">{d.note}</p>}
              </li>
            ))}
          </ol>
        </Section>

        {/* 厂商产品与临床数据（横向对比表，与厂商对比页样式一致） */}
        <section>
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="font-bold flex items-center gap-2 text-stone-800">
              <FlaskConical className="w-4 h-4 text-brand-500" />
              厂商产品与临床数据
            </h2>
            {vaccine.productIds.length > 1 && (
              <Link to={`/compare?v=${vaccine.id}`} className="text-sm text-brand-500 shrink-0">
                全部对比 →
              </Link>
            )}
          </div>
          <ProductTable
            products={vaccine.productIds
              .map((pid) => productMap[pid])
              .filter((p): p is NonNullable<typeof p> => Boolean(p))}
          />
        </section>

        {/* 可能的反应 */}
        <Section icon={<AlertTriangle className="w-4 h-4" />} title="接种后可能的反应与处理">
          <div className="grid gap-4 md:grid-cols-2">
            {vaccine.reactions.map((g) => {
              const label = { common: '常见反应（多为自限，1–3 天缓解）', rare: '罕见反应', veryRare: '极罕见反应' }[g.severity];
              const color = g.severity === 'common' ? 'text-sage-600' : 'text-red-600';
              return (
                <div key={g.severity}>
                  <p className={`text-sm font-medium mb-1.5 ${color}`}>{label}</p>
                  <div className="space-y-2">
                    {g.items.map((item, i) => (
                      <div key={i} className="rounded-xl bg-stone-50 p-3">
                        <p className="text-sm font-medium">
                          {item.symptom}
                          {item.rate && <span className="text-stone-400 font-normal">（{item.rate}）</span>}
                        </p>
                        <p className="text-sm text-stone-500 mt-1">怎么处理：{item.handling}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </Section>

        {/* 禁忌 */}
        <Section icon={<Ban className="w-4 h-4" />} title="禁忌与暂缓">
          <ul className="space-y-2">
            {vaccine.contraindications.map((c, i) => (
              <li key={i} className="text-sm text-stone-600 flex gap-2 leading-relaxed">
                <span className="text-red-400 shrink-0">·</span>
                {c}
              </li>
            ))}
          </ul>
        </Section>

        <Disclaimer />
      </div>
    </div>
  );
}

/** 相关疫苗对比引导：按预防疾病重叠自动推导（脊灰→五联、百白破→五联/四联、流脑→自费流脑等） */
function CompareHint({ vaccineId }: { vaccineId: string }) {
  const related = relatedVaccines(vaccineId);
  const group = groupForVaccine(vaccineId);
  if (related.length === 0 && !group) return null;

  return (
    <section className="card p-4 border-brand-100 bg-brand-50/40">
      <h2 className="font-bold flex items-center gap-2 text-stone-800 mb-2.5">
        <GitCompareArrows className="w-4 h-4 text-brand-500" />
        相关疫苗对比
      </h2>

      {related.length > 0 ? (
        <ul className="space-y-2">
          {related.map(({ vaccine: v, reason }) => (
            <li key={v.id}>
              <Link
                to={`/vaccine/${v.id}`}
                className="flex items-center justify-between gap-2 rounded-xl bg-white border border-stone-200 px-3 py-2.5 hover:shadow-md transition-shadow"
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-stone-800 flex items-center gap-2 flex-wrap">
                    对比：{v.shortName}
                    <CategoryBadge category={v.category} />
                  </p>
                  <p className="text-xs text-stone-500 mt-1 leading-relaxed">{reason}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-300 shrink-0" />
              </Link>
            </li>
          ))}
        </ul>
      ) : group?.id === 'g-addition' ? (
        <p className="text-sm text-stone-600 leading-relaxed">
          本病在国家<b className="text-stone-800">免费免疫程序中没有对应疫苗</b>
          ，属于纯增量自费苗——它不替代任何免费针，防的是免费程序尚未覆盖的疾病。
        </p>
      ) : null}

      {group && (
        <Link
          to={`/compare-plans?g=${group.id}`}
          className="mt-2.5 inline-flex items-center gap-1 text-sm font-medium text-brand-600"
        >
          查看「免费 vs 自费」完整对比 →
        </Link>
      )}
    </section>
  );
}

function Section({
  icon, title, extra, children,
}: {
  icon: React.ReactNode;
  title: string;
  extra?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="card p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-bold flex items-center gap-2 text-stone-800">
          <span className="text-brand-500">{icon}</span>
          {title}
        </h2>
        {extra}
      </div>
      {children}
    </section>
  );
}
