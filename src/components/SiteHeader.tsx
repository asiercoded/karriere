import { useLocation, useNavigate } from "react-router";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SkipLink } from "@/components/SkipLink";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";

const NAV = [
  { key: "index", label: "Careers", href: "/careers" },
  { key: "quiz", label: "Match", href: "/quiz" },
  { key: "compare", label: "Compare", href: "/compare" },
  { key: "guide", label: "Guide", href: "/field-guide" },
  { key: "parents", label: "For parents", href: "/for-parents" },
  { key: "saved", label: "Saved", href: "/saved" },
];

function NavPill({ href, label, current }: { href: string; label: string; current: boolean }) {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(href)}
      aria-current={current ? "page" : undefined}
      className={cn(
        "shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
        current ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground",
      )}
    >
      {label}
    </button>
  );
}

export function SiteHeader() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { isAuthenticated, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <SkipLink />
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 sm:px-6">
        <button
          onClick={() => navigate("/")}
          className="flex shrink-0 items-center gap-2.5 font-display text-lg font-bold tracking-[0.12em] sm:text-xl"
        >
          <img src="/logo.png" alt="Karriere logo" className="h-9 w-9 sm:h-10 sm:w-10" />
          KARRIERE
        </button>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {NAV.map((item) => (
            <NavPill key={item.key} href={item.href} label={item.label} current={pathname.startsWith(item.href)} />
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <Button size="sm" onClick={() => navigate("/quiz")} className="hidden sm:inline-flex">
            Get matched
          </Button>
          {isAuthenticated ? (
            <Button size="icon" variant="ghost" onClick={() => signOut()} title="Sign out" aria-label="Sign out">
              <LogOut className="h-4 w-4 text-muted-foreground" />
            </Button>
          ) : (
            <Button size="sm" variant="outline" onClick={() => navigate("/auth")} className="hidden sm:inline-flex">
              Sign in
            </Button>
          )}
          <ThemeToggle />
        </div>
      </div>

      {/* Mobile/tablet: scrollable chip rail */}
      <nav className="flex items-center gap-1.5 overflow-x-auto px-5 pb-3 no-scrollbar lg:hidden" aria-label="Main">
        {NAV.map((item) => (
          <NavPill key={item.key} href={item.href} label={item.label} current={pathname.startsWith(item.href)} />
        ))}
        {!isAuthenticated && <NavPill href="/auth" label="Sign in" current={pathname.startsWith("/auth")} />}
      </nav>
    </header>
  );
}
