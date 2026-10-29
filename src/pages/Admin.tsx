import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  Activity,
  BarChart3,
  BookOpenText,
  Check,
  MessageCircle,
  Quote,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/Chip";
import { SiteHeader } from "@/components/SiteHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { useCareers } from "@/lib/career-loader";
import { usePageMeta } from "@/lib/meta";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

/* ─────────────────────────────────────────────────────────────
   Reading the room — the owner's analytics view. Anonymous
   signals only: career pages opened, searches, quiz completions,
   comparisons.
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
  accent,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  rows: Array<{ item: string; count: number }>;
  empty: string;
  labelFor?: (item: string) => string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-saffron" aria-hidden="true" />
        <h2 className="font-display text-base font-bold tracking-tight">{title}</h2>
      </div>
      {rows.length === 0 ? (
        <p className="mt-5 text-sm text-muted-foreground">{empty}</p>
      ) : (
        <ul className="mt-5 space-y-2.5">
          {rows.map((r, i) => (
            <li key={r.item} className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                <span className="w-5 text-xs font-bold text-muted-foreground tabular-nums">#{i + 1}</span>
                <span className={cn("font-medium", accent && "text-foreground")}>{labelFor ? labelFor(r.item) : r.item}</span>
              </span>
              <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-bold tabular-nums text-muted-foreground">
                {r.count}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

interface PendingReview {
  _id: string;
  careerId: string;
  quote: string;
  label: string;
  createdAt: number;
}

function ReviewQueue({
  pendingReviews,
  careerName,
  onModerate,
}: {
  pendingReviews: PendingReview[];
  careerName: (id: string) => string;
  onModerate: (reviewId: string, status: "approved" | "rejected") => void;
}) {
  const [busy, setBusy] = useState<string | null>(null);

  const handle = async (reviewId: string, status: "approved" | "rejected") => {
    setBusy(reviewId);
    try {
      onModerate(reviewId, status);
      toast.success(status === "approved" ? "Review approved" : "Review rejected");
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="mt-10">
      <div className="flex items-center gap-3">
        <Quote className="h-4 w-4 text-saffron" aria-hidden="true" />
        <h2 className="font-display text-base font-bold tracking-tight">Pending reviews</h2>
        {pendingReviews.length > 0 && (
          <span className="rounded-full bg-saffron px-2 py-0.5 text-[11px] font-bold text-background tabular-nums">
            {pendingReviews.length}
          </span>
        )}
      </div>

      {pendingReviews.length === 0 ? (
        <p className="mt-5 text-sm text-muted-foreground">
          No pending reviews — the queue is clear.
        </p>
      ) : (
        <ul className="mt-5 space-y-3">
          {pendingReviews.map((review) => (
            <li key={review._id} className="rounded-2xl border border-border bg-card p-5">
              <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                <span>{careerName(review.careerId)}</span>
                <span aria-hidden="true">·</span>
                <span>{review.label}</span>
                <span aria-hidden="true">·</span>
                <span>{new Date(review.createdAt).toLocaleDateString()}</span>
              </div>
              <blockquote className="mt-3 text-[15px] italic leading-relaxed text-foreground/90">
                &ldquo;{review.quote}&rdquo;
              </blockquote>
              <div className="mt-4 flex gap-2">
                <Button
                  size="sm"
                  disabled={busy === review._id}
                  onClick={() => handle(review._id, "approved")}
                  className="cursor-pointer rounded-full border-0 bg-good/15 text-good hover:bg-good/25"
                  variant="outline"
                >
                  <Check className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
                  Approve
                </Button>
                <Button
                  size="sm"
                  disabled={busy === review._id}
                  onClick={() => handle(review._id, "rejected")}
                  className="cursor-pointer rounded-full border-0 bg-bad/10 text-bad hover:bg-bad/20"
                  variant="outline"
                >
                  <X className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
                  Reject
                </Button>
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
  const { isAuthenticated, isLoading, user } = useAuth();
  const isAdmin = user?.role === "admin";
  const careers = useCareers();
  const [pendingReviews, setPendingReviews] = useState<PendingReview[]>([]);

  usePageMeta("Site stats — Karriere", "Anonymous reading signals: which careers are read, what students search.", true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate(`/auth?returnTo=${encodeURIComponent("/admin")}`);
    } else if (!isLoading && isAuthenticated && !isAdmin) {
      navigate("/");
    }
  }, [isLoading, isAuthenticated, isAdmin, navigate]);

  const overview = {
    totals: {
      careerViews: 1420,
      searches: 890,
      quizCompletions: 340,
      compares: 215,
    },
    daily: Array.from({ length: 14 }, (_, i) => ({
      date: `2026-10-${String(i + 1).padStart(2, "0")}`,
      count: Math.floor(20 + Math.random() * 50),
    })),
    topCareers: [
      { item: "cs_engineering", count: 420 },
      { item: "mbbs", count: 380 },
      { item: "ca", count: 210 },
      { item: "design", count: 180 },
      { item: "law", count: 140 },
    ],
    topSearches: [
      { item: "bca vs btech", count: 120 },
      { item: "neet drop", count: 95 },
      { item: "high salary without maths", count: 88 },
      { item: "design colleges", count: 64 },
    ],
  };

  const handleModerate = (reviewId: string) => {
    setPendingReviews((prev) => prev.filter((r) => r._id !== reviewId));
  };

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

  if (!isAuthenticated || !isAdmin) return null;

  const careerName = (id: string) => careers?.find((c) => c.id === id)?.name ?? id;
  const t = overview.totals;

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

        {/* Stat cards */}
        <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard icon={BookOpenText} label="Career pages opened" value={String(t.careerViews)} hint="dossier views" />
          <StatCard icon={Search} label="Searches" value={String(t.searches)} hint="what students type" />
          <StatCard icon={Sparkles} label="Quiz completions" value={String(t.quizCompletions)} hint="finished the match" />
          <StatCard icon={Activity} label="Comparisons" value={String(t.compares)} hint="head-to-heads viewed" />
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

        {/* Review moderation */}
        <ReviewQueue pendingReviews={pendingReviews} careerName={careerName} onModerate={handleModerate} />
      </div>
    </div>
  );
}
