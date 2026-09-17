import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Coins, Info, ShieldPlus, Syringe } from 'lucide-react';
import { diseaseMap } from '../data';
import {
  lockReason, PLAN_PRESETS, planStats, replacementNote,
  SELF_PAID_PRICES, selfPaidVaccines,
} from '../lib/planner';
import { getPlanChoices, setPlanChoices } from '../lib/storage';
import { CategoryBadge } from '../components/Badge';
import { Disclaimer } from '../components/Disclaimer';

export function PlanPage() {
  const navigate = useNavigate();
  const saved = getPlanChoices();
  const [enabled, setEnabled] = useState<Set<string>>(
    new Set(saved?.enabled ?? PLAN_PRESETS[1].enabled),
  );
  const [presetId, setPresetId] = useState<string>(saved?.presetId ?? 'custom');

  const selfPaid = useMemo(() => selfPaidVaccines(), []);
  const stats = useMemo(() => planStats({ enabled: [...enabled] }), [enabled]);

  function toggle(id: string) {
    const next = new Set(enabled);
    if (next.has(id)) {
      next.delete(id);
    } else {
      // 互斥组内三选一：选新的自动移除同组
      for (const group of [['v-pentavalent', 'v-quadrivalent', 'v-hib']]) {
        if (group.includes(id)) group.forEach((g) => next.delete(g));
      }
      next.add(id);
    }
    setEnabled(next);
    setPresetId('custom');
  }

  function applyPreset(p: (typeof PLAN_PRESETS)[number]) {
    setEnabled(new Set(p.enabled));
    setPresetId(p.id);
  }

  function save() {
    setPlanChoices({ enabled: [...enabled], presetId });
    navigate('/');
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <button onClick={() => navigate(-1)} className="p-1 -ml-1 text-stone-500" aria-label="返回">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold">自费疫苗方案规划</h1>
      </div>

      <div className="card border-brand-100 bg-brand-50/60 p-4 flex gap-3">
        <Info className="w-5 h-5 text-brand-500 shrink-0 mt-0.5" />
        <p className="text-sm text-stone-600 leading-relaxed">
          勾选你想给宝宝接种的自费疫苗，排针引擎会自动处理联合疫苗替换（打五联就不再重复打免费百白破/Hib）、
          同日可接种提示，并更新到宝宝的接种日历。费用为各地常见参考区间，以门诊公示为准。
          {' '}
          <Link to="/compare-plans" className="text-brand-600 font-medium whitespace-nowrap">
            先看免费 vs 自费对比 →
          </Link>
        </p>
      </div>

      {/* 预设方案 */}
      <div className="grid gap-3 md:grid-cols-3">
        {PLAN_PRESETS.map((p) => (
          <button
            key={p.id}
            onClick={() => applyPreset(p)}
            className={`card p-4 text-left transition-shadow hover:shadow-md ${
              presetId === p.id ? 'ring-2 ring-brand-500' : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <p className="font-bold text-stone-800">{p.name}</p>
              {presetId === p.id && (
                <span className="w-5 h-5 rounded-full bg-brand-500 text-white flex items-center justify-center">
                  <Check className="w-3.5 h-3.5" />
                </span>
              )}
            </div>
            <p className="text-sm text-brand-600 mt-0.5">{p.slogan}</p>
            <p className="text-xs text-stone-500 mt-2 leading-relaxed">{p.highlight}</p>
          </button>
        ))}
      </div>

      {/* 自费疫苗逐项选择 */}
      <div className="space-y-3">
        {selfPaid.map((v) => {
          const on = enabled.has(v.id);
          const lock = on ? null : lockReason(v.id, enabled);
          const price = SELF_PAID_PRICES[v.id];
          const note = replacementNote(v.id);
          const diseases = v.diseaseIds.map((id) => diseaseMap[id]?.name).filter(Boolean).join('、');
          return (
            <div key={v.id} className={`card p-4 ${lock ? 'opacity-60' : ''}`}>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={on}
                  disabled={!!lock}
                  onChange={() => toggle(v.id)}
                  className="mt-1 w-5 h-5 accent-[#F57020] shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold">{v.shortName}</span>
                    <CategoryBadge category="selfPaid" />
                  </div>
                  <p className="text-sm text-stone-500 mt-1">预防：{diseases}</p>
                  {price && (
                    <p className="text-xs text-stone-400 mt-1">
                      参考费用约 ¥{price.min}–{price.max}（{price.doses}）
                    </p>
                  )}
                  {on && note && (
                    <p className="text-xs text-sage-600 mt-1.5 bg-sage-50 rounded-lg px-2 py-1.5 leading-relaxed">
                      ✓ {note}
                    </p>
                  )}
                  {lock && <p className="text-xs text-stone-400 mt-1.5">{lock}</p>}
                  {v.notes?.[0] && (
                    <p className="text-xs text-brand-600/80 mt-1.5 leading-relaxed">⏰ {v.notes[0]}</p>
                  )}
                </div>
              </label>
            </div>
          );
        })}
      </div>

      {/* 统计 + 保存（桌面 sticky） */}
      <div className="card p-4 lg:sticky lg:bottom-6 lg:shadow-lg">
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="flex items-center justify-center gap-1 text-stone-400 text-xs mb-1">
              <Syringe className="w-3.5 h-3.5" /> 0–6 岁总剂次
            </p>
            <p className="text-xl font-bold text-stone-800">{stats.doses}</p>
            <p className="text-xs text-stone-400">其中自费 {stats.selfPaidDoses}</p>
          </div>
          <div>
            <p className="flex items-center justify-center gap-1 text-stone-400 text-xs mb-1">
              <Coins className="w-3.5 h-3.5" /> 自费参考合计
            </p>
            <p className="text-xl font-bold text-brand-600">
              ¥{Math.round(stats.costMin / 100) / 10}k–{Math.round(stats.costMax / 100) / 10}k
            </p>
            <p className="text-xs text-stone-400">以门诊公示为准</p>
          </div>
          <div>
            <p className="flex items-center justify-center gap-1 text-stone-400 text-xs mb-1">
              <ShieldPlus className="w-3.5 h-3.5" /> 预防疾病
            </p>
            <p className="text-xl font-bold text-sage-600">{stats.diseases}</p>
            <p className="text-xs text-stone-400">种</p>
          </div>
        </div>
        <button onClick={save} className="btn-primary w-full mt-4 text-base">
          应用到宝宝接种日历
        </button>
      </div>

      <Disclaimer compact />
    </div>
  );
}
