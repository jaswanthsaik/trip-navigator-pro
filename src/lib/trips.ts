import { useSyncExternalStore } from "react";

export type TripStatus = "planned" | "in_progress" | "completed";
export type ItemStatus = "pending" | "completed" | "skipped";

export interface Member { id: string; name: string; phone?: string; role?: string }
export interface Transport {
  id: string; type: string; name: string; number?: string;
  fromLocation: string; toLocation: string;
  startDate: string; startTime: string; reachDate: string; reachTime: string;
  pricePerPerson: number; totalPrice: number; notes?: string;
}
export interface Stay {
  id: string; type: string; name: string; location: string;
  checkInDate: string; checkInTime: string; checkOutDate: string; checkOutTime: string;
  totalAmount: number; paidBy?: string; notes?: string;
}
export interface Rental {
  id: string; type: string; shopName: string; location: string;
  vehicleName: string; vehicleNumber?: string;
  startDate: string; startTime: string; returnDate: string; returnTime: string;
  price: number; deposit: number; notes?: string;
}
export interface Activity {
  id: string; day: number; date: string; startTime: string; endTime: string;
  title: string; place: string; location: string; goingBy: string;
  fromLocation: string; toLocation: string; estimatedCost: number; notes?: string;
  status: ItemStatus; actualCost?: number; skipReason?: string; isReturnHome?: boolean;
}
export interface Expense {
  id: string; title: string; category: string; date: string; time: string;
  amount: number; paidBy?: string; splitBetween: number; notes?: string;
}

export interface Trip {
  id: string; name: string; destination: string;
  startDate: string; endDate: string; days: number; notes?: string;
  status: TripStatus;
  members: Member[]; transports: Transport[]; stays: Stay[];
  rentals: Rental[]; itinerary: Activity[]; expenses: Expense[];
  createdAt: number; completedAt?: number;
}

const KEY = "tripmate.trips.v1";
const listeners = new Set<() => void>();

function read(): Trip[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(KEY) ?? "[]"); } catch { return []; }
}
function write(trips: Trip[]) {
  localStorage.setItem(KEY, JSON.stringify(trips));
  listeners.forEach((l) => l());
}

export const uid = () => Math.random().toString(36).slice(2, 10);

export function useTrips(): Trip[] {
  return useSyncExternalStore(
    (cb) => { listeners.add(cb); return () => listeners.delete(cb); },
    read,
    () => [],
  );
}

export function getTrip(id: string): Trip | undefined {
  return read().find((t) => t.id === id);
}

export function saveTrip(trip: Trip) {
  const trips = read();
  const idx = trips.findIndex((t) => t.id === trip.id);
  if (idx >= 0) trips[idx] = trip; else trips.push(trip);
  write(trips);
}

export function updateTrip(id: string, mut: (t: Trip) => Trip) {
  const trips = read();
  const idx = trips.findIndex((t) => t.id === id);
  if (idx < 0) return;
  trips[idx] = mut({ ...trips[idx] });
  write(trips);
}

export function deleteTrip(id: string) {
  write(read().filter((t) => t.id !== id));
}

export function createBlankTrip(): Trip {
  return {
    id: uid(), name: "", destination: "", startDate: "", endDate: "", days: 1, notes: "",
    status: "planned", members: [], transports: [], stays: [],
    rentals: [], itinerary: [], expenses: [], createdAt: Date.now(),
  };
}

export function estimatedBudget(trip: Trip) {
  const transport = trip.transports.reduce((s, t) => s + (Number(t.totalPrice) || 0), 0);
  const stay = trip.stays.reduce((s, t) => s + (Number(t.totalAmount) || 0), 0);
  const rental = trip.rentals.reduce((s, t) => s + (Number(t.price) || 0), 0);
  const food = trip.expenses.reduce((s, t) => s + (Number(t.amount) || 0), 0);
  const itinerary = trip.itinerary.reduce((s, t) => s + (Number(t.estimatedCost) || 0), 0);
  const total = transport + stay + rental + food + itinerary;
  const perPerson = trip.members.length ? total / trip.members.length : total;
  return { transport, stay, rental, food, itinerary, total, perPerson };
}

export function actualSpent(trip: Trip) {
  const transport = trip.transports.reduce((s, t) => s + (Number(t.totalPrice) || 0), 0);
  const stay = trip.stays.reduce((s, t) => s + (Number(t.totalAmount) || 0), 0);
  const rental = trip.rentals.reduce((s, t) => s + (Number(t.price) || 0), 0);
  const food = trip.expenses.reduce((s, t) => s + (Number(t.amount) || 0), 0);
  const activities = trip.itinerary
    .filter((a) => a.status === "completed")
    .reduce((s, a) => s + (Number(a.actualCost) || 0), 0);
  const total = transport + stay + rental + food + activities;
  return { transport, stay, rental, food, activities, total };
}