import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { motion } from "framer-motion";
import { ArrowUpRight, Bookmark, BookmarkCheck, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/Chip";
import { SiteHeader } from "@/components/SiteHeader";
import { Skeleton } from "@/components/ui/skeleton";
import {
  STREAM_META,
  careerMatchesStream,
  categories,
  categoryLabel,
  entryMeta,
  formatSalaryRange,
  searchCareers,
  type CareerProfile,
  type StreamId,
} from "@/lib/career-data";
import { useCareers } from "@/lib/career-loader";
import { useAnalytics } from "@/lib/analytics";
import { toggleSaved, useShortlist } from "@/lib/shortlist";
import { useJsonLd } from "@/lib/meta";
import { cn } from "@/lib/utils";

type SortKey = "relevance" | "salary" | "low_stress" | "worklife" | "fastest";

const QUICK_SEARCHES = ["doctor", "CA", "B.Tech", "nurse", "high salary", "stress-free"];

const sortOptions: { value: SortKey; label: string }[] = [
  { value: "relevance", label: "Recommended" },
  { value: "salary", label: "Highest pay" },
  { value: "low_stress", label: "Lowest stress" },
  { value: "worklife", label: "Best work-life" },
  { value: "fastest", label: "Fastest to establish" },
];

function entryMid(career: CareerProfile): number {
  const e = career.salaryParsed.entry;
  if (!e || (!e.min && !e.max)) return 0;
  return ((e.min ?? 0) + (e.max ?? e.min ?? 0)) / 2;
}

export default function CareerExplorer() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [category, setCategory] = useState(searchParams.get("cat") ?? "all");
  const [gate, setGate] = useState(searchParams.get("gate") ?? "all");
  const [stream, setStream] = useState<StreamId | "all">((searchParams.get("stream") as StreamId | null) ?? "all");
  const [sort, setSort] = useState<SortKey>("relevance");
  const shortlist = useShortlist();
  const careers = useCareers();
  const careersList = careers ?? [];
  const track = useAnalytics();

  // What students actually search — recorded after they pause typing (or pick a
  // quick search), so per-keystroke noise never reaches the backend.
  useEffect(() => {
    const q = query.trim();
    if (!q) return;
    const t = setTimeout(() => track("search", { query: q }), 800);
    return () => clearTimeout(t);
  }, [query, track]);

  const gateCounts = useMemo(() => {
    const exam = careersList.filter((c) => entryMeta(c).isExam).length;
    return { exam, none: careersList.length - exam };
  }, [careersList]);


  // Structured data: the full index as an ItemList for search engines.
  const itemListSchema = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "All careers — Karriere",
      numberOfItems: careersList.length,
      itemListElement: careersList.map((c, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: c.name,
        url: `${window.location.origin}/careers/${c.id}`,
      })),
    }),
    [careersList],
  );
  useJsonLd(itemListSchema);

  const filtered = useMemo(() => {
    let list = query.trim() ? searchCareers(careersList, query) : [...careersList];
    if (category !== "all") list = list.filter((c) => c.category === category);
    if (gate !== "all") list = list.filter((c) => entryMeta(c).isExam === (gate === "exam"));
    if (stream !== "all") list = list.filter((c) => careerMatchesStream(c, stream));

    switch (sort) {
      case "salary":
        list.sort((a, b) => entryMid(b) - entryMid(a));
        break;
      case "low_stress":
        list.sort((a, b) => a.metrics.stress - b.metrics.stress || b.metrics.workLifeBalance - a.metrics.workLifeBalance);
        break;
      case "worklife":
        list.sort((a, b) => b.metrics.workLifeBalance - a.metrics.workLifeBalance || a.metrics.stress - b.metrics.stress);
        break;
      case "fastest":
        list.sort((a, b) => a.durationParsed - b.durationParsed);
        break;
      default:
        break;
    }
    return list;
  }, [query, category, gate, stream, sort, careersList]);

  const selectCategory = (id: string) => {
    setCategory(id);
    const next = new URLSearchParams(searchParams);
    if (id === "all") next.delete("cat");
    else next.set("cat", id);
    setSearchParams(next, { replace: true });
  };

  const selectGate = (id: string) => {
    setGate(id);
    const next = new URLSearchParams(searchParams);
    if (id === "all") next.delete("gate");
    else next.set("gate", id);
    setSearchParams(next, { replace: true });
  };

  const selectStream = (id: StreamId | "all") => {
    setStream(id);
    const next = new URLSearchParams(searchParams);
    if (id === "all") next.delete("stream");
    else next.set("stream", id);
    setSearchParams(next, { replace: true });
  };

  const submitSearch = (q: string) => {
    setQuery(q);
    const next = new URLSearchParams(searchParams);
    if (q.trim()) next.set("q", q.trim());
    else next.delete("q");
    setSearchParams(next, { replace: true });
  };

  const clearFilters = () => {
    setQuery("");
    setCategory("all");
    setGate("all");
    setStream("all");
    setSearchParams(new URLSearchParams(), { replace: true });
  };

  if (careers === null) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <SiteHeader />
        <div id="main" className="mx-auto max-w-3xl px-5 py-12 sm:px-6 md:py-16">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="mt-6 h-12 w-3/4 max-w-xl" />
          <Skeleton className="mt-4 h-4 w-full max-w-lg" />
          <Skeleton className="mt-10 h-12 w-full rounded-full" />
          <Skeleton className="mt-8 h-24 w-full rounded-2xl" />
          <Skeleton className="mt-3 h-24 w-full rounded-2xl" />
          <Skeleton className="mt-3 h-24 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <div id="main" className="mx-auto max-w-3xl px-5 py-12 sm:px-6 md:py-16">
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Chip tone="saffron">The index</Chip>
          <h1 className="mt-5 font-display text-4xl font-bold leading-[1.03] tracking-tight text-balance md:text-5xl">
            All {careersList.length} careers, honestly.
          </h1>
          <p className="mt-4 max-w-xl text-muted-foreground leading-relaxed">
            No placement brochures, no &ldquo;great scope&rdquo; fluff. Entry barriers, real money, and
            hidden struggles — for every path.
          </p>
        </motion.div>

        {/* Search */}
        <div className="relative mt-8">
          <div className="flex items-center gap-2 rounded-full border border-border bg-card py-2 pl-4 pr-2 focus-within:border-saffron focus-within:ring-[3px] focus-within:ring-ring/30">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            <input
              value={query}
              onChange={(e) => submitSearch(e.target.value)}
              placeholder="Search by degree (B.Tech), job (Nurse), or vibe (stress-free)…"
              aria-label="Search careers"
              className="h-9 flex-1 bg-transparent text-[15px] placeholder:text-muted-foreground/70 focus:outline-none"
            />
            {query && (
              <button
                onClick={() => submitSearch("")}
                className="rounded-full px-2.5 py-1 text-xs font-semibold text-muted-foreground hover:text-foreground"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Category chips */}
        <div className="mt-5 flex flex-wrap gap-1.5">
          {[{ id: "all", label: "All" }, ...categories].map((c) => {
            const count = c.id === "all" ? careersList.length : careersList.filter((x) => x.category === c.id).length;
            const active = category === c.id;
            return (
              <button
                key={c.id}
                onClick={() => selectCategory(c.id)}
                aria-pressed={active}
                className={cn(
                  "flex items-center gap-1.5 rounded-full border py-1.5 pl-3.5 pr-2.5 text-sm font-semibold transition-colors",
                  active
                    ? "border-saffron/50 bg-saffron-dim text-saffron"
                    : "border-border bg-card text-muted-foreground hover:border-saffron/30 hover:text-foreground",
                )}
              >
                {c.label}
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.5 text-[10px] font-bold tabular-nums",
                    active ? "bg-saffron text-primary-foreground" : "bg-secondary text-muted-foreground",
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Entry gate + stream chips */}
        <div className="mt-5 flex flex-wrap gap-1.5">
          {[
            { id: "all", label: "Entry" },
            { id: "exam", label: "Entrance exam", count: gateCounts.exam },
            { id: "none", label: "No entrance exam", count: gateCounts.none },
          ].map((g) => {
            const active = gate === g.id;
            return (
              <button
                key={g.id}
                onClick={() => selectGate(g.id)}
                aria-pressed={active}
                className={cn(
                  "flex items-center gap-1.5 rounded-full border py-1.5 pl-3.5 pr-2.5 text-sm font-semibold transition-colors",
                  active
                    ? "border-saffron/50 bg-saffron-dim text-saffron"
                    : "border-border bg-card text-muted-foreground hover:border-saffron/30 hover:text-foreground",
                )}
              >
                {g.label}
                {g.count !== undefined && (
                  <span
                    className={cn(
                      "rounded-full px-1.5 py-0.5 text-[10px] font-bold tabular-nums",
                      active ? "bg-saffron text-primary-foreground" : "bg-secondary text-muted-foreground",
                    )}
                  >
                    {g.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {[{ id: "all" as const, label: "Stream" }, ...STREAM_META.map((s) => ({ id: s.id, label: s.label }))].map((s) => {
            const active = stream === s.id;
            return (
              <button
                key={s.id}
                onClick={() => selectStream(s.id)}
                aria-pressed={active}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-[13px] font-semibold transition-colors",
                  active
                    ? "border-saffron/50 bg-saffron-dim text-saffron"
                    : "border-border bg-card text-muted-foreground hover:border-saffron/30 hover:text-foreground",
                )}
              >
                {s.label}
              </button>
            );
          })}
        </div>

        {/* Sort + count */}
        <div className="mt-6 flex items-center justify-between gap-4 border-b border-border pb-4">
          <p className="text-sm font-medium text-muted-foreground tabular-nums">
            Showing {filtered.length} of {careersList.length}
          </p>
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="text-xs font-bold uppercase tracking-widest">Sort</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              aria-label="Sort careers"
              className="rounded-lg border border-border bg-card px-2.5 py-1.5 text-sm font-medium text-foreground"
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* Results */}
        {filtered.length === 0 ? (
          <div role="status" className="py-20 text-center">
            <p className="font-display text-2xl font-bold mb-3">
              {query.trim()
                ? `Nothing matches “${query.trim()}”${category !== "all" ? ` in ${categoryLabel(category)}` : ""}`
                : category !== "all"
                  ? `No careers in ${categoryLabel(category)} yet`
                  : "No careers match those filters"}
            </p>
            <p className="mx-auto mb-7 max-w-sm text-sm text-muted-foreground">
              {category !== "all"
                ? "Loosen the category or try one of these:"
                : "Try one of these — they&rsquo;re the questions students actually search:"}
            </p>
            <div className="mx-auto mb-8 flex max-w-md flex-wrap justify-center gap-2">
              {QUICK_SEARCHES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => {
                    // One shot: reset the category and set the query + URL atomically
                    // (chaining helpers would rebuild from stale params and re-add cat=).
                    setQuery(s);
                    setCategory("all");
                    const next = new URLSearchParams();
                    next.set("q", s);
                    setSearchParams(next, { replace: true });
                  }}
                  className="rounded-full border border-border bg-card px-3.5 py-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:border-saffron/40 hover:text-foreground"
                >
                  {s}
                </button>
              ))}
            </div>
            <Button variant="outline" onClick={clearFilters}>
              Clear filters
            </Button>
          </div>
        ) : (
          <div className="mt-5 grid gap-3">
            {filtered.map((career, i) => {
              const saved = shortlist.includes(career.id);
              return (
                <motion.div
                  key={career.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: Math.min(i * 0.03, 0.3) }}
                  whileHover={{ y: -2 }}
                  className="group rounded-2xl border border-border bg-card transition-colors hover:border-saffron/40"
                >
                  <div className="flex items-start justify-between gap-4 p-5">
                    <button
                      onClick={() => navigate(`/careers/${career.id}`)}
                      aria-label={`Open ${career.name}`}
                      className="min-w-0 flex-1 text-left"
                    >
                      <h2 className="font-display text-xl font-bold tracking-tight group-hover:text-saffron transition-colors">
                        {career.name}
                      </h2>
                      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{career.tagline}</p>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        <Chip tone="saffron">{categoryLabel(career.category)}</Chip>
                        <Chip>{formatSalaryRange(career.salaryParsed.entry)} entry</Chip>
                        <Chip>{career.metrics.duration}</Chip>
                        <Chip tone={career.metrics.stress <= 2 ? "good" : career.metrics.stress >= 4 ? "bad" : "default"}>
                          stress {career.metrics.stress}/5
                        </Chip>
                      </div>
                    </button>
                    <span className="flex shrink-0 items-center gap-1 pt-1">
                      <button
                        aria-label={saved ? "Remove from saved" : "Save career"}
                        aria-pressed={saved}
                        onClick={() => toggleSaved(career.id)}
                        className="rounded-full p-1.5 text-muted-foreground hover:text-saffron transition-colors"
                      >
                        {saved ? <BookmarkCheck className="h-4 w-4 text-saffron" /> : <Bookmark className="h-4 w-4" />}
                      </button>
                      <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-saffron" aria-hidden="true" />
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
