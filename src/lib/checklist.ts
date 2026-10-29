import { useCallback, useSyncExternalStore } from "react";

/* ── Local storage checklist progress ──
   Kept separate from the shortlist so checklist progress is its own key. */

const localKey = (careerId: string) => `karriere-checklist-${careerId}`;

const perCareerCache = new Map<string, number[]>();
let progressCache: { careerId: string; checked: number[] }[] | null = null;

const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function readLocal(careerId: string): number[] {
  const cached = perCareerCache.get(careerId);
  if (cached) return cached;
  let arr: number[] = [];
  try {
    const raw = localStorage.getItem(localKey(careerId));
    if (raw) {
      const parsed = JSON.parse(raw) as unknown;
      if (Array.isArray(parsed)) arr = parsed.filter((x): x is number => typeof x === "number");
    }
  } catch {
    /* ignore corrupt storage */
  }
  perCareerCache.set(careerId, arr);
  return arr;
}

function writeLocal(careerId: string, checked: number[]) {
  perCareerCache.set(careerId, checked);
  progressCache = null;
  try {
    localStorage.setItem(localKey(careerId), JSON.stringify(checked));
  } catch {
    /* storage may be unavailable; progress just won't persist */
  }
  emit();
}

function readAllLocal(): { careerId: string; checked: number[] }[] {
  if (progressCache) return progressCache;
  const out = [];
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key || !key.startsWith("karriere-checklist-")) continue;
      const careerId = key.slice("karriere-checklist-".length);
      const checked = readLocal(careerId);
      if (checked.length) out.push({ careerId, checked });
    }
  } catch {
    /* storage may be unavailable; report nothing */
  }
  progressCache = out;
  return out;
}

/* ── Hooks ── */

/**
 * Checked state + toggling for one career's "Before you commit" list.
 * Persists reliably to local storage.
 */
export function useChecklist(careerId: string) {
  const localChecked = useSyncExternalStore(subscribe, () => readLocal(careerId));

  const toggle = useCallback(
    (index: number) => {
      writeLocal(
        careerId,
        localChecked.includes(index) ? localChecked.filter((i) => i !== index) : [...localChecked, index].sort((a, b) => a - b),
      );
    },
    [careerId, localChecked],
  );

  const clearAll = useCallback(() => {
    writeLocal(careerId, []);
  }, [careerId]);

  return { checked: localChecked, toggle, clearAll, isLocal: true };
}

/**
 * Progress across all careers — for the Saved page dashboard.
 */
export function useChecklistProgress() {
  return useSyncExternalStore(subscribe, readAllLocal);
}
