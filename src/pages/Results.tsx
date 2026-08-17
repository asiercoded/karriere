import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAction } from "convex/react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Bookmark, BookmarkCheck, Link2, MessageCircle, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/Chip";
import { Skeleton } from "@/components/ui/skeleton";
import { getRecommendations, categoryLabel, formatSalaryRange, type CareerMatch, type QuizAnswers } from "@/lib/career-data";
import { useCareers } from "@/lib/career-loader";
import { useAnalytics } from "@/lib/analytics";
import { usePageMeta, whatsappShare } from "@/lib/meta";
import { toggleSaved, useShortlist } from "@/lib/shortlist";
import { SiteHeader } from "@/components/SiteHeader";

type AiState = "idle" | "loading" | "done" | "off";

// In-flight guard: React StrictMode double-runs effects in dev; without this a
// single quiz run would bill the AI call twice.
const aiInFlight = new Set<string>();

const Q_KEYS: (keyof QuizAnswers)[] = ["interests", "workStyle", "pace", "stability", "values"];

/** Answers encoded in the URL (?v=medical,people,moderate,stable,helping) so a
    shared results link opens straight to the same matches — no session needed. */
function answersFromUrl(search: string): Partial<QuizAnswers> | null {
  const raw = new URLSearchParams(search).get("v");
  if (!raw) return null;
  const parts = raw.split(",");
  if (parts.length !== Q_KEYS.length) return null;
  const answers: Partial<QuizAnswers> = {};
  Q_KEYS.forEach((key, i) => {
    (answers as Record<string, string>)[key] = parts[i];
  });
  return answers;
}

function resultsShareUrl(answers: QuizAnswers): string {
  return `${window.location.origin}/results?v=${Q_KEYS.map((k) => answers[k]).join(",")}`;
}

function resultsShareText(recs: CareerMatch[], url: string): string {
  const top = recs
    .slice(0, 3)
    .map((r, i) => `${i + 1}. ${r.career.name} (${categoryLabel(r.career.category)})`)
    .join("\n");
  return `My career matches on Karriere — honest reality check:\n${top}\n\n${url}`;
}

export default function Results() {
  const navigate = useNavigate();
  const generateVerdict = useAction(api.ai.verdict);
  const shortlist = useShortlist();
  const careers = useCareers();
  const track = useAnalytics();
  const [recommendations, setRecommendations] = useState<CareerMatch[]>([]);
  const [answers, setAnswers] = useState<QuizAnswers | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [aiVerdict, setAiVerdict] = useState<string | null>(null);
  const [aiState, setAiState] = useState<AiState>("idle");

  useEffect(() => {
    // The dataset is lazy-loaded; wait for it before scoring.
    if (!careers) return;
    // Landing on /results without valid answers should never dead-end on a
    // blank screen — prefer the quiz session, then a shared ?v= link, then the quiz.
    try {
      let parsed: Partial<QuizAnswers> | null = null;
      const stored = sessionStorage.getItem("quizAnswers");
      if (stored) {
        const candidate = JSON.parse(stored) as Partial<QuizAnswers>;
        if (candidate && typeof candidate === "object" && Object.keys(candidate).length > 0) parsed = candidate;
      }
      if (!parsed) parsed = answersFromUrl(window.location.search);
      if (!parsed) {
        navigate("/quiz");
        return;
      }
      const recs = getRecommendations(careers, parsed as QuizAnswers);
      if (recs.length === 0) {
        navigate("/quiz");
        return;
      }
      // Remember shared-link answers so refresh/back keep working without the URL.
      if (!stored) sessionStorage.setItem("quizAnswers", JSON.stringify(parsed));
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAnswers(parsed as QuizAnswers);
      setRecommendations(recs);
      setLoaded(true);

      // AI take — grounded in the same answers, cached per answer-set so
      // retakes and back-navigation never re-bill the model.
      const cacheKey = `aiVerdict:${JSON.stringify(parsed)}`;
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        setAiVerdict(cached);
        setAiState("done");
        return;
      }
      if (aiInFlight.has(cacheKey)) return;
      aiInFlight.add(cacheKey);
      setAiState("loading");
      generateVerdict({
        answers: parsed as QuizAnswers,
        topIds: recs.slice(0, 3).map((r) => r.career.id),
      })
        .then((res) => {
          if (res?.text) {
            sessionStorage.setItem(cacheKey, res.text);
            setAiVerdict(res.text);
            setAiState("done");
          } else {
            setAiState("off");
          }
        })
        .catch(() => setAiState("off"))
        .finally(() => aiInFlight.delete(cacheKey));
    } catch {
      navigate("/quiz");
    }
  }, [navigate, generateVerdict, careers]);

  // A finished quiz is the strongest "this product works" signal we have.
  useEffect(() => {
    if (loaded && recommendations.length > 0) track("quiz_completed");
  }, [loaded, recommendations.length, track]);

  usePageMeta(
    "Your career matches — Karriere",
    "Careers that line up with your answers — honest salary, stress and regret data, sourced and dated.",
    true,
  );

  // Edge state: while the dataset (and any stored answers) load, show the
  // header + a quiet loading note instead of a blank page. If there are no
  // valid answers we redirect to the quiz inside the effect above.
  if (careers === null || !loaded) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <SiteHeader />
        <div className="flex min-h-[60vh] items-center justify-center px-6">
          <div className="flex flex-col items-center gap-3 text-center">
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-border border-t-saffron" aria-hidden="true" />
            <p className="text-sm text-muted-foreground">Reading your answers…</p>
          </div>
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <SiteHeader />
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
          <p className="font-display text-2xl font-bold">No strong matches this time.</p>
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
            That combination didn&rsquo;t line up with any career in the file. Try the match again — small
            changes in how you answer can shift the picture.
          </p>
          <Button onClick={() => navigate("/quiz")}>Retake the match</Button>
        </div>
      </div>
    );
  }

  const topMatch = recommendations[0];
  const top = topMatch.career;

  const recIds = recommendations.map((r) => r.career.id);
  const allSaved = recIds.length > 0 && recIds.every((id) => shortlist.includes(id));
  const saveMatches = () => {
    if (allSaved) {
      for (const id of recIds) if (shortlist.includes(id)) toggleSaved(id);
      toast("Removed your matches from Saved");
    } else {
      for (const id of recIds) if (!shortlist.includes(id)) toggleSaved(id);
      toast.success(`${recIds.length} careers saved — find them under Saved`);
    }
  };
  const copyShare = async () => {
    if (!answers) return;
    try {
      await navigator.clipboard.writeText(resultsShareUrl(answers));
      toast.success("Link copied — it opens straight to these results");
    } catch {
      toast.error("Couldn't copy — share on WhatsApp instead");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      {/* Results */}
      <div id="main" className="mx-auto max-w-3xl px-5 py-12 sm:px-6 md:py-16">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Chip tone="saffron">
            <Sparkles className="h-3 w-3" aria-hidden="true" /> Your results
          </Chip>
          <h1 className="mt-5 font-display text-4xl font-bold leading-[1.03] tracking-tight text-balance md:text-5xl">
            Careers that fit.
          </h1>
          <p className="mt-4 max-w-xl text-muted-foreground leading-relaxed">
            Based on your answers, these careers line up with how you work and what you value.
            A match is a starting point, not a verdict — read the honest sections before you decide.
          </p>
        </motion.div>

        {/* AI take — hidden entirely if the call fails or the gateway is off */}
        {aiState !== "off" && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="mt-10"
          >
            <div className="rounded-3xl border border-border bg-card p-7 md:p-8">
              <div className="flex items-center gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-saffron-dim text-saffron" aria-hidden="true">
                  <Sparkles className="h-4 w-4" />
                </span>
                <div>
                  <p className="font-display text-base font-bold tracking-tight">Your match, explained</p>
                  <p className="text-xs text-muted-foreground">An AI reading of your answers — grounded in Karriere&rsquo;s data</p>
                </div>
              </div>
              <div aria-live="polite">
                {aiState === "loading" ? (
                  <div className="mt-5 space-y-2.5" aria-hidden="true">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-[94%]" />
                    <Skeleton className="h-4 w-[82%]" />
                  </div>
                ) : (
                  <p className="mt-5 text-[15px] leading-relaxed text-foreground/90 md:text-base">{aiVerdict}</p>
                )}
              </div>
              {aiState === "done" && (
                <p className="mt-5 border-t border-border pt-4 text-[11px] uppercase tracking-widest text-muted-foreground">
                  One view, not a verdict — the data below is the real source
                </p>
              )}
            </div>
          </motion.div>
        )}

        {/* Top pick */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-10"
        >
          <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Top recommendation</div>
          <motion.button
            whileHover={{ y: -2 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            onClick={() => navigate(`/careers/${top.id}`)}
            className="group relative mt-4 w-full overflow-hidden rounded-3xl border border-saffron/40 bg-gradient-to-br from-saffron/15 via-card to-card p-7 text-left md:p-8"
          >
            <span className="pointer-events-none absolute right-6 top-5 font-display text-7xl font-bold text-saffron/10" aria-hidden="true">
              01
            </span>
            <div className="relative">
              <Chip tone="saffron">{categoryLabel(top.category)}</Chip>
              <h2 className="mt-4 font-display text-3xl font-bold tracking-tight group-hover:text-saffron transition-colors md:text-4xl">
                {top.name}
              </h2>
              <p className="mt-2 max-w-xl leading-relaxed text-muted-foreground">{top.tagline}</p>
              <div className="mt-5 flex flex-wrap gap-1.5">
                <Chip>{formatSalaryRange(top.salaryParsed.entry)} entry</Chip>
                <Chip>{top.metrics.duration}</Chip>
                <Chip tone={top.metrics.stress <= 2 ? "good" : top.metrics.stress >= 4 ? "bad" : "default"}>
                  stress {top.metrics.stress}/5
                </Chip>
                <Chip tone={top.metrics.workLifeBalance >= 4 ? "good" : "default"}>
                  work-life {top.metrics.workLifeBalance}/5
                </Chip>
              </div>
              {topMatch.reasons.length > 0 && (
                <div className="mt-5 border-t border-saffron/15 pt-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Why this match</p>
                  <ul className="mt-2.5 space-y-2">
                    {topMatch.reasons.map((reason, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm leading-relaxed text-foreground/85">
                        <span className="mt-[7px] size-1.5 shrink-0 rounded-full bg-saffron" aria-hidden="true" />
                        {reason}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <span className="absolute bottom-7 right-7 grid size-10 place-items-center rounded-full bg-saffron text-primary-foreground opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true">
              <ArrowRight className="h-4 w-4" />
            </span>
          </motion.button>
        </motion.div>

        {/* Other recommendations */}
        <div className="mt-12">
          <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Also worth a read</div>
          <div className="mt-4 space-y-3">
            {recommendations.slice(1).map((match, i) => {
              const career = match.career;
              return (
                <motion.button
                  key={career.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.06 }}
                  whileHover={{ y: -2 }}
                  onClick={() => navigate(`/careers/${career.id}`)}
                  className="group flex w-full items-center justify-between gap-4 rounded-2xl border border-border bg-card p-5 text-left transition-colors hover:border-saffron/40"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h3 className="font-display text-xl font-bold tracking-tight group-hover:text-saffron transition-colors">
                        {career.name}
                      </h3>
                      <Chip tone="saffron">{categoryLabel(career.category)}</Chip>
                    </div>
                    <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">{career.tagline}</p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      <Chip>{formatSalaryRange(career.salaryParsed.entry)} entry</Chip>
                      <Chip>{career.metrics.duration}</Chip>
                      <Chip>stress {career.metrics.stress}/5</Chip>
                    </div>
                    {match.reasons.length > 0 && (
                      <ul className="mt-3 space-y-1.5">
                        {match.reasons.slice(0, 2).map((reason, j) => (
                          <li key={j} className="flex items-start gap-2 text-sm leading-snug text-muted-foreground">
                            <span className="mt-[7px] size-1 shrink-0 rounded-full bg-saffron/70" aria-hidden="true" />
                            {reason}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-saffron" aria-hidden="true" />
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-12 space-y-4"
        >
          {answers && (
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="outline" onClick={saveMatches} aria-pressed={allSaved}>
                {allSaved ? (
                  <BookmarkCheck className="mr-2 h-4 w-4 text-saffron" aria-hidden="true" />
                ) : (
                  <Bookmark className="mr-2 h-4 w-4" aria-hidden="true" />
                )}
                {allSaved ? "All saved" : "Save my matches"}
              </Button>
              <Button variant="outline" asChild>
                <a href={whatsappShare(resultsShareText(recommendations, resultsShareUrl(answers)))} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="mr-2 h-4 w-4 text-[#25D366]" aria-hidden="true" />
                  Share on WhatsApp
                </a>
              </Button>
              <Button variant="outline" onClick={copyShare}>
                <Link2 className="mr-2 h-4 w-4" aria-hidden="true" />
                Copy link
              </Button>
            </div>
          )}
          <div className="flex flex-wrap items-center gap-3">
            <Button onClick={() => navigate("/careers")} className="rounded-full px-6">
              Explore all careers
            </Button>
            <Button variant="ghost" className="text-muted-foreground" onClick={() => navigate("/quiz")}>
              <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
              Retake the match
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
