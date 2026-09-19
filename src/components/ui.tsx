import Link from "next/link";
import { ReactNode } from "react";
import { priorityTone, statusTone, STATUS_LABEL, PRIORITY_LABEL } from "@/lib/constants";

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-lg border border-line bg-white shadow-card ${className}`}>{children}</div>
  );
}

export function CardHead({ title, hint, action }: { title: string; hint?: string; action?: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
      <div>
        <h2 className="font-display text-base font-semibold text-ink">{title}</h2>
        {hint && <p className="mt-0.5 text-sm text-ink-muted">{hint}</p>}
      </div>
      {action}
    </div>
  );
}

export function Field({
  label,
  htmlFor,
  required,
  hint,
  children,
}: {
  label: string;
  htmlFor?: string;
  required?: boolean;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="block text-sm font-medium text-ink-soft">
        {label} {required && <span className="text-clay">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-ink-muted">{hint}</p>}
    </div>
  );
}

const control =
  "w-full rounded-md border border-line bg-white px-3 py-2 text-sm text-ink placeholder:text-ink-muted/70 focus:border-civic focus:outline-none focus:ring-2 focus:ring-civic/20 disabled:bg-paper";

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${control} ${props.className ?? ""}`} />;
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${control} ${props.className ?? ""}`} />;
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`${control} ${props.className ?? ""}`} />;
}

export function Button({
  children,
  variant = "primary",
  className = "",
  ...rest
}: { variant?: "primary" | "ghost" | "outline" } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const styles = {
    primary: "bg-civic text-white hover:bg-civic-dark",
    outline: "border border-line bg-white text-ink hover:border-civic hover:text-civic",
    ghost: "text-ink-soft hover:bg-paper",
  }[variant];
  return (
    <button
      {...rest}
      className={`inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:opacity-60 ${styles} ${className}`}
    >
      {children}
    </button>
  );
}

export function LinkButton({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "outline";
}) {
  const styles =
    variant === "primary"
      ? "bg-civic text-white hover:bg-civic-dark"
      : "border border-line bg-white text-ink hover:border-civic hover:text-civic";
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${styles}`}
    >
      {children}
    </Link>
  );
}

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusTone(status)}`}>
      {STATUS_LABEL[status] ?? status}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: string }) {
  return (
    <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${priorityTone(priority)}`}>
      {PRIORITY_LABEL[priority] ?? priority} priority
    </span>
  );
}

export function Alert({ tone = "error", children }: { tone?: "error" | "info" | "success"; children: ReactNode }) {
  const styles = {
    error: "border-clay/40 bg-clay-light text-clay",
    info: "border-line bg-paper text-ink-soft",
    success: "border-civic/30 bg-civic-light text-civic-dark",
  }[tone];
  return <div className={`rounded-md border px-3 py-2 text-sm ${styles}`}>{children}</div>;
}

export function Empty({ title, body, action }: { title: string; body: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-3 px-6 py-14 text-center">
      <h3 className="font-display text-lg font-semibold text-ink">{title}</h3>
      <p className="max-w-sm text-sm text-ink-muted">{body}</p>
      {action}
    </div>
  );
}

export function Placeholder({ children }: { children: ReactNode }) {
  return (
    <span className="ml-2 rounded border border-dashed border-line px-1.5 py-0.5 text-[11px] text-ink-muted">
      {children}
    </span>
  );
}
