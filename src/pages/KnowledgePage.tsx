import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, BookOpen, Check, CheckSquare, HeartHandshake, FlaskConical, XCircle,
} from 'lucide-react';
import { checklist, cocoonTips, ingredients, myths } from '../data/knowledge';
import { Disclaimer } from '../components/Disclaimer';

export function KnowledgePage() {
  const navigate = useNavigate();
  const [checked, setChecked] = useState<Set<string>>(new Set());

  function toggle(key: string) {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <button onClick={() => navigate(-1)} className="p-1 -ml-1 text-stone-500" aria-label="返回">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold">接种知识</h1>
      </div>

      {/* 误区辟谣 */}
      <section className="card p-4">
        <h2 className="font-bold mb-3 flex items-center gap-2">
          <XCircle className="w-4 h-4 text-brand-500" />
          常见误区辟谣
        </h2>
        <div className="space-y-3">
          {myths.map((m, i) => (
            <div key={i} className="rounded-xl bg-stone-50 p-3.5">
              <p className="text-sm font-medium text-red-700/90 line-through decoration-red-300">
                {m.claim}
              </p>
              <p className="text-sm font-semibold text-sage-600 mt-1.5">✓ {m.truth}</p>
              <p className="text-sm text-stone-600 mt-1 leading-relaxed">{m.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 接种前后清单 */}
      <section className="card p-4">
        <h2 className="font-bold mb-3 flex items-center gap-2">
          <CheckSquare className="w-4 h-4 text-brand-500" />
          接种前后准备清单
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {checklist.map((group) => (
            <div key={group.phase} className="rounded-xl bg-stone-50 p-3.5">
              <p className="font-semibold text-stone-800 mb-2">{group.phase}</p>
              <ul className="space-y-2">
                {group.items.map((item) => {
                  const key = `${group.phase}-${item}`;
                  const on = checked.has(key);
                  return (
                    <li key={key}>
                      <button
                        onClick={() => toggle(key)}
                        className="flex items-start gap-2 text-left w-full"
                      >
                        <span
                          className={`shrink-0 w-4 h-4 mt-0.5 rounded border flex items-center justify-center ${
                            on ? 'bg-sage-500 border-sage-500 text-white' : 'border-stone-300 bg-white'
                          }`}
                        >
                          {on && <Check className="w-3 h-3" />}
                        </span>
                        <span className={`text-sm leading-relaxed ${on ? 'text-stone-400 line-through' : 'text-stone-600'}`}>
                          {item}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* 家庭免疫茧 */}
      <section className="card p-4">
        <h2 className="font-bold mb-3 flex items-center gap-2">
          <HeartHandshake className="w-4 h-4 text-brand-500" />
          家庭「免疫茧」：太小不能打疫苗的宝宝怎么保护
        </h2>
        <div className="grid gap-3 md:grid-cols-2">
          {cocoonTips.map((c, i) => (
            <div key={i} className="rounded-xl bg-brand-50/60 p-3.5">
              <p className="text-sm font-semibold text-brand-700">{c.audience}</p>
              <p className="text-sm text-stone-600 mt-1 leading-relaxed">{c.advice}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 成分名词 */}
      <section className="card p-4">
        <h2 className="font-bold mb-3 flex items-center gap-2">
          <FlaskConical className="w-4 h-4 text-brand-500" />
          疫苗成分名词解释
        </h2>
        <div className="grid gap-3 md:grid-cols-2">
          {ingredients.map((ing) => (
            <div key={ing.name} className="rounded-xl bg-stone-50 p-3.5">
              <p className="text-sm font-semibold text-stone-800">{ing.name}</p>
              <p className="text-xs text-stone-400 mt-0.5">{ing.what}</p>
              <p className="text-sm text-stone-600 mt-1.5 leading-relaxed">{ing.note}</p>
            </div>
          ))}
        </div>
      </section>

      <p className="text-center text-xs text-stone-400 flex items-center justify-center gap-1">
        <BookOpen className="w-3 h-3" />
        内容依据国家免疫规划程序、疫苗说明书与公开科普共识整理
      </p>
      <Disclaimer compact />
    </div>
  );
}
