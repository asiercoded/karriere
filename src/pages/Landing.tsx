import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpenText,
  FolderOpen,
  Quote,
  Scale,
  Search,
  Shapes,
  ShieldCheck,
  Sparkles,
  Timer,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/Chip";
import { SiteHeader } from "@/components/SiteHeader";
import { Skeleton } from "@/components/ui/skeleton";
import {
  categories,
  categoryLabel,
  formatSalaryRange,
  searchCareers,
  type CareerProfile,
} from "@/lib/career-data";
import { useCareers } from "@/lib/career-loader";
import { useJsonLd } from "@/lib/meta";

const featuredIds = ["mbbs", "bds", "ca", "cs_engineering", "law", "design"];

function featuredCareers(careers: CareerProfile[]): CareerProfile[] {
  const byId = new Map(careers.map((c) => [c.id, c]));
  return featuredIds.map((id) => byId.get(id)).filter((c): c is CareerProfile => Boolean(c));
}

const earlyReaders = [
  {
    quote: "Itna accha to logon ke saalon se established websites nahi hote. It's so good.",
    label: "B.Sc student · saw Karriere 1.0",
  },
  {
    quote: "I am speechless. This will really help a lot of people out there.",
    label: "BDS student · saw Karriere 1.0",
  },
  {
    quote: "Just read this — so apt and to the point.",
    label: "MDS student",
  },
];

const startCards = [
  {
    icon: Sparkles,
    title: "Take the 5-min match",
    body: "A few honest questions about how you work and what you value. We point you to the careers worth opening first.",
    href: "/quiz",
    cta: "Start the match",
  },
  {
    icon: Scale,
    title: "Compare two careers",
    body: "Down to two paths? Put them side by side — entry pay, ceiling, stress, and the trade-off nobody phrases for you.",
    href: "/compare",
    cta: "Open compare",
  },
  {
    icon: BookOpenText,
    title: "Learn the lingo",
    body: "What's an articleship? What does LPA really mean? A two-minute primer before you dive into the dossiers.",
    href: "/field-guide",
    cta: "Open the guide",
  },
];

function Reveal({ delay = 0, children, className }: { delay?: number; children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function SectionHeading({ title, action }: { title: string; action?: { label: string; onClick: () => void } }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex min-w-0 items-center gap-3">
        <h2 className="shrink-0 font-display text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>
        <span className="h-px min-w-4 flex-1 bg-border" aria-hidden="true" />
      </div>
      {action && (
        <button
          onClick={action.onClick}
          className="shrink-0 text-sm font-semibold text-muted-foreground hover:text-saffron transition-colors"
        >
          {action.label} →
        </button>
      )}
    </div>
  );
}

export default function Landing() {
  const navigate = useNavigate();
  const careers = useCareers();
  const careersList = careers ?? [];
  const featured = useMemo(() => featuredCareers(careersList), [careersList]);
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const pullQuote = useMemo(() => careersList.find((c) => c.id === "mbbs")?.realExperiences[0] ?? null, [careersList]);
  
  const searchResults = useMemo(() => {
    if (!query.trim() || !careersList.length) return [];
    return searchCareers(careersList, query).slice(0, 5);
  }, [query, careersList]);

  // Site-level structured data for search engines.
  const siteSchema = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Karriere — The unfiltered career file",
      alternateName: "Karriere",
      url: window.location.origin,
      description:
        "Honest career guidance for Indian students. Real salaries, real timelines, real regrets — from people who lived each path.",
      inLanguage: "en-IN",
      publisher: {
        "@type": "Organization",
        name: "Karriere",
        url: window.location.origin,
        logo: `${window.location.origin}/logo.png`,
      },
    }),
    [],
  );
  useJsonLd(siteSchema);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      {/* Hero */}
      <section id="main" className="relative z-50">
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="absolute -top-40 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-saffron/15 blur-[120px]" />
        </div>
        <div className="relative mx-auto max-w-6xl px-5 pt-16 pb-14 text-center sm:px-6 md:pt-24 md:pb-16 z-50">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }} className="relative z-50">
            <Chip tone="saffron" className="mb-7">
              <span className="inline-flex size-1.5 rounded-full bg-saffron" aria-hidden="true" />
              The unfiltered career file
            </Chip>

            <h1 className="mx-auto max-w-3xl font-display text-5xl font-bold leading-[1.04] tracking-tight text-balance sm:text-6xl md:text-7xl">
              What <span className="text-saffron">nobody tells you</span> about a career.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              Forget the placement brochures. Karriere breaks down the actual entry barriers, the real
              money on day one, and the hidden struggles nobody mentions until you&rsquo;re three years
              into a degree.
            </p>

            {/* Search */}
            <form
              className="relative mx-auto mt-9 flex max-w-xl items-center gap-2 rounded-full border border-border bg-card py-2 pl-4 pr-2 shadow-sm focus-within:ring-2 focus-within:ring-saffron/20 transition-all"
              role="search"
              onSubmit={(e) => {
                e.preventDefault();
                navigate(query.trim() ? `/careers?q=${encodeURIComponent(query.trim())}` : "/careers");
              }}
              onFocus={() => setIsFocused(true)}
              onBlur={(e) => {
                // Delay hiding so clicks on the dropdown register before blur hides it
                setTimeout(() => setIsFocused(false), 200);
              }}
            >
              <Search className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Try &ldquo;MBBS&rdquo;, &ldquo;CA&rdquo;, &ldquo;stress-free&rdquo;…"
                aria-label="Search careers"
                className="h-9 min-w-0 flex-1 bg-transparent text-[15px] placeholder:text-muted-foreground/70 focus:outline-none"
              />
              <Button type="submit" size="sm" className="shrink-0 rounded-full px-4">
                Explore
              </Button>

              {isFocused && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 rounded-2xl border border-border bg-card p-2 shadow-xl z-50 text-left animate-in fade-in slide-in-from-top-2">
                  {searchResults.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => navigate(`/careers/${c.id}`)}
                      className="w-full flex items-center justify-between gap-3 rounded-xl px-4 py-3 hover:bg-secondary text-left transition-colors"
                    >
                      <div>
                        <div className="font-semibold text-[15px]">{c.name}</div>
                        <div className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{c.tagline}</div>
                      </div>
                      <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground opacity-50" />
                    </button>
                  ))}
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 rounded-xl px-4 py-3 mt-1 hover:bg-secondary text-sm font-semibold text-saffron transition-colors"
                  >
                    See all results <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </form>
          </motion.div>
        </div>
      </section>

      {/* Featured careers — the content, up front */}
      <section className="mx-auto max-w-6xl px-5 pb-14 sm:px-6 md:pb-16">
        <Reveal>
          <SectionHeading
            title="Start with a career"
            action={{ label: careers ? `All ${careersList.length}` : "All careers", onClick: () => navigate("/careers") }}
          />
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Real entry pay, real timelines, real regrets — tap a career to open its full dossier.
          </p>
        </Reveal>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {careers === null
            ? [0, 1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="rounded-2xl border border-border bg-card p-6">
                  <Skeleton className="h-5 w-20 rounded-full" />
                  <Skeleton className="mt-5 h-7 w-3/4" />
                  <Skeleton className="mt-3 h-4 w-full" />
                  <div className="mt-6 flex flex-wrap gap-2">
                    <Skeleton className="h-6 w-24 rounded-full" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </div>
                </div>
              ))
            : featured.map((career, i) => (
            <Reveal key={career.id} delay={i * 0.05}>
              <motion.button
                whileHover={{ y: -3 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                onClick={() => navigate(`/careers/${career.id}`)}
                className="group flex h-full w-full flex-col rounded-2xl border border-border bg-card p-6 text-left transition-colors hover:border-saffron/40"
              >
                <div className="flex items-start justify-between gap-3">
                  <Chip tone="saffron">{categoryLabel(career.category)}</Chip>
                  <ArrowUpRight
                    className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-saffron"
                    aria-hidden="true"
                  />
                </div>
                <h3 className="mt-4 font-display text-2xl font-bold tracking-tight group-hover:text-saffron transition-colors">
                  {career.name}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{career.tagline}</p>
                <div className="mt-5 flex flex-wrap gap-1.5">
                  <Chip>{formatSalaryRange(career.salaryParsed.entry)} entry</Chip>
                  <Chip>{career.metrics.duration}</Chip>
                  <Chip tone={career.metrics.stress <= 2 ? "good" : career.metrics.stress >= 4 ? "bad" : "default"}>
                    stress {career.metrics.stress}/5
                  </Chip>
                </div>
              </motion.button>
            </Reveal>
            ))}
        </div>
        <Reveal delay={0.2}>
          <div className="mt-10 flex justify-center">
            <Button variant="outline" size="lg" onClick={() => navigate("/careers")} className="rounded-full px-8">
              Show all {careers ? careersList.length : ""} careers
            </Button>
          </div>
        </Reveal>
      </section>

      {/* Where do I start — quiz / compare / guide */}
      <section className="border-y border-border/70 bg-card/40">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-6 md:py-16">
          <Reveal>
            <SectionHeading title="Not sure where to begin?" />
          </Reveal>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {startCards.map((card, i) => (
              <Reveal key={card.title} delay={i * 0.06}>
                <motion.button
                  whileHover={{ y: -3 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  onClick={() => navigate(card.href)}
                  className="group flex h-full w-full flex-col rounded-2xl border border-border bg-card p-6 text-left transition-colors hover:border-saffron/40"
                >
                  <span className="grid size-10 place-items-center rounded-xl bg-saffron-dim text-saffron">
                    <card.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 font-display text-xl font-bold tracking-tight">{card.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{card.body}</p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-saffron">
                    {card.cta}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  </span>
                </motion.button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Pull quote */}
      {pullQuote && (
        <section className="mx-auto max-w-6xl px-5 pt-14 sm:px-6 md:pt-16">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-8 md:p-12">
              <Quote className="absolute right-8 top-8 h-16 w-16 text-saffron/10" aria-hidden="true" />
              <blockquote className="relative max-w-3xl font-serif text-lg italic leading-snug tracking-tight md:text-xl">
                &ldquo;{pullQuote.quote.length > 260 ? pullQuote.quote.slice(0, 260) + "…" : pullQuote.quote}&rdquo;
              </blockquote>
              {pullQuote.url && (
                <a
                  href={pullQuote.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-saffron transition-colors"
                >
                  From {pullQuote.source} <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </a>
              )}
            </div>
          </Reveal>
        </section>
      )}

      {/* Categories — chips */}
      <section className="mx-auto max-w-6xl px-5 py-14 sm:px-6 md:py-16">
        <Reveal>
          <SectionHeading
            title="Browse by field"
            action={{ label: "Search all", onClick: () => navigate("/careers") }}
          />
          <div className="mt-7 flex flex-wrap gap-2">
            {categories.map((cat) => {
              const count = careers ? careersList.filter((c) => c.category === cat.id).length : null;
              return (
                <button
                  key={cat.id}
                  onClick={() => navigate(`/careers?cat=${cat.id}`)}
                  className="group flex items-center gap-2 rounded-full border border-border bg-card py-2 pl-4 pr-3 text-sm font-semibold transition-colors hover:border-saffron/40 hover:bg-saffron-dim"
                >
                  {cat.label}
                  <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-bold text-muted-foreground tabular-nums">
                    {count ?? "—"}
                  </span>
                </button>
              );
            })}
          </div>
        </Reveal>
      </section>

      {/* Stats */}
      <section className="mx-auto max-w-6xl px-5 pb-14 sm:px-6 md:pb-16">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            { icon: FolderOpen, value: careers ? `${careersList.length}` : "—", label: "career profiles" },
            { icon: Shapes, value: `${categories.length}`, label: "fields covered" },
            { icon: Timer, value: "5", label: "minute match" },
            { icon: ShieldCheck, value: "0", label: "ads & sponsors" },
          ].map((s, i) => (
            <Reveal key={s.label} delay={i * 0.05}>
              <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-6">
                <span className="grid size-9 place-items-center rounded-lg bg-saffron-dim text-saffron">
                  <s.icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <div className="mt-4 font-display text-4xl font-bold tracking-tight text-saffron tabular-nums">
                  {s.value}
                </div>
                <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* First reactions — real feedback, lightly trimmed for clarity */}
      <section className="mx-auto max-w-6xl px-5 pb-14 sm:px-6 md:pb-16">
        <Reveal>
          <SectionHeading title="First reactions" />
        </Reveal>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {earlyReaders.map((t, i) => (
            <Reveal key={t.label} delay={i * 0.06}>
              <figure className="flex h-full flex-col rounded-2xl border border-border bg-card p-6">
                <Quote className="h-6 w-6 text-saffron/50" aria-hidden="true" />
                <blockquote className="mt-4 flex-1 font-serif text-[15px] italic leading-relaxed tracking-tight">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-6 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                  {t.label}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-5 pb-20 sm:px-6 md:pb-28">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-saffron/30 bg-gradient-to-br from-saffron/20 via-card to-card px-8 py-14 text-center md:py-20">
            <div
              className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-saffron/25 blur-[90px]"
              aria-hidden="true"
            />
            <h2 className="relative mx-auto max-w-2xl font-display text-4xl font-bold leading-[1.05] tracking-tight text-balance md:text-5xl">
              Your future deserves clarity, not confusion.
            </h2>
            <p className="relative mx-auto mt-5 max-w-xl text-muted-foreground">
              Five minutes of honest questions. Zero coaching-institute pressure.
            </p>
            <div className="relative mt-9 flex flex-wrap items-center justify-center gap-3">
              <Button size="lg" onClick={() => navigate("/quiz")} className="rounded-full px-7">
                Take the match <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/careers")} className="rounded-full px-7">
                Browse careers
              </Button>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/70">
        <div className="mx-auto max-w-6xl px-5 py-12 sm:px-6">
          <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
            <div>
              <button
                onClick={() => navigate("/")}
                className="flex items-center gap-2.5 font-display text-base font-bold tracking-[0.12em]"
              >
                <img src="/logo.png" alt="Karriere logo" className="h-8 w-8" />
                KARRIERE
              </button>
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
                The unfiltered career file. Built for students who deserve the truth, not a brochure.
              </p>
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Explore</div>
              <ul className="mt-4 space-y-2.5 text-sm">
                <li><button onClick={() => navigate("/careers")} className="hover:text-saffron transition-colors">All careers</button></li>
                <li><button onClick={() => navigate("/field-guide")} className="hover:text-saffron transition-colors">Field guide</button></li>
                <li><button onClick={() => navigate("/for-parents")} className="hover:text-saffron transition-colors">For parents</button></li>
                <li><button onClick={() => navigate("/quiz")} className="hover:text-saffron transition-colors">Take the match</button></li>
                <li><button onClick={() => navigate("/saved")} className="hover:text-saffron transition-colors">Saved</button></li>
              </ul>
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Decide</div>
              <ul className="mt-4 space-y-2.5 text-sm">
                <li><button onClick={() => navigate("/compare")} className="hover:text-saffron transition-colors">Compare careers</button></li>
                <li><button onClick={() => navigate("/careers?cat=medical")} className="hover:text-saffron transition-colors">Medical</button></li>
                <li><button onClick={() => navigate("/careers?cat=engineering")} className="hover:text-saffron transition-colors">Engineering</button></li>
                <li><button onClick={() => navigate("/careers?cat=commerce")} className="hover:text-saffron transition-colors">Commerce</button></li>
              </ul>
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">The promise</div>
              <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
                <li>Not a coaching institute</li>
                <li>Zero ads · no sponsored results</li>
                <li>Sources linked on every quote</li>
              </ul>
            </div>
          </div>
          <div className="mt-12 flex flex-wrap items-center justify-between gap-2 border-t border-border/70 pt-6 text-xs text-muted-foreground">
            <span>Karriere — the unfiltered career file.</span>
            <span className="tabular-nums">{careersList.length} careers · {new Date().getFullYear()}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
