import type { ReactNode } from "react";

export function EmptyState({ icon, title, action }: { icon: ReactNode; title: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 p-10 text-center animate-fade-in">
      <div className="mb-3 text-muted-foreground">{icon}</div>
      <p className="text-sm text-muted-foreground">{title}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}