import { Link } from "@tanstack/react-router";
import { Compass } from "lucide-react";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-[image:var(--gradient-hero)] text-primary-foreground shadow-[var(--shadow-card)] transition-transform group-hover:scale-105">
            <Compass className="h-5 w-5" />
          </span>
          <div className="leading-tight">
            <div className="font-semibold tracking-tight">TripMate</div>
            <div className="text-[11px] text-muted-foreground -mt-0.5">Planner</div>
          </div>
        </Link>
        <Link to="/previous-trips" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          Previous Trips
        </Link>
      </div>
    </header>
  );
}