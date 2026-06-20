import { Check, Clock, Plane, X, CircleDashed } from "lucide-react";

const map: Record<string, { label: string; cls: string; Icon: any }> = {
  planned: { label: "Planned", cls: "bg-secondary text-secondary-foreground", Icon: CircleDashed },
  in_progress: { label: "In Progress", cls: "bg-accent text-accent-foreground", Icon: Plane },
  completed: { label: "Completed", cls: "bg-[color:var(--success)] text-white", Icon: Check },
  skipped: { label: "Skipped", cls: "bg-muted text-muted-foreground", Icon: X },
  pending: { label: "Pending", cls: "bg-secondary text-secondary-foreground", Icon: Clock },
};

export function StatusBadge({ status }: { status: string }) {
  const v = map[status] ?? map.pending;
  const Icon = v.Icon;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${v.cls}`}>
      <Icon className="h-3 w-3" /> {v.label}
    </span>
  );
}