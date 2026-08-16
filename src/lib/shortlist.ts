import { useSyncExternalStore } from "react";

const STORAGE_KEY = "karriere-shortlist";

/**
 * Cached snapshot. useSyncExternalStore requires getSnapshot to return the
 * same reference between store updates — parsing localStorage on every call
 * creates a new array each time and makes React loop ("Maximum update depth").
 * The cache is only invalidated when we persist a change.
 */
let snapshotCache: string[] | null = null;

function readShortlist(): string[] {
  if (snapshotCache) return snapshotCache;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    snapshotCache = Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === "string") : [];
  } catch {
    snapshotCache = [];
  }
  return snapshotCache;
}

const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function persist(ids: string[]) {
  snapshotCache = ids;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  emit();
}

export function isSaved(id: string): boolean {
  return readShortlist().includes(id);
}

export function toggleSaved(id: string): void {
  const current = readShortlist();
  persist(current.includes(id) ? current.filter((x) => x !== id) : [...current, id]);
}

export function removeSaved(id: string): void {
  persist(readShortlist().filter((x) => x !== id));
}

export function clearSaved(): void {
  persist([]);
}

export function useShortlist(): string[] {
  return useSyncExternalStore(subscribe, readShortlist);
}
