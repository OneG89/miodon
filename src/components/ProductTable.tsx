import { FlaskConical } from 'lucide-react';
import type { VaccineProduct } from '../types';
import { QualityBadge } from './Badge';

/**
 * 产品横向对比表：行 = 对比项（厂商/工艺/价格/临床数据），列 = 产品。
 * 小屏可横向滑动，左侧指标列固定。厂商对比页与疫苗详情页共用。
 */
export function ProductTable({ products }: { products: VaccineProduct[] }) {
  const gridStyle = {
    gridTemplateColumns: `96px repeat(${products.length}, minmax(0, 1fr))`,
  };
  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <div className="min-w-[720px]">
          {/* 表头：产品名 */}
          <div className="grid border-b border-stone-100 bg-stone-50" style={gridStyle}>
            <div className="sticky left-0 z-10 bg-stone-50" />
            {products.map((p) => (
              <div key={p.id} className="px-4 py-3 border-l border-stone-100">
                <p className="font-bold text-stone-800 text-sm leading-snug">{p.tradeName}</p>
                <div className="mt-1.5">
                  {p.nipSupplied ? (
                    <span className="tag bg-sage-100 text-sage-600">免疫规划供应</span>
                  ) : (
                    <span className="tag bg-brand-100 text-brand-700">自费</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <Row label="生产厂商" count={products.length}>
            {products.map((p) => (
              <Cell key={p.id}><p className="text-sm text-stone-700">{p.manufacturer}</p></Cell>
            ))}
          </Row>

          <Row label="工艺技术" count={products.length}>
            {products.map((p) => (
              <Cell key={p.id}><p className="text-sm text-stone-600">{p.technology}</p></Cell>
            ))}
          </Row>

          <Row label="参考价格与接种窗口" count={products.length}>
            {products.map((p) => (
              <Cell key={p.id}>
                <p className="text-sm text-stone-600 leading-relaxed">{p.priceNote ?? '以门诊公示为准'}</p>
              </Cell>
            ))}
          </Row>

          {/* 临床数据行 */}
          <div className="grid border-b border-stone-100 last:border-b-0" style={gridStyle}>
            <div className="sticky left-0 z-10 bg-white px-3 py-4 flex items-start gap-1.5 text-sm font-medium text-stone-500">
              <FlaskConical className="w-4 h-4 text-brand-500 mt-0.5 shrink-0" />
              临床测试数据
            </div>
            {products.map((p) => (
              <Cell key={p.id}>
                {!p.clinical || p.clinical.length === 0 ? (
                  <p className="text-xs text-stone-400">临床数据整理核实中，暂以说明书为准</p>
                ) : (
                  <div className="space-y-3">
                    {p.clinical.map((c, i) => (
                      <div key={i} className="rounded-lg bg-stone-50 p-3 space-y-1.5">
                        <p className="text-xs font-semibold text-stone-800">{c.endpoint}</p>
                        <div className="pb-0.5"><QualityBadge quality={c.quality} /></div>
                        <p className="text-sm text-stone-700 leading-relaxed">{c.result}</p>
                        <p className="text-xs text-stone-500 leading-relaxed">
                          测试方法：{c.design}
                          <br />
                          样本/人群：{c.population}
                          {c.followUp ? <><br />随访：{c.followUp}</> : null}
                        </p>
                        <p className="text-xs text-stone-400 leading-relaxed">来源：{c.source}</p>
                      </div>
                    ))}
                  </div>
                )}
              </Cell>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, count, children }: { label: string; count: number; children: React.ReactNode }) {
  return (
    <div
      className="grid border-b border-stone-100"
      style={{ gridTemplateColumns: `96px repeat(${count}, minmax(0, 1fr))` }}
    >
      <div className="sticky left-0 z-10 bg-white px-3 py-4 flex items-center text-sm font-medium text-stone-500">
        {label}
      </div>
      {children}
    </div>
  );
}

function Cell({ children }: { children: React.ReactNode }) {
  return <div className="px-4 py-4 border-l border-stone-100 align-top">{children}</div>;
}
