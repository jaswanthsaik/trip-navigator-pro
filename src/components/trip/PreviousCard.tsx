import { Link } from "@tanstack/react-router";
import { Calendar, MapPin, Eye } from "lucide-react";
import { type Trip, actualSpent } from "@/lib/trips";
import { StatusBadge } from "./StatusBadge";

export function PreviousCard({ trip }: { trip: Trip }) {
  const a = actualSpent(trip);
  const per = trip.members.length ? a.total / trip.members.length : a.total;
  return (
    <div className="rounded-2xl border border-border bg-card p-4 card-hover animate-fade-in">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold">{trip.name}</h3>
          <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{trip.destination}</span>
            <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" />{trip.startDate} → {trip.endDate}</span>
          </div>
        </div>
        <StatusBadge status="completed" />
      </div>
      <div className="mt-3 flex items-center justify-between">
        <div className="text-sm">
          <div className="font-medium">₹{Math.round(a.total)} <span className="text-xs text-muted-foreground">total</span></div>
          <div className="text-xs text-muted-foreground">₹{Math.round(per)} per person</div>
        </div>
        <Link to="/trips/$id/result" params={{ id: trip.id }}
          className="inline-flex items-center gap-1.5 rounded-lg border border-input bg-background px-3 py-1.5 text-xs hover:bg-secondary transition">
          <Eye className="h-3.5 w-3.5" /> View Result
        </Link>
      </div>
    </div>
  );
}