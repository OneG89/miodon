import type { CalendarDose, DataQuality, VaccineCategory } from '../types';

export function CategoryBadge({ category }: { category: VaccineCategory }) {
  return category === 'nip' ? (
    <span className="tag bg-sage-100 text-sage-600">一类 · 免费</span>
  ) : (
    <span className="tag bg-brand-100 text-brand-700">二类 · 自费</span>
  );
}

export function StatusBadge({ status }: { status: CalendarDose['status'] }) {
  const map = {
    done: { text: '已接种', cls: 'bg-sage-100 text-sage-600' },
    dueSoon: { text: '即将到期', cls: 'bg-brand-100 text-brand-700' },
    overdue: { text: '已逾期·可补种', cls: 'bg-red-100 text-red-700' },
    upcoming: { text: '待接种', cls: 'bg-stone-100 text-stone-500' },
  } as const;
  const s = map[status];
  return <span className={`tag ${s.cls}`}>{s.text}</span>;
}

export function QualityBadge({ quality }: { quality: DataQuality }) {
  const map = {
    published: { text: '已发表临床研究', cls: 'bg-sage-100 text-sage-600' },
    label: { text: '疫苗说明书数据', cls: 'bg-blue-100 text-blue-700' },
    pending: { text: '待补充核实', cls: 'bg-stone-200 text-stone-500' },
  } as const;
  const q = map[quality];
  return <span className={`tag ${q.cls}`}>{q.text}</span>;
}
