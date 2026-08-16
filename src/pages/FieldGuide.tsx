import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { ArrowRight, BookOpenText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/Chip";
import { SiteHeader } from "@/components/SiteHeader";

const terms = [
  {
    term: "LPA",
    definition:
      "Lakhs per annum — the standard unit for Indian salaries in this guide. ₹10 LPA means ₹10 lakh a year, before tax.",
  },
  {
    term: "Entry · Mid · Senior",
    definition:
      "Earnings at the start, roughly 5–10 years in, and at the 10–15 year mark. The trajectory matters more than any single number.",
  },
  {
    term: "Entrance exam",
    definition:
      "The gatekeeping exam for a field — NEET, JEE, CLAT, CA Foundation, NID, CAT. The competition rating on each profile refers to these.",
  },
  {
    term: "AIR",
    definition: "All India Rank — how India's competitive exams rank you nationally. Chasing it is optional; most students won't get one.",
  },
  {
    term: "Articleship",
    definition:
      "The compulsory practical-training period in CA and some professional courses — full-time work for a stipend that is often near-zero.",
  },
  {
    term: "Dummy articleship",
    definition:
      "Registering for articleship without actually working, to buy study time. Most working CAs call it the biggest trap in the course.",
  },
  {
    term: "Residency",
    definition:
      "The post-MBBS training period (MD/MS) where doctors work long, irregular hours for a stipend. The years the 'doctor earns lakhs' image forgets.",
  },
  {
    term: "USMLE / PLAB",
    definition:
      "The licensing exams to practise in the US and UK — the 'going abroad' route for doctors. Tough, expensive, and not a given.",
  },
  {
    term: "Likelihood",
    definition:
      "Our editorial estimate of how common a career path is among graduates: Most graduates / Common / Some / Few. A direction, not a statistic.",
  },
  {
    term: "Placement brochure",
    definition:
      "The thing we refuse to be. Toppers' packages presented as everyone's starting salary, with the averages and the attempts left out.",
  },
];

const readingOrder = [
  {
    no: "01",
    title: "Start with the facts",
    body: "The quick-facts chips on top of each career — duration, entry pay, stress, work-life, competition — are the 30-second version.",
  },
  {
    no: "02",
    title: "Read the realities before the upside",
    body: "'What nobody tells you' and 'who might regret this' come before the good parts. If they scare you, that's the point.",
  },
  {
    no: "03",
    title: "Metrics are a scale, not science",
    body: "Fixed legend: 1 = low, 5 = high. Each metric has a direction — for stress and study difficulty, lower is better; for salary and work-life, higher. A 4/5 in one field means a different week than a 4/5 in another — read the realities for what each one means.",
  },
  {
    no: "04",
    title: "Salary is a trajectory",
    body: "Entry → mid → senior. Judge by the shape, not the day-one number: some paths pay early and plateau, others starve first and soar later.",
  },
  {
    no: "05",
    title: "Likelihoods tell you where people end up",
    body: "'Most graduates' is the realistic default. 'Few' is the dream route with the highest gate — treat it as a plan B, not a plan.",
  },
  {
    no: "06",
    title: "Read several reviews",
    body: "Every quote is one person's experience, linked to its source. No single one is a trend — the spread is the signal.",
  },
];

function Reveal({ delay = 0, children }: { delay?: number; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay }}
    >
      {children}
    </motion.div>
  );
}

export default function FieldGuide() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <div id="main" className="mx-auto max-w-3xl px-5 py-12 sm:px-6 md:py-16">
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Chip tone="saffron">Field guide</Chip>
          <h1 className="mt-5 font-display text-4xl font-bold leading-[1.03] tracking-tight text-balance md:text-5xl">
            The words, and the scale.
          </h1>
          <p className="mt-4 max-w-xl text-muted-foreground leading-relaxed">
            Everything on this site uses a small vocabulary. Learn it once, and every career opens
            clean — LPA, articleship, likelihood, and how to read a 5-point metric.
          </p>
        </motion.div>

        {/* Terms */}
        <section className="mt-12">
          <h2 className="mb-5 font-display text-xl font-bold tracking-tight">Words you&rsquo;ll meet</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {terms.map((t, i) => (
              <Reveal key={t.term} delay={Math.min(i * 0.03, 0.2)}>
                <div className="h-full rounded-2xl border border-border bg-card p-5">
                  <Chip tone="saffron">{t.term}</Chip>
                  <p className="mt-3 text-sm leading-relaxed text-foreground/85">{t.definition}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Reading order */}
        <section className="mt-14">
          <h2 className="mb-5 font-display text-xl font-bold tracking-tight">How to read a career</h2>
          <div className="space-y-3">
            {readingOrder.map((step, i) => (
              <Reveal key={step.no} delay={Math.min(i * 0.03, 0.2)}>
                <div className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5">
                  <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-saffron-dim font-mono text-xs font-bold text-saffron">
                    {step.no}
                  </span>
                  <div>
                    <h3 className="font-display text-base font-bold tracking-tight">{step.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Methodology */}
        <section className="mt-14">
          <Reveal>
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-center gap-2.5">
                <BookOpenText className="h-5 w-5 text-saffron" aria-hidden="true" />
                <h2 className="font-display text-xl font-bold tracking-tight">Where the numbers come from</h2>
              </div>
              <div className="mt-4 space-y-4 text-sm leading-relaxed text-foreground/85">
                <p>
                  Every salary range, timeline, and likelihood on a career page is an editorial estimate built from
                  graduates&rsquo; accounts, working-professional threads, and public salary discussions — not a
                  company&rsquo;s placement brochure and not a statistician&rsquo;s dataset.
                </p>
                <p>
                  Quotes are verbatim and linked to their sources. Ranges are deliberately wide because real
                  earnings vary by city, college, and attempt history. Treat the numbers as directions, and the
                  reviews as the ground truth.
                </p>
                <p className="font-semibold text-foreground">
                  Nothing on this site is sponsored. No institute pays to appear. No result is sold.
                </p>
              </div>
            </div>
          </Reveal>
        </section>

        <div className="mt-10">
          <Button onClick={() => navigate("/careers")}>
            Browse careers <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </div>
  );
}
