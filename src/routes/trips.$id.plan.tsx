import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Trash2, Play } from "lucide-react";
import { AppHeader } from "@/components/trip/AppHeader";
import { GhostBtn, PrimaryBtn } from "@/components/trip/Field";
import { MembersSection, TransportSection, StaySection, RentalsSection, ItinerarySection, ExpensesSection } from "@/components/trip/Sections";
import { useTrips, updateTrip, deleteTrip, estimatedBudget } from "@/lib/trips";

export const Route = createFileRoute("/trips/$id/plan")({
  head: () => ({ meta: [{ title: "Trip Plan — TripMate" }] }),
  component: PlanPage,
});

const tabs = ["Members", "Transport", "Stay", "Rentals", "Itinerary", "Expenses", "Budget"] as const;
type Tab = typeof tabs[number];

function PlanPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const trip = useTrips().find((t) => t.id === id);
  const [tab, setTab] = useState<Tab>("Members");

  if (!trip) {
    return (
      <div className="min-h-screen bg-background"><AppHeader />
        <main className="mx-auto max-w-3xl px-4 py-10 text-center">
          <p className="text-muted-foreground">Trip not found.</p>
          <Link to="/" className="mt-3 inline-block text-primary">Go home</Link>
        </main>
      </div>
    );
  }
  const b = estimatedBudget(trip);
  const upd = (patch: Partial<typeof trip>) => updateTrip(trip.id, (t) => ({ ...t, ...patch }));

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="mx-auto max-w-5xl px-4 py-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Home</Link>
            <h1 className="mt-1 text-2xl font-semibold">{trip.name || "Untitled trip"}</h1>
            <p className="text-sm text-muted-foreground">{trip.destination} · {trip.startDate} → {trip.endDate}</p>
          </div>
          <div className="flex gap-2">
            <PrimaryBtn onClick={() => navigate({ to: "/trips/$id/live", params: { id: trip.id } })}>
              <Play className="h-4 w-4" /> Start Trip
            </PrimaryBtn>
            <GhostBtn onClick={() => { if (confirm("Delete this trip?")) { deleteTrip(trip.id); navigate({ to: "/" }); } }} className="text-destructive">
              <Trash2 className="h-4 w-4" /> Delete
            </GhostBtn>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 border-b border-border pb-2">
          {tabs.map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${tab === t ? "bg-primary text-primary-foreground" : "hover:bg-secondary"}`}>
              {t}
            </button>
          ))}
        </div>

        <div key={tab} className="animate-fade-in">
          {tab === "Members" && <MembersSection items={trip.members} onChange={(members) => upd({ members })} />}
          {tab === "Transport" && <TransportSection items={trip.transports} onChange={(transports) => upd({ transports })} />}
          {tab === "Stay" && <StaySection items={trip.stays} onChange={(stays) => upd({ stays })} />}
          {tab === "Rentals" && <RentalsSection items={trip.rentals} onChange={(rentals) => upd({ rentals })} />}
          {tab === "Itinerary" && <ItinerarySection items={trip.itinerary} onChange={(itinerary) => upd({ itinerary })} />}
          {tab === "Expenses" && <ExpensesSection items={trip.expenses} onChange={(expenses) => upd({ expenses })} />}
          {tab === "Budget" && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[["Transport", b.transport],["Stay", b.stay],["Rentals", b.rental],["Food", b.food],["Itinerary", b.itinerary],["Total", b.total]].map(([l, v]) => (
                <div key={l as string} className="rounded-xl border border-border bg-card p-3">
                  <div className="text-xs text-muted-foreground">{l}</div>
                  <div className="text-lg font-semibold">₹{Math.round(v as number)}</div>
                </div>
              ))}
              <div className="col-span-2 sm:col-span-3 rounded-xl bg-[image:var(--gradient-hero)] p-4 text-primary-foreground">
                <div className="text-xs opacity-80">Per person</div>
                <div className="text-2xl font-bold">₹{Math.round(b.perPerson)}</div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}