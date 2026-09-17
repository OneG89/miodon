import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Baby, CalendarHeart } from 'lucide-react';
import { addChild } from '../lib/storage';
import { todayISO } from '../lib/age';
import { Disclaimer } from '../components/Disclaimer';

export function Onboarding() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState<'M' | 'F' | ''>('');

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !birthDate) return;
    addChild({ name: name.trim(), birthDate, gender: gender || undefined });
    navigate('/');
  }

  return (
    <div className="min-h-screen flex flex-col justify-center max-w-md mx-auto px-6 py-10">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-brand-500 flex items-center justify-center mx-auto mb-4">
          <Baby className="w-9 h-9 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-stone-800">
          苗懂 <span className="text-brand-500">Miodon</span>
        </h1>
        <p className="text-stone-500 mt-2 leading-relaxed">
          宝宝疫苗数据查询 + 智能接种日历
          <br />
          建档后自动生成 0–6 岁全程接种安排
        </p>
      </div>

      <form onSubmit={submit} className="card p-5 space-y-4">
        <label className="block">
          <span className="text-sm font-medium text-stone-600">宝宝昵称</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="如：小汤圆"
            maxLength={12}
            className="mt-1.5 w-full rounded-xl border border-stone-200 px-4 py-3 text-lg"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-stone-600">出生日期</span>
          <input
            type="date"
            value={birthDate}
            max={todayISO()}
            onChange={(e) => setBirthDate(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-stone-200 px-4 py-3 text-lg"
          />
        </label>
        <div>
          <span className="text-sm font-medium text-stone-600">性别（选填）</span>
          <div className="mt-1.5 flex gap-3">
            {([
              ['F', '女宝'],
              ['M', '男宝'],
            ] as const).map(([v, label]) => (
              <button
                type="button"
                key={v}
                onClick={() => setGender(v)}
                className={`flex-1 rounded-xl border py-3 font-medium ${
                  gender === v
                    ? 'border-brand-500 bg-brand-50 text-brand-600'
                    : 'border-stone-200 text-stone-500'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <button type="submit" className="btn-primary w-full text-lg" disabled={!name.trim() || !birthDate}>
          <CalendarHeart className="w-5 h-5" />
          生成接种日历
        </button>
      </form>

      <div className="mt-6 space-y-3">
        <Disclaimer />
        <p className="text-center text-xs text-stone-400">
          档案仅保存在本设备浏览器中，无需注册、不上传服务器
        </p>
      </div>
    </div>
  );
}
