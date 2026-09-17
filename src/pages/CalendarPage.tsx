import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BellRing, CheckCircle2, ChevronRight, CircleAlert, Download, Sparkles, Wand2,
} from 'lucide-react';
import { useActiveChild, useStorageVersion } from '../hooks';
import { getPlanChoices, listRecordsForChild } from '../lib/storage';
import { buildCalendar, progressStats } from '../lib/schedule';
import { PLAN_PRESETS } from '../lib/planner';
import { exportCalendarICS } from '../lib/ics';
import { daysFromNow, formatAgeLabel, ageInMonths, shortDate } from '../lib/age';
import { CategoryBadge, StatusBadge } from '../components/Badge';
import { RecordDoseModal } from '../components/RecordDoseModal';
import { Disclaimer } from '../components/Disclaimer';
import type { CalendarDose } from '../types';

export function CalendarPage() {
  const child = useActiveChild();
  const [recording, setRecording] = useState<CalendarDose | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'done'>('all');

  const version = useStorageVersion();
  const choices = getPlanChoices();
  const doses = useMemo(
    () => (child ? buildCalendar(child.birthDate, listRecordsForChild(child.id), choices) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [child, version],
  );

  if (!child) return null; // 路由守卫已处理
  const presetName = choices
    ? (PLAN_PRESETS.find((p) => p.id === choices.presetId)?.name ?? '自定义方案')
    : null;

  const stats = progressStats(doses);
  const ageMonths = ageInMonths(child.birthDate);
  const visible = doses.filter((d) =>
    filter === 'all' ? true : filter === 'done' ? d.status === 'done' : d.status !== 'done',
  );

  return (
    <div className="space-y-4">
      {/* 头部：宝宝信息 + 进度 */}
      <div className="card p-5 bg-gradient-to-br from-brand-500 to-brand-400 text-white border-0">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/80 text-sm">{child.gender === 'F' ? '女宝' : child.gender === 'M' ? '男宝' : '宝宝'}</p>
            <h2 className="text-2xl font-bold">{child.name}</h2>
            <p className="text-white/90 text-sm mt-1">
              {formatAgeLabel(ageMonths)} · 已完成 {stats.done}/{stats.total} 剂
            </p>
          </div>
          <div className="relative w-16 h-16">
            <svg viewBox="0 0 36 36" className="w-16 h-16 -rotate-90">
              <circle cx="18" cy="18" r="15.5" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="4" />
              <circle
                cx="18" cy="18" r="15.5" fill="none" stroke="white" strokeWidth="4"
                strokeDasharray={`${(stats.pct / 100) * 97.4} 97.4`} strokeLinecap="round"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-sm font-bold">
              {stats.pct}%
            </span>
          </div>
        </div>
        <div className="mt-3 h-2 rounded-full bg-white/25 overflow-hidden">
          <div className="h-full bg-white rounded-full transition-all" style={{ width: `${stats.pct}%` }} />
        </div>
      </div>

      {/* 方案入口 */}
      <Link
        to="/plan"
        className={`card p-4 flex items-center gap-3 ${presetName ? '' : 'border-brand-200 bg-brand-50/60'}`}
      >
        <div className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center shrink-0">
          <Wand2 className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-sm">
            {presetName ? `当前方案：${presetName}` : '定制宝宝的自费疫苗方案'}
          </p>
          <p className="text-xs text-stone-500 mt-0.5">
            {presetName ? '点击可调整选择，排针引擎自动更新日历' : '五联/13 价/轮状怎么选？勾选后自动排期、算费用'}
          </p>
        </div>
        <ChevronRight className="w-5 h-5 text-stone-300 shrink-0" />
      </Link>

      {/* 桌面：右栏（sticky 下一针）；移动端顺序在筛选之前 */}
      <div className="lg:grid lg:grid-cols-3 lg:gap-4 lg:items-start">
        <aside className="lg:col-start-3 lg:row-start-1 lg:sticky lg:top-8 space-y-4">
          <NextDoseCard doses={doses} />
          <div className="hidden lg:block">
            <Disclaimer compact />
          </div>
        </aside>

        <div className="lg:col-span-2 lg:col-start-1 lg:row-start-1 space-y-4 mt-4 lg:mt-0">
          {/* 筛选 + 导出 */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex gap-2">
              {([
                ['all', '全部'],
                ['pending', '待接种'],
                ['done', '已完成'],
              ] as const).map(([v, label]) => (
                <button
                  key={v}
                  onClick={() => setFilter(v)}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium ${
                    filter === v ? 'bg-stone-800 text-white' : 'bg-white text-stone-500 border border-stone-200'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <button
              onClick={() => exportCalendarICS(doses, child.name)}
              className="shrink-0 flex items-center gap-1.5 rounded-full bg-white border border-stone-200 px-3 py-1.5 text-sm text-stone-600"
            >
              <Download className="w-4 h-4 text-brand-500" />
              导出日历
            </button>
          </div>

          {/* 时间线 */}
          <div className="space-y-3">
            {visible.map((d) => (
              <DoseTimelineItem key={`${d.vaccineId}-${d.doseIndex}`} dose={d} onRecord={() => setRecording(d)} />
            ))}
            {visible.length === 0 && (
              <p className="text-center text-stone-400 py-10">暂无相关剂次</p>
            )}
          </div>

          <div className="lg:hidden">
            <Disclaimer compact />
          </div>
        </div>
      </div>

      {recording && (
        <RecordDoseModal dose={recording} childId={child.id} onClose={() => setRecording(null)} />
      )}
    </div>
  );
}

function NextDoseCard({ doses }: { doses: CalendarDose[] }) {
  const next = doses.find((d) => d.status !== 'done');
  if (!next) {
    return (
      <div className="card p-4 flex items-center gap-3 border-sage-200">
        <CheckCircle2 className="w-8 h-8 text-sage-500 shrink-0" />
        <div>
          <p className="font-semibold text-sage-600">全程接种已完成 🎉</p>
          <p className="text-sm text-stone-500">记得每年秋季带宝宝接种流感疫苗（每年 1 剂）</p>
        </div>
      </div>
    );
  }
  const diff = daysFromNow(next.dueDate);
  const urgent = next.status === 'overdue' || next.status === 'dueSoon';
  return (
    <div className={`card p-4 flex items-center gap-3 ${urgent ? 'border-brand-200 bg-brand-50/60' : ''}`}>
      {next.status === 'overdue' ? (
        <CircleAlert className="w-8 h-8 text-red-500 shrink-0" />
      ) : (
        <Sparkles className="w-8 h-8 text-brand-500 shrink-0" />
      )}
      <div className="flex-1">
        <p className="font-semibold">
          下一针：{next.shortName}（第 {next.doseIndex} 剂）
        </p>
        <p className="text-sm text-stone-500">
          应种 {shortDate(next.dueDate)} ·{' '}
          {next.status === 'overdue'
            ? `已超过建议日期 ${-diff} 天，可尽快补种`
            : diff === 0
              ? '就是今天'
              : `还有 ${diff} 天`}
        </p>
      </div>
      <Link to={`/vaccine/${next.vaccineId}`} className="text-brand-500 p-1" aria-label="查看详情">
        <ChevronRight className="w-6 h-6" />
      </Link>
    </div>
  );
}

function DoseTimelineItem({ dose, onRecord }: { dose: CalendarDose; onRecord: () => void }) {
  const done = dose.status === 'done';
  const diff = daysFromNow(dose.dueDate);
  return (
    <div className={`card p-4 flex items-center gap-3 ${done ? 'opacity-70' : ''}`}>
      <div className="flex flex-col items-center w-14 shrink-0">
        <span className={`text-lg font-bold leading-tight ${done ? 'text-sage-500' : dose.status === 'overdue' ? 'text-red-500' : 'text-stone-700'}`}>
          {done && dose.record?.actualDate
            ? shortDate(dose.record.actualDate)
            : shortDate(dose.dueDate)}
        </span>
        <span className="text-xs text-stone-400 mt-0.5">{dose.ageLabel}</span>
      </div>
      <div className="w-px self-stretch bg-stone-100" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <Link to={`/vaccine/${dose.vaccineId}`} className="font-semibold truncate hover:text-brand-600">
            {dose.shortName}
            <span className="text-stone-400 font-normal"> · 第 {dose.doseIndex} 剂</span>
          </Link>
          <CategoryBadge category={dose.category} />
        </div>
        <div className="mt-1 flex items-center gap-2 flex-wrap">
          <StatusBadge status={dose.status} />
          {dose.reminder && (
            <span className="tag bg-blue-50 text-blue-600">
              <BellRing className="w-3 h-3 mr-0.5" />年度提醒
            </span>
          )}
          {!done && dose.status === 'overdue' && (
            <span className="text-xs text-red-500">逾期 {-diff} 天，别担心，可补种</span>
          )}
          {done && dose.record?.productId && (
            <span className="text-xs text-stone-400">已完成 ✓</span>
          )}
        </div>
        {!done && dose.coScheduled && dose.coScheduled.length > 0 && (
          <p className="mt-1 text-xs text-sage-600">
            当天可同时接种：{dose.coScheduled.join('、')}（不同部位，少跑一趟）
          </p>
        )}
      </div>
      {done ? (
        <CheckCircle2 className="w-6 h-6 text-sage-500 shrink-0" />
      ) : (
        <button
          onClick={onRecord}
          className={`shrink-0 rounded-lg px-3 py-2 text-sm font-medium ${
            dose.status === 'overdue' || dose.status === 'dueSoon'
              ? 'bg-brand-500 text-white'
              : 'bg-stone-100 text-stone-600'
          }`}
        >
          记录接种
        </button>
      )}
    </div>
  );
}
