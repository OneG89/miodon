import { useEffect, useState } from 'react';
import { getActiveChildId, listChildren } from './lib/storage';
import type { ChildProfile } from './types';

/** 监听本地存储变化（自定义事件 + 跨标签页 storage 事件），返回版本号 */
export function useStorageVersion(): number {
  const [version, setVersion] = useState(0);
  useEffect(() => {
    const bump = () => setVersion((v) => v + 1);
    window.addEventListener('miodon:storage', bump);
    window.addEventListener('storage', bump);
    return () => {
      window.removeEventListener('miodon:storage', bump);
      window.removeEventListener('storage', bump);
    };
  }, []);
  return version;
}

/** 当前选中的宝宝档案（无档案返回 null） */
export function useActiveChild(): ChildProfile | null {
  useStorageVersion();
  const children = listChildren();
  if (children.length === 0) return null;
  const activeId = getActiveChildId();
  return children.find((c) => c.id === activeId) ?? children[0];
}
