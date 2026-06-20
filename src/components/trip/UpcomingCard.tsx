import { Link } from "@tanstack/react-router";
import { Calendar, MapPin, Users, Wallet, Eye, Play } from "lucide-react";
import { type Trip, estimatedBudget } from "@/lib/trips";
import { StatusBadge } from "./StatusBadge";

export function UpcomingCard({ trip }: { trip: Trip }) {
  const b = estimatedBudget(trip);
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)] card-hover animate-fade-in">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-wide text-muted-foreground">Upcoming Trip</div>
          <h2 className="mt-1 text-xl font-semibold">{trip.name || "Untitled trip"}</h2>
          <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{trip.destination || "—"}</span>
            <span className="inline-flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{trip.startDate || "?"} → {trip.endDate || "?"}</span>
            <span className="inline-flex items-center gap-1"><Users className="h-3.5 w-3.5" />{trip.members.length}</span>
            <span className="inline-flex items-center gap-1"><Wallet className="h-3.5 w-3.5" />₹{Math.round(b.total)}</span>
          </div>
        </div>
        <StatusBadge status={trip.status} />
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Link to="/trips/$id/plan" params={{ id: trip.id }}
          className="inline-flex items-center gap-1.5 rounded-lg border border-input bg-background px-3 py-2 text-sm hover:bg-secondary transition">
          <Eye className="h-4 w-4" /> View Plan
        </Link>
        <Link to="/trips/$id/live" params={{ id: trip.id }}
          className="inline-flex items-center gap-1.5 rounded-lg bg-[image:var(--gradient-hero)] px-3 py-2 text-sm font-medium text-primary-foreground shadow-[var(--shadow-card)] hover:opacity-95 transition">
          <Play className="h-4 w-4" /> Start Trip
        </Link>
      </div>
    </div>
  );
}