import { useState, type ReactNode } from "react";
import { Plus, Trash2, Pencil } from "lucide-react";
import { Field, TextInput, TextArea, Select, Modal, PrimaryBtn, GhostBtn } from "./Field";
import { EmptyState } from "./EmptyState";
import { uid } from "@/lib/trips";
import type { Member, Transport, Stay, Rental, Activity, Expense } from "@/lib/trips";

function SectionList<T extends { id: string }>(props: {
  items: T[];
  onChange: (next: T[]) => void;
  blank: () => T;
  emptyIcon: ReactNode;
  emptyText: string;
  addLabel: string;
  title: string;
  renderCard: (item: T) => ReactNode;
  renderForm: (draft: T, set: (patch: Partial<T>) => void) => ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<T | null>(null);
  const startAdd = () => { setDraft(props.blank()); setOpen(true); };
  const startEdit = (it: T) => { setDraft({ ...it }); setOpen(true); };
  const save = () => {
    if (!draft) return;
    const exists = props.items.some((i) => i.id === draft.id);
    props.onChange(exists ? props.items.map((i) => (i.id === draft.id ? draft : i)) : [...props.items, draft]);
    setOpen(false); setDraft(null);
  };
  const remove = (id: string) => props.onChange(props.items.filter((i) => i.id !== id));
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">{props.title}</h3>
        <PrimaryBtn onClick={startAdd}><Plus className="h-4 w-4" /> {props.addLabel}</PrimaryBtn>
      </div>
      {props.items.length === 0 ? (
        <EmptyState icon={props.emptyIcon} title={props.emptyText}
          action={<PrimaryBtn onClick={startAdd}><Plus className="h-4 w-4" /> {props.addLabel}</PrimaryBtn>} />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {props.items.map((it) => (
            <div key={it.id} className="rounded-xl border border-border bg-card p-4 card-hover">
              {props.renderCard(it)}
              <div className="mt-3 flex justify-end gap-2">
                <GhostBtn onClick={() => startEdit(it)}><Pencil className="h-3.5 w-3.5" /> Edit</GhostBtn>
                <GhostBtn onClick={() => remove(it.id)} className="text-destructive"><Trash2 className="h-3.5 w-3.5" /> Delete</GhostBtn>
              </div>
            </div>
          ))}
        </div>
      )}
      <Modal open={open} onClose={() => setOpen(false)} title={props.addLabel}>
        {draft && (
          <div className="space-y-3">
            {props.renderForm(draft, (patch) => setDraft({ ...draft, ...patch }))}
            <div className="flex justify-end gap-2 pt-2">
              <GhostBtn onClick={() => setOpen(false)}>Cancel</GhostBtn>
              <PrimaryBtn onClick={save}>Save</PrimaryBtn>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

const grid = "grid grid-cols-1 sm:grid-cols-2 gap-3";

export function MembersSection({ items, onChange }: { items: Member[]; onChange: (n: Member[]) => void }) {
  return <SectionList<Member>
    items={items} onChange={onChange}
    blank={() => ({ id: uid(), name: "", phone: "", role: "" })}
    title="Members" addLabel="Add Member"
    emptyIcon={<span className="text-3xl">👥</span>} emptyText="No members added yet"
    renderCard={(m) => (
      <div>
        <div className="font-medium">{m.name || "—"}</div>
        <div className="text-xs text-muted-foreground">{m.role || "Member"}{m.phone ? ` · ${m.phone}` : ""}</div>
      </div>
    )}
    renderForm={(d, set) => (
      <div className={grid}>
        <Field label="Name"><TextInput value={d.name} onChange={(e) => set({ name: e.target.value })} /></Field>
        <Field label="Phone (optional)"><TextInput value={d.phone ?? ""} onChange={(e) => set({ phone: e.target.value })} /></Field>
        <Field label="Role (optional)"><TextInput value={d.role ?? ""} onChange={(e) => set({ role: e.target.value })} /></Field>
      </div>
    )}
  />;
}

export function TransportSection({ items, onChange }: { items: Transport[]; onChange: (n: Transport[]) => void }) {
  return <SectionList<Transport>
    items={items} onChange={onChange}
    blank={() => ({ id: uid(), type: "", name: "", number: "", fromLocation: "", toLocation: "", startDate: "", startTime: "", reachDate: "", reachTime: "", pricePerPerson: 0, totalPrice: 0, notes: "" })}
    title="Transport" addLabel="Add Transport"
    emptyIcon={<span className="text-3xl">🚆</span>} emptyText="No transport added yet"
    renderCard={(t) => (
      <div>
        <div className="font-medium">{t.type} · {t.name} {t.number && <span className="text-muted-foreground">({t.number})</span>}</div>
        <div className="text-xs text-muted-foreground">{t.fromLocation} → {t.toLocation}</div>
        <div className="text-xs text-muted-foreground">{t.startDate} {t.startTime} → {t.reachDate} {t.reachTime}</div>
        <div className="mt-1 text-sm">₹{t.totalPrice} <span className="text-xs text-muted-foreground">(₹{t.pricePerPerson}/person)</span></div>
      </div>
    )}
    renderForm={(d, set) => (
      <div className={grid}>
        <Field label="Type"><Select options={["Train","Bus","Flight","Car","Bike","Other"]} value={d.type} onChange={(e) => set({ type: e.target.value })} /></Field>
        <Field label="Transport name"><TextInput value={d.name} onChange={(e) => set({ name: e.target.value })} /></Field>
        <Field label="Bus / Train / Flight number"><TextInput value={d.number ?? ""} onChange={(e) => set({ number: e.target.value })} /></Field>
        <div />
        <Field label="From"><TextInput value={d.fromLocation} onChange={(e) => set({ fromLocation: e.target.value })} /></Field>
        <Field label="To"><TextInput value={d.toLocation} onChange={(e) => set({ toLocation: e.target.value })} /></Field>
        <Field label="Start date"><TextInput type="date" value={d.startDate} onChange={(e) => set({ startDate: e.target.value })} /></Field>
        <Field label="Start time"><TextInput type="time" value={d.startTime} onChange={(e) => set({ startTime: e.target.value })} /></Field>
        <Field label="Reach date"><TextInput type="date" value={d.reachDate} onChange={(e) => set({ reachDate: e.target.value })} /></Field>
        <Field label="Reach time"><TextInput type="time" value={d.reachTime} onChange={(e) => set({ reachTime: e.target.value })} /></Field>
        <Field label="Price per person"><TextInput type="number" value={d.pricePerPerson} onChange={(e) => set({ pricePerPerson: +e.target.value })} /></Field>
        <Field label="Total price"><TextInput type="number" value={d.totalPrice} onChange={(e) => set({ totalPrice: +e.target.value })} /></Field>
        <div className="sm:col-span-2"><Field label="Notes"><TextArea value={d.notes ?? ""} onChange={(e) => set({ notes: e.target.value })} /></Field></div>
      </div>
    )}
  />;
}

export function StaySection({ items, onChange }: { items: Stay[]; onChange: (n: Stay[]) => void }) {
  return <SectionList<Stay>
    items={items} onChange={onChange}
    blank={() => ({ id: uid(), type: "", name: "", location: "", checkInDate: "", checkInTime: "", checkOutDate: "", checkOutTime: "", totalAmount: 0, paidBy: "", notes: "" })}
    title="Stay" addLabel="Add Stay"
    emptyIcon={<span className="text-3xl">🏨</span>} emptyText="No stay details added yet"
    renderCard={(s) => (
      <div>
        <div className="font-medium">{s.type} · {s.name}</div>
        <div className="text-xs text-muted-foreground">{s.location}</div>
        <div className="text-xs text-muted-foreground">{s.checkInDate} {s.checkInTime} → {s.checkOutDate} {s.checkOutTime}</div>
        <div className="mt-1 text-sm">₹{s.totalAmount} {s.paidBy && <span className="text-xs text-muted-foreground">· paid by {s.paidBy}</span>}</div>
      </div>
    )}
    renderForm={(d, set) => (
      <div className={grid}>
        <Field label="Type"><Select options={["Hotel","Room","Resort","Airbnb","Other"]} value={d.type} onChange={(e) => set({ type: e.target.value })} /></Field>
        <Field label="Name"><TextInput value={d.name} onChange={(e) => set({ name: e.target.value })} /></Field>
        <Field label="Location"><TextInput value={d.location} onChange={(e) => set({ location: e.target.value })} /></Field>
        <div />
        <Field label="Check-in date"><TextInput type="date" value={d.checkInDate} onChange={(e) => set({ checkInDate: e.target.value })} /></Field>
        <Field label="Check-in time"><TextInput type="time" value={d.checkInTime} onChange={(e) => set({ checkInTime: e.target.value })} /></Field>
        <Field label="Check-out date"><TextInput type="date" value={d.checkOutDate} onChange={(e) => set({ checkOutDate: e.target.value })} /></Field>
        <Field label="Check-out time"><TextInput type="time" value={d.checkOutTime} onChange={(e) => set({ checkOutTime: e.target.value })} /></Field>
        <Field label="Total amount"><TextInput type="number" value={d.totalAmount} onChange={(e) => set({ totalAmount: +e.target.value })} /></Field>
        <Field label="Paid by"><TextInput value={d.paidBy ?? ""} onChange={(e) => set({ paidBy: e.target.value })} /></Field>
        <div className="sm:col-span-2"><Field label="Notes"><TextArea value={d.notes ?? ""} onChange={(e) => set({ notes: e.target.value })} /></Field></div>
      </div>
    )}
  />;
}

export function RentalsSection({ items, onChange }: { items: Rental[]; onChange: (n: Rental[]) => void }) {
  return <SectionList<Rental>
    items={items} onChange={onChange}
    blank={() => ({ id: uid(), type: "", shopName: "", location: "", vehicleName: "", vehicleNumber: "", startDate: "", startTime: "", returnDate: "", returnTime: "", price: 0, deposit: 0, notes: "" })}
    title="Rentals" addLabel="Add Rental"
    emptyIcon={<span className="text-3xl">🛵</span>} emptyText="No rentals added yet"
    renderCard={(r) => (
      <div>
        <div className="font-medium">{r.type} · {r.vehicleName} {r.vehicleNumber && <span className="text-muted-foreground">({r.vehicleNumber})</span>}</div>
        <div className="text-xs text-muted-foreground">{r.shopName} · {r.location}</div>
        <div className="text-xs text-muted-foreground">{r.startDate} {r.startTime} → {r.returnDate} {r.returnTime}</div>
        <div className="mt-1 text-sm">₹{r.price} <span className="text-xs text-muted-foreground">· deposit ₹{r.deposit}</span></div>
      </div>
    )}
    renderForm={(d, set) => (
      <div className={grid}>
        <Field label="Type"><Select options={["Bike","Car","Scooter","Other"]} value={d.type} onChange={(e) => set({ type: e.target.value })} /></Field>
        <Field label="Shop name"><TextInput value={d.shopName} onChange={(e) => set({ shopName: e.target.value })} /></Field>
        <Field label="Location"><TextInput value={d.location} onChange={(e) => set({ location: e.target.value })} /></Field>
        <Field label="Vehicle name"><TextInput value={d.vehicleName} onChange={(e) => set({ vehicleName: e.target.value })} /></Field>
        <Field label="Vehicle number (optional)"><TextInput value={d.vehicleNumber ?? ""} onChange={(e) => set({ vehicleNumber: e.target.value })} /></Field>
        <div />
        <Field label="Start date"><TextInput type="date" value={d.startDate} onChange={(e) => set({ startDate: e.target.value })} /></Field>
        <Field label="Start time"><TextInput type="time" value={d.startTime} onChange={(e) => set({ startTime: e.target.value })} /></Field>
        <Field label="Return date"><TextInput type="date" value={d.returnDate} onChange={(e) => set({ returnDate: e.target.value })} /></Field>
        <Field label="Return time"><TextInput type="time" value={d.returnTime} onChange={(e) => set({ returnTime: e.target.value })} /></Field>
        <Field label="Price"><TextInput type="number" value={d.price} onChange={(e) => set({ price: +e.target.value })} /></Field>
        <Field label="Deposit"><TextInput type="number" value={d.deposit} onChange={(e) => set({ deposit: +e.target.value })} /></Field>
        <div className="sm:col-span-2"><Field label="Notes"><TextArea value={d.notes ?? ""} onChange={(e) => set({ notes: e.target.value })} /></Field></div>
      </div>
    )}
  />;
}

export function ItinerarySection({ items, onChange }: { items: Activity[]; onChange: (n: Activity[]) => void }) {
  return <SectionList<Activity>
    items={items} onChange={onChange}
    blank={() => ({ id: uid(), day: 1, date: "", startTime: "", endTime: "", title: "", place: "", location: "", goingBy: "", fromLocation: "", toLocation: "", estimatedCost: 0, notes: "", status: "pending" })}
    title="Itinerary" addLabel="Add Activity"
    emptyIcon={<span className="text-3xl">🗺️</span>} emptyText="No itinerary activities added yet"
    renderCard={(a) => (
      <div>
        <div className="flex items-center justify-between gap-2">
          <div className="font-medium">Day {a.day} · {a.title}</div>
          <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px]">{a.status}</span>
        </div>
        <div className="text-xs text-muted-foreground">{a.date} · {a.startTime} – {a.endTime}</div>
        <div className="text-xs text-muted-foreground">{a.place}{a.location ? ` · ${a.location}` : ""}</div>
        {a.fromLocation && <div className="text-xs text-muted-foreground">{a.goingBy}: {a.fromLocation} → {a.toLocation}</div>}
        <div className="mt-1 text-sm">Est. ₹{a.estimatedCost}{a.actualCost != null ? ` · Actual ₹${a.actualCost}` : ""}</div>
      </div>
    )}
    renderForm={(d, set) => (
      <div className={grid}>
        <Field label="Day number"><TextInput type="number" value={d.day} onChange={(e) => set({ day: +e.target.value })} /></Field>
        <Field label="Date"><TextInput type="date" value={d.date} onChange={(e) => set({ date: e.target.value })} /></Field>
        <Field label="Start time"><TextInput type="time" value={d.startTime} onChange={(e) => set({ startTime: e.target.value })} /></Field>
        <Field label="End / expected time"><TextInput type="time" value={d.endTime} onChange={(e) => set({ endTime: e.target.value })} /></Field>
        <Field label="Activity title"><TextInput value={d.title} onChange={(e) => set({ title: e.target.value })} /></Field>
        <Field label="Place name"><TextInput value={d.place} onChange={(e) => set({ place: e.target.value })} /></Field>
        <Field label="Location"><TextInput value={d.location} onChange={(e) => set({ location: e.target.value })} /></Field>
        <Field label="Going by"><Select options={["Walk","Bike","Car","Bus","Train","Auto","Taxi","Other"]} value={d.goingBy} onChange={(e) => set({ goingBy: e.target.value })} /></Field>
        <Field label="From location"><TextInput value={d.fromLocation} onChange={(e) => set({ fromLocation: e.target.value })} /></Field>
        <Field label="To location"><TextInput value={d.toLocation} onChange={(e) => set({ toLocation: e.target.value })} /></Field>
        <Field label="Estimated cost"><TextInput type="number" value={d.estimatedCost} onChange={(e) => set({ estimatedCost: +e.target.value })} /></Field>
        <Field label="Mark as Return Home">
          <Select options={["No","Yes"]} value={d.isReturnHome ? "Yes" : "No"} onChange={(e) => set({ isReturnHome: e.target.value === "Yes" })} />
        </Field>
        <div className="sm:col-span-2"><Field label="Notes"><TextArea value={d.notes ?? ""} onChange={(e) => set({ notes: e.target.value })} /></Field></div>
      </div>
    )}
  />;
}

export function ExpensesSection({ items, onChange }: { items: Expense[]; onChange: (n: Expense[]) => void }) {
  return <SectionList<Expense>
    items={items} onChange={onChange}
    blank={() => ({ id: uid(), title: "", category: "", date: "", time: "", amount: 0, paidBy: "", splitBetween: 1, notes: "" })}
    title="Expenses" addLabel="Add Expense"
    emptyIcon={<span className="text-3xl">💰</span>} emptyText="No expenses added yet"
    renderCard={(x) => (
      <div>
        <div className="font-medium">{x.title} <span className="text-xs text-muted-foreground">· {x.category}</span></div>
        <div className="text-xs text-muted-foreground">{x.date} {x.time}{x.paidBy ? ` · paid by ${x.paidBy}` : ""}</div>
        <div className="mt-1 text-sm">₹{x.amount} <span className="text-xs text-muted-foreground">· split {x.splitBetween}</span></div>
      </div>
    )}
    renderForm={(d, set) => (
      <div className={grid}>
        <Field label="Title"><TextInput value={d.title} onChange={(e) => set({ title: e.target.value })} /></Field>
        <Field label="Category"><Select options={["Breakfast","Lunch","Dinner","Snacks","Fuel","Entry Ticket","Shopping","Other"]} value={d.category} onChange={(e) => set({ category: e.target.value })} /></Field>
        <Field label="Date"><TextInput type="date" value={d.date} onChange={(e) => set({ date: e.target.value })} /></Field>
        <Field label="Time"><TextInput type="time" value={d.time} onChange={(e) => set({ time: e.target.value })} /></Field>
        <Field label="Amount"><TextInput type="number" value={d.amount} onChange={(e) => set({ amount: +e.target.value })} /></Field>
        <Field label="Paid by"><TextInput value={d.paidBy ?? ""} onChange={(e) => set({ paidBy: e.target.value })} /></Field>
        <Field label="Split between (count)"><TextInput type="number" value={d.splitBetween} onChange={(e) => set({ splitBetween: +e.target.value })} /></Field>
        <div className="sm:col-span-2"><Field label="Notes"><TextArea value={d.notes ?? ""} onChange={(e) => set({ notes: e.target.value })} /></Field></div>
      </div>
    )}
  />;
}