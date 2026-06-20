import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, PartyPopper } from "lucide-react";
import { AppHeader } from "@/components/trip/AppHeader";
import { useTrips, actualSpent } from "@/lib/trips";

export const Route = createFileRoute("/trips/$id/result")({
  head: () => ({ meta: [{ title: "Trip Summary — TripMate" }] }),
  component: ResultPage,
});

const FOOD_CATS = new Set(["Breakfast","Lunch","Dinner","Snacks"]);

function ResultPage() {
  const { id } = Route.useParams();
  const trip = useTrips().find((t) => t.id === id);
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
  const s = actualSpent(trip);
  const per = trip.members.length ? s.total / trip.members.length : s.total;
  const completed = trip.itinerary.filter((a) => a.status === "completed");
  const skipped = trip.itinerary.filter((a) => a.status === "skipped");
  const foodExp = trip.expenses.filter((e) => FOOD_CATS.has(e.category));
  const otherExp = trip.expenses.filter((e) => !FOOD_CATS.has(e.category));
  const otherTotal = otherExp.reduce((s, e) => s + (Number(e.amount) || 0), 0);
  const foodTotal = foodExp.reduce((s, e) => s + (Number(e.amount) || 0), 0);

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="mx-auto max-w-3xl px-4 py-6 space-y-6">
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Home</Link>

        <div className="rounded-2xl bg-[image:var(--gradient-hero)] p-6 text-primary-foreground animate-fade-in">
          <div className="flex items-center gap-2 text-sm opacity-90"><PartyPopper className="h-4 w-4" /> Trip completed!</div>
          <h1 className="mt-1 text-2xl font-semibold">{trip.name}</h1>
          <div className="text-sm opacity-90">{trip.destination} · {trip.startDate} → {trip.endDate} · {trip.members.length} member(s)</div>
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Stat label="Completed" value={completed.length} />
            <Stat label="Skipped" value={skipped.length} />
            <Stat label="Total spent" value={`₹${Math.round(s.total)}`} />
            <Stat label="Per person" value={`₹${Math.round(per)}`} />
          </div>
        </div>

        <Block title="Places Visited">
          {completed.length === 0 ? <Empty text="No completed activities." /> : (
            <ul className="space-y-1.5">
              {completed.map((a) => (
                <li key={a.id} className="rounded-lg border border-border bg-card p-2 text-sm">
                  <span className="font-medium">{a.title}</span> <span className="text-muted-foreground text-xs">· {a.place || a.location || "—"} · ₹{a.actualCost ?? 0}</span>
                </li>
              ))}
            </ul>
          )}
        </Block>

        <Block title="Food Eaten">
          {foodExp.length === 0 ? <Empty text="No food expenses recorded." /> : (
            <ul className="space-y-1.5">
              {foodExp.map((e) => (
                <li key={e.id} className="rounded-lg border border-border bg-card p-2 text-sm">
                  <span className="font-medium">{e.title}</span> <span className="text-muted-foreground text-xs">· {e.category} · ₹{e.amount}</span>
                </li>
              ))}
            </ul>
          )}
        </Block>

        <Block title="Travel Used">
          {trip.transports.length + trip.rentals.length === 0 ? <Empty text="No transport / rental records." /> : (
            <ul className="space-y-1.5">
              {trip.transports.map((t) => (
                <li key={t.id} className="rounded-lg border border-border bg-card p-2 text-sm">
                  <span className="font-medium">{t.type} · {t.name}</span> <span className="text-muted-foreground text-xs">· {t.fromLocation} → {t.toLocation} · ₹{t.totalPrice}</span>
                </li>
              ))}
              {trip.rentals.map((r) => (
                <li key={r.id} className="rounded-lg border border-border bg-card p-2 text-sm">
                  <span className="font-medium">{r.type} · {r.vehicleName}</span> <span className="text-muted-foreground text-xs">· {r.shopName} · ₹{r.price}</span>
                </li>
              ))}
            </ul>
          )}
        </Block>

        <Block title="Stay Details">
          {trip.stays.length === 0 ? <Empty text="No stay details." /> : (
            <ul className="space-y-1.5">
              {trip.stays.map((s) => (
                <li key={s.id} className="rounded-lg border border-border bg-card p-2 text-sm">
                  <span className="font-medium">{s.type} · {s.name}</span> <span className="text-muted-foreground text-xs">· {s.location} · ₹{s.totalAmount}</span>
                </li>
              ))}
            </ul>
          )}
        </Block>

        <Block title="Skipped Activities">
          {skipped.length === 0 ? <Empty text="Nothing was skipped." /> : (
            <ul className="space-y-1.5">
              {skipped.map((a) => (
                <li key={a.id} className="rounded-lg border border-border bg-card p-2 text-sm">
                  <span className="font-medium">{a.title}</span>{a.skipReason && <span className="text-muted-foreground text-xs"> · {a.skipReason}</span>}
                </li>
              ))}
            </ul>
          )}
        </Block>

        <Block title="Full Expense Breakdown">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <Tile label="Transport" value={s.transport} />
            <Tile label="Stay" value={s.stay} />
            <Tile label="Rentals" value={s.rental} />
            <Tile label="Food" value={foodTotal} />
            <Tile label="Activities" value={s.activities} />
            <Tile label="Other" value={otherTotal} />
            <div className="col-span-2 sm:col-span-3 rounded-xl border border-border bg-card p-3">
              <div className="flex items-center justify-between">
                <div><div className="text-xs text-muted-foreground">Total actual spent</div><div className="text-xl font-semibold">₹{Math.round(s.total)}</div></div>
                <div className="text-right"><div className="text-xs text-muted-foreground">Per person</div><div className="text-xl font-semibold">₹{Math.round(per)}</div></div>
              </div>
            </div>
          </div>
        </Block>
      </main>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-xl bg-white/15 px-3 py-2">
      <div className="text-[11px] opacity-80">{label}</div>
      <div className="text-lg font-semibold">{value}</div>
    </div>
  );
}
function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-2 animate-fade-in">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">{title}</h2>
      {children}
    </section>
  );
}
function Empty({ text }: { text: string }) {
  return <div className="rounded-lg border border-dashed border-border bg-card/50 p-4 text-center text-xs text-muted-foreground">{text}</div>;
}
function Tile({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-border bg-card p-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-base font-semibold">₹{Math.round(value)}</div>
    </div>
  );
}