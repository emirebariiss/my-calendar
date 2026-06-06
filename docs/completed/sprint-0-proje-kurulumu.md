# Sprint 0 — Proje Kurulumu

> **Hedef:** Çalışan bir Next.js iskeleti ve sayfalar arası gezinme.

Merhaba! Bu sprintte projenin "iskeletini" kurduk. Henüz gerçek özellik yok — sadece uygulamanın dış çerçevesi, menüsü ve boş sayfaları var. Bir evin duvarlarını örmek gibi düşün.

---

## 1. Next.js Projesi Neden Manuel Kuruldu?

Normalde şu komutla proje oluşturulur:

```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir
```

Ama klasörde zaten `README.md` ve `docs/` vardı. `create-next-app` dolu klasörde çalışmaz. Bu yüzden şu dosyaları **elle** oluşturduk:

| Dosya | Ne işe yarar? |
|-------|---------------|
| `package.json` | Proje adı, bağımlılıklar, script'ler (`dev`, `build`, `lint`) |
| `tsconfig.json` | TypeScript ayarları — `strict: true` açık |
| `next.config.ts` | Next.js yapılandırması |
| `postcss.config.mjs` | Tailwind CSS için PostCSS |
| `eslint.config.mjs` | Kod kalitesi kuralları |

**Öğrenmen gereken:** Bir Next.js projesi sadece `create-next-app` ile değil, bu dosyaların kombinasyonuyla da oluşturulabilir.

---

## 2. Klasör Yapısı

```
src/
├── app/           → Sayfalar (URL = klasör yolu)
├── components/    → Tekrar kullanılan UI parçaları
├── data/          → Mock JSON dosyaları (Sprint 1'de dolduruldu)
├── hooks/         → Custom React hook'ları
├── lib/           → Tipler, yardımcı fonksiyonlar
└── providers/     → Global state (Sprint 2'de eklendi)
```

**Next.js App Router kuralı:** `src/app/tasks/page.tsx` dosyası otomatik olarak `/tasks` URL'sine karşılık gelir. Ekstra route tanımı gerekmez.

---

## 3. Layout Bileşenleri

Uygulamanın her sayfasında görünen ortak parçalar:

### Sidebar (`src/components/layout/Sidebar.tsx`)

Sol menü. 5 link içerir:
- Dashboard → `/`
- Takvim → `/calendar`
- Görevler → `/tasks`
- Süreçler → `/workflows`
- Hatırlatmalar → `/reminders`

**Önemli kod — aktif sayfa vurgusu:**

```tsx
const pathname = usePathname();
const isActive = item.href === "/"
  ? pathname === "/"
  : pathname.startsWith(item.href);
```

`usePathname()` hook'u şu an hangi URL'de olduğunu verir. Aktif linke mavi arka plan uygularız.

### Header (`src/components/layout/Header.tsx`)

Üst bar. Sayfa başlığını gösterir. `PAGE_TITLES` sabitinden başlık alır.

### AppShell (`src/components/layout/AppShell.tsx`)

Sidebar + Header + içerik alanını bir araya getirir. Tüm sayfalar bu kabuk içinde render edilir.

---

## 4. Root Layout

`src/app/layout.tsx` — Next.js'te **en dış katman**.

Burada yaptıklarımız:
1. Google Font (Geist) yükleme
2. `AppProvider` ile global state sarmalama (Sprint 2)
3. `AppShell` ile layout uygulama
4. `globals.css` import

Her sayfa otomatik olarak bu layout'un içine yerleşir.

---

## 5. Sayfa Route'ları

| URL | Dosya | İlk durum |
|-----|-------|-----------|
| `/` | `src/app/page.tsx` | Dashboard |
| `/calendar` | `src/app/calendar/page.tsx` | Placeholder |
| `/tasks` | `src/app/tasks/page.tsx` | Görev listesi |
| `/workflows` | `src/app/workflows/page.tsx` | Süreç listesi |
| `/workflows/[id]` | `src/app/workflows/[id]/page.tsx` | Dinamik detay |
| `/reminders` | `src/app/reminders/page.tsx` | Hatırlatma listesi |

`[id]` klasör adı **dinamik route** demek. `/workflows/wf-001` gibi URL'ler bu sayfaya gider.

---

## 6. Tailwind CSS

`src/app/globals.css` dosyasında Tailwind import edilir:

```css
@import "tailwindcss";
```

CSS değişkenleri ile renk paleti tanımlandı (`--primary`, `--border` vb.). Bileşenlerde `className="bg-primary"` gibi kullanılır.

---

## 7. Kontrol Listesi

Sprint 0 bittiğinde şunları doğrula:

- [x] `npm install` çalışıyor
- [x] `npm run dev` ile uygulama açılıyor
- [x] Sidebar'dan tüm sayfalara gidilebiliyor
- [x] Aktif sayfa menüde vurgulanıyor
- [x] `npm run build` hatasız

---

## 8. Sık Sorulan Sorular

**S: `"use client"` ne demek?**  
C: Next.js varsayılan olarak Server Component kullanır. `useState`, `usePathname` gibi browser hook'ları için dosyanın en üstüne `"use client"` yazmalısın.

**S: `@/` import'u nereden geliyor?**  
C: `tsconfig.json` içindeki `paths` ayarı. `@/components/...` aslında `src/components/...` demek.

**S: Neden `public/` klasörü yok?**  
C: Henüz statik dosya (favicon, resim) eklemedik. İleride eklenebilir.

---

## Sonraki Adım

→ [Sprint 1 — Tipler ve Mock Veri](./sprint-1-tipler-ve-mock-veri.md)
