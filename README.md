# My Calendar

Takvim, görev yönetimi ve süreç (workflow) planlamasını tek bir uygulamada birleştiren Next.js projesi.

> **Klasik takvim + todo değil:** Gerçek hayattaki işleri modelleyen esnek bir planlama sistemi.

## Ürün Özeti

Bu uygulama üç şeyi aynı anda yönetir:

| Modül | Açıklama |
|-------|----------|
| 📅 **Takvim** | Gün / hafta / ay görünümü, time-blocking, sürükle-bırak |
| ✅ **Görevler** | Deadline'lı veya deadline'sız aktif görevler |
| 🔁 **Süreçler** | Aşamalı (multi-step) workflow görevleri |

**Temel fark:** Bir görev tek adımlı bir item olmak zorunda değil — aşamalı ilerleyen bir süreç olabilir.

## Teknoloji

| Katman | Seçim |
|--------|-------|
| Framework | Next.js 15 (App Router) |
| Dil | TypeScript (strict) |
| Stil | Tailwind CSS 4 |
| Takvim | FullCalendar 6 |
| Veri | Mock JSON (`src/data/`) |
| State | React Context (`AppProvider`) |
| Tarih | date-fns |

## Hızlı Başlangıç

```bash
npm install
npm run dev
```

Uygulama `http://localhost:3000` adresinde çalışır.

```bash
npm run build   # production build
npm run lint    # ESLint kontrolü
```

## Proje Yapısı

```
my-calendar/
├── .cursor/
│   ├── AGENTS.md           # AI agent proje rehberi
│   └── rules/              # Cursor kuralları (.mdc)
├── docs/
│   ├── completed/          # ⭐ Biten sprintlerin öğrenci rehberi
│   ├── 00-PRODUCT.md       # Ürün tanımı
│   ├── 01-ARCHITECTURE.md  # Mimari
│   ├── 02-MOCK-DATA.md     # Veri şemaları
│   ├── 03-INTERN-TASKS.md  # Stajyer görev listesi
│   ├── 04-MVP-CHECKLIST.md # MVP kontrol listesi
│   └── 05-ROADMAP.md       # Yol haritası
├── src/
│   ├── app/                # Sayfalar (App Router)
│   ├── components/
│   │   ├── layout/         # Sidebar, Header, AppShell
│   │   ├── ui/             # Button, Modal, Card, Badge...
│   │   ├── calendar/     # CalendarView, EventForm, EventCard
│   │   ├── dashboard/      # Dashboard widget'ları
│   │   └── tasks/          # TaskItem, TaskList, TaskForm
│   ├── data/               # Mock JSON dosyaları
│   ├── hooks/              # useTasks, useEvents...
│   ├── lib/                # Tipler, utils, mock loader
│   └── providers/          # AppProvider (global state)
└── README.md
```

## Geliştirme Durumu

| Sprint | Konu | Durum |
|--------|------|-------|
| 0 | Proje kurulumu + navigasyon | ✅ Tamamlandı |
| 1 | TypeScript tipleri + mock JSON | ✅ Tamamlandı |
| 2 | Global state + Dashboard | ✅ Tamamlandı |
| 3 | Görev CRUD | ✅ Tamamlandı |
| 4 | Takvim sistemi (FullCalendar) | ✅ Tamamlandı |
| 5 | Workflow step yönetimi | 🔜 Sıradaki |
| 6 | Hatırlatmalar | ⏳ Bekliyor |
| 7 | Cilalama + MVP tamamlama | ⏳ Bekliyor |

## MVP Kapsamı

- [x] Takvim: gün / hafta / ay görünümü, event CRUD, sürükle-bırak
- [x] Görevler: durum, öncelik, opsiyonel deadline, CRUD
- [ ] Süreçli görevler: step bazlı workflow (liste + detay var, CRUD eksik)
- [ ] Hatırlatmalar: event, task ve step bazlı (liste var, oluşturma eksik)
- [x] Dashboard: bugün, yaklaşan, aktif süreçler, overdue

**MVP ilerlemesi:** ~73% (40/55 madde)

## Stajyer / Geliştirici Rehberi

**Yeni başlayanlar için okuma sırası:**

1. [`docs/completed/README.md`](./docs/completed/README.md) — Biten sprintlerin detaylı açıklamaları (önce bunu oku!)
2. [`docs/03-INTERN-TASKS.md`](./docs/03-INTERN-TASKS.md) — Aktif görev listesi → **Sprint 5'ten devam et**
3. [`docs/01-ARCHITECTURE.md`](./docs/01-ARCHITECTURE.md) — Mimari ve klasör yapısı
4. [`docs/02-MOCK-DATA.md`](./docs/02-MOCK-DATA.md) — Mock veri şemaları
5. [`docs/04-MVP-CHECKLIST.md`](./docs/04-MVP-CHECKLIST.md) — MVP tamamlanma kontrol listesi

## Geliştirme İlkeleri

- **Mock-first:** Tüm veri `src/data/*.json` üzerinden gelir; harici API yok
- **Tip güvenliği:** Her mock entity için TypeScript interface tanımla
- **Küçük PR'lar:** Her sprint ayrı branch: `feat/sprint-5-workflows`
- **Bileşen odaklı:** Tekrar kullanılabilir UI parçaları

## Lisans

MIT (veya proje sahibi tarafından güncellenecek)
