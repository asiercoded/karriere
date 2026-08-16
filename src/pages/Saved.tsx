import { useMemo } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { ArrowUpRight, Bookmark, ListChecks, Scale, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/Chip";
import { categoryLabel, formatSalaryRange } from "@/lib/career-data";
import { useCareers } from "@/lib/career-loader";
import { useChecklistProgress } from "@/lib/checklist";
import { clearSaved, removeSaved, useShortlist } from "@/lib/shortlist";
import { SiteHeader } from "@/components/SiteHeader";

export default function Saved() {
  const navigate = useNavigate();
  const shortlist = useShortlist();
  const careers = useCareers();

  const savedCareers = useMemo(
    () => shortlist.map((id) => careers?.find((c) => c.id === id)).filter((c): c is NonNullable<typeof c> => Boolean(c)),
    [shortlist, careers],
  );
  const progress = useChecklistProgress();

  if (careers === null) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <SiteHeader />
        <div id="main" className="mx-auto max-w-3xl px-5 py-12 sm:px-6 md:py-16">
          <div className="h-6 w-32 animate-pulse rounded bg-secondary" />
          <div className="mt-6 h-12 w-2/3 animate-pulse rounded bg-secondary" />
          <div className="mt-4 h-4 w-full max-w-xl animate-pulse rounded bg-secondary" />
          <div className="mt-10 h-28 animate-pulse rounded-3xl bg-secondary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <div id="main" className="mx-auto max-w-3xl px-5 py-12 sm:px-6 md:py-16">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Chip tone="saffron">Your shortlist</Chip>
          <h1 className="mt-5 font-display text-4xl font-bold leading-[1.03] tracking-tight text-balance md:text-5xl">
            Saved careers.
          </h1>
          <p className="mt-4 max-w-xl text-muted-foreground leading-relaxed">
            Careers you&rsquo;ve bookmarked while reading. When you&rsquo;re down to two, put them on the
            compare desk.
          </p>
        </motion.div>

        {savedCareers.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-border bg-card px-6 py-16 text-center">
            <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-saffron-dim">
              <Bookmark className="h-6 w-6 text-saffron" aria-hidden="true" />
            </span>
            <p className="mt-5 font-display text-2xl font-bold tracking-tight">Nothing saved yet</p>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Hit the bookmark on any career while reading, and it lands here for later.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button onClick={() => navigate("/careers")} className="rounded-full px-6">
                Browse careers
              </Button>
              <Button variant="outline" onClick={() => navigate("/quiz")} className="rounded-full px-6">
                Take the match
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="mt-10 space-y-3">
              {savedCareers.map((career, i) => (
                <motion.div
                  key={career.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.04 }}
                  className="group flex w-full items-start justify-between gap-4 rounded-2xl border border-border bg-card p-5 text-left transition-colors hover:border-saffron/40"
                >
                  <button
                    onClick={() => navigate(`/careers/${career.id}`)}
                    className="min-w-0 flex-1 cursor-pointer text-left"
                  >
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h2 className="font-display text-xl font-bold tracking-tight group-hover:text-saffron transition-colors">
                        {career.name}
                      </h2>
                      <Chip tone="saffron">{categoryLabel(career.category)}</Chip>
                    </div>
                    <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">{career.tagline}</p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      <Chip>{career.metrics.duration}</Chip>
                      <Chip>{formatSalaryRange(career.salaryParsed.entry)} entry</Chip>
                    </div>
                  </button>
                  <div className="flex shrink-0 flex-col items-end gap-3">
                    <button
                      aria-label={`Remove ${career.name} from saved`}
                      onClick={() => removeSaved(career.id)}
                      className="rounded-full p-2 text-muted-foreground hover:bg-bad-dim hover:text-bad transition-colors"
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-saffron" aria-hidden="true" />
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              {savedCareers.length >= 2 && (
                <Button
                  onClick={() => navigate(`/compare?a=${savedCareers[0].id}&b=${savedCareers[1].id}`)}
                  className="rounded-full px-6"
                >
                  <Scale className="mr-2 h-4 w-4" aria-hidden="true" /> Compare the first two
                </Button>
              )}
              <Button variant="ghost" onClick={clearSaved} className="text-muted-foreground">
                <Trash2 className="mr-2 h-4 w-4" aria-hidden="true" /> Clear all
              </Button>
            </div>
          </>
        )}

        {/* Checklist progress */}
        {progress.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center gap-2">
              <ListChecks className="h-4 w-4 text-saffron" aria-hidden="true" />
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">In-progress checklists</span>
            </div>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              Pick up where you left off on the &ldquo;Before you commit&rdquo; to-do lists.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {progress.map((p, i) => {
                const career = careers.find((c) => c.id === p.careerId);
                if (!career) return null;
                const total = career.beforeYouCommit.length || 1;
                const pct = Math.min(100, Math.round((p.checked.length / total) * 100));
                const done = p.checked.length >= total;
                return (
                  <motion.button
                    key={p.careerId}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.04 }}
                    whileHover={{ y: -2 }}
                    onClick={() => navigate(`/careers/${career.id}`)}
                    className="group rounded-2xl border border-border bg-card p-5 text-left transition-colors hover:border-saffron/40"
                  >
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="font-display text-lg font-bold tracking-tight group-hover:text-saffron transition-colors">
                        {career.name}
                      </span>
                      <span className="text-xs font-medium tabular-nums text-muted-foreground">
                        {p.checked.length}/{total} done
                      </span>
                    </div>
                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-border">
                      <motion.div
                        className={done ? "h-full rounded-full bg-good" : "h-full rounded-full bg-saffron"}
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                      />
                    </div>
                    <p className="mt-3 line-clamp-1 text-xs text-muted-foreground">
                      {done ? "All done — time to decide." : `Next: ${career.beforeYouCommit[p.checked.length] ?? "finish the rest"}`}
                    </p>
                  </motion.button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
