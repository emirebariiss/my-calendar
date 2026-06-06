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

- **Framework:** Next.js (App Router)
- **Dil:** TypeScript
- **Stil:** Tailwind CSS
- **Veri:** Mock JSON (backend / API yok)
- **State:** React Context veya Zustand (görev listesinde belirtilecek)

## Hızlı Başlangıç

```bash
# Bağımlılıkları yükle
npm install

# Geliştirme sunucusu
npm run dev
```

Uygulama `http://localhost:3000` adresinde çalışır.

## Proje Yapısı (hedef)

```
my-calendar/
├── .cursor/              # Cursor AI kuralları
├── docs/                 # Ürün, mimari ve stajyer görevleri
├── public/
├── src/
│   ├── app/              # Next.js App Router sayfaları
│   ├── components/       # UI bileşenleri
│   ├── data/             # Mock JSON dosyaları
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Yardımcı fonksiyonlar, tipler
│   └── stores/           # Global state (opsiyonel)
└── README.md
```

## MVP Kapsamı

- [ ] Takvim: gün / hafta / ay görünümü, event tipleri
- [ ] Görevler: durum, öncelik, opsiyonel deadline
- [ ] Süreçli görevler: step bazlı workflow
- [ ] Hatırlatmalar: event, task ve step bazlı
- [ ] Dashboard: bugün, yaklaşan, aktif süreçler, overdue

Detaylı özellik listesi ve kabul kriterleri için → [`docs/00-PRODUCT.md`](./docs/00-PRODUCT.md)

## Stajyer / Geliştirici Rehberi

Projeye yeni başlayanlar için adım adım görev listesi:

1. [`docs/03-INTERN-TASKS.md`](./docs/03-INTERN-TASKS.md) — Sprint bazlı görevler (başlangıç noktası)
2. [`docs/01-ARCHITECTURE.md`](./docs/01-ARCHITECTURE.md) — Mimari ve klasör yapısı
3. [`docs/02-MOCK-DATA.md`](./docs/02-MOCK-DATA.md) — Mock veri şemaları
4. [`docs/04-MVP-CHECKLIST.md`](./docs/04-MVP-CHECKLIST.md) — MVP tamamlanma kontrol listesi
5. [`docs/05-ROADMAP.md`](./docs/05-ROADMAP.md) — V1+ ve gelişmiş özellikler

## Geliştirme İlkeleri

- **Mock-first:** Tüm veri `src/data/*.json` üzerinden gelir; harici API yok
- **Tip güvenliği:** Her mock entity için TypeScript interface tanımla
- **Küçük PR'lar:** Her sprint görevi ayrı branch / PR olarak ilerlesin
- **Bileşen odaklı:** Tekrar kullanılabilir, test edilebilir UI parçaları

## Lisans

MIT (veya proje sahibi tarafından güncellenecek)
