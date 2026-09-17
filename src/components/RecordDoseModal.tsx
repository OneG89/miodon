import { useState } from 'react';
import { X } from 'lucide-react';
import { productMap, vaccineMap } from '../data';
import { todayISO, uid } from '../lib/age';
import { findDoneRecord, upsertRecord } from '../lib/storage';
import type { CalendarDose } from '../types';

interface Props {
  dose: CalendarDose;
  childId: string;
  onClose: () => void;
}

/** 标记某一剂「已接种 / 跳过」的表单弹窗 */
export function RecordDoseModal({ dose, childId, onClose }: Props) {
  const vaccine = vaccineMap[dose.vaccineId];
  const existing = findDoneRecord(childId, dose.vaccineId, dose.doseIndex);

  const [actualDate, setActualDate] = useState(existing?.actualDate ?? todayISO());
  const [productId, setProductId] = useState(existing?.productId ?? vaccine.productIds[0] ?? '');
  const [clinic, setClinic] = useState(existing?.clinic ?? '');
  const [batchNo, setBatchNo] = useState(existing?.batchNo ?? '');
  const [price, setPrice] = useState(existing?.price ? String(existing.price) : '');
  const [note, setNote] = useState(existing?.note ?? '');

  function save(status: 'done' | 'skipped') {
    upsertRecord({
      id: existing?.id ?? uid(),
      childId,
      vaccineId: dose.vaccineId,
      productId: status === 'done' ? productId : undefined,
      doseIndex: dose.doseIndex,
      status,
      actualDate: status === 'done' ? actualDate : undefined,
      clinic: clinic || undefined,
      batchNo: batchNo || undefined,
      price: price ? Number(price) : undefined,
      note: note || undefined,
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40" onClick={onClose}>
      <div
        className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-5 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold">{vaccine.shortName} · 第 {dose.doseIndex} 剂</h3>
            <p className="text-sm text-stone-500">建议 {dose.ageLabel} 接种</p>
          </div>
          <button onClick={onClose} className="p-1 text-stone-400" aria-label="关闭">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          <label className="block">
            <span className="text-sm text-stone-600">接种日期</span>
            <input
              type="date"
              value={actualDate}
              max={todayISO()}
              onChange={(e) => setActualDate(e.target.value)}
              className="mt-1 w-full rounded-xl border border-stone-200 px-3 py-2.5"
            />
          </label>
          <label className="block">
            <span className="text-sm text-stone-600">接种的疫苗产品（厂商）</span>
            <select
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              className="mt-1 w-full rounded-xl border border-stone-200 px-3 py-2.5 bg-white"
            >
              {vaccine.productIds.map((pid) => (
                <option key={pid} value={pid}>
                  {productMap[pid].tradeName}（{productMap[pid].manufacturer.split('/')[0].trim()}）
                </option>
              ))}
            </select>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-sm text-stone-600">接种门诊</span>
              <input
                value={clinic}
                onChange={(e) => setClinic(e.target.value)}
                placeholder="如：社区卫生服务中心"
                className="mt-1 w-full rounded-xl border border-stone-200 px-3 py-2.5"
              />
            </label>
            <label className="block">
              <span className="text-sm text-stone-600">疫苗批号</span>
              <input
                value={batchNo}
                onChange={(e) => setBatchNo(e.target.value)}
                placeholder="接种本上有记录"
                className="mt-1 w-full rounded-xl border border-stone-200 px-3 py-2.5"
              />
            </label>
          </div>
          <label className="block">
            <span className="text-sm text-stone-600">自费金额（元，免费苗留空）</span>
            <input
              type="number"
              inputMode="decimal"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0"
              className="mt-1 w-full rounded-xl border border-stone-200 px-3 py-2.5"
            />
          </label>
          <label className="block">
            <span className="text-sm text-stone-600">备注</span>
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="如：接种时有点哭闹，回家正常"
              className="mt-1 w-full rounded-xl border border-stone-200 px-3 py-2.5"
            />
          </label>
        </div>

        <div className="flex gap-3 mt-5">
          <button className="btn-primary flex-1" onClick={() => save('done')}>
            确认已接种
          </button>
          <button className="btn-ghost" onClick={() => save('skipped')}>
            跳过本剂
          </button>
        </div>
      </div>
    </div>
  );
}
