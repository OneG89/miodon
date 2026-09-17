import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronDown, HeartPulse, Plus, Siren, Syringe, Thermometer, Trash2,
} from 'lucide-react';
import { useActiveChild } from '../hooks';
import {
  addReactionRecord, deleteReactionRecord, deleteRecord,
  listReactionRecordsForChild, listRecordsForChild,
} from '../lib/storage';
import { emergencyTips, reactionGuide } from '../data';
import { productMap, vaccineMap } from '../data';
import { formatDate, todayISO } from '../lib/age';
import { Disclaimer } from '../components/Disclaimer';

const COMMON_SYMPTOMS = ['发热', '注射部位红肿', '注射部位硬结', '皮疹', '哭闹增多', '嗜睡', '食欲下降', '腹泻', '呕吐'];

export function RecordsPage() {
  const child = useActiveChild();
  const [tab, setTab] = useState<'shots' | 'reactions'>('shots');
  useActiveChild(); // 触发重渲染
  const [, force] = useState(0);
  const refresh = () => force((x) => x + 1);

  if (!child) return null;

  const records = listRecordsForChild(child.id)
    .filter((r) => r.status === 'done')
    .sort((a, b) => (b.actualDate ?? '').localeCompare(a.actualDate ?? ''));
  const reactions = listReactionRecordsForChild(child.id);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold px-1">接种记录</h1>

      {/* 急救红旗卡 */}
      <div className="card border-red-200 bg-red-50 p-4">
        <p className="font-semibold text-red-700 flex items-center gap-2 mb-2">
          <Siren className="w-5 h-5" />
          出现这些情况，请立即就医
        </p>
        <ul className="space-y-1">
          {emergencyTips.map((t) => (
            <li key={t} className="text-sm text-red-800/90 flex gap-2">
              <span className="shrink-0">•</span>
              {t}
            </li>
          ))}
        </ul>
      </div>

      <div className="lg:grid lg:grid-cols-5 lg:gap-4 lg:items-start space-y-4 lg:space-y-0">
        <div className="lg:col-span-3 space-y-4">
          <div className="flex rounded-xl bg-stone-100 p-1">
            {([
              ['shots', '接种记录', Syringe],
              ['reactions', '反应记录', HeartPulse],
            ] as const).map(([v, label, Icon]) => (
              <button
                key={v}
                onClick={() => setTab(v)}
                className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-medium ${
                  tab === v ? 'bg-white text-brand-600 shadow-sm' : 'text-stone-500'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>

          {tab === 'shots' ? (
            <div className="space-y-3">
              {records.length === 0 && (
                <p className="text-center text-stone-400 py-10">
                  还没有接种记录，去<Link to="/" className="text-brand-500">日历</Link>标记第一针吧
                </p>
              )}
              {records.map((r) => {
            const v = vaccineMap[r.vaccineId];
            const p = r.productId ? productMap[r.productId] : undefined;
            return (
              <div key={r.id} className="card p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold">
                      {v?.shortName} · 第 {r.doseIndex} 剂
                    </p>
                    <p className="text-sm text-stone-500 mt-0.5">{r.actualDate ? formatDate(r.actualDate) : '—'}</p>
                  </div>
                  <button
                    onClick={() => { deleteRecord(r.id); refresh(); }}
                    className="text-stone-300 p-1"
                    aria-label="删除记录"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="mt-2 text-sm text-stone-500 space-y-0.5">
                  {p && <p>产品：{p.tradeName}（{p.manufacturer.split('/')[0].trim()}）</p>}
                  {r.clinic && <p>门诊：{r.clinic}</p>}
                  {r.batchNo && <p>批号：{r.batchNo}</p>}
                  {r.price != null && <p>费用：¥{r.price}</p>}
                  {r.note && <p>备注：{r.note}</p>}
                </div>
              </div>
            );
          })}
            </div>
          ) : (
            <ReactionTab
              childId={child.id}
              reactions={reactions}
              onChange={() => { refresh(); }}
            />
          )}

          <div className="lg:hidden">
            <Disclaimer compact />
          </div>
        </div>

        {/* 反应处理指南（桌面右栏 sticky） */}
        <aside className="lg:col-span-2 lg:sticky lg:top-8 mt-4 lg:mt-0">
          <ReactionGuide />
        </aside>
      </div>
    </div>
  );
}

function ReactionTab({
  childId, reactions, onChange,
}: {
  childId: string;
  reactions: ReturnType<typeof listReactionRecordsForChild>;
  onChange: () => void;
}) {
  const [adding, setAdding] = useState(false);
  const [date, setDate] = useState(todayISO());
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [temperature, setTemperature] = useState('');
  const [handling, setHandling] = useState('');
  const [note, setNote] = useState('');

  function toggleSymptom(s: string) {
    setSymptoms((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));
  }

  function save() {
    if (symptoms.length === 0 && !handling.trim()) return;
    addReactionRecord({
      childId,
      date,
      symptoms,
      temperature: temperature ? Number(temperature) : undefined,
      handling: handling.trim(),
      note: note.trim() || undefined,
    });
    setSymptoms([]); setTemperature(''); setHandling(''); setNote('');
    setAdding(false);
    onChange();
  }

  return (
    <div className="space-y-3">
      {!adding ? (
        <button onClick={() => setAdding(true)} className="btn-primary w-full">
          <Plus className="w-5 h-5" />
          记录接种后反应
        </button>
      ) : (
        <div className="card p-4 space-y-3">
          <label className="block">
            <span className="text-sm text-stone-600">日期</span>
            <input type="date" value={date} max={todayISO()} onChange={(e) => setDate(e.target.value)}
              className="mt-1 w-full rounded-xl border border-stone-200 px-3 py-2.5" />
          </label>
          <div>
            <span className="text-sm text-stone-600">出现的反应（可多选）</span>
            <div className="mt-1.5 flex flex-wrap gap-2">
              {COMMON_SYMPTOMS.map((s) => (
                <button
                  key={s}
                  onClick={() => toggleSymptom(s)}
                  className={`rounded-full px-3 py-1.5 text-sm ${
                    symptoms.includes(s) ? 'bg-brand-500 text-white' : 'bg-stone-100 text-stone-600'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <label className="flex items-center gap-2">
            <Thermometer className="w-4 h-4 text-stone-400" />
            <span className="text-sm text-stone-600">最高体温</span>
            <input
              type="number" step="0.1" inputMode="decimal"
              value={temperature} onChange={(e) => setTemperature(e.target.value)}
              placeholder="如 38.2"
              className="w-24 rounded-xl border border-stone-200 px-3 py-2"
            />
            <span className="text-sm text-stone-500">℃</span>
          </label>
          <label className="block">
            <span className="text-sm text-stone-600">怎么处理的</span>
            <textarea
              value={handling} onChange={(e) => setHandling(e.target.value)}
              placeholder="如：多喝水、物理降温、口服对乙酰氨基酚…"
              rows={2}
              className="mt-1 w-full rounded-xl border border-stone-200 px-3 py-2.5"
            />
          </label>
          <label className="block">
            <span className="text-sm text-stone-600">备注</span>
            <input value={note} onChange={(e) => setNote(e.target.value)}
              className="mt-1 w-full rounded-xl border border-stone-200 px-3 py-2.5" />
          </label>
          <div className="flex gap-3">
            <button onClick={save} className="btn-primary flex-1">保存</button>
            <button onClick={() => setAdding(false)} className="btn-ghost">取消</button>
          </div>
        </div>
      )}

      {reactions.map((r) => (
        <div key={r.id} className="card p-4">
          <div className="flex items-start justify-between">
            <p className="text-sm font-medium text-stone-700">{formatDate(r.date)}</p>
            <button onClick={() => { deleteReactionRecord(r.id); onChange(); }}
              className="text-stone-300 p-1" aria-label="删除">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          {r.symptoms.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {r.symptoms.map((s) => (
                <span key={s} className="tag bg-brand-50 text-brand-600">{s}</span>
              ))}
              {r.temperature && (
                <span className="tag bg-red-50 text-red-600">{r.temperature}℃</span>
              )}
            </div>
          )}
          {r.handling && <p className="text-sm text-stone-500 mt-2">处理：{r.handling}</p>}
          {r.note && <p className="text-sm text-stone-400 mt-1">{r.note}</p>}
        </div>
      ))}
    </div>
  );
}

function ReactionGuide() {
  return (
    <div className="card p-4">
      <h2 className="font-bold mb-3">常见反应居家处理指南</h2>
      <div className="space-y-2">
        {reactionGuide.map((g) => (
          <details key={g.symptom} className="group rounded-xl bg-stone-50 px-4 py-3">
            <summary className="flex items-center justify-between cursor-pointer font-medium text-stone-700 list-none">
              {g.symptom}
              <ChevronDown className="w-4 h-4 text-stone-400 group-open:rotate-180 transition-transform" />
            </summary>
            <div className="mt-2.5 space-y-2 text-sm">
              <div>
                <p className="text-sage-600 font-medium mb-1">居家护理</p>
                <ul className="space-y-1 text-stone-600">
                  {g.homeCare.map((h, i) => <li key={i} className="flex gap-2"><span className="shrink-0">·</span>{h}</li>)}
                </ul>
              </div>
              <div>
                <p className="text-red-600 font-medium mb-1">出现以下情况及时就医</p>
                <ul className="space-y-1 text-stone-600">
                  {g.redFlags.map((h, i) => <li key={i} className="flex gap-2"><span className="text-red-400 shrink-0">·</span>{h}</li>)}
                </ul>
              </div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
