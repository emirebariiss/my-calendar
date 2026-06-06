interface ProgressBarProps {
  value: number;
  label?: string;
}

export function ProgressBar({ value, label }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div>
      {label && (
        <div className="mb-1 flex justify-between text-xs text-muted">
          <span>{label}</span>
          <span>%{clamped}</span>
        </div>
      )}
      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
