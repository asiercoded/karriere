import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Quote } from "lucide-react";

interface SubmitReviewDialogProps {
  careerId: string;
  careerName: string;
}

export function SubmitReviewDialog({ careerId, careerName }: SubmitReviewDialogProps) {
  const [open, setOpen] = useState(false);
  const [label, setLabel] = useState("");
  const [quote, setQuote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitReview = useMutation(api.reviews.submitReview);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim() || !quote.trim()) {
      toast.error("Please fill in both fields");
      return;
    }

    setIsSubmitting(true);
    try {
      await submitReview({ careerId, label: label.trim(), quote: quote.trim() });
      toast.success("Story submitted!", {
        description: "It has been sent for moderation and will appear soon.",
      });
      setOpen(false);
      setLabel("");
      setQuote("");
    } catch (error) {
      toast.error("Failed to submit story. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 rounded-full">
          <Quote className="h-4 w-4" />
          Add your experience
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add your {careerName} story</DialogTitle>
          <DialogDescription>
            Help others by sharing the unfiltered truth about this path. Your story will be reviewed before publishing.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="label">Who are you?</Label>
            <Input
              id="label"
              placeholder="e.g. 2nd year student, 3 YOE Engineer"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              maxLength={40}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="quote">The reality check</Label>
            <Textarea
              id="quote"
              placeholder="What do you wish someone told you before you started? What's the real stress, salary, or ceiling?"
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              className="min-h-[120px]"
              maxLength={500}
              required
            />
          </div>
          <div className="flex justify-end pt-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit story"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
