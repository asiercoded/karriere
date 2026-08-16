import { useState } from "react";
import { useMutation } from "convex/react";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const localKey = (careerId: string) => `karriere-feedback-${careerId}`;

interface Stored {
  helpful: boolean;
  note?: string;
}

function readLocal(careerId: string): Stored | null {
  try {
    const raw = localStorage.getItem(localKey(careerId));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (parsed && typeof parsed === "object" && "helpful" in parsed) {
      return { helpful: Boolean((parsed as Stored).helpful), note: (parsed as Stored).note };
    }
  } catch {
    /* ignore corrupt storage */
  }
  return null;
}

function writeLocal(careerId: string, value: Stored | null) {
  try {
    if (value === null) localStorage.removeItem(localKey(careerId));
    else localStorage.setItem(localKey(careerId), JSON.stringify(value));
  } catch {
    /* storage may be unavailable; vote just won't persist */
  }
}

/**
 * "Was this page helpful?" — one tap, then an optional "what's missing?" note
 * for negative votes. Votes go to Convex (careerFeedback table); the voted
 * state also persists locally so signed-out users don't get re-asked.
 */
export function FeedbackWidget({ careerId, careerName }: { careerId: string; careerName: string }) {
  const [stored, setStored] = useState<Stored | null>(() => readLocal(careerId));
  const [note, setNote] = useState("");
  const record = useMutation(api.feedback.record);

  const vote = (helpful: boolean, noteText?: string) => {
    const next: Stored = { helpful, note: noteText };
    writeLocal(careerId, next);
    setStored(next);
    void record({ careerId, helpful, note: noteText });
  };

  const change = () => {
    writeLocal(careerId, null);
    setStored(null);
    setNote("");
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
      {!stored ? (
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-display text-lg font-bold tracking-tight">Was this page helpful?</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Your answer tells us which careers need more digging.
            </p>
          </div>
          <div className="flex gap-2.5">
            <Button variant="outline" size="sm" onClick={() => vote(true)} className="border-good/40 text-good hover:border-good/70 hover:text-good">
              <ThumbsUp className="mr-1.5 h-4 w-4" aria-hidden="true" /> Yes, helped
            </Button>
            <Button variant="outline" size="sm" onClick={() => vote(false)} className="border-bad/40 text-bad hover:border-bad/70 hover:text-bad">
              <ThumbsDown className="mr-1.5 h-4 w-4" aria-hidden="true" /> Not really
            </Button>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-start justify-between gap-4">
            <p className="flex items-center gap-2.5 font-display text-base font-bold tracking-tight">
              <span
                className={cn(
                  "grid size-8 shrink-0 place-items-center rounded-full",
                  stored.helpful ? "bg-good-dim text-good" : "bg-bad-dim text-bad",
                )}
              >
                {stored.helpful ? <ThumbsUp className="h-4 w-4" aria-hidden="true" /> : <ThumbsDown className="h-4 w-4" aria-hidden="true" />}
              </span>
              {stored.helpful
                ? "Thanks — noted."
                : stored.note
                  ? "Thanks — we'll dig into it."
                  : "Sorry this fell short."}
            </p>
            <button type="button" onClick={change} className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground">
              Change
            </button>
          </div>

          {!stored.helpful && !stored.note && (
            <div className="mt-5">
              <label htmlFor={`fb-note-${careerId}`} className="text-sm font-medium text-foreground/90">
                What was missing? (optional)
              </label>
              <textarea
                id={`fb-note-${careerId}`}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={2}
                placeholder="e.g. government exam details, more salary data, what an average day looks like…"
                className="mt-2 w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-saffron"
              />
              <div className="mt-3 flex gap-2.5">
                <Button size="sm" onClick={() => vote(false, note.trim() || undefined)} disabled={!note.trim()}>
                  Send feedback
                </Button>
                <Button size="sm" variant="ghost" onClick={() => vote(false, undefined)}>
                  Skip
                </Button>
              </div>
            </div>
          )}

          {stored.helpful && (
            <p className="mt-3 text-sm text-muted-foreground">
              Glad {careerName} delivered. Anything you&rsquo;d add is welcome — every page improves with input.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
