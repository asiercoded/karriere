import { useEffect } from "react";

export const SITE_TITLE = "Karriere — The unfiltered career file";
export const SITE_DESC =
  "Honest career guidance for Indian students. Real salaries, real timelines, real regrets — from people who lived each path. No brochures, no fluff.";

/* ── Dynamic per-page meta (SPA: works for in-app rendering and JS-capable
      crawlers; static crawlers still see index.html's site-wide tags) ── */

function setMeta(attr: "name" | "property", key: string, value: string) {
  const selector = `meta[${attr}="${key}"]`;
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", value);
}

function getMeta(attr: "name" | "property", key: string): string | null {
  return document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)?.getAttribute("content") ?? null;
}

const META_KEYS: { attr: "name" | "property"; key: string }[] = [
  { attr: "name", key: "description" },
  { attr: "property", key: "og:title" },
  { attr: "property", key: "og:description" },
  { attr: "property", key: "og:url" },
  { attr: "property", key: "og:image" },
  { attr: "name", key: "twitter:card" },
  { attr: "name", key: "twitter:title" },
  { attr: "name", key: "twitter:description" },
  { attr: "name", key: "twitter:image" },
];

/** Set the document title + description + OG/Twitter tags for the current page.
    Pass noindex for utility/print pages that shouldn't appear in search results.
    Pass ogImage (absolute URL) for a page-specific share card; defaults to the site card. */
export function usePageMeta(title: string, description: string, noindex = false, ogImage?: string) {
  useEffect(() => {
    const prevTitle = document.title;
    const prev = new Map(META_KEYS.map(({ attr, key }) => [`${attr}:${key}`, getMeta(attr, key)]));
    const prevRobots = getMeta("name", "robots");
    const image = ogImage ?? `${window.location.origin}/og/default.png`;

    document.title = title;
    setMeta("name", "description", description);
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:type", "website");
    setMeta("property", "og:url", window.location.href);
    setMeta("property", "og:image", image);
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", description);
    setMeta("name", "twitter:image", image);
    if (noindex) setMeta("name", "robots", "noindex,follow");

    return () => {
      document.title = prevTitle;
      for (const { attr, key } of META_KEYS) {
        const before = prev.get(`${attr}:${key}`);
        if (before == null) {
          document.head.querySelector(`meta[${attr}="${key}"]`)?.remove();
        } else {
          setMeta(attr, key, before);
        }
      }
      if (noindex) {
        if (prevRobots == null) {
          document.head.querySelector('meta[name="robots"]')?.remove();
        } else {
          setMeta("name", "robots", prevRobots);
        }
      }
    };
  }, [title, description, noindex, ogImage]);
}

/* ── Structured data (JSON-LD) ──
   Injected client-side like the other meta tags — Google renders JS and
   picks up JSON-LD from the DOM, so per-page FAQ/breadcrumb schema works
   in this SPA. Cleaned up on unmount so routes never leak each other's data. */

function jsonLdTag() {
  let el = document.head.querySelector<HTMLScriptElement>('script[data-karriere-jsonld]');
  if (!el) {
    el = document.createElement("script");
    el.type = "application/ld+json";
    el.dataset.karriereJsonld = "";
    document.head.appendChild(el);
  }
  return el;
}

/** Set (or remove, when `json` is null) the page's JSON-LD structured data. */
export function useJsonLd(json: object | null) {
  useEffect(() => {
    if (!json) return;
    jsonLdTag().textContent = JSON.stringify(json);
    return () => {
      document.head.querySelector('script[data-karriere-jsonld]')?.remove();
    };
  }, [json]);
}

/* ── Share intents ── */

export function careerShareUrl(careerId: string): string {
  return `${window.location.origin}/careers/${careerId}`;
}

export function careerShareText(careerName: string, verdict: string, careerId: string): string {
  return `“${careerName}” — the honest reality check: ${verdict} ${careerShareUrl(careerId)}`;
}

export function whatsappShare(text: string): string {
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

export function twitterShare(text: string, url: string): string {
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
}

export function telegramShare(text: string, url: string): string {
  return `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
}
