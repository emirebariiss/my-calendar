interface SpinnerProps {
    label?: string;
  }
  
  export function Spinner({ label = "Yükleniyor..." }: SpinnerProps) {
    return (
      <div
        className="flex flex-col items-center gap-3"
        role="status"
        aria-live="polite"
      >
        <div
          className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-primary"
          aria-hidden="true"
        />
        <p className="text-sm text-muted">{label}</p>
      </div>
    );
  }