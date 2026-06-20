import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, Check, X, MapPin, Clock, Navigation } from "lucide-react";
import { AppHeader } from "@/components/trip/AppHeader";
import { Field, TextInput, Modal, PrimaryBtn, GhostBtn, TextArea } from "@/components/trip/Field";
import { StatusBadge } from "@/components/trip/StatusBadge";
import { EmptyState } from "@/components/trip/EmptyState";
import { useTrips, updateTrip, actualSpent, estimatedBudget, type Activity } from "@/lib/trips";

export const Route = createFileRoute("/trips/$id/live")({
  head: () => ({ meta: [{ title: "Live Trip — TripMate" }] }),
  component: LivePage,
});

function LivePage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const trip = useTrips().find((t) => t.id === id);

  const [completeFor, setCompleteFor] = useState<Activity | null>(null);
  const [skipFor, setSkipFor] = useState<Activity | null>(null);
  const [actualCost, setActualCost] = useState("");
  const [skipReason, setSkipReason] = useState("");

  // Ensure trip flagged in_progress on mount via render check
  useMemo(() => {
    if (trip && trip.status === "planned") updateTrip(trip.id, (t) => ({ ...t, status: "in_progress" }));
  }, [trip?.id]);

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

  const ordered = [...trip.itinerary].sort((a, b) =>
    (a.day - b.day) || a.startTime.localeCompare(b.startTime));
  const pending = ordered.filter((a) => a.status === "pending");
  const completed = ordered.filter((a) => a.status === "completed");
  const skipped = ordered.filter((a) => a.status === "skipped");
  const current = pending[0];
  const next = pending[1];
  const total = ordered.length || 1;
  const progress = Math.round(((completed.length + skipped.length) / total) * 100);
  const spent = actualSpent(trip);
  const est = estimatedBudget(trip);

  const markStatus = (act: Activity, patch: Partial<Activity>) => {
    const updatedItin = trip.itinerary.map((a) => (a.id === act.id ? { ...a, ...patch } : a));
    const allFinal = updatedItin.length > 0 && updatedItin.every((a) => a.status !== "pending");
    const finalReturnDone = updatedItin.some((a) => a.isReturnHome && a.status === "completed");
    let nextStatus = trip.status;
    let completedAt: number | undefined = trip.completedAt;
    if (finalReturnDone || allFinal) { nextStatus = "completed"; completedAt = Date.now(); }
    updateTrip(trip.id, (t) => ({ ...t, itinerary: updatedItin, status: nextStatus, completedAt }));
    if (nextStatus === "completed") {
      setCompleteFor(null); setSkipFor(null);
      navigate({ to: "/trips/$id/result", params: { id: trip.id } });
    }
  };

  const openComplete = (a: Activity) => { setActualCost(""); setCompleteFor(a); };
  const submitComplete = (cost: number) => {
    if (!completeFor) return;
    markStatus(completeFor, { status: "completed", actualCost: cost });
    setCompleteFor(null);
  };
  const openSkip = (a: Activity) => { setSkipReason(""); setSkipFor(a); };
  const submitSkip = () => {
    if (!skipFor) return;
    markStatus(skipFor, { status: "skipped", skipReason });
    setSkipFor(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="mx-auto max-w-3xl px-4 py-6 space-y-5">
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Home</Link>

        <div className="rounded-2xl bg-[image:var(--gradient-hero)] p-5 text-primary-foreground shadow-[var(--shadow-card)]">
          <div className="text-xs opacity-80">Live Trip</div>
          <h1 className="text-xl font-semibold">{trip.name}</h1>
          <div className="text-sm opacity-90">Day {current?.day ?? "—"} · {current?.title ?? "All activities done"}</div>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/25">
            <div className="h-full bg-white transition-all" style={{ width: `${progress}%` }} />
          </div>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs">
            <span>Completed: {completed.length}</span>
            <span>Skipped: {skipped.length}</span>
            <span>Spent: ₹{Math.round(spent.total)} / ₹{Math.round(est.total)}</span>
            <span>{progress}%</span>
          </div>
        </div>

        {next && (
          <div className="rounded-xl border border-border bg-card p-3 text-sm">
            <span className="text-xs text-muted-foreground">Up next:</span> <span className="font-medium">{next.title}</span> · {next.startTime}
          </div>
        )}

        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Pending Activities</h2>
          {pending.length === 0 ? (
            <EmptyState icon={<Check className="h-10 w-10" />} title="All activities done." />
          ) : (
            pending.map((a) => (
              <div key={a.id} className="rounded-2xl border border-border bg-card p-4 card-hover animate-fade-in">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-semibold">Day {a.day} · {a.title}{a.isReturnHome && <span className="ml-2 text-xs text-primary">↩ return home</span>}</div>
                    <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" />{a.startTime}{a.endTime ? ` – ${a.endTime}` : ""}</span>
                      <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{a.place || a.location || "—"}</span>
                      {a.fromLocation && <span className="inline-flex items-center gap-1"><Navigation className="h-3 w-3" />{a.goingBy}: {a.fromLocation} → {a.toLocation}</span>}
                    </div>
                    <div className="mt-1 text-sm">Estimated: ₹{a.estimatedCost}</div>
                    {a.notes && <div className="mt-1 text-xs text-muted-foreground">{a.notes}</div>}
                  </div>
                  <StatusBadge status={a.status} />
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <PrimaryBtn onClick={() => openComplete(a)}><Check className="h-4 w-4" /> Complete</PrimaryBtn>
                  <GhostBtn onClick={() => openSkip(a)}><X className="h-4 w-4" /> Skip</GhostBtn>
                </div>
              </div>
            ))
          )}
        </section>

        {completed.length > 0 && (
          <section className="space-y-2">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Completed</h2>
            {completed.map((a) => (
              <div key={a.id} className="flex items-center justify-between rounded-xl border border-border bg-card p-3 text-sm animate-fade-in">
                <div>
                  <div className="font-medium">{a.title}</div>
                  <div className="text-xs text-muted-foreground">Day {a.day} · ₹{a.actualCost ?? 0}</div>
                </div>
                <StatusBadge status="completed" />
              </div>
            ))}
          </section>
        )}

        {skipped.length > 0 && (
          <section className="space-y-2">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Skipped</h2>
            {skipped.map((a) => (
              <div key={a.id} className="flex items-center justify-between rounded-xl border border-border bg-card p-3 text-sm animate-fade-in">
                <div>
                  <div className="font-medium">{a.title}</div>
                  <div className="text-xs text-muted-foreground">Day {a.day}{a.skipReason ? ` · ${a.skipReason}` : ""}</div>
                </div>
                <StatusBadge status="skipped" />
              </div>
            ))}
          </section>
        )}
      </main>

      <Modal open={!!completeFor} onClose={() => setCompleteFor(null)} title={completeFor ? `Actual cost for "${completeFor.title}"` : ""}>
        <div className="space-y-3">
          <Field label="Amount">
            <TextInput type="number" value={actualCost} onChange={(e) => setActualCost(e.target.value)} autoFocus />
          </Field>
          <div className="flex justify-end gap-2">
            <GhostBtn onClick={() => submitComplete(0)}>Skip Cost</GhostBtn>
            <PrimaryBtn onClick={() => submitComplete(Number(actualCost) || 0)}>Save</PrimaryBtn>
          </div>
        </div>
      </Modal>

      <Modal open={!!skipFor} onClose={() => setSkipFor(null)} title={skipFor ? `Skip "${skipFor.title}"?` : ""}>
        <div className="space-y-3">
          <Field label="Reason (optional)">
            <TextArea value={skipReason} onChange={(e) => setSkipReason(e.target.value)} />
          </Field>
          <div className="flex justify-end gap-2">
            <GhostBtn onClick={() => setSkipFor(null)}>Cancel</GhostBtn>
            <PrimaryBtn onClick={submitSkip}>Confirm Skip</PrimaryBtn>
          </div>
        </div>
      </Modal>
    </div>
  );
}