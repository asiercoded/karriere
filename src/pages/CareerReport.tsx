import { useMemo } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft, BadgeCheck, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/SiteHeader";
import { categoryLabel, formatLakhs, getMid, getSalaryContext, journeySummary, type CareerProfile } from "@/lib/career-data";
import { useCareers } from "@/lib/career-loader";
import { usePageMeta } from "@/lib/meta";
import { SITE_TITLE } from "@/lib/meta";

function ReportSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="border-b border-neutral-200 pb-2 font-display text-sm font-bold uppercase tracking-[0.14em] text-neutral-500">
        {title}
      </h2>
      {children}
    </section>
  );
}

function FactRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-neutral-100 py-1.5 last:border-0">
      <span className="text-[13px] text-neutral-500">{label}</span>
      <span className="text-right text-[13px] font-semibold text-neutral-900">{value}</span>
    </div>
  );
}

function Road({ career }: { career: CareerProfile }) {
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
    <div className="mt-5">
      {stops.map((stop, i) => (
        <div key={stop.label} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className="mt-1 size-2.5 rounded-full border-2 border-neutral-400 bg-white" />
            {i < stops.length - 1 && <div className="my-1 w-px flex-1 bg-neutral-300" />}
          </div>
          <div className={`flex-1 ${i < stops.length - 1 ? "pb-6" : ""}`}>
            <div className="flex flex-wrap items-baseline gap-x-3">
              <span className="text-[14px] font-semibold text-neutral-900">{stop.label}</span>
              <span className="text-[11px] font-medium text-neutral-500">
                year {stop.year} · {stop.note}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function CareerReport() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const careers = useCareers();

  const career = useMemo(() => careers?.find((c) => c.id === id) ?? null, [careers, id]);

  usePageMeta(
    career ? `${career.name}: One-page reality check — Karriere` : SITE_TITLE,
    career ? career.verdict : "The unfiltered career file for Indian students.",
    true, // print artifact — keep it out of search results
  );

  if (careers === null) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <SiteHeader />
        <div id="main" className="mx-auto max-w-3xl px-6 py-16">
          <div className="h-6 w-40 animate-pulse rounded bg-secondary" />
          <div className="mt-8 h-10 w-2/3 animate-pulse rounded bg-secondary" />
          <div className="mt-4 h-4 w-full animate-pulse rounded bg-secondary" />
          <div className="mt-10 h-48 w-full animate-pulse rounded-2xl bg-secondary" />
        </div>
      </div>
    );
  }

  if (!career) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <SiteHeader />
        <div id="main" className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-6 py-24 text-center">
          <p className="font-display text-2xl font-bold">That report doesn&rsquo;t exist.</p>
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
            The link may be mistyped, or that career isn&rsquo;t in the file yet.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button onClick={() => navigate("/careers")}>
              <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" /> Back to careers
            </Button>
            <Button variant="outline" onClick={() => navigate("/quiz")}>
              Take the match
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const salaryCtx = getSalaryContext(career.salaryParsed.entry);
  const journey = journeySummary(career);
  const reportUrl = `${window.location.origin}/careers/${career.id}`;

  const quickFacts = [
    { label: "Duration", value: career.metrics.duration },
    { label: "Entry pay", value: `${formatLakhs(getMid(career.salaryParsed.entry))}/yr` },
    { label: "Stress", value: `${career.metrics.stress}/5` },
    { label: "Work-life", value: `${career.metrics.workLifeBalance}/5` },
    { label: "Competition", value: `${career.metrics.competition}/5` },
    { label: "Job availability", value: `${career.metrics.jobAvailability}/5` },
  ];

  return (
    <div className="min-h-screen bg-background print:bg-white">
      {/* Toolbar — hidden when printing */}
      <div className="print:hidden sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-5 py-3 sm:px-6">
          <Button variant="ghost" size="sm" onClick={() => navigate(`/careers/${career.id}`)}>
            <ArrowLeft className="mr-1.5 h-4 w-4" aria-hidden="true" /> Back to {career.name}
          </Button>
          <Button size="sm" onClick={() => window.print()}>
            <Download className="mr-1.5 h-4 w-4" aria-hidden="true" /> Download PDF
          </Button>
        </div>
      </div>

      {/* Report body — always light, prints on A4 */}
      <div className="mx-auto max-w-3xl px-5 py-10 sm:px-6 print:max-w-none print:px-0 print:py-0">
        <div className="bg-white text-neutral-900 print:shadow-none">
          {/* Header */}
          <header className="border-b-2 border-neutral-900 pb-5">
            <div className="flex items-baseline justify-between gap-4">
              <div>
                <p className="font-display text-lg font-bold tracking-tight">KARRIERE</p>
                <p className="text-[11px] text-neutral-500">The unfiltered career file</p>
              </div>
              <p className="flex items-center gap-1.5 text-[11px] font-semibold text-neutral-600">
                <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" /> Facts verified · {career.lastVerified}
              </p>
            </div>
            <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.14em] text-neutral-500">{categoryLabel(career.category)}</p>
            <h1 className="mt-1 font-display text-4xl font-bold leading-tight tracking-tight">{career.name}</h1>
            <p className="mt-2 max-w-xl text-[14px] leading-snug text-neutral-600">{career.tagline}</p>
            <div className="mt-5 rounded-xl border border-neutral-300 bg-[#fbf3e4] px-5 py-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-neutral-500">Bottom line</p>
              <p className="mt-1.5 text-[15px] font-semibold leading-snug">{career.verdict}</p>
            </div>
          </header>

          {/* Quick facts */}
          <ReportSection title="At a glance">
            <div className="mt-5 grid grid-cols-2 gap-x-8 sm:grid-cols-3">
              {quickFacts.map((f) => (
                <FactRow key={f.label} label={f.label} value={f.value} />
              ))}
            </div>
          </ReportSection>

          {/* Money */}
          <ReportSection title="The money">
            <div className="mt-5 space-y-1">
              <FactRow label="Entry" value={career.salary.entry} />
              <FactRow label="Mid-career" value={career.salary.mid} />
              <FactRow label="Senior" value={career.salary.senior} />
            </div>
            {salaryCtx && <p className="mt-4 text-[13px] leading-relaxed text-neutral-700">{salaryCtx}</p>}
            {journey && <p className="mt-1.5 text-[12px] leading-relaxed text-neutral-500">{journey}.</p>}
          </ReportSection>

          {/* Road */}
          <ReportSection title="The road">
            <Road career={career} />
          </ReportSection>

          {/* Fit */}
          <ReportSection title="Is this for you?">
            <div className="mt-5 grid grid-cols-2 gap-8">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-neutral-500">Choose this if…</p>
                <ul className="mt-3 space-y-2">
                  {career.chooseIf.slice(0, 3).map((c) => (
                    <li key={c} className="flex gap-2.5 text-[13px] leading-snug text-neutral-800">
                      <span className="mt-0.5 text-neutral-400" aria-hidden="true">✓</span>
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-neutral-500">Avoid if…</p>
                <ul className="mt-3 space-y-2">
                  {career.avoidIf.slice(0, 3).map((c) => (
                    <li key={c} className="flex gap-2.5 text-[13px] leading-snug text-neutral-800">
                      <span className="mt-0.5 text-neutral-400" aria-hidden="true">✕</span>
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </ReportSection>

          {/* Checklist */}
          <ReportSection title="Before you commit — a to-do list">
            <ul className="mt-5 space-y-2.5">
              {career.beforeYouCommit.map((c) => (
                <li key={c} className="flex gap-3 text-[13px] leading-snug text-neutral-800">
                  <span className="mt-0.5 inline-block size-3.5 shrink-0 rounded border border-neutral-400" aria-hidden="true" />
                  {c}
                </li>
              ))}
            </ul>
          </ReportSection>

          {/* Sources */}
          <ReportSection title="Where the numbers come from">
            <ul className="mt-4 space-y-1.5">
              {career.sources.map((s) => (
                <li key={s.label} className="flex items-baseline justify-between gap-4 text-[12px]">
                  <span className="text-neutral-800">{s.label}</span>
                  {s.url && <span className="truncate font-mono text-[10px] text-neutral-400">{new URL(s.url).hostname}</span>}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-[11px] leading-relaxed text-neutral-500">
              Figures are approximations from the sources above — treat them as signal, not gospel.
            </p>
          </ReportSection>

          {/* Footer */}
          <footer className="mt-10 border-t border-neutral-200 pt-4">
            <p className="text-center font-mono text-[11px] text-neutral-400">{reportUrl}</p>
            <p className="mt-1 text-center text-[11px] text-neutral-400">
              Karriere — the unfiltered career file for Indian students · Data checked {career.lastVerified}
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}
