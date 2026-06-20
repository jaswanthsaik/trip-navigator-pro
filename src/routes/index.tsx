import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Plus, History, Luggage } from "lucide-react";
import { useTrips } from "@/lib/trips";
import { AppHeader } from "@/components/trip/AppHeader";
import { EmptyState } from "@/components/trip/EmptyState";
import { UpcomingCard } from "@/components/trip/UpcomingCard";
import { PreviousCard } from "@/components/trip/PreviousCard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TripMate Planner" },
      { name: "description", content: "Plan, track and remember your trips." },
      { property: "og:title", content: "TripMate Planner" },
      { property: "og:description", content: "Plan, track and remember your trips." },
    ],
  }),
  component: Index,
});

function Index() {
  const trips = useTrips();
  const upcoming = trips.filter((t) => t.status !== "completed").sort((a, b) => b.createdAt - a.createdAt);
  const previous = trips.filter((t) => t.status === "completed").sort((a, b) => (b.completedAt ?? 0) - (a.completedAt ?? 0));
  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="mx-auto max-w-5xl px-4 py-6 space-y-8">
        <section className="flex flex-col sm:flex-row gap-3">
          <Link to="/trips/new"
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[image:var(--gradient-hero)] px-4 py-3 text-sm font-medium text-primary-foreground shadow-[var(--shadow-card)] hover:opacity-95 transition active:scale-[0.99]">
            <Plus className="h-4 w-4" /> Add New Trip
          </Link>
          <Link to="/previous-trips"
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-input bg-card px-4 py-3 text-sm font-medium hover:bg-secondary transition">
            <History className="h-4 w-4" /> Previous Trips
          </Link>
        </section>

        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Upcoming Trip</h2>
          {upcoming.length === 0 ? (
            <EmptyState
              icon={<Luggage className="h-10 w-10" />}
              title="No trips planned yet. Click Add New Trip to create your first trip." />
          ) : (
            <div className="space-y-3">{upcoming.map((t) => <UpcomingCard key={t.id} trip={t} />)}</div>
          )}
        </section>

        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Previous Trips</h2>
          {previous.length === 0 ? (
            <EmptyState icon={<History className="h-10 w-10" />} title="No previous trips yet." />
          ) : (
            <div className="grid sm:grid-cols-2 gap-3">{previous.slice(0, 4).map((t) => <PreviousCard key={t.id} trip={t} />)}</div>
          )}
        </section>
      </main>
    </div>
  );
}
