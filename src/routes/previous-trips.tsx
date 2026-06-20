import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, History } from "lucide-react";
import { useTrips } from "@/lib/trips";
import { AppHeader } from "@/components/trip/AppHeader";
import { EmptyState } from "@/components/trip/EmptyState";
import { PreviousCard } from "@/components/trip/PreviousCard";

export const Route = createFileRoute("/previous-trips")({
  head: () => ({ meta: [{ title: "Previous Trips — TripMate" }] }),
  component: PreviousTrips,
});

function PreviousTrips() {
  const trips = useTrips().filter((t) => t.status === "completed");
  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="mx-auto max-w-5xl px-4 py-6 space-y-4">
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Home
        </Link>
        <h1 className="text-2xl font-semibold">Previous Trips</h1>
        {trips.length === 0 ? (
          <EmptyState icon={<History className="h-10 w-10" />} title="No previous trips yet." />
        ) : (
          <div className="grid sm:grid-cols-2 gap-3">{trips.map((t) => <PreviousCard key={t.id} trip={t} />)}</div>
        )}
      </main>
    </div>
  );
}