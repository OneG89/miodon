import { useRef, useState } from 'react';
import {
  Baby, Download, Plus, RefreshCcw, ShieldCheck, Trash2, Upload,
} from 'lucide-react';
import { useStorageVersion } from '../hooks';
import {
  addChild, exportData, getActiveChildId, importData,
  listChildren, removeChild, setActiveChild,
} from '../lib/storage';
import { formatAgeLabel, ageInMonths, todayISO } from '../lib/age';

const DATA_SOURCES = [
  '《国家免疫规划疫苗儿童免疫程序及说明（2026 年版）》（国家疾控局、国家卫生健康委；百白破程序 2025 年调整、HPV 疫苗 2025 年纳入免疫规划）',
  '中国疾病预防控制中心免疫规划中心接种指南与各类疫苗专家共识',
  '各疫苗官方说明书（免疫程序、禁忌、不良反应、免疫原性数据）',
  '公开发表的 III 期临床试验与系统综述：如 EV71 疫苗（Lancet / NEJM 2014）、五价轮状疫苗 REST 研究（NEJM 2006）、乙脑 SA14-14-2 疫苗（NEJM 2001 / Lancet 1996）、卡介苗保护效果 Meta 分析（JAMA 1994）、HPV 疫苗 III 期（JNCI 2020 / NEJM 2015）等',
  'WHO 各疫苗立场文件（肺炎球菌、轮状病毒、Hib、流感、流脑、麻疹等）',
];

export function ProfilePage() {
  useStorageVersion();
  const children = listChildren();
  const activeId = getActiveChildId();
  const fileRef = useRef<HTMLInputElement>(null);
  const [, force] = useState(0);
  const refresh = () => force((x) => x + 1);

  const [adding, setAdding] = useState(false);
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');

  function add() {
    if (!name.trim() || !birthDate) return;
    addChild({ name: name.trim(), birthDate });
    setName(''); setBirthDate(''); setAdding(false);
  }

  function doExport() {
    const blob = new Blob([exportData()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `miodon-backup-${todayISO()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function doImport(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        importData(String(reader.result));
        refresh();
        alert('导入成功');
      } catch {
        alert('文件格式不正确，导入失败');
      }
    };
    reader.readAsText(file);
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold px-1">我的</h1>

      <div className="md:grid md:grid-cols-2 md:gap-4 space-y-4 md:space-y-0">
      {/* 宝宝档案 */}
      <section className="card p-4 md:col-span-2">
        <h2 className="font-bold mb-3 flex items-center gap-2">
          <Baby className="w-4 h-4 text-brand-500" />
          宝宝档案
        </h2>
        <div className="space-y-2">
          {children.map((c) => (
            <div
              key={c.id}
              className={`flex items-center gap-3 rounded-xl border p-3 ${
                c.id === activeId ? 'border-brand-400 bg-brand-50/60' : 'border-stone-200'
              }`}
            >
              <div className="flex-1">
                <p className="font-medium">{c.name}</p>
                <p className="text-sm text-stone-500">
                  {c.birthDate} 出生 · {formatAgeLabel(ageInMonths(c.birthDate))}
                </p>
              </div>
              {c.id === activeId ? (
                <span className="tag bg-brand-500 text-white">当前</span>
              ) : (
                <button
                  onClick={() => { setActiveChild(c.id); refresh(); }}
                  className="text-sm text-brand-600 font-medium"
                >
                  切换
                </button>
              )}
              <button
                onClick={() => {
                  if (confirm(`确定删除「${c.name}」的档案和全部记录？此操作不可恢复。`)) {
                    removeChild(c.id);
                    refresh();
                  }
                }}
                className="text-stone-300 p-1"
                aria-label="删除档案"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {adding ? (
          <div className="mt-3 rounded-xl border border-stone-200 p-3 space-y-2">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="宝宝昵称"
              maxLength={12}
              className="w-full rounded-lg border border-stone-200 px-3 py-2"
            />
            <input
              type="date"
              value={birthDate}
              max={todayISO()}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full rounded-lg border border-stone-200 px-3 py-2"
            />
            <div className="flex gap-2">
              <button onClick={add} className="btn-primary flex-1 py-2 text-sm">保存</button>
              <button onClick={() => setAdding(false)} className="btn-ghost py-2 text-sm">取消</button>
            </div>
          </div>
        ) : (
          <button onClick={() => setAdding(true)} className="mt-3 w-full rounded-xl border-2 border-dashed border-stone-200 py-2.5 text-sm text-stone-500 flex items-center justify-center gap-1">
            <Plus className="w-4 h-4" />
            添加二胎/多胎档案
          </button>
        )}
      </section>

      {/* 数据备份 */}
      <section className="card p-4">
        <h2 className="font-bold mb-1">数据备份</h2>
        <p className="text-sm text-stone-500 mb-3">
          所有档案和记录仅保存在本设备浏览器中。换手机或清理浏览器前，请先导出备份文件。
        </p>
        <div className="flex gap-3">
          <button onClick={doExport} className="btn-primary flex-1 text-sm py-2.5">
            <Download className="w-4 h-4" />
            导出备份
          </button>
          <button onClick={() => fileRef.current?.click()} className="btn-ghost flex-1 text-sm py-2.5">
            <Upload className="w-4 h-4" />
            导入恢复
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) doImport(f);
              e.target.value = '';
            }}
          />
        </div>
      </section>

      {/* 数据来源与免责 */}
      <section className="card p-4">
        <h2 className="font-bold mb-3 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-sage-500" />
          数据来源与免责声明
        </h2>
        <ul className="space-y-2 text-sm text-stone-600 mb-4">
          {DATA_SOURCES.map((s, i) => (
            <li key={i} className="flex gap-2 leading-relaxed">
              <span className="text-stone-400 shrink-0">{i + 1}.</span>
              {s}
            </li>
          ))}
        </ul>
        <div className="rounded-xl bg-stone-50 p-3 text-sm text-stone-500 leading-relaxed space-y-2">
          <p>
            苗懂 Miodon 是疫苗数据查询与接种安排参考工具，<b>不提供在线问诊、不销售疫苗，不替代接种门诊医生的专业判断</b>。
          </p>
          <p>
            临床数据来自厂商说明书与公开发表的临床研究，受研究人群、年代和方法限制，仅供参考；标注「待补充核实」的条目表示尚无可靠公开数据或正在核实。
          </p>
          <p>
            疫苗价格、供应和接种程序各地可能不同，且会随政策调整，<b>一切以接种门诊公示和最新版疫苗说明书为准</b>。
          </p>
        </div>
      </section>
      </div>

      <p className="text-center text-xs text-stone-400 flex items-center justify-center gap-1">
        <RefreshCcw className="w-3 h-3" />
        苗懂 Miodon v1.0 · 本地数据，离线可用
      </p>
    </div>
  );
}
