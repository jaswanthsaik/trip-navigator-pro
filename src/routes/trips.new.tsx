import { AppHeader } from "@/components/trip/AppHeader";
import { Field, GhostBtn, PrimaryBtn, TextArea, TextInput } from "@/components/trip/Field";
import { ExpensesSection, ItinerarySection, MembersSection, RentalsSection, StaySection, TransportSection } from "@/components/trip/Sections";
import { createBlankTrip, estimatedBudget, saveTrip, type Trip } from "@/lib/trips";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Check, ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/trips/new")({
  head: () => ({ meta: [{ title: "New Trip — TripMate" }] }),
  component: NewTrip,
});

const steps = ["Basic", "Members", "Transport", "Stay", "Rentals", "Itinerary", "Expenses", "Budget"] as const;

function NewTrip() {
  const navigate = useNavigate();
  const [trip, setTrip] = useState<Trip>(() => createBlankTrip());
  const [step, setStep] = useState(0);
  const set = (patch: Partial<Trip>) => setTrip({ ...trip, ...patch });
  const b = useMemo(() => estimatedBudget(trip), [trip]);

  const finish = () => {
    saveTrip({ ...trip, status: "planned" });
    navigate({ to: "/trips/$id/plan", params: { id: trip.id } });
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="mx-auto max-w-3xl px-4 py-6 space-y-6">
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Home</Link>
        <div className="flex flex-wrap gap-1.5">
          {steps.map((s, i) => (
            <button key={s} onClick={() => setStep(i)}
              className={`rounded-full cursor-pointer px-3 py-1 text-xs font-medium transition ${i === step ? "bg-primary text-primary-foreground" : i < step ? "bg-[color:var(--success)] text-white" : "bg-secondary text-secondary-foreground"}`}>
              {i + 1}. {s}
            </button>
          ))}
        </div>

        <div key={step} className="rounded-2xl border border-border bg-card p-5 shadow-sm animate-fade-in">
          {step === 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Basic Trip Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="Trip name"><TextInput value={trip.name} onChange={(e) => set({ name: e.target.value })} /></Field>
                <Field label="Destination"><TextInput value={trip.destination} onChange={(e) => set({ destination: e.target.value })} /></Field>
                <Field label="Start date"><TextInput type="date" value={trip.startDate} onChange={(e) => set({ startDate: e.target.value })} /></Field>
                <Field label="End date"><TextInput type="date" value={trip.endDate} onChange={(e) => set({ endDate: e.target.value })} /></Field>
                <Field label="Number of days"><TextInput type="number" min={1} value={trip.days} onChange={(e) => set({ days: +e.target.value })} /></Field>
              </div>
              <Field label="Notes"><TextArea value={trip.notes ?? ""} onChange={(e) => set({ notes: e.target.value })} /></Field>
            </div>
          )}
          {step === 1 && <MembersSection items={trip.members} onChange={(members) => set({ members })} />}
          {step === 2 && <TransportSection items={trip.transports} onChange={(transports) => set({ transports })} />}
          {step === 3 && <StaySection items={trip.stays} onChange={(stays) => set({ stays })} />}
          {step === 4 && <RentalsSection items={trip.rentals} onChange={(rentals) => set({ rentals })} />}
          {step === 5 && <ItinerarySection items={trip.itinerary} onChange={(itinerary) => set({ itinerary })} />}
          {step === 6 && <ExpensesSection items={trip.expenses} onChange={(expenses) => set({ expenses })} />}
          {step === 7 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Budget Preview</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  ["Transport", b.transport], ["Stay", b.stay], ["Rentals", b.rental],
                  ["Food / Expenses", b.food], ["Itinerary", b.itinerary], ["Total", b.total],
                ].map(([label, val]) => (
                  <div key={label as string} className="rounded-xl border border-border bg-background p-3">
                    <div className="text-xs text-muted-foreground">{label}</div>
                    <div className="text-lg font-semibold">₹{Math.round(val as number)}</div>
                  </div>
                ))}
              </div>
              <div className="rounded-xl bg-[image:var(--gradient-hero)] p-4 text-primary-foreground">
                <div className="text-xs opacity-80">Estimated cost per person ({trip.members.length || 1})</div>
                <div className="text-2xl font-bold">₹{Math.round(b.perPerson)}</div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between gap-2">
          <GhostBtn className="cursor-pointer" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>
            <ChevronLeft className="h-4 w-4" /> Back
          </GhostBtn>
          {step < steps.length - 1 ? (
            <PrimaryBtn className="cursor-pointer" onClick={() => setStep(step + 1)}>Next <ChevronRight className="h-4 w-4" /></PrimaryBtn>
          ) : (
            <PrimaryBtn className="cursor-pointer" onClick={finish}><Check className="h-4 w-4" /> Save Trip</PrimaryBtn>
          )}
        </div>
      </main>
    </div>
  );
}