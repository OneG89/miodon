import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { productMap, vaccines, vaccineMap } from '../data';
import { ProductTable } from '../components/ProductTable';
import { Disclaimer } from '../components/Disclaimer';

export function ComparePage() {
  const [params, setParams] = useSearchParams();
  const comparable = vaccines.filter((v) => v.productIds.length > 1);
  const initialId = params.get('v') && vaccineMap[params.get('v')!]
    ? params.get('v')!
    : comparable[0]?.id;
  const [selected, setSelected] = useState<string>(initialId ?? '');
  const vaccine = vaccineMap[selected];

  function choose(id: string) {
    setSelected(id);
    setParams({ v: id });
  }

  const products = vaccine ? vaccine.productIds.map((pid) => productMap[pid]).filter(Boolean) : [];

  return (
    <div className="pb-10">
      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm px-4 lg:px-5 pt-3 lg:pt-4 pb-4 sticky top-2 lg:top-4 z-20">
        <div className="flex items-center gap-2 mb-3">
          <Link to="/library" className="p-1 -ml-1 text-stone-500" aria-label="返回">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-lg font-bold">厂商产品对比</h1>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          {comparable.map((v) => (
            <button
              key={v.id}
              onClick={() => choose(v.id)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium ${
                selected === v.id ? 'bg-brand-500 text-white' : 'bg-stone-100 text-stone-600'
              }`}
            >
              {v.shortName}
            </button>
          ))}
        </div>
      </div>

      {vaccine && (
        <div className="mt-4 space-y-4">
          <p className="text-sm text-stone-500 px-1">
            {vaccine.name}：共 {products.length} 个产品横向对比，价格与供应以当地门诊公示为准
            <span className="text-stone-400">（小屏可左右滑动表格）</span>
            {' '}·{' '}
            <Link to="/compare-plans" className="text-brand-600 font-medium">
              想看免费针和自费针（如五联 vs 免费单苗）怎么选？→ 免费 vs 自费对比
            </Link>
          </p>

          <ProductTable products={products} />

          <Disclaimer compact />
        </div>
      )}
    </div>
  );
}
