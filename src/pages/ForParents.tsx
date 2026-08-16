import { useNavigate } from "react-router";
import { ArrowRight, BadgeCheck, Download, MessageCircle, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/Chip";
import { SiteHeader } from "@/components/SiteHeader";
import { usePageMeta } from "@/lib/meta";

/* ─────────────────────────────────────────────────────────────
   For parents — the decision happens at the dinner table.
   Plain-language page for the adults who read the numbers with
   their kid, plus a print-only A4 one-pager (window.print()) they
   can keep or share on WhatsApp.
   ───────────────────────────────────────────────────────────── */

const threeNumbers = [
  {
    title: "Entry pay",
    body: "What a fresher genuinely earns in year one — not the brochure’s ten-year figure. Most pages on this site show entry, mid, and senior pay side by side, so you can see the climb.",
  },
  {
    title: "Years to established",
    body: "Degree plus training plus the first real role. MBBS is honest about being 5+ years to a salary; BCA says 4. The timeline decides whether a path fits the family’s reality.",
  },
  {
    title: "The odds",
    body: "Competition and job availability are scored 1–5 on every page. Some careers are brutally competitive (UPSC, MBBS). Knowing the odds before the dream is not pessimism — it’s planning.",
  },
];

const doList = [
  "Ask what a normal day in that career looks like — and read the “What nobody tells you” section together.",
  "Share the real numbers: entry pay, years, odds. They make the same decision you would with the full picture.",
  "Let them change their mind. The 17-year-old who loves biology today may love design in November.",
  "Separate the decision from your expectations. Their path is not a report card for yours.",
];

const dontList = [
  "Don’t decide for them. The person who lives the career should pick it — even if they pick it imperfectly.",
  "Don’t say “you’ll figure it out.” Vague reassurance reads as pressure when the exams start.",
  "Don’t measure paths only by status or salary ceiling. A calm 4-year path often beats a prestigious 8-year one.",
  "Don’t treat a “no” to your suggestion as failure. It’s the first career decision they’re making themselves.",
];

const questions = [
  "What part of the day-to-day work actually sounds good to you?",
  "If money were equal across all these careers, which would you still choose?",
  "How do you feel about the timeline — waiting 5 years vs earning in 3?",
  "What’s the trade-off you’re not willing to make? (Stress? City? Gap years?)",
  "What would you do if the entrance exam didn’t go your way?",
];

const onePagerDos = [
  "Read entry pay, years to established, and the odds — the three numbers that matter.",
  "Ask what their day-to-day actually looks like in each path.",
  "Let them change their mind — more than once.",
  "Plan the backup before the exam, not after.",
];

const onePagerDonts = [
  "Don’t pick for them.",
  "Don’t compare them to cousins.",
  "Don’t measure every path by salary ceiling alone.",
  "Don’t treat a change of mind as failure.",
];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{children}</p>;
}

export default function ForParents() {
  const navigate = useNavigate();

  usePageMeta(
    "For parents — how to help without pressure · Karriere",
    "The career decision happens at your dinner table. How to read the honest numbers, ask the right questions, and help without pressure — plus a printable one-pager.",
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      {/* Screen view — hidden when printing */}
      <div className="print:hidden">
        <div id="main" className="mx-auto max-w-3xl px-5 py-12 sm:px-6 md:py-16">
          {/* Hero */}
          <Chip tone="saffron">For parents</Chip>
          <h1 className="mt-5 font-display text-4xl font-bold leading-[1.03] tracking-tight text-balance md:text-5xl">
            How to help them choose — without pressure.
          </h1>
          <p className="mt-5 max-w-xl leading-relaxed text-muted-foreground">
            The career decision doesn’t happen in a counselling room. It happens at your dinner
            table, in the weeks after boards. This page is the plain-language version of what
            Karriere does — the honest numbers, the questions worth asking, and what to do tonight.
          </p>

          {/* What this site is */}
          <section className="mt-14 border-t border-border pt-10">
            <SectionLabel>Start with what this is</SectionLabel>
            <p className="mt-4 text-[15px] leading-relaxed text-foreground/90">
              Karriere is a career file for Indian students — 30 real paths from MBBS to BA, written
              without brochures. Every salary, timeline, and quote on this site is sourced and dated,
              and the quotes come from people who actually lived the path. It is not a coaching
              institute, it sells nothing, and no career pays to be listed.
            </p>
          </section>

          {/* The three numbers */}
          <section className="mt-14 border-t border-border pt-10">
            <SectionLabel>The three numbers that matter</SectionLabel>
            <div className="mt-5 space-y-4">
              {threeNumbers.map((n) => (
                <div key={n.title} className="rounded-2xl border border-border bg-card p-6">
                  <p className="font-display text-lg font-bold tracking-tight">{n.title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{n.body}</p>
                </div>
              ))}
            </div>
            <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
              If a page doesn’t show one of these numbers, the site is telling you something. Every
              career profile carries a <span className="font-semibold text-foreground">“Facts verified”</span> stamp
              with the date it was checked.
            </p>
          </section>

          {/* How to help without pressure */}
          <section className="mt-14 border-t border-border pt-10">
            <SectionLabel>How to help without pressure</SectionLabel>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-border bg-card p-6">
                <p className="text-xs font-bold uppercase tracking-widest text-good">Do</p>
                <ul className="mt-4 space-y-3">
                  {doList.map((d) => (
                    <li key={d} className="flex gap-3 text-sm leading-relaxed text-foreground/90">
                      <span className="mt-[7px] size-1.5 shrink-0 rounded-full bg-good" aria-hidden="true" />
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-border bg-card p-6">
                <p className="text-xs font-bold uppercase tracking-widest text-bad">Don’t</p>
                <ul className="mt-4 space-y-3">
                  {dontList.map((d) => (
                    <li key={d} className="flex gap-3 text-sm leading-relaxed text-foreground/90">
                      <span className="mt-[7px] size-1.5 shrink-0 rounded-full bg-bad" aria-hidden="true" />
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Dinner-table questions */}
          <section className="mt-14 border-t border-border pt-10">
            <SectionLabel>Questions worth asking at dinner</SectionLabel>
            <ol className="mt-5 space-y-3">
              {questions.map((q, i) => (
                <li key={q} className="flex gap-4 rounded-2xl border border-border bg-card p-5">
                  <span className="grid size-7 shrink-0 place-items-center rounded-full bg-saffron-dim font-display text-sm font-bold text-saffron">
                    {i + 1}
                  </span>
                  <p className="pt-1 text-[15px] leading-relaxed text-foreground/90">{q}</p>
                </li>
              ))}
            </ol>
          </section>

          {/* What to do tonight */}
          <section className="mt-14 border-t border-border pt-10">
            <SectionLabel>What to do tonight</SectionLabel>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <button
                onClick={() => navigate("/quiz")}
                className="rounded-2xl border border-border bg-card p-5 text-left transition-colors hover:border-saffron/40"
              >
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Step 1</p>
                <p className="mt-2 font-display text-base font-bold tracking-tight">Take the 5-minute match</p>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">Together — it opens the conversation better than any lecture.</p>
              </button>
              <button
                onClick={() => navigate("/careers")}
                className="rounded-2xl border border-border bg-card p-5 text-left transition-colors hover:border-saffron/40"
              >
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Step 2</p>
                <p className="mt-2 font-display text-base font-bold tracking-tight">Open the top two careers</p>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">Compare entry pay, years, and the honest trade-offs side by side.</p>
              </button>
              <button
                onClick={() => navigate("/compare")}
                className="rounded-2xl border border-border bg-card p-5 text-left transition-colors hover:border-saffron/40"
              >
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Step 3</p>
                <p className="mt-2 font-display text-base font-bold tracking-tight">Print or share this page</p>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">The one-pager below — keep it on the fridge, send it in the family group.</p>
              </button>
            </div>
          </section>

          {/* Print CTA */}
          <div className="mt-14 flex flex-wrap items-center gap-3">
            <Button onClick={() => window.print()} className="rounded-full px-6">
              <Printer className="mr-2 h-4 w-4" aria-hidden="true" /> Print the one-pager
            </Button>
            <Button variant="outline" onClick={() => navigate("/careers")} className="rounded-full px-6">
              Browse all careers <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </div>

      {/* Print-only one-pager — A4, light, fits one page */}
      <div className="mx-auto hidden max-w-3xl px-5 py-10 sm:px-6 print:block print:max-w-none print:px-0 print:py-0">
        <div className="bg-white text-neutral-900">
          <header className="border-b-2 border-neutral-900 pb-4">
            <div className="flex items-baseline justify-between gap-4">
              <div>
                <p className="font-display text-lg font-bold tracking-tight">KARRIERE</p>
                <p className="text-[11px] text-neutral-500">The unfiltered career file · for parents</p>
              </div>
              <p className="flex items-center gap-1.5 text-[11px] font-semibold text-neutral-600">
                <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" /> Facts verified · August 2026
              </p>
            </div>
            <h1 className="mt-4 font-display text-2xl font-bold tracking-tight">
              Helping your child choose — without pressure
            </h1>
            <p className="mt-1.5 max-w-xl text-[13px] leading-snug text-neutral-600">
              The decision happens at your dinner table. Read these three numbers on any career page,
              ask these questions, and let them decide.
            </p>
          </header>

          <section className="mt-5">
            <h2 className="border-b border-neutral-300 pb-1.5 font-display text-[12px] font-bold uppercase tracking-[0.14em] text-neutral-500">
              The three numbers that matter
            </h2>
            <div className="mt-3 grid grid-cols-3 gap-3">
              {threeNumbers.map((n) => (
                <div key={n.title} className="rounded-lg border border-neutral-300 bg-[#fbf6ee] p-3">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-600">{n.title}</p>
                  <p className="mt-1 text-[11.5px] leading-snug text-neutral-700">{n.body}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-5">
            <h2 className="border-b border-neutral-300 pb-1.5 font-display text-[12px] font-bold uppercase tracking-[0.14em] text-neutral-500">
              Help without pressure
            </h2>
            <div className="mt-3 grid grid-cols-2 gap-4">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-600">Do</p>
                <ul className="mt-2 space-y-1.5">
                  {onePagerDos.map((d) => (
                    <li key={d} className="flex gap-2 text-[11.5px] leading-snug text-neutral-700">
                      <span className="mt-[5px] size-1 shrink-0 rounded-full bg-neutral-400" aria-hidden="true" />
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-600">Don’t</p>
                <ul className="mt-2 space-y-1.5">
                  {onePagerDonts.map((d) => (
                    <li key={d} className="flex gap-2 text-[11.5px] leading-snug text-neutral-700">
                      <span className="mt-[5px] size-1 shrink-0 rounded-full bg-neutral-400" aria-hidden="true" />
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section className="mt-5">
            <h2 className="border-b border-neutral-300 pb-1.5 font-display text-[12px] font-bold uppercase tracking-[0.14em] text-neutral-500">
              Dinner-table questions
            </h2>
            <ol className="mt-3 space-y-1.5">
              {questions.map((q, i) => (
                <li key={q} className="flex gap-2 text-[11.5px] leading-snug text-neutral-700">
                  <span className="font-bold text-neutral-500">{i + 1}.</span>
                  {q}
                </li>
              ))}
            </ol>
          </section>

          <footer className="mt-6 border-t border-neutral-300 pt-3 text-[10px] text-neutral-500">
            Every salary, timeline, and quote on karriere.freebuff.app is sourced and dated — no ads,
            no sponsors, no career paying to be listed. Start at the 5-minute match with your child.
          </footer>
        </div>
      </div>
    </div>
  );
}
