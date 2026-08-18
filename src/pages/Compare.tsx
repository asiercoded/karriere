import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight, Check, RefreshCw, Scale, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/Chip";
import { SiteHeader } from "@/components/SiteHeader";
import {
  categoryLabel,
  formatLakhs,
  getMid,
  metricMeta,
  pickWinner,
  verdictNarrative,
  type CareerProfile,
} from "@/lib/career-data";
import { useCareers } from "@/lib/career-loader";
import { useAnalytics } from "@/lib/analytics";
import { VS_PAIRS } from "@/lib/vs-pairs";
import { cn } from "@/lib/utils";

function BetterTag() {
  return (
    <span className="mr-2 inline-flex items-center gap-1 rounded-full border border-saffron/40 bg-saffron-dim px-2 py-0.5 align-middle text-[10px] font-bold uppercase tracking-wider text-saffron">
      <Check className="h-2.5 w-2.5" aria-hidden="true" /> better
    </span>
  );
}

function MiniBar({ value, tone }: { value: number; tone: "good" | "bad" }) {
  return (
    <span className="inline-flex items-center gap-2 align-middle">
      <span className="font-mono text-sm font-semibold tabular-nums">{value}/5</span>
      <span className="inline-block h-1.5 w-16 overflow-hidden rounded-full bg-border">
        <span className={cn("block h-full rounded-full", tone === "good" ? "bg-good" : "bg-bad")} style={{ width: `${(value / 5) * 100}%` }} />
      </span>
    </span>
  );
}

function Row({
  label,
  a,
  b,
  winner,
  aSub,
  bSub,
}: {
  label: string;
  a: React.ReactNode;
  b: React.ReactNode;
  winner: "a" | "b" | null;
  aSub?: React.ReactNode;
  bSub?: React.ReactNode;
}) {
  // Mobile: label spans the full width as a header row, then A | B sit side by
  // side in two columns. Desktop: the classic label | A | B grid. One markup,
  // pure CSS — halves the vertical scroll of the old stacked layout on phones.
  return (
    <div className="grid grid-cols-2 md:grid-cols-[170px_1fr_1fr]">
      <div className="col-span-2 flex items-center border-b border-border px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-muted-foreground md:col-span-1 md:border-b-0 md:border-r md:py-3.5">
        {label}
      </div>
      <div className={cn("border-r border-border px-4 py-3.5 text-sm", winner === "b" && "text-muted-foreground")}>
        {winner === "a" && <BetterTag />}
        <span className="inline align-middle">{a}</span>
        {aSub && <div className="mt-1 text-xs text-muted-foreground">{aSub}</div>}
      </div>
      <div className={cn("px-4 py-3.5 text-sm", winner === "a" && "text-muted-foreground")}>
        {winner === "b" && <BetterTag />}
        <span className="inline align-middle">{b}</span>
        {bSub && <div className="mt-1 text-xs text-muted-foreground">{bSub}</div>}
      </div>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <h2 className="mb-4 font-display text-lg font-bold tracking-tight">{title}</h2>
      <div className="divide-y divide-border rounded-2xl border border-border bg-card">
        {children}
      </div>
    </div>
  );
}

function NarrativeColumns({
  title,
  itemsA,
  itemsB,
  nameA,
  nameB,
}: {
  title: string;
  itemsA: string[];
  itemsB: string[];
  nameA: string;
  nameB: string;
}) {
  return (
    <div className="mb-10">
      <h2 className="mb-4 font-display text-lg font-bold tracking-tight">{title}</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {[
          { name: nameA, items: itemsA },
          { name: nameB, items: itemsB },
        ].map((col) => (
          <div key={col.name} className="rounded-2xl border border-border bg-card p-6">
            <div className="font-display text-base font-bold tracking-tight">{col.name}</div>
            <ul className="mt-3 space-y-3">
              {col.items.slice(0, 4).map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-relaxed text-foreground/85">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-saffron" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Slot picker ── */

function SlotPicker({
  label,
  value,
  onChange,
  exclude,
  careers,
}: {
  label: string;
  value: string;
  onChange: (id: string) => void;
  exclude: string;
  careers: CareerProfile[];
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [focusIndex, setFocusIndex] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const baseId = useId();
  const listId = `slot-list-${baseId}`;
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const selected = careers.find((c) => c.id === value);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const options = useMemo(() => {
    const q = query.trim().toLowerCase();
    return careers.filter((c) => c.id !== exclude && (!q || c.name.toLowerCase().includes(q) || c.category.includes(q)));
  }, [query, exclude, careers]);

  // Roving focus: the list re-opens or re-filters, the tab stop resets to the top.
  useEffect(() => {
    if (!open) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFocusIndex(0);
  }, [open, query]);

  const moveFocus = (index: number) => {
    if (!options.length) return;
    const clamped = Math.min(Math.max(index, 0), options.length - 1);
    setFocusIndex(clamped);
    optionRefs.current[clamped]?.focus();
  };

  return (
    <div
      ref={ref}
      onKeyDown={(e) => {
        if (e.key === "Escape") setOpen(false);
      }}
      className="relative flex-1"
    >
      <div className="mb-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">{label}</div>
      <button
        onClick={() => setOpen(true)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        className={cn(
          "w-full rounded-2xl border bg-card p-5 text-left transition-colors",
          selected ? "border-saffron/50" : "border-border hover:border-saffron/40",
        )}
      >
        {selected ? (
          <>
            <span className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              {categoryLabel(selected.category)}
            </span>
            <span className="mt-0.5 block font-display text-2xl font-bold tracking-tight">{selected.name}</span>
          </>
        ) : (
          <span className="font-display text-xl font-bold tracking-tight text-muted-foreground">Pick a career…</span>
        )}
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-2xl border border-border bg-popover shadow-xl">
          <div className="relative border-b border-border p-3">
            <Search className="absolute left-6 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  moveFocus(0);
                }
              }}
              placeholder="Search…"
              aria-label={`Search ${label}`}
              className="w-full rounded-lg bg-transparent py-2 pl-9 pr-3 text-sm focus:outline-none"
            />
          </div>
          <div
            id={listId}
            role="listbox"
            aria-label={`${label} careers`}
            className="max-h-72 divide-y divide-border overflow-y-auto"
            onKeyDown={(e) => {
              const current = Math.min(focusIndex, Math.max(options.length - 1, 0));
              switch (e.key) {
                case "ArrowDown":
                  e.preventDefault();
                  moveFocus(current + 1);
                  break;
                case "ArrowUp":
                  e.preventDefault();
                  moveFocus(current - 1);
                  break;
                case "Home":
                  e.preventDefault();
                  moveFocus(0);
                  break;
                case "End":
                  e.preventDefault();
                  moveFocus(options.length - 1);
                  break;
              }
            }}
          >
            {options.map((c, i) => (
              <button
                key={c.id}
                ref={(el) => {
                  optionRefs.current[i] = el;
                }}
                role="option"
                aria-selected={c.id === value}
                tabIndex={i === focusIndex ? 0 : -1}
                onFocus={() => setFocusIndex(i)}
                onClick={() => {
                  onChange(c.id);
                  setOpen(false);
                  setQuery("");
                }}
                className="w-full px-4 py-3 text-left transition-colors hover:bg-secondary/60"
              >
                <span className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{categoryLabel(c.category)}</span>
                <span className="font-display text-base font-bold tracking-tight">{c.name}</span>
              </button>
            ))}
            {!options.length && <p className="px-4 py-3 text-sm text-muted-foreground">No matches.</p>}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Compare view ── */

function CompareView({ a, b }: { a: CareerProfile; b: CareerProfile }) {
  const navigate = useNavigate();
  const track = useAnalytics();
  const verdict = useMemo(() => verdictNarrative(a, b), [a, b]);

  // Which pairs actually get compared — cheap signal for new VS pages.
  useEffect(() => {
    track("compare_view", { careerId: `${a.id}:${b.id}` });
  }, [a.id, b.id, track]);

  const glanceRows = [
    {
      label: "Duration",
      a: a.metrics.duration,
      b: b.metrics.duration,
      winner: pickWinner(a.durationParsed, b.durationParsed, "lower"),
      aSub: "degree length",
      bSub: "degree length",
    },
    {
      label: "Entry salary",
      a: formatLakhs(getMid(a.salaryParsed.entry)),
      b: formatLakhs(getMid(b.salaryParsed.entry)),
      winner: pickWinner(getMid(a.salaryParsed.entry), getMid(b.salaryParsed.entry), "higher"),
      aSub: "per year, day one",
      bSub: "per year, day one",
    },
    {
      label: "Stress",
      a: `${a.metrics.stress}/5`,
      b: `${b.metrics.stress}/5`,
      winner: pickWinner(a.metrics.stress, b.metrics.stress, "lower"),
      aSub: "lower is better",
      bSub: "lower is better",
    },
    {
      label: "Competition",
      a: `${a.metrics.competition}/5`,
      b: `${b.metrics.competition}/5`,
      winner: pickWinner(a.metrics.competition, b.metrics.competition, "lower"),
      aSub: "lower is better",
      bSub: "lower is better",
    },
  ];

  const snapshotRows = metricMeta.map((m) => ({
    label: m.label,
    a: <MiniBar value={a.metrics[m.key]} tone={m.goodWhen === "high" ? "good" : "bad"} />,
    b: <MiniBar value={b.metrics[m.key]} tone={m.goodWhen === "high" ? "good" : "bad"} />,
    winner: pickWinner(a.metrics[m.key], b.metrics[m.key], m.goodWhen === "high" ? "higher" : "lower") as "a" | "b" | null,
  }));

  const salaryStages = [
    { label: "Entry", key: "entry" as const },
    { label: "Mid", key: "mid" as const },
    { label: "Senior", key: "senior" as const },
  ];

  return (
    <div id="main" className="mx-auto max-w-4xl px-5 py-10 sm:px-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <button onClick={() => navigate("/compare")} className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Compare
        </button>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate(`/compare?a=${b.id}&b=${a.id}`)}>
            <RefreshCw className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" /> Swap
          </Button>
          <Button variant="ghost" size="sm" onClick={() => navigate("/compare")} className="text-muted-foreground">
            Change careers
          </Button>
        </div>
      </div>

      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Head to head</p>
      <div className="mb-10 grid gap-5 md:grid-cols-[1fr_auto_1fr] md:items-start">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Career A</div>
          <h1 className="mt-1 font-display text-4xl font-bold leading-none tracking-tight md:text-5xl">{a.name}</h1>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-foreground/80">{a.verdict}</p>
        </div>
        <div className="hidden pt-1 md:flex md:justify-center">
          <span className="shrink-0 self-start rounded-full bg-secondary px-3 py-1 font-mono text-xs font-bold text-muted-foreground">vs</span>
        </div>
        <div className="md:text-right">
          <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Career B</div>
          <h1 className="mt-1 font-display text-4xl font-bold leading-none tracking-tight text-saffron md:text-5xl">{b.name}</h1>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-foreground/80 md:ml-auto">{b.verdict}</p>
        </div>
      </div>

      {/* The honest read */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative mb-12 overflow-hidden rounded-3xl border border-saffron/30 bg-gradient-to-br from-saffron/15 via-card to-card p-7 md:p-9"
      >
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-saffron/20 blur-[70px]" aria-hidden="true" />
        <div className="relative">
          <div className="text-xs font-bold uppercase tracking-widest text-saffron">The honest read</div>
          <div className="mt-4 space-y-4">
            {verdict.map((sentence) => (
              <p key={sentence} className="font-display text-lg font-medium leading-snug tracking-tight md:text-xl">
                {sentence}
              </p>
            ))}
          </div>
        </div>
      </motion.div>

      {/* At a glance */}
      <Panel title="At a glance">
        {glanceRows.map((row) => <Row key={row.label} {...row} />)}
      </Panel>

      {/* Reality snapshot */}
      <Panel title="Reality snapshot">
        {snapshotRows.map((row) => <Row key={row.label} {...row} />)}
      </Panel>
      <p className="-mt-5 mb-10 text-xs text-muted-foreground">Scale: 1 = low, 5 = high. Directional read, not science.</p>

      {/* Salary progression */}
      <Panel title="Salary progression">
        {salaryStages.map((stage) => (
          <Row
            key={stage.key}
            label={stage.label}
            a={a.salary[stage.key]}
            b={b.salary[stage.key]}
            winner={pickWinner(getMid(a.salaryParsed[stage.key]), getMid(b.salaryParsed[stage.key]), "higher")}
          />
        ))}
      </Panel>

      {/* Narratives */}
      <NarrativeColumns title="What nobody tells you" itemsA={a.whatNobodyTellsYou} itemsB={b.whatNobodyTellsYou} nameA={a.name} nameB={b.name} />
      <NarrativeColumns title="Who thrives here" itemsA={a.whoThrives} itemsB={b.whoThrives} nameA={a.name} nameB={b.name} />
      <NarrativeColumns title="Who might struggle" itemsA={a.whoRegretsIt} itemsB={b.whoRegretsIt} nameA={a.name} nameB={b.name} />

      {/* Decision guide */}
      <div className="mb-12">
        <h2 className="mb-4 font-display text-lg font-bold tracking-tight">Your decision</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {[
            { name: a.name, verdict: a.verdict, choose: a.chooseIf, avoid: a.avoidIf },
            { name: b.name, verdict: b.verdict, choose: b.chooseIf, avoid: b.avoidIf },
          ].map((col) => (
            <div key={col.name} className="rounded-2xl border border-border bg-card p-6">
              <div className="font-display text-xl font-bold tracking-tight">{col.name}</div>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{col.verdict}</p>
              <div className="mt-4 text-xs font-bold uppercase tracking-widest text-good">Choose if…</div>
              <ul className="mt-2.5 space-y-2.5">
                {col.choose.map((c) => (
                  <li key={c} className="flex gap-3 text-sm leading-relaxed text-foreground/85">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-good" aria-hidden="true" />
                    {c}
                  </li>
                ))}
              </ul>
              <div className="mt-5 text-xs font-bold uppercase tracking-widest text-bad">Avoid if…</div>
              <ul className="mt-2.5 space-y-2.5">
                {col.avoid.map((c) => (
                  <li key={c} className="flex gap-3 text-sm leading-relaxed text-foreground/85">
                    <X className="mt-0.5 h-4 w-4 shrink-0 text-bad" aria-hidden="true" />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button variant="outline" onClick={() => navigate(`/careers/${a.id}`)}>
          {a.name} <ArrowUpRight className="ml-2 h-4 w-4" aria-hidden="true" />
        </Button>
        <Button variant="outline" onClick={() => navigate(`/careers/${b.id}`)}>
          {b.name} <ArrowUpRight className="ml-2 h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}

/* ── Page ── */

export default function Compare() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const idA = searchParams.get("a") ?? "";
  const idB = searchParams.get("b") ?? "";
  const careers = useCareers();
  const careerA = careers?.find((c) => c.id === idA);
  const careerB = careers?.find((c) => c.id === idB);

  if (careers === null) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <SiteHeader />
        <div id="main" className="mx-auto max-w-3xl px-5 py-12 sm:px-6 md:py-16">
          <div className="h-6 w-24 animate-pulse rounded bg-secondary" />
          <div className="mt-6 h-12 w-2/3 animate-pulse rounded bg-secondary" />
          <div className="mt-4 h-4 w-full max-w-xl animate-pulse rounded bg-secondary" />
          <div className="mt-10 grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-end">
            <div className="h-36 animate-pulse rounded-2xl bg-secondary" />
            <div className="hidden md:block" />
            <div className="h-36 animate-pulse rounded-2xl bg-secondary" />
          </div>
        </div>
      </div>
    );
  }

  if (careerA && careerB && idA !== idB) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <SiteHeader />
        <CompareView a={careerA} b={careerB} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <div id="main" className="mx-auto max-w-3xl px-5 py-12 sm:px-6 md:py-16">
        <Chip tone="saffron">Compare</Chip>
        <h1 className="mt-5 font-display text-4xl font-bold leading-[1.03] tracking-tight text-balance md:text-5xl">
          Two careers, side by side.
        </h1>
        <p className="mt-4 max-w-xl text-muted-foreground leading-relaxed">
          The metric that wins is the one that matters to you — we&rsquo;ll show both, honestly.
        </p>

        <div className="mt-10 flex flex-col gap-4 md:flex-row md:items-end md:gap-6">
          <SlotPicker label="Career A" value={idA} exclude={idB} careers={careers} onChange={(id) => navigate(`/compare?a=${id}&b=${idB}`)} />
          <div className="hidden shrink-0 pb-4 font-mono text-sm font-bold text-muted-foreground md:block">vs</div>
          <SlotPicker label="Career B" value={idB} exclude={idA} careers={careers} onChange={(id) => navigate(`/compare?a=${idA}&b=${id}`)} />
        </div>

        <div className="mt-8 flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
          <Scale className="h-4 w-4 shrink-0 text-saffron" aria-hidden="true" />
          <p className="text-sm text-muted-foreground">
            Tip: the &ldquo;Compare&rdquo; button on any career page pre-fills the first slot.
          </p>
        </div>

        <div className="mt-10">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Popular comparisons</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {VS_PAIRS.map((p) => (
              <button
                key={p.slug}
                onClick={() => navigate(`/vs/${p.slug}`)}
                className="rounded-full border border-border bg-card px-3.5 py-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:border-saffron/40 hover:text-foreground"
              >
                {p.nameA} vs {p.nameB}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
