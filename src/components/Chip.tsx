import { cn } from "@/lib/utils";

const tones = {
  default: "border-border text-muted-foreground bg-background/60",
  saffron: "border-saffron/40 text-saffron bg-saffron-dim",
  good: "border-good/40 text-good bg-good-dim",
  bad: "border-bad/40 text-bad bg-bad-dim",
  card: "border-border text-muted-foreground bg-card",
} as const;

export function Chip({
  className,
  children,
  tone = "default",
}: {
  className?: string;
  children: React.ReactNode;
  tone?: keyof typeof tones;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold tracking-wide whitespace-nowrap",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
