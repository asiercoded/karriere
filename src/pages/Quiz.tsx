import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, RotateCcw } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { quizQuestions, type QuizAnswers } from "@/lib/career-data";
import { cn } from "@/lib/utils";
import { SiteHeader } from "@/components/SiteHeader";

export default function Quiz() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<QuizAnswers>>({});
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // A fresh quiz must never inherit a previous run's stored answers —
  // otherwise backing out to /results after a retake shows stale matches.
  useEffect(() => {
    sessionStorage.removeItem("quizAnswers");
  }, []);

  const handleRestart = () => {
    setCurrentStep(0);
    setAnswers({});
    setSelectedOption(null);
    optionRefs.current = [];
    sessionStorage.removeItem("quizAnswers");
  };

  const question = quizQuestions[currentStep];
  const progress = ((currentStep + 1) / quizQuestions.length) * 100;
  const isLastStep = currentStep === quizQuestions.length - 1;

  const handleSelect = (value: string) => {
    const nextAnswers = { ...answers, [question.id]: value };
    if (isLastStep) {
      // Final question: store the complete run and go straight to results.
      sessionStorage.setItem("quizAnswers", JSON.stringify(nextAnswers as QuizAnswers));
      navigate("/results");
    } else {
      setAnswers(nextAnswers);
      setCurrentStep((prev) => prev + 1);
      setSelectedOption(null);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      const prev = currentStep - 1;
      // Restore the answer the user already gave for the previous question,
      // so Back doesn't silently wipe their selection.
      setCurrentStep(prev);
      setSelectedOption(answers[quizQuestions[prev].id as keyof QuizAnswers] ?? null);
    }
  };

  /* Radio-group keyboard support: arrow keys move the selection (and focus),
     Home/End jump to the ends. Only one option stays in the tab order. */
  const moveTo = (index: number) => {
    const clamped = Math.min(Math.max(index, 0), question.options.length - 1);
    const value = question.options[clamped].value;
    setSelectedOption(value);
    setAnswers((prev) => ({ ...prev, [question.id]: value }));
    optionRefs.current[clamped]?.focus();
  };

  const handleGroupKeyDown = (e: React.KeyboardEvent) => {
    const current = selectedOption ? question.options.findIndex((o) => o.value === selectedOption) : 0;
    let next: number | null = null;
    switch (e.key) {
      case "ArrowDown":
      case "ArrowRight":
        next = current + 1;
        break;
      case "ArrowUp":
      case "ArrowLeft":
        next = current - 1;
        break;
      case "Home":
        next = 0;
        break;
      case "End":
        next = question.options.length - 1;
        break;
    }
    if (next !== null) {
      e.preventDefault();
      moveTo(next);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Progress bar */}
      <div className="fixed left-0 right-0 top-0 z-50 h-1 bg-border">
        <motion.div
          className="h-full rounded-r-full bg-saffron"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        />
      </div>

      <SiteHeader />

      {/* Question */}
      <div id="main" className="flex flex-1 items-center justify-center px-5 py-12 sm:px-6">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={question.id}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.3 }}
              onAnimationComplete={() => headingRef.current?.focus({ preventScroll: true })}
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Question {String(currentStep + 1).padStart(2, "0")}
                </p>
                <span className="rounded-full bg-secondary px-2.5 py-1 font-mono text-xs font-bold text-muted-foreground tabular-nums" aria-live="polite">
                  {String(currentStep + 1).padStart(2, "0")} / {String(quizQuestions.length).padStart(2, "0")}
                </span>
              </div>
              <h1
                ref={headingRef}
                id="quiz-question"
                tabIndex={-1}
                className="mt-5 font-display text-4xl font-bold leading-[1.05] tracking-tight text-balance outline-none"
              >
                {question.question}
              </h1>
              <p className="mt-3 text-muted-foreground leading-relaxed">{question.subtitle}</p>

              <p className="mt-9 text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Pick an answer to continue
              </p>

              <div
                role="radiogroup"
                aria-labelledby="quiz-question"
                onKeyDown={handleGroupKeyDown}
                className="mt-3 grid gap-3"
              >
                {question.options.map((option, optionIndex) => {
                  const selected = selectedOption === option.value;
                  return (
                    <button
                      key={option.value}
                      ref={(el) => {
                        optionRefs.current[optionIndex] = el;
                      }}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      tabIndex={selected || (selectedOption === null && optionIndex === 0) ? 0 : -1}
                      onClick={() => handleSelect(option.value)}
                      className={cn(
                        "flex items-center gap-4 rounded-2xl border p-5 text-left transition-all",
                        selected
                          ? "border-saffron/60 bg-saffron-dim"
                          : "border-border bg-card hover:border-saffron/40 hover:bg-card",
                      )}
                    >
                      <span
                        className={cn(
                          "grid size-8 shrink-0 place-items-center rounded-full border font-mono text-xs font-bold tabular-nums transition-colors",
                          selected ? "border-saffron bg-saffron text-primary-foreground" : "border-border text-muted-foreground",
                        )}
                        aria-hidden="true"
                      >
                        {String(optionIndex + 1).padStart(2, "0")}
                      </span>
                      <span className={cn("text-base leading-snug md:text-lg", selected ? "text-foreground" : "text-foreground/85")}>
                        {option.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation */}
      <div className="mx-auto flex w-full max-w-2xl items-center justify-center gap-1 px-5 py-6 sm:px-6">
        <Button
          variant="ghost"
          onClick={handleBack}
          disabled={currentStep === 0}
          className="text-muted-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
          Back
        </Button>
        {currentStep > 0 && Object.keys(answers).length > 0 && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" className="text-muted-foreground">
                <RotateCcw className="mr-2 h-4 w-4" aria-hidden="true" />
                Start over
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Restart the match?</AlertDialogTitle>
                <AlertDialogDescription>
                  Your {Object.keys(answers).length} answer{Object.keys(answers).length === 1 ? "" : "s"} will be
                  cleared and you&rsquo;ll start again from question 1.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Keep going</AlertDialogCancel>
                <AlertDialogAction onClick={handleRestart}>Restart</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </div>
  );
}
