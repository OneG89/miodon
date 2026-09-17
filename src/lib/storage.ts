import type { ChildProfile, ReactionRecord, VaccinationRecord } from '../types';
import { uid } from './age';

/**
 * 本地优先存储：全部数据存于 localStorage，无需登录、不上传服务器。
 * 命名空间 miodon:*
 */
const KEYS = {
  children: 'miodon:children',
  activeChild: 'miodon:activeChild',
  records: 'miodon:records',
  reactions: 'miodon:reactions',
};

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent('miodon:storage'));
}

/* ---------- 宝宝档案 ---------- */

export function listChildren(): ChildProfile[] {
  return read<ChildProfile[]>(KEYS.children, []).sort(
    (a, b) => a.birthDate.localeCompare(b.birthDate),
  );
}

export function addChild(input: Omit<ChildProfile, 'id' | 'createdAt'>): ChildProfile {
  const child: ChildProfile = { ...input, id: uid(), createdAt: new Date().toISOString() };
  const list = listChildren();
  list.push(child);
  write(KEYS.children, list);
  if (!getActiveChildId()) setActiveChild(child.id);
  return child;
}

export function removeChild(id: string): void {
  write(KEYS.children, listChildren().filter((c) => c.id !== id));
  write(KEYS.records, listRecords().filter((r) => r.childId !== id));
  write(KEYS.reactions, listReactionRecords().filter((r) => r.childId !== id));
  if (getActiveChildId() === id) {
    const rest = listChildren();
    write(KEYS.activeChild, rest[0]?.id ?? '');
  }
}

export function getActiveChildId(): string {
  return read<string>(KEYS.activeChild, '');
}

export function setActiveChild(id: string): void {
  write(KEYS.activeChild, id);
}

/* ---------- 接种记录 ---------- */

export function listRecords(): VaccinationRecord[] {
  return read<VaccinationRecord[]>(KEYS.records, []);
}

export function listRecordsForChild(childId: string): VaccinationRecord[] {
  return listRecords().filter((r) => r.childId === childId);
}

export function upsertRecord(rec: VaccinationRecord): void {
  const all = listRecords();
  const idx = all.findIndex((r) => r.id === rec.id);
  if (idx >= 0) all[idx] = rec;
  else all.push(rec);
  write(KEYS.records, all);
}

export function deleteRecord(id: string): void {
  write(KEYS.records, listRecords().filter((r) => r.id !== id));
}

/** 同一宝宝 + 疫苗 + 剂次的已种记录 */
export function findDoneRecord(
  childId: string,
  vaccineId: string,
  doseIndex: number,
): VaccinationRecord | undefined {
  return listRecordsForChild(childId).find(
    (r) => r.vaccineId === vaccineId && r.doseIndex === doseIndex && r.status === 'done',
  );
}

/* ---------- 接种后反应记录 ---------- */

export function listReactionRecords(): ReactionRecord[] {
  return read<ReactionRecord[]>(KEYS.reactions, []).sort((a, b) =>
    b.date.localeCompare(a.date),
  );
}

export function listReactionRecordsForChild(childId: string): ReactionRecord[] {
  return listReactionRecords().filter((r) => r.childId === childId);
}

export function addReactionRecord(rec: Omit<ReactionRecord, 'id'>): ReactionRecord {
  const full: ReactionRecord = { ...rec, id: uid() };
  write(KEYS.reactions, [...listReactionRecords(), full]);
  return full;
}

export function deleteReactionRecord(id: string): void {
  write(KEYS.reactions, listReactionRecords().filter((r) => r.id !== id));
}

/* ---------- 接种方案选择 ---------- */

const PLAN_KEY = 'miodon:plan';

export interface PlanChoices {
  enabled: string[];
  presetId?: string;
}

export function getPlanChoices(): PlanChoices | null {
  return read<PlanChoices | null>(PLAN_KEY, null);
}

export function setPlanChoices(choices: PlanChoices | null): void {
  if (choices) write(PLAN_KEY, choices);
  else localStorage.removeItem(PLAN_KEY);
  window.dispatchEvent(new CustomEvent('miodon:storage'));
}

/* ---------- 备份 ---------- */

export function exportData(): string {
  return JSON.stringify(
    {
      version: 1,
      exportedAt: new Date().toISOString(),
      children: listChildren(),
      records: listRecords(),
      reactions: listReactionRecords(),
      plan: getPlanChoices(),
    },
    null,
    2,
  );
}

export function importData(json: string): void {
  const data = JSON.parse(json);
  if (Array.isArray(data.children)) write(KEYS.children, data.children);
  if (Array.isArray(data.records)) write(KEYS.records, data.records);
  if (Array.isArray(data.reactions)) write(KEYS.reactions, data.reactions);
  if (data.plan && Array.isArray(data.plan.enabled)) write(PLAN_KEY, data.plan);
}
