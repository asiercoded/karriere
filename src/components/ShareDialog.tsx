import { BadgeCheck, Link2, MessageCircle, Send } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Chip } from "@/components/Chip";
import { categoryLabel, type CareerProfile } from "@/lib/career-data";
import { careerShareText, careerShareUrl, telegramShare, twitterShare, whatsappShare } from "@/lib/meta";

function ShareButton({
  label,
  href,
  onClick,
  children,
}: {
  label: string;
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  const cls =
    "flex flex-col items-center gap-2 rounded-2xl border border-border bg-secondary/40 px-2 py-4 text-[11px] font-semibold text-muted-foreground transition-colors hover:border-saffron/40 hover:text-foreground";
  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls} aria-label={label}>
        {children}
        {label}
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} className={cls} aria-label={label}>
      {children}
      {label}
    </button>
  );
}

export function ShareDialog({
  open,
  onOpenChange,
  career,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  career: CareerProfile;
}) {
  const url = careerShareUrl(career.id);
  const text = careerShareText(career.name, career.verdict, career.id);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied — paste it anywhere");
    } catch {
      toast.error("Couldn't copy — select the link below instead");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Share {career.name}</DialogTitle>
          <DialogDescription>
            Send the honest version — parents, group chats, and friends deciding the same thing.
          </DialogDescription>
        </DialogHeader>

        {/* OG-style preview card */}
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="flex items-center justify-between gap-2 border-b border-border px-5 py-3">
            <span className="font-display text-sm font-bold tracking-tight">KARRIERE</span>
            <Chip tone="saffron">{categoryLabel(career.category)}</Chip>
          </div>
          <div className="px-5 py-5">
            <p className="font-display text-2xl font-bold leading-tight tracking-tight">{career.name}</p>
            <p className="mt-1.5 text-sm leading-snug text-muted-foreground line-clamp-2">{career.tagline}</p>
            <div className="mt-4 rounded-xl border border-saffron/30 bg-saffron-dim/40 px-4 py-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-saffron">Bottom line</p>
              <p className="mt-1 text-[13px] font-medium leading-snug line-clamp-3">{career.verdict}</p>
            </div>
            <p className="mt-4 flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
              <BadgeCheck className="h-3.5 w-3.5 text-good" aria-hidden="true" />
              Facts verified · {career.lastVerified}
            </p>
          </div>
          <div className="border-t border-border bg-secondary/30 px-5 py-3">
            <p className="truncate font-mono text-[11px] text-muted-foreground">{url}</p>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2.5">
          <ShareButton label="WhatsApp" href={whatsappShare(text)}>
            <MessageCircle className="h-5 w-5 text-[#25D366]" aria-hidden="true" />
          </ShareButton>
          <ShareButton label="X" href={twitterShare(text, url)}>
            <span className="grid h-5 w-5 place-items-center text-[15px] font-bold leading-none" aria-hidden="true">
              𝕏
            </span>
          </ShareButton>
          <ShareButton label="Telegram" href={telegramShare(text, url)}>
            <Send className="h-5 w-5 text-sky-500" aria-hidden="true" />
          </ShareButton>
          <ShareButton label="Copy" onClick={copy}>
            <Link2 className="h-5 w-5" aria-hidden="true" />
          </ShareButton>
        </div>

        <p className="text-center text-[11px] text-muted-foreground">
          {career.name} · honest salary, reality &amp; regret data
        </p>
      </DialogContent>
    </Dialog>
  );
}
