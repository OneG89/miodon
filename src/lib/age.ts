import { addMonths, differenceInCalendarDays, format, parseISO } from 'date-fns';

/** 月龄计算：返回宝宝当前月龄（按日历月差，未到当月生日舍去） */
export function ageInMonths(birthDate: string, now: Date = new Date()): number {
  const birth = parseISO(birthDate);
  const months =
    (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
  return now.getDate() < birth.getDate() ? months - 1 : months;
}

/** 月龄转可读年龄，如 0 → 「出生」、3 → 「3 月龄」、72 → 「6 岁」 */
export function formatAgeLabel(months: number): string {
  if (months === 0) return '出生时';
  if (months < 12) return `${months} 月龄`;
  const years = months / 12;
  if (Number.isInteger(years)) return `${years} 岁`;
  return `${Math.floor(years)} 岁 ${months % 12} 个月`;
}

/** 出生日期 + 月龄 → 应种日期（ISO yyyy-MM-dd） */
export function dateAtAge(birthDate: string, ageMonths: number): string {
  return format(addMonths(parseISO(birthDate), ageMonths), 'yyyy-MM-dd');
}

export function formatDate(iso: string): string {
  return format(parseISO(iso), 'yyyy年M月d日');
}

export function shortDate(iso: string): string {
  return format(parseISO(iso), 'M月d日');
}

/** 距今天数：负数 = 已过去，正数 = 未来 */
export function daysFromNow(iso: string, now: Date = new Date()): number {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return differenceInCalendarDays(parseISO(iso), today);
}

export function todayISO(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

export function uid(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
