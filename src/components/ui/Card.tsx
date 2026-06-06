interface CardProps {
  title?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function Card({ title, action, children, className = "" }: CardProps) {
  return (
    <section
      className={`rounded-xl border border-border bg-sidebar p-5 shadow-sm ${className}`}
    >
      {(title || action) && (
        <div className="mb-4 flex items-center justify-between gap-4">
          {title && <h3 className="text-base font-semibold">{title}</h3>}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}
