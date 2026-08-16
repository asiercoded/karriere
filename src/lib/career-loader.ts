import { useEffect, useState } from "react";
import type { CareerProfile } from "./career-data";

/* ─────────────────────────────────────────────────────────────
   Lazy career-data loader (client-only — never imported from
   Convex functions). career-profiles.ts is the only module that
   statically imports careers.json; loading it here via a cached
   dynamic import keeps the ~488 KB dataset out of the entry
   bundle and every page chunk until it's actually needed.

   Repeat-visit cache: the dataset is static editorial content
   (checked quarterly), and the audience — students sharing links
   on cheap Android phones — re-downloads it on every session.
   We cache the parsed array in localStorage under a versioned
   key with a short TTL; bump CACHE_VERSION whenever careers.json
   changes materially and the cache self-invalidates.
   ───────────────────────────────────────────────────────────── */

const CACHE_VERSION = "v3";
const CACHE_KEY = `karriere-careers-${CACHE_VERSION}`;
const CACHE_TTL_MS = 3 * 24 * 60 * 60 * 1000; // 3 days — stale but safe for static content

let careerDataPromise: Promise<CareerProfile[]> | null = null;

function readCache(): CareerProfile[] | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const entry = JSON.parse(raw) as { savedAt: number; careers: CareerProfile[] } | null;
    if (!entry || !Array.isArray(entry.careers) || entry.careers.length === 0) return null;
    if (Date.now() - entry.savedAt > CACHE_TTL_MS) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
    return entry.careers;
  } catch {
    return null;
  }
}

function writeCache(careers: CareerProfile[]) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ savedAt: Date.now(), careers }));
  } catch {
    // Quota exceeded / private mode — the app works fine without the cache.
  }
}

export function loadCareerData(): Promise<CareerProfile[]> {
  // Synchronous cache hit resolves on the next microtask, so first paint of a
  // repeat visit has the full dataset immediately (no skeleton flash).
  const cached = readCache();
  if (cached) {
    careerDataPromise ??= Promise.resolve(cached);
    return careerDataPromise;
  }

  careerDataPromise ??= import("./career-profiles").then((m) => {
    writeCache(m.careerProfiles);
    return m.careerProfiles;
  });
  return careerDataPromise;
}

/**
 * `null` while the dataset is still loading; the array once it arrives.
 * Module-level cache means back/forward navigation and multiple pages on
 * the same session never re-download the chunk.
 */
export function useCareers(): CareerProfile[] | null {
  const [careers, setCareers] = useState<CareerProfile[] | null>(null);

  useEffect(() => {
    let alive = true;
    loadCareerData().then((c) => {
      if (alive) setCareers(c);
    });
    return () => {
      alive = false;
    };
  }, []);

  return careers;
}
