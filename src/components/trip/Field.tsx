import type { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

const baseInput =
  "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";

export function TextInput(p: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...p} className={`${baseInput} ${p.className ?? ""}`} />;
}
export function TextArea(p: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...p} rows={p.rows ?? 3} className={`${baseInput} ${p.className ?? ""}`} />;
}
export function Select(p: SelectHTMLAttributes<HTMLSelectElement> & { options: string[] }) {
  const { options, ...rest } = p;
  return (
    <select {...rest} className={`${baseInput} ${rest.className ?? ""}`}>
      <option value="">Select...</option>
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

export function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-2 sm:p-4 animate-fade-in" onClick={onClose}>
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-card shadow-2xl animate-pop-in" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 flex items-center justify-between border-b border-border bg-card px-5 py-3">
          <h3 className="font-semibold">{title}</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-xl leading-none">×</button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

export function PrimaryBtn({ children, className, ...p }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type={p.type ?? "button"} {...p}
      className={`inline-flex items-center justify-center gap-2 rounded-lg bg-[image:var(--gradient-hero)] px-4 py-2 text-sm font-medium text-primary-foreground shadow-[var(--shadow-card)] transition hover:opacity-95 active:scale-[0.98] disabled:opacity-50 ${className ?? ""}`}>
      {children}
    </button>
  );
}

export function GhostBtn({ children, className, ...p }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type={p.type ?? "button"} {...p}
      className={`inline-flex items-center justify-center gap-2 rounded-lg border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-secondary transition active:scale-[0.98] ${className ?? ""}`}>
      {children}
    </button>
  );
}