import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowUpRight,
  BadgeCheck,
  Bookmark,
  BookmarkCheck,
  Check,
  ChevronDown,
  Clock,
  FileDown,
  Quote,
  Scale,
  Share2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/Chip";
import { SiteHeader } from "@/components/SiteHeader";
import { Skeleton } from "@/components/ui/skeleton";
import {
  STREAM_META,
  calculateSalaryPercentage,
  categoryLabel,
  entryMeta,
  formatLakhs,
  getMid,
  getSalaryContext,
  journeySummary,
  metricMeta,
  pathLikelihoodLabels,
  type CareerProfile,
} from "@/lib/career-data";
import { useCareers } from "@/lib/career-loader";
import { useAnalytics } from "@/lib/analytics";
import { VS_PAIRS } from "@/lib/vs-pairs";
import { toggleSaved, useShortlist } from "@/lib/shortlist";
import { useChecklist } from "@/lib/checklist";
import { SITE_DESC, SITE_TITLE, useJsonLd, usePageMeta } from "@/lib/meta";
import { ShareDialog } from "@/components/ShareDialog";
import { FeedbackWidget } from "@/components/FeedbackWidget";
import { cn } from "@/lib/utils";

const CHAPTERS = [
  { id: "ch-short", label: "Overview" },
  { id: "ch-reality", label: "Reality" },
  { id: "ch-snapshot", label: "Snapshot" },
  { id: "ch-money", label: "Money" },
  { id: "ch-road", label: "Road" },
  { id: "ch-paths", label: "Paths" },
  { id: "ch-fit", label: "Fit" },
  { id: "ch-reviews", label: "Reviews" },
  { id: "ch-faq", label: "FAQ" },
];

function Reveal({ delay = 0, children, className }: { delay?: number; children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{children}</p>
  );
}

/* Progressive disclosure: show the first few items, let readers expand the rest. */
function ShowMore({
  count,
  initial = 3,
  label,
  children,
}: {
  count: number;
  initial?: number;
  label: string;
  children: (visible: number) => React.ReactNode;
}) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? count : Math.min(initial, count);
  return (
    <>
      {children(visible)}
      {count > initial && (
        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-saffron transition-colors hover:text-saffron/80"
        >
          {expanded ? "Show less" : `+${count - initial} ${label}`}
          <ChevronDown className={cn("h-4 w-4 transition-transform", expanded && "rotate-180")} aria-hidden="true" />
        </button>
      )}
    </>
  );
}

/* Long paragraphs: clamp to 3 lines with a "Read more" toggle (only when they actually overflow). */
function ClampedText({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [overflowing, setOverflowing] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (el) setOverflowing(el.scrollHeight > el.clientHeight + 2);
  }, [text]);
  return (
    <div>
      <p ref={ref} className={cn(className, !expanded && "line-clamp-3")}>
        {text}
      </p>
      {overflowing && (
        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-saffron transition-colors hover:text-saffron/80"
        >
          {expanded ? "Show less" : "Read more"}
          <ChevronDown className={cn("h-4 w-4 transition-transform", expanded && "rotate-180")} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

function MetricRow({ label, value, goodWhen }: { label: string; value: number; goodWhen: "high" | "low" }) {
  const pct = (value / 5) * 100;
  const direction = goodWhen === "high" ? "higher is better" : "lower is better";
  const good = goodWhen === "high" ? value >= 4 : value <= 2;
  const bad = goodWhen === "high" ? value <= 2 : value >= 4;
  const bar = good ? "bg-good" : bad ? "bg-bad" : "bg-foreground/40";
  const text = good ? "text-good" : bad ? "text-bad" : "text-foreground";
  return (
    <div className="grid grid-cols-1 gap-2 py-4 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-4">
      <div>
        <div className="text-sm font-semibold">{label}</div>
        <div className="mt-0.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{direction}</div>
      </div>
      <div className="flex items-center gap-3 sm:justify-end">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-border sm:w-24 sm:flex-none md:w-36">
          <motion.div
            className={cn("h-full rounded-full", bar)}
            initial={{ width: 0 }}
            whileInView={{ width: `${pct}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          />
        </div>
        <span className={cn("w-8 text-right font-mono text-sm font-semibold tabular-nums", text)}>{value}/5</span>
      </div>
    </div>
  );
}

function SalaryTrajectory({ career }: { career: CareerProfile }) {
  const pct = calculateSalaryPercentage(career.salaryParsed);
  const points = [
    { label: "Entry", pct: pct.entry, note: career.salary.entry },
    { label: "Mid", pct: pct.mid, note: career.salary.mid },
    { label: "Senior", pct: pct.senior, note: career.salary.senior },
  ];
  const W = 600;
  const H = 130;
  const padX = 60;
  const padY = 22;
  const xs = [padX, W / 2, W - padX];
  const yOf = (p: number) => H - padY - (p / 100) * (H - padY * 2);
  const ys = points.map((p) => yOf(p.pct));
  const path = `M ${xs[0]} ${ys[0]} L ${xs[1]} ${ys[1]} L ${xs[2]} ${ys[2]}`;

  return (
    <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Salary progression from entry to senior">
        <line x1={xs[0]} y1={ys[0]} x2={xs[2]} y2={ys[0]} stroke="var(--border)" strokeWidth="1" strokeDasharray="3 3" />
        <motion.path
          d={path}
          fill="none"
          stroke="var(--saffron)"
          strokeWidth="3"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, ease: "easeOut" }}
        />
        {points.map((p, i) => (
          <g key={p.label}>
            <circle cx={xs[i]} cy={ys[i]} r="5" fill="var(--background)" stroke="var(--saffron)" strokeWidth="2.5" />
            <text x={xs[i]} y={ys[i] - 14} textAnchor="middle" fontSize="11" fill="var(--muted-foreground)" fontFamily="var(--font-mono)">
              {formatLakhs(getMid(career.salaryParsed[i === 0 ? "entry" : i === 1 ? "mid" : "senior"]))}
            </text>
          </g>
        ))}
      </svg>
      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
        {points.map((p) => (
          <div key={p.label} className="rounded-xl bg-secondary/60 px-3 py-3">
            <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{p.label}</div>
            <div className="mt-1 text-[13px] leading-snug text-foreground/90">{p.note}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TimelineRail({ career }: { career: CareerProfile }) {
  const realistic = career.careerPaths.filter((p) => p.likelihood !== "few");
  const firstRole = realistic.length ? Math.min(...realistic.map((p) => p.timeParsed.min)) : 1;
  const established = realistic.length ? Math.max(...realistic.map((p) => p.timeParsed.max)) : 5;
  const stops = [
    { label: "Class 12", note: "The starting line", year: 0 },
    { label: "The degree", note: career.metrics.duration, year: career.durationParsed },
    {
      label: "First real role",
      note: firstRole === 0 ? "right after" : `${firstRole} yr${firstRole === 1 ? "" : "s"} after`,
      year: career.durationParsed + firstRole,
    },
    { label: "Established", note: `~${career.durationParsed + established} yrs in`, year: career.durationParsed + established },
  ];
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      {stops.map((stop, i) => (
        <div key={stop.label} className="flex gap-5">
          <div className="flex flex-col items-center">
            <div className="mt-1.5 size-3 rounded-full border-2 border-saffron bg-background" />
            {i < stops.length - 1 && <div className="my-1.5 w-px flex-1 bg-border" />}
          </div>
          <div className={cn("flex-1", i < stops.length - 1 && "pb-8")}>
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
              <span className="text-[15px] font-semibold">{stop.label}</span>
              <Chip>{stop.year} yrs</Chip>
            </div>
            <div className="mt-0.5 text-sm text-muted-foreground">{stop.note}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function CareerProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const shortlist = useShortlist();
  const [activeChapter, setActiveChapter] = useState("ch-short");
  const railRef = useRef<HTMLDivElement>(null);
  const railLockedRef = useRef(false);
  const careers = useCareers();

  const career = useMemo(() => careers?.find((c) => c.id === id) ?? null, [careers, id]);
  const checklist = useChecklist(career?.id ?? "");
  const [shareOpen, setShareOpen] = useState(false);
  const track = useAnalytics();

  // Which careers actually get read — the signal behind every ordering decision.
  useEffect(() => {
    if (career) track("career_view", { careerId: career.id });
  }, [career, track]);

  const metaTitle = career ? `${career.name}: Honest Verdict, Salary & Reality — Karriere` : SITE_TITLE;
  const metaDescRaw = career ? `${career.verdict} Entry pay: ${career.salary.entry}.` : SITE_DESC;
  const metaDesc = metaDescRaw.length > 160 ? `${metaDescRaw.slice(0, 157).trimEnd()}…` : metaDescRaw;
  usePageMeta(
    metaTitle,
    metaDesc,
    false,
    career ? `${window.location.origin}/og/${career.id}.png` : undefined,
  );

  // Structured data: FAQ rich results + breadcrumbs (Google renders JS and reads this).
  const jsonLd = useMemo(() => {
    if (!career) return null;
    const origin = window.location.origin;
    return [
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: career.faq.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${origin}/` },
          { "@type": "ListItem", position: 2, name: "Careers", item: `${origin}/careers` },
          { "@type": "ListItem", position: 3, name: career.name, item: `${origin}/careers/${career.id}` },
        ],
      },
    ];
  }, [career]);
  useJsonLd(jsonLd);

  useEffect(() => {
    if (!career) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveChapter(entry.target.id);
        }
      },
      { rootMargin: "-15% 0px -75% 0px" },
    );
    for (const ch of CHAPTERS) {
      const el = document.getElementById(ch.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [career]);

  // Keep the active tab visible: when the scroll-spy advances, glide the rail to
  // center the active pill (skipped while the user is actively swiping the rail).
  useEffect(() => {
    if (railLockedRef.current || !railRef.current) return;
    const active = railRef.current.querySelector('a[aria-current="true"]');
    active?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [activeChapter]);

  if (careers === null) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <SiteHeader />
        <div className="mx-auto max-w-3xl px-5 py-12 sm:px-6">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="mt-6 h-14 w-2/3 max-w-md" />
          <Skeleton className="mt-4 h-4 w-full max-w-lg" />
          <Skeleton className="mt-10 h-40 w-full rounded-2xl" />
          <Skeleton className="mt-6 h-4 w-3/4" />
          <Skeleton className="mt-3 h-4 w-full" />
          <Skeleton className="mt-3 h-4 w-5/6" />
        </div>
      </div>
    );
  }

  if (!career) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <SiteHeader />
        <div className="flex min-h-[70vh] items-center justify-center px-6">
          <div className="text-center">
            <p className="font-display text-2xl font-bold mb-4">Career not found.</p>
            <Button onClick={() => navigate("/careers")}>
              <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" /> Back to careers
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const saved = shortlist.includes(career.id);
  const vsPair = VS_PAIRS.find((p) => p.a === career.id || p.b === career.id);
  const heroQuote = career.realExperiences[0];
  const salaryCtx = getSalaryContext(career.salaryParsed.entry);
  const journey = journeySummary(career);
  const related = career.relatedCareers
    .map((rid) => careers.find((c) => c.id === rid))
    .filter((c): c is CareerProfile => Boolean(c));

  const quickFacts = [
    { label: "Duration", value: career.metrics.duration },
    { label: "Entry pay", value: `${formatLakhs(getMid(career.salaryParsed.entry))}/yr` },
    { label: "Stress", value: `${career.metrics.stress}/5` },
    { label: "Work-life", value: `${career.metrics.workLifeBalance}/5` },
    { label: "Competition", value: `${career.metrics.competition}/5` },
    { label: "Job availability", value: `${career.metrics.jobAvailability}/5` },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <div id="main" className="mx-auto max-w-3xl px-5 sm:px-6">
        {/* Header */}
        <div className="pt-12 pb-8 md:pt-16 md:pb-10">
          <div className="flex flex-wrap items-center gap-2">
            <Chip tone="saffron">{categoryLabel(career.category)}</Chip>
            <Chip tone="card">
              <span className="inline-flex items-center gap-1.5">
                <BadgeCheck className="h-3.5 w-3.5 text-good" aria-hidden="true" />
                Facts verified · {career.lastVerified}
              </span>
            </Chip>
            <Chip tone="card" className="hidden sm:inline-flex">
              Entry · {entryMeta(career).gateLabel}
              {entryMeta(career).streams.some((s) => s !== "any") && (
                <span className="text-muted-foreground">
                  {" "}
                  {STREAM_META.filter((s) => entryMeta(career).streams.includes(s.id)).map((s) => s.label.replace("Science ", "")).join(" / ")}
                </span>
              )}
            </Chip>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/compare?a=${career.id}&b=`)}
              className="text-muted-foreground hidden sm:inline-flex"
            >
              <Scale className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" /> Compare
            </Button>
            {vsPair && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(`/vs/${vsPair.slug}`)}
                className="text-muted-foreground hidden sm:inline-flex"
              >
                {vsPair.nameA} vs {vsPair.nameB}
              </Button>
            )}
            <Button
              variant={saved ? "outline" : "ghost"}
              size="sm"
              onClick={() => toggleSaved(career.id)}
              aria-pressed={saved}
              className={saved ? "border-saffron/40 text-saffron" : "text-muted-foreground"}
            >
              {saved ? <BookmarkCheck className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" /> : <Bookmark className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />}
              {saved ? "Saved" : "Save"}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setShareOpen(true)} className="text-muted-foreground">
              <Share2 className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" /> Share
            </Button>
          </div>
          <h1 className="mt-5 font-display text-4xl font-bold leading-[1.04] tracking-tight text-balance md:text-6xl">
            {career.name}
          </h1>
          <p className="mt-4 text-lg leading-snug text-muted-foreground md:text-xl">{career.tagline}</p>
          <div className="mt-6 rounded-2xl border border-saffron/30 bg-saffron-dim/40 px-5 py-4">
            <p className="text-xs font-bold uppercase tracking-widest text-saffron">Bottom line</p>
            <p className="mt-1.5 font-display text-lg font-semibold leading-snug tracking-tight md:text-xl">
              {career.verdict}
            </p>
          </div>
        </div>

        {/* Quick facts */}
        <div className="mb-10 flex flex-wrap gap-2">
          {quickFacts.map((f) => (
            <Chip key={f.label} tone="card">
              <span className="font-medium uppercase tracking-wider text-muted-foreground/80">{f.label}</span>
              <span className="font-bold text-foreground tabular-nums">{f.value}</span>
            </Chip>
          ))}
        </div>

        {/* Hero quote */}
        {heroQuote && (
          <Reveal>
            <div className="relative mb-10 overflow-hidden rounded-2xl border border-border bg-card p-6 md:p-8">
              <Quote className="absolute right-6 top-6 h-10 w-10 text-saffron/10" aria-hidden="true" />
              <blockquote className="relative font-serif text-lg italic leading-snug tracking-tight md:text-xl">
                &ldquo;{heroQuote.quote.length > 300 ? heroQuote.quote.slice(0, 300) + "…" : heroQuote.quote}&rdquo;
              </blockquote>
              {heroQuote.url && (
                <a
                  href={heroQuote.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-saffron transition-colors"
                >
                  From {heroQuote.source} <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </a>
              )}
            </div>
          </Reveal>
        )}

        {/* Sticky chapter nav — sits below the site header (which is taller on mobile) */}
        <nav
          className="sticky top-28 z-40 -mx-5 bg-background/90 px-5 py-3 backdrop-blur-md md:top-16 sm:-mx-6 sm:px-6"
          aria-label="Profile sections"
        >
          <div
            ref={railRef}
            onPointerDown={() => (railLockedRef.current = true)}
            onPointerUp={() => (railLockedRef.current = false)}
            onPointerLeave={() => (railLockedRef.current = false)}
            className="flex items-center gap-1 overflow-x-auto rounded-full border border-border bg-secondary/50 p-1 no-scrollbar"
          >
            {CHAPTERS.map((ch) => {
              const active = activeChapter === ch.id;
              return (
                <a
                  key={ch.id}
                  href={`#${ch.id}`}
                  aria-current={active ? "true" : undefined}
                  className={cn(
                    "relative whitespace-nowrap rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition-colors",
                    active ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="chapter-pill"
                      className="absolute inset-0 rounded-full bg-saffron shadow-sm"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative z-10">{ch.label}</span>
                </a>
              );
            })}
          </div>
        </nav>

        {/* 01 The short version */}
        <section id="ch-short" className="scroll-mt-32 pt-12 md:pt-16">
          <Reveal>
            <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">The short version</h2>
            <ClampedText text={career.overview} className="mt-5 text-lg leading-relaxed text-foreground/90" />
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-border bg-card p-5">
                <SectionLabel>Ideal personality</SectionLabel>
                <ClampedText text={career.metrics.idealPersonality} className="mt-2 text-[15px] leading-relaxed" />
              </div>
              {career.metrics.internship && (
                <div className="rounded-2xl border border-border bg-card p-5">
                <SectionLabel>Internship / training</SectionLabel>
                <ClampedText text={career.metrics.internship} className="mt-2 text-[15px] leading-relaxed" />
                </div>
              )}
              <div className="rounded-2xl border border-border bg-card p-5">
                <SectionLabel>Outlook in India</SectionLabel>
                <ClampedText text={career.careerOutlook.india} className="mt-2 text-[15px] leading-relaxed" />
              </div>
              <div className="rounded-2xl border border-border bg-card p-5">
                <SectionLabel>Going abroad</SectionLabel>
                <ClampedText text={career.careerOutlook.abroad} className="mt-2 text-[15px] leading-relaxed" />
              </div>
            </div>
          </Reveal>
        </section>

        {/* 02 What it's really like */}
        <section id="ch-reality" className="scroll-mt-32 pt-12 md:pt-16">
          <Reveal>
            <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">What it&rsquo;s really like</h2>
          </Reveal>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <Reveal delay={0.05}>
              <div className="h-full rounded-2xl border border-bad/30 bg-bad-dim/40 p-6">
                <SectionLabel>What nobody tells you</SectionLabel>
                <ShowMore count={career.whatNobodyTellsYou.length} initial={3} label="more">
                  {(n) => (
                    <ul className="mt-4 space-y-4">
                      {career.whatNobodyTellsYou.slice(0, n).map((p) => (
                        <li key={p} className="flex gap-3 text-[15px] leading-relaxed">
                          <X className="mt-1 h-4 w-4 shrink-0 text-bad" aria-hidden="true" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  )}
                </ShowMore>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="h-full rounded-2xl border border-good/30 bg-good-dim/40 p-6">
                <SectionLabel>Why people choose this</SectionLabel>
                <ShowMore count={career.whyPeopleLoveIt.length} initial={3} label="more">
                  {(n) => (
                    <ul className="mt-4 space-y-4">
                      {career.whyPeopleLoveIt.slice(0, n).map((p) => (
                        <li key={p} className="flex gap-3 text-[15px] leading-relaxed">
                          <Check className="mt-1 h-4 w-4 shrink-0 text-good" aria-hidden="true" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  )}
                </ShowMore>
              </div>
            </Reveal>
          </div>
        </section>

        {/* 03 Reality snapshot */}
        <section id="ch-snapshot" className="scroll-mt-32 pt-12 md:pt-16">
          <Reveal>
            <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">Reality snapshot</h2>
            <p className="mt-3 text-sm text-muted-foreground max-w-2xl">
              A directional read from graduates&rsquo; accounts — not science, but signal. Scale: 1 = low, 5 = high.
            </p>
            <div className="mt-7 rounded-2xl border border-border bg-card px-6">
              {metricMeta.map((m, i) => (
                <div key={m.key} className={cn(i > 0 && "border-t border-border")}>
                  <MetricRow label={m.label} value={career.metrics[m.key]} goodWhen={m.goodWhen} />
                </div>
              ))}
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {[
                { label: "Biggest misconception", text: career.metrics.misconception, tone: "saffron" as const },
                { label: "Most common regret", text: career.metrics.regret, tone: "bad" as const },
                { label: "Most common praise", text: career.metrics.praise, tone: "good" as const },
              ].map((q) => (
                <div key={q.label} className="rounded-2xl border border-border bg-card p-5">
                  <div className={cn("text-xs font-bold uppercase tracking-widest", q.tone === "saffron" ? "text-saffron" : q.tone === "good" ? "text-good" : "text-bad")}>
                    {q.label}
                  </div>
                  <p className="mt-3 font-serif text-base italic leading-snug tracking-tight">&ldquo;{q.text}&rdquo;</p>
                </div>
              ))}
            </div>
          </Reveal>
        </section>

        {/* 04 The money */}
        <section id="ch-money" className="scroll-mt-32 pt-12 md:pt-16">
          <Reveal>
            <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">The money</h2>
            <div className="mt-7">
              <SalaryTrajectory career={career} />
            </div>
            {salaryCtx && (
              <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-foreground/85">
                <span className="mr-2 font-mono text-saffron" aria-hidden="true">→</span>
                {salaryCtx}
              </p>
            )}
            {journey && (
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">{journey}.</p>
            )}
          </Reveal>
        </section>

        {/* 05 The road */}
        <section id="ch-road" className="scroll-mt-32 pt-12 md:pt-16">
          <Reveal>
            <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">The road</h2>
            <div className="mt-7 max-w-2xl">
              <TimelineRail career={career} />
              <p className="mt-3 text-xs text-muted-foreground">
                Degree length is fixed; &ldquo;first role&rdquo; and &ldquo;established&rdquo; are estimates from the paths most
                graduates actually take — not promises.
              </p>
            </div>
            <div className="mt-10 max-w-2xl">
              <SectionLabel>Typical progression</SectionLabel>
              <div className="mt-5 rounded-2xl border border-border bg-card px-6 py-4">
                {career.metrics.progression.map((step, i) => (
                  <div key={step} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="mt-2 size-2 rounded-full bg-saffron" />
                      {i < career.metrics.progression.length - 1 && <div className="my-1 w-px flex-1 bg-border" />}
                    </div>
                    <div className={cn("text-[15px] leading-relaxed", i < career.metrics.progression.length - 1 && "pb-5")}>
                      {step}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </section>

        {/* 06 Where it leads */}
        <section id="ch-paths" className="scroll-mt-32 pt-12 md:pt-16">
          <Reveal>
            <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">Where it leads</h2>
            <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
              Most {career.name} graduates don&rsquo;t become specialists overnight. These are the realistic
              destinations, roughly in order of how common they are.
            </p>
            <div className="mt-7 space-y-3">
              {career.careerPaths.map((path) => (
                <details key={path.id} className="group rounded-2xl border border-border bg-card transition-colors open:border-saffron/40">
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-4 p-5">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="font-display text-lg font-bold tracking-tight">{path.name}</span>
                        <Chip tone={path.likelihood === "most_graduates" ? "saffron" : "default"}>
                          {pathLikelihoodLabels[path.likelihood]}
                        </Chip>
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs font-medium text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" aria-hidden="true" /> {path.time}
                        </span>
                        <span className="tabular-nums">{path.salary}</span>
                      </div>
                    </div>
                    <ChevronDown className="mt-1 h-5 w-5 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" aria-hidden="true" />
                  </summary>
                  <div className="space-y-4 px-5 pb-6">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {path.pathway.map((step, i) => (
                        <span key={step} className="flex items-center gap-1.5 text-xs font-medium">
                          <span className="rounded-lg border border-border bg-secondary/60 px-2.5 py-1.5">{step}</span>
                          {i < path.pathway.length - 1 && <span className="text-muted-foreground" aria-hidden="true">→</span>}
                        </span>
                      ))}
                    </div>
                    <p className="text-sm leading-relaxed text-foreground/85">{path.explanation}</p>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      <span className="font-semibold text-foreground/80">Difficulty: </span>
                      {path.difficulty}
                    </p>
                    {path.watchOut && (
                      <p className="text-sm leading-relaxed text-saffron">
                        <span className="font-semibold">⚠ Watch out: </span>
                        {path.watchOut}
                      </p>
                    )}
                  </div>
                </details>
              ))}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Likelihood is an editorial estimate from graduates&rsquo; accounts, not precise statistics.
            </p>
          </Reveal>
        </section>

        {/* 07 Is this for you */}
        <section id="ch-fit" className="scroll-mt-32 pt-12 md:pt-16">
          <Reveal>
            <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">Is this for you?</h2>
            <div className="mt-7 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-good/30 bg-good-dim/40 p-6">
                <SectionLabel>Who thrives here</SectionLabel>
                <ShowMore count={career.whoThrives.length} initial={3} label="more">
                  {(n) => (
                    <ul className="mt-4 space-y-3">
                      {career.whoThrives.slice(0, n).map((t) => (
                        <li key={t} className="flex gap-3 text-[15px] leading-relaxed">
                          <Check className="mt-1 h-4 w-4 shrink-0 text-good" aria-hidden="true" />
                          {t}
                        </li>
                      ))}
                    </ul>
                  )}
                </ShowMore>
              </div>
              <div className="rounded-2xl border border-bad/30 bg-bad-dim/40 p-6">
                <SectionLabel>Who might struggle or regret this</SectionLabel>
                <ShowMore count={career.whoRegretsIt.length} initial={3} label="more">
                  {(n) => (
                    <ul className="mt-4 space-y-3">
                      {career.whoRegretsIt.slice(0, n).map((t) => (
                        <li key={t} className="flex gap-3 text-[15px] leading-relaxed">
                          <X className="mt-1 h-4 w-4 shrink-0 text-bad" aria-hidden="true" />
                          {t}
                        </li>
                      ))}
                    </ul>
                  )}
                </ShowMore>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.05}>
            <div className="mt-8">
              <div className="flex flex-wrap items-end justify-between gap-2">
                <SectionLabel>Before you commit — a to-do list</SectionLabel>
                <span className="text-xs font-medium tabular-nums text-muted-foreground">
                  {checklist.checked.length}/{career.beforeYouCommit.length} done
                </span>
              </div>
              <ShowMore count={career.beforeYouCommit.length} initial={3} label="more">
                {(n) => (
                  <div className="mt-4 space-y-3">
                    {career.beforeYouCommit.slice(0, n).map((c, i) => {
                      const done = checklist.checked.includes(i);
                      return (
                        <button
                          key={c}
                          type="button"
                          onClick={() => checklist.toggle(i)}
                          aria-pressed={done}
                          className={cn(
                            "flex w-full items-start gap-3.5 rounded-2xl border p-5 text-left transition-colors",
                            done ? "border-good/30 bg-good-dim/30" : "border-border bg-card hover:border-saffron/40",
                          )}
                        >
                          <span
                            className={cn(
                              "mt-0.5 grid size-6 shrink-0 place-items-center rounded-md border transition-colors",
                              done ? "border-good bg-good text-primary-foreground" : "border-border bg-background",
                            )}
                          >
                            {done && <Check className="h-3.5 w-3.5" aria-hidden="true" />}
                          </span>
                          <span className={cn("text-[15px] leading-relaxed", done && "text-muted-foreground line-through")}>
                            {c}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </ShowMore>
              {checklist.isLocal && (
                <p className="mt-3 text-xs text-muted-foreground">
                  Progress saves on this device.{" "}
                  <button
                    type="button"
                    onClick={() => navigate(`/auth?returnTo=${encodeURIComponent(`/careers/${career.id}`)}`)}
                    className="font-semibold text-saffron transition-colors hover:text-saffron/80"
                  >
                    Sign in
                  </button>{" "}
                  to keep it everywhere.
                </p>
              )}
              {checklist.checked.length > 0 && (
                <button
                  type="button"
                  onClick={checklist.clearAll}
                  className="mt-3 text-xs font-medium text-muted-foreground transition-colors hover:text-bad"
                >
                  Clear progress
                </button>
              )}
            </div>
          </Reveal>

          <Reveal delay={0.05}>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-border bg-card p-6">
                <div className="text-xs font-bold uppercase tracking-widest text-good">Choose this if…</div>
                <ShowMore count={career.chooseIf.length} initial={3} label="more">
                  {(n) => (
                    <ul className="mt-4 space-y-3">
                      {career.chooseIf.slice(0, n).map((c) => (
                        <li key={c} className="flex gap-3 text-[15px] leading-relaxed text-foreground/90">
                          <Check className="mt-1 h-4 w-4 shrink-0 text-good" aria-hidden="true" />
                          {c}
                        </li>
                      ))}
                    </ul>
                  )}
                </ShowMore>
              </div>
              <div className="rounded-2xl border border-border bg-card p-6">
                <div className="text-xs font-bold uppercase tracking-widest text-bad">Avoid if…</div>
                <ShowMore count={career.avoidIf.length} initial={3} label="more">
                  {(n) => (
                    <ul className="mt-4 space-y-3">
                      {career.avoidIf.slice(0, n).map((c) => (
                        <li key={c} className="flex gap-3 text-[15px] leading-relaxed text-foreground/90">
                          <X className="mt-1 h-4 w-4 shrink-0 text-bad" aria-hidden="true" />
                          {c}
                        </li>
                      ))}
                    </ul>
                  )}
                </ShowMore>
              </div>
            </div>
          </Reveal>
        </section>

        {/* 08 Reviews */}
        <section id="ch-reviews" className="scroll-mt-32 pt-12 md:pt-16">
          <Reveal>
            <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">Reviews</h2>
            <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
              Verbatim accounts from real threads. One person&rsquo;s experience is not a trend — read them all.
            </p>
            <p className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-saffron/30 bg-saffron-dim px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-saffron">
              <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
              Reviews collected &amp; linked · {career.lastVerified}
            </p>
            <ShowMore count={career.realExperiences.length} initial={2} label="reviews">
              {(n) => (
                <div className="mt-7 space-y-4">
                  {career.realExperiences.slice(0, n).map((exp, i) => (
                    <div key={i} className="rounded-2xl border border-border bg-card p-6">
                      <Quote className="h-5 w-5 text-saffron/50" aria-hidden="true" />
                      <blockquote className="mt-3 text-[15px] italic leading-relaxed tracking-tight md:text-base">
                        &ldquo;{exp.quote}&rdquo;
                      </blockquote>
                      {exp.url ? (
                        <a
                          href={exp.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-saffron transition-colors"
                        >
                          {exp.source} <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                        </a>
                      ) : (
                        <span className="mt-4 block text-sm font-medium text-muted-foreground">{exp.source}</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </ShowMore>
          </Reveal>
        </section>

        {/* FAQ */}
        <section id="ch-faq" className="scroll-mt-32 pt-12 md:pt-16">
          <Reveal>
            <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">FAQ</h2>
            <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
              The questions students actually ask — answered honestly.
            </p>
            <ShowMore count={career.faq.length} initial={5} label="questions">
              {(n) => (
                <div className="mt-7 space-y-3">
                  {career.faq.slice(0, n).map((f) => (
                    <details key={f.question} className="group rounded-2xl border border-border bg-card transition-colors open:border-saffron/40">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5">
                        <span className="font-display text-base font-bold tracking-tight">{f.question}</span>
                        <ChevronDown className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" aria-hidden="true" />
                      </summary>
                      <p className="px-5 pb-6 text-[15px] leading-relaxed text-foreground/85">{f.answer}</p>
                    </details>
                  ))}
                </div>
              )}
            </ShowMore>
          </Reveal>
        </section>

        {/* Sources */}
        <section className="scroll-mt-32 pt-12 md:pt-16">
          <Reveal>
            <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">Where the numbers come from</h2>
            <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
              Every figure on this page traces back to a published report, an official body, or a real
              graduate&rsquo;s account. Community quotes link to the original threads.
            </p>
            <ul className="mt-7 space-y-2.5">
              {career.sources.map((s) => (
                <li key={s.label} className="rounded-xl border border-border bg-card px-4 py-3">
                  {s.url ? (
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-1.5 text-sm font-medium text-foreground/90 transition-colors hover:text-saffron"
                    >
                      <span className="flex-1">{s.label}</span>
                      <ArrowUpRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
                    </a>
                  ) : (
                    <span className="text-sm text-foreground/70">{s.label}</span>
                  )}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-muted-foreground">
              Data checked {career.lastVerified}. Figures are approximations from the sources above — treat
              them as signal, not gospel.
            </p>
          </Reveal>
        </section>

        {/* Related */}
        <div className="pt-14 pb-24">
          <Reveal>
            <SectionLabel>Related careers</SectionLabel>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {related.map((c) => (
                <motion.button
                  key={c.id}
                  whileHover={{ y: -2 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  onClick={() => navigate(`/careers/${c.id}`)}
                  className="group flex items-center justify-between gap-3 rounded-2xl border border-border bg-card p-5 text-left transition-colors hover:border-saffron/40"
                >
                  <div>
                    <div className="font-display text-lg font-bold tracking-tight">{c.name}</div>
                    <div className="mt-1 text-xs text-muted-foreground line-clamp-1">{c.tagline}</div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-saffron" aria-hidden="true" />
                </motion.button>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button variant="outline" onClick={() => navigate("/careers")}>
                <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" /> All careers
              </Button>
              <Button variant={saved ? "outline" : "default"} onClick={() => toggleSaved(career.id)}>
                {saved ? <BookmarkCheck className="mr-2 h-4 w-4" aria-hidden="true" /> : <Bookmark className="mr-2 h-4 w-4" aria-hidden="true" />}
                {saved ? "Saved" : "Save for later"}
              </Button>
              <Button variant="outline" onClick={() => navigate(`/careers/${career.id}/report`)}>
                <FileDown className="mr-2 h-4 w-4" aria-hidden="true" /> Download report
              </Button>
              <Button onClick={() => navigate(`/compare?a=${career.id}&b=`)}>
                <Scale className="mr-2 h-4 w-4" aria-hidden="true" /> Compare this career
              </Button>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.05}>
          <div className="mt-8 pb-24">
            <FeedbackWidget careerId={career.id} careerName={career.name} />
          </div>
        </Reveal>
      </div>

      <ShareDialog open={shareOpen} onOpenChange={setShareOpen} career={career} />
    </div>
  );
}
