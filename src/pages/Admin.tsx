import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useQuery } from "convex/react";
import { Activity, BarChart3, BookOpenText, MessageCircle, Search, Sparkles } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { Chip } from "@/components/Chip";
import { SiteHeader } from "@/components/SiteHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { useCareers } from "@/lib/career-loader";
import { usePageMeta } from "@/lib/meta";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────────────────────
   Reading the room — the owner's analytics view. Anonymous
   signals only: career pages opened, searches, quiz completions,
   comparisons. No cookies, no user ids, no IPs. Reached at /admin
   (signed-in only); kept out of the student nav on purpose.
   ───────────────────────────────────────────────────────────── */

function StatCard({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center gap-2.5">
        <span className="grid size-8 place-items-center rounded-lg bg-saffron-dim text-saffron">
          <Icon className="h-4 w-4" />
        </span>
        <div className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">{label}</div>
      </div>
      <div className="mt-4 font-display text-3xl font-bold tracking-tight tabular-nums">{value}</div>
      <div className="mt-1 text-xs text-muted-foreground">{hint}</div>
    </div>
  );
}

function RankList({
  title,
  icon: Icon,
  rows,
  empty,
  labelFor,
  accent = false,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  rows: { key: string; count: number }[];
  empty: string;
  labelFor: (key: string) => string;
  accent?: boolean;
}) {
  const max = rows.length ? rows[0].count : 1;
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-saffron" />
        <h2 className="font-display text-base font-bold tracking-tight">{title}</h2>
      </div>
      {rows.length === 0 ? (
        <p className="mt-5 text-sm leading-relaxed text-muted-foreground">{empty}</p>
      ) : (
        <ul className="mt-5 space-y-3.5">
          {rows.map((row, i) => (
            <li key={row.key} className="flex items-center gap-3">
              <span className="w-5 shrink-0 text-right font-mono text-xs font-bold text-muted-foreground tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="truncate text-sm font-semibold">{labelFor(row.key)}</span>
                  <span className="shrink-0 text-xs font-medium tabular-nums text-muted-foreground">{row.count}</span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-border">
                  <div
                    className={cn("h-full rounded-full", accent ? "bg-saffron" : "bg-foreground/40")}
                    style={{ width: `${Math.max(4, (row.count / max) * 100)}%` }}
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function Admin() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();
  const overview = useQuery(api.analytics.overview);
  const careers = useCareers();

  usePageMeta("Site stats — Karriere", "Anonymous reading signals: which careers are read, what students search.", true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate(`/auth?returnTo=${encodeURIComponent("/admin")}`);
    }
  }, [isLoading, isAuthenticated, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <SiteHeader />
        <div className="mx-auto max-w-4xl px-5 py-12 sm:px-6">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="mt-6 h-12 w-72" />
          <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 rounded-2xl" />
            ))}
          </div>
          <Skeleton className="mt-6 h-64 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null; // redirecting to /auth

  const careerName = (id: string) => careers?.find((c) => c.id === id)?.name ?? id;
  const t = overview?.totals;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <div id="main" className="mx-auto max-w-4xl px-5 py-12 sm:px-6 md:py-16">
        <Chip tone="saffron">Site stats</Chip>
        <h1 className="mt-5 font-display text-4xl font-bold leading-[1.03] tracking-tight text-balance md:text-5xl">
          Reading the room.
        </h1>
        <p className="mt-4 max-w-xl leading-relaxed text-muted-foreground">
          Anonymous signals from the last 30 days — no cookies, no user ids, no IPs.
          This is what decides which careers get ordered first and what gets written next.
        </p>

        {!overview ? (
          <div className="mt-10 space-y-4">
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 rounded-2xl" />
            ))}
          </div>
        ) : (
          <>
            {/* Stat cards */}
            <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
              <StatCard icon={BookOpenText} label="Career pages opened" value={String(t?.careerViews ?? 0)} hint="dossier views" />
              <StatCard icon={Search} label="Searches" value={String(t?.searches ?? 0)} hint="what students type" />
              <StatCard icon={Sparkles} label="Quiz completions" value={String(t?.quizCompletions ?? 0)} hint="finished the match" />
              <StatCard icon={Activity} label="Comparisons" value={String(t?.compares ?? 0)} hint="head-to-heads viewed" />
            </div>

            {/* 14-day activity */}
            <div className="mt-6 rounded-2xl border border-border bg-card p-6">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-saffron" aria-hidden="true" />
                <h2 className="font-display text-base font-bold tracking-tight">Activity, last 14 days</h2>
              </div>
              <div className="mt-6 flex h-32 items-end gap-1.5" role="img" aria-label="Events per day over the last 14 days">
                {overview.daily.map((d, i) => {
                  const max = Math.max(...overview.daily.map((x) => x.count), 1);
                  return (
                    <div key={d.date} className="group relative flex-1" title={`${d.date} · ${d.count}`}>
                      <div
                        className={cn(
                          "w-full rounded-t-sm transition-colors",
                          d.count > 0 ? "bg-saffron/80 group-hover:bg-saffron" : "bg-border",
                        )}
                        style={{ height: `${Math.max(3, (d.count / max) * 100)}%` }}
                      />
                      {i % 3 === 0 && (
                        <div className="mt-1.5 text-center text-[9px] font-medium text-muted-foreground">
                          {d.date.slice(5)}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Top lists */}
            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              <RankList
                title="Most-read careers"
                icon={BookOpenText}
                rows={overview.topCareers}
                empty="No career pages opened yet — share a link to get the first signal."
                labelFor={careerName}
                accent
              />
              <RankList
                title="What students search"
                icon={Search}
                rows={overview.topSearches}
                empty="No searches yet — the explorer records what students type."
                labelFor={(q) => `“${q}”`}
              />
            </div>

            {/* Privacy note */}
            <div className="mt-8 flex items-start gap-3 rounded-2xl border border-border bg-card p-5">
              <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-saffron" aria-hidden="true" />
              <p className="text-sm leading-relaxed text-muted-foreground">
                Events are stored anonymously in Karriere&rsquo;s own database — no third-party trackers,
                no cookies, no user ids, no IP addresses. Queries are kept as plain text so search gaps
                surface; nothing here can identify a student.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
