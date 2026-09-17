import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpenCheck, ChevronRight, GitCompareArrows, Scale, Search, Stethoscope, Wand2,
} from 'lucide-react';
import { diseaseMap, vaccines } from '../data';
import { CategoryBadge } from '../components/Badge';
import type { VaccineCategory } from '../types';

export function LibraryPage() {
  const [q, setQ] = useState('');
  const [cat, setCat] = useState<'all' | VaccineCategory>('all');

  const list = useMemo(() => {
    const kw = q.trim();
    return vaccines.filter((v) => {
      if (cat !== 'all' && v.category !== cat) return false;
      if (!kw) return true;
      const diseases = v.diseaseIds.map((id) => diseaseMap[id]?.name ?? '').join(' ');
      const products = v.productIds.map((pid) => pid).join(' ');
      return (
        v.name.includes(kw) ||
        v.shortName.includes(kw) ||
        diseases.includes(kw) ||
        products.includes(kw)
      );
    });
  }, [q, cat]);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold px-1">疫苗库</h1>

      {/* 工具入口 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Link to="/plan" className="card p-3 flex flex-col items-center text-center gap-1.5 hover:shadow-md transition-shadow">
          <Wand2 className="w-6 h-6 text-brand-500" />
          <span className="text-xs font-medium text-stone-700">方案规划</span>
          <span className="text-[10px] text-stone-400 leading-tight">自费苗怎么选</span>
        </Link>
        <Link to="/compare-plans" className="card p-3 flex flex-col items-center text-center gap-1.5 hover:shadow-md transition-shadow">
          <Scale className="w-6 h-6 text-brand-500" />
          <span className="text-xs font-medium text-stone-700">免费vs自费</span>
          <span className="text-[10px] text-stone-400 leading-tight">五联/流脑对比</span>
        </Link>
        <Link to="/conditions" className="card p-3 flex flex-col items-center text-center gap-1.5 hover:shadow-md transition-shadow">
          <Stethoscope className="w-6 h-6 text-brand-500" />
          <span className="text-xs font-medium text-stone-700">能不能打</span>
          <span className="text-[10px] text-stone-400 leading-tight">湿疹黄疸发烧</span>
        </Link>
        <Link to="/knowledge" className="card p-3 flex flex-col items-center text-center gap-1.5 hover:shadow-md transition-shadow">
          <BookOpenCheck className="w-6 h-6 text-brand-500" />
          <span className="text-xs font-medium text-stone-700">接种知识</span>
          <span className="text-[10px] text-stone-400 leading-tight">辟谣清单</span>
        </Link>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex-1 flex items-center gap-2 bg-white rounded-xl border border-stone-200 px-3 py-2.5">
          <Search className="w-4 h-4 text-stone-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="搜疫苗 / 疾病，如「肺炎」「手足口」"
            className="flex-1 outline-none text-sm"
          />
        </div>
        <Link
          to="/compare"
          className="shrink-0 flex items-center gap-1 rounded-xl bg-white border border-stone-200 px-3 py-2.5 text-sm text-stone-600"
        >
          <GitCompareArrows className="w-4 h-4 text-brand-500" />
          厂商对比
        </Link>
      </div>

      <div className="flex gap-2">
        {([
          ['all', '全部'],
          ['nip', '一类免费'],
          ['selfPaid', '二类自费'],
        ] as const).map(([v, label]) => (
          <button
            key={v}
            onClick={() => setCat(v)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium ${
              cat === v ? 'bg-stone-800 text-white' : 'bg-white text-stone-500 border border-stone-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {list.map((v) => (
          <Link key={v.id} to={`/vaccine/${v.id}`} className="card p-4 flex items-center gap-3 hover:shadow-md transition-shadow">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold">{v.shortName}</span>
                <CategoryBadge category={v.category} />
              </div>
              <p className="text-sm text-stone-500 mt-1">
                预防：{v.diseaseIds.map((id) => diseaseMap[id]?.name).join('、')}
              </p>
              <p className="text-xs text-stone-400 mt-0.5">
                {v.doses.length} 剂程序 · {v.productIds.length} 个厂商产品
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-stone-300 shrink-0" />
          </Link>
        ))}
        {list.length === 0 && <p className="text-center text-stone-400 py-10 md:col-span-2 xl:col-span-3">没有找到相关疫苗</p>}
      </div>
    </div>
  );
}
