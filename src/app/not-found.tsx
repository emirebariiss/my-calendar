import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <p className="text-6xl font-bold text-muted">404</p>
      <h1 className="text-xl font-semibold">Sayfa bulunamadı</h1>
      <p className="max-w-sm text-sm text-muted">
        Aradığınız süreç veya sayfa mevcut değil veya silinmiş olabilir.
      </p>
      <Link
        href="/"
        className="mt-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-blue-700"
      >
        Ana sayfaya dön
      </Link>
    </div>
  );
}