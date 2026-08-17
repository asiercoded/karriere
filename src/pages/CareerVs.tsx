import { useMemo } from "react";
import { useNavigate, useParams } from "react-router";
import { motion } from "framer-motion";
import { ArrowUpRight, BadgeCheck, Check, MessageCircle, Scale, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/Chip";
import { SiteHeader } from "@/components/SiteHeader";
import { Skeleton } from "@/components/ui/skeleton";
import {
  formatLakhs,
  getMid,
  metricMeta,
  pickWinner,
  verdictNarrative,
  type MetricNumberKey,
} from "@/lib/career-data";
import { useCareers } from "@/lib/career-loader";
import { getVsPair, otherPairs } from "@/lib/vs-pairs";
import { useJsonLd, usePageMeta, whatsappShare } from "@/lib/meta";
import { cn } from "@/lib/utils";

function Row({
  label,
  valA,
  valB,
  winner,
  aName,
}: {
  label: string;
  valA: string;
  valB: string;
  winner: "a" | "b" | null;
  aName: string;
}) {
  const cells = [
    { value: valA, best: winner === "a" },
    { value: valB, best: winner === "b" },
  ];
  return (
    <div className="grid grid-cols-[1.3fr_1fr_1fr] items-center gap-3 border-b border-border/70 py-3 last:border-0">
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
      {cells.map((c, i) => (
        <span
          key={i}
          className={cn(
            "text-sm font-semibold tabular-nums",
            c.best ? "text-saffron" : "text-foreground/80",
          )}
        >
          {c.best && <Check className="mr-1 inline h-3.5 w-3.5 -translate-y-px" aria-hidden="true" />}
          {c.value}
          {c.best && <span className="sr-only"> — better for this metric ({i === 0 ? aName : "the other"})</span>}
        </span>
      ))}
    </div>
  );
}

function FaqCard({ q, a }: { q: string; a: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <p className="font-display text-base font-bold tracking-tight">{q}</p>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{a}</p>
    </div>
  );
}

export default function CareerVs() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const careers = useCareers();
  const pair = slug ? getVsPair(slug) : undefined;

  const careerA = useMemo(
    () => (careers ? careers.find((c) => c.id === pair?.a) ?? null : null),
    [careers, pair],
  );
  const careerB = useMemo(
    () => (careers ? careers.find((c) => c.id === pair?.b) ?? null : null),
    [careers, pair],
  );

  const title = pair ? `${pair.title} · Karriere` : "Compare two careers · Karriere";
  const description = pair
    ? `${pair.intro} Entry pay, senior ceiling, stress and job availability — side by side, from sourced data.`
    : "Honest, data-backed career comparisons for Indian students.";
  usePageMeta(title, description);

  const jsonLd = useMemo(() => {
    if (!pair) return null;
    const origin = window.location.origin;
    return [
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: pair.faq.map((f) => ({
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
          { "@type": "ListItem", position: 3, name: pair.title, item: `${origin}/vs/${pair.slug}` },
        ],
      },
    ];
  }, [pair]);
  useJsonLd(jsonLd);

  if (careers === null) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <SiteHeader />
        <div id="main" className="mx-auto max-w-3xl px-5 py-12 sm:px-6 md:py-16">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="mt-6 h-12 w-2/3 max-w-lg" />
          <Skeleton className="mt-4 h-4 w-full max-w-xl" />
          <Skeleton className="mt-10 h-64 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  // Unknown pair → the explorer is a better dead-end than a 404.
  if (!pair || !careerA || !careerB) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <SiteHeader />
        <div id="main" className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-6 py-24 text-center">
          <p className="font-display text-2xl font-bold">That comparison doesn’t exist yet.</p>
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
            Try one of the comparisons below, or open the full compare tool.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button onClick={() => navigate("/compare")} className="rounded-full px-6">
              <Scale className="mr-2 h-4 w-4" aria-hidden="true" /> Open compare
            </Button>
            <Button variant="outline" onClick={() => navigate("/careers")} className="rounded-full px-6">
              Browse careers
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const narrative = verdictNarrative(careerA, careerB);
  const shareText = `${pair.title} — the honest numbers: entry pay, ceiling, stress. ${window.location.origin}/vs/${pair.slug}`;

  const rows: { label: string; valA: string; valB: string; winner: "a" | "b" | null }[] = [
    {
      label: "Entry pay",
      valA: formatLakhs(getMid(careerA.salaryParsed.entry)),
      valB: formatLakhs(getMid(careerB.salaryParsed.entry)),
      winner: pickWinner(getMid(careerA.salaryParsed.entry), getMid(careerB.salaryParsed.entry), "higher"),
    },
    {
      label: "Senior ceiling",
      valA: formatLakhs(getMid(careerA.salaryParsed.senior)),
      valB: formatLakhs(getMid(careerB.salaryParsed.senior)),
      winner: pickWinner(getMid(careerA.salaryParsed.senior), getMid(careerB.salaryParsed.senior), "higher"),
    },
    {
      label: "Years of study",
      valA: `${careerA.durationParsed} yrs`,
      valB: `${careerB.durationParsed} yrs`,
      winner: pickWinner(careerA.durationParsed, careerB.durationParsed, "lower"),
    },
    ...metricMeta.map((m) => {
      const key = m.key as MetricNumberKey;
      return {
        label: m.label,
        valA: `${careerA.metrics[key]}/5`,
        valB: `${careerB.metrics[key]}/5`,
        winner: pickWinner(careerA.metrics[key], careerB.metrics[key], m.goodWhen === "high" ? "higher" : "lower"),
      };
    }),
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <div id="main" className="mx-auto max-w-3xl px-5 py-12 sm:px-6 md:py-16">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Chip tone="saffron">Compare · honest data</Chip>
          <h1 className="mt-5 font-display text-4xl font-bold leading-[1.03] tracking-tight text-balance md:text-5xl">
            {pair.title}
          </h1>
          <p className="mt-4 max-w-xl leading-relaxed text-muted-foreground">{pair.intro}</p>
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <Chip tone="card">
              <span className="inline-flex items-center gap-1.5">
                <BadgeCheck className="h-3.5 w-3.5 text-good" aria-hidden="true" />
                Facts verified · {careerA.lastVerified}
              </span>
            </Chip>
            <Button
              size="sm"
              variant="outline"
              className="rounded-full"
              onClick={() => navigate(`/compare?a=${careerA.id}&b=${careerB.id}`)}
            >
              <Scale className="mr-1.5 h-4 w-4" aria-hidden="true" /> Open full compare
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="rounded-full"
              onClick={() => window.open(whatsappShare(shareText), "_blank", "noopener,noreferrer")}
            >
              <MessageCircle className="mr-1.5 h-4 w-4" aria-hidden="true" /> Share
            </Button>
          </div>
        </motion.div>

        {/* Side-by-side table */}
        <section className="mt-10 rounded-2xl border border-border bg-card p-6">
          <div className="grid grid-cols-[1.3fr_1fr_1fr] items-center gap-3 border-b border-border pb-4">
            <span className="sr-only">Metric</span>
            <button
              onClick={() => navigate(`/careers/${careerA.id}`)}
              className="text-left font-display text-lg font-bold tracking-tight hover:text-saffron transition-colors"
            >
              {careerA.name} <ArrowUpRight className="inline h-4 w-4" aria-hidden="true" />
            </button>
            <button
              onClick={() => navigate(`/careers/${careerB.id}`)}
              className="text-left font-display text-lg font-bold tracking-tight hover:text-saffron transition-colors"
            >
              {careerB.name} <ArrowUpRight className="inline h-4 w-4" aria-hidden="true" />
            </button>
          </div>
          {rows.map((r) => (
            <Row key={r.label} label={r.label} valA={r.valA} valB={r.valB} winner={r.winner} aName={careerA.name} />
          ))}
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
            Saffron marks the better value for that metric. “Better” depends on what your family is
            optimizing for — money, time, or a calmer life. The full pages show the sources behind every figure.
          </p>
        </section>

        {/* Narrative */}
        <section className="mt-10 rounded-2xl border border-border bg-card p-6 md:p-8">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">The honest read</p>
          <ul className="mt-4 space-y-3">
            {narrative.map((s, i) => (
              <li key={i} className="flex items-start gap-2.5 text-[15px] leading-relaxed text-foreground/90">
                <span className="mt-[7px] size-1.5 shrink-0 rounded-full bg-saffron" aria-hidden="true" />
                {s}
              </li>
            ))}
          </ul>
        </section>

        {/* FAQ */}
        <section className="mt-12">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-display text-2xl font-bold tracking-tight">Common questions</h2>
            <span className="h-px min-w-4 flex-1 bg-border" aria-hidden="true" />
          </div>
          <div className="mt-5 space-y-3">
            {pair.faq.map((f) => (
              <FaqCard key={f.question} q={f.question} a={f.answer} />
            ))}
          </div>
        </section>

        {/* More comparisons */}
        <section className="mt-12">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-display text-2xl font-bold tracking-tight">More comparisons</h2>
            <span className="h-px min-w-4 flex-1 bg-border" aria-hidden="true" />
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {otherPairs(pair.slug).map((p) => (
              <button
                key={p.slug}
                onClick={() => navigate(`/vs/${p.slug}`)}
                className="group flex items-center justify-between gap-3 rounded-2xl border border-border bg-card p-5 text-left transition-colors hover:border-saffron/40"
              >
                <span>
                  <span className="block font-display text-base font-bold tracking-tight group-hover:text-saffron transition-colors">
                    {p.title}
                  </span>
                  <span className="mt-1 block text-xs text-muted-foreground">{p.intro.slice(0, 90)}…</span>
                </span>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-saffron" aria-hidden="true" />
              </button>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mt-12 rounded-3xl border border-border bg-card p-8 text-center">
          <Search className="mx-auto h-6 w-6 text-saffron" aria-hidden="true" />
          <p className="mt-4 font-display text-2xl font-bold tracking-tight">Not down to two yet?</p>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
            Take the 5-minute match and let the honest data point you to the careers worth opening first.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button onClick={() => navigate("/quiz")} className="rounded-full px-6">
              Take the match
            </Button>
            <Button variant="outline" onClick={() => navigate("/careers")} className="rounded-full px-6">
              Browse all careers
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
