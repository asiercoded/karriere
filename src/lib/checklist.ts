import { useCallback } from "react";
import { useMutation, useQuery } from "convex/react";
import { useSyncExternalStore } from "react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";

/* ── Local storage fallback (signed-out users) ──
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
 * Signed-in users persist to Convex; signed-out users persist to local storage
 * (with `isLocal` set so the UI can offer sign-in).
 */
export function useChecklist(careerId: string) {
  const { isAuthenticated } = useAuth();
  const serverChecked = useQuery(api.checklist.getByCareer, { careerId });
  const toggleItem = useMutation(api.checklist.toggleItem);
  const reset = useMutation(api.checklist.reset);

  const localChecked = useSyncExternalStore(subscribe, () => readLocal(careerId));

  const checked = isAuthenticated ? (serverChecked ?? []) : localChecked;
  const isLocal = !isAuthenticated;

  const toggle = useCallback(
    (index: number) => {
      if (isAuthenticated) {
        void toggleItem({ careerId, index });
      } else {
        writeLocal(
          careerId,
          localChecked.includes(index) ? localChecked.filter((i) => i !== index) : [...localChecked, index].sort((a, b) => a - b),
        );
      }
    },
    [isAuthenticated, careerId, toggleItem, localChecked],
  );

  const clearAll = useCallback(() => {
    if (isAuthenticated) {
      void reset({ careerId });
    } else {
      writeLocal(careerId, []);
    }
  }, [isAuthenticated, careerId, reset]);

  return { checked, toggle, clearAll, isLocal };
}

/**
 * Progress across all careers — for the Saved page dashboard.
 * Convex when signed in, local storage otherwise.
 */
export function useChecklistProgress() {
  const { isAuthenticated } = useAuth();
  const serverProgress = useQuery(api.checklist.getAll);
  const localProgress = useSyncExternalStore(subscribe, readAllLocal);
  if (isAuthenticated) return serverProgress ?? [];
  return localProgress;
}
