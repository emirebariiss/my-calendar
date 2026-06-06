# Sprint 4 — Takvim Sistemi

> **Hedef:** Gün/hafta/ay görünümü, event ekleme/düzenleme/silme ve sürükle-bırak.

Bu sprintte uygulamanın ikinci tam CRUD modülünü tamamladık. Takvim artık sadece placeholder değil — gerçek bir planlama arayüzü.

---

## 1. Kütüphane Kararı: FullCalendar

İki seçenek vardı:

| Seçenek | Artı | Eksi |
|---------|------|------|
| **FullCalendar** ✅ | Gün/hafta/ay, drag-drop hazır | Ek bağımlılık (~85KB) |
| Custom grid | Tam kontrol | 3-4 gün ekstra iş |

**Karar:** `@fullcalendar/react` — MVP hızı için en mantıklı seçim.

Kurulan paketler:

```bash
npm install @fullcalendar/react @fullcalendar/core \
  @fullcalendar/daygrid @fullcalendar/timegrid @fullcalendar/interaction
```

| Paket | Ne sağlar? |
|-------|------------|
| `daygrid` | Ay görünümü |
| `timegrid` | Gün ve hafta görünümü (saat slotları) |
| `interaction` | Tıklama, seçim, sürükle-bırak |

Karar `docs/01-ARCHITECTURE.md` dosyasına da işlendi.

---

## 2. Veri Akışı

Sprint 3'teki görev pattern'i ile aynı:

```
events.json → loader → AppProvider (useState)
                           ↓
                    useEvents() hook
                           ↓
              CalendarView + EventForm + EventCard
```

### AppProvider'a eklenen fonksiyonlar

```typescript
addEvent(event)    // yeni etkinlik, otomatik evt-XXX id
updateEvent(id, updates)  // tarih taşıma dahil
deleteEvent(id)    // silme
```

`useEvents` hook'u artık CRUD döndürüyor (Sprint 2'de sadece `events` okuyordu).

---

## 3. Bileşenler

### Dosya yapısı

```
src/components/calendar/
├── CalendarView.tsx   ← FullCalendar sarmalayıcısı
├── EventForm.tsx      ← oluştur / düzenle modal
└── EventCard.tsx      ← liste özet kartı

src/lib/utils/calendar.ts  ← format dönüşümleri
```

---

## 4. CalendarView — FullCalendar Entegrasyonu

`CalendarView` FullCalendar'ı proje ihtiyaçlarına göre yapılandırır:

```typescript
<FullCalendar
  plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
  locale={trLocale}                    // Türkçe
  initialView="timeGridWeek"           // varsayılan: hafta
  headerToolbar={{
    right: "dayGridMonth,timeGridWeek,timeGridDay"  // ay / hafta / gün
  }}
  editable        // sürükle-bırak
  selectable      // tarih aralığı seçerek yeni event
  events={calendarEvents}
  eventClick={...}
  select={...}
  eventDrop={...}
/>
```

### Mock veri → FullCalendar formatı

`toFullCalendarEvent()` fonksiyonu dönüşümü yapar:

```typescript
{
  id: "evt-001",
  title: "Haftalık ekip toplantısı",
  start: "2026-06-09T10:00:00",
  end: "2026-06-09T11:00:00",
  allDay: false,
  backgroundColor: "#3B82F6",  // EVENT_COLORS[type]
}
```

**Neden ayrı fonksiyon?** FullCalendar'ın beklediği format bizim `CalendarEvent` tipinden farklı. Dönüşüm katmanı ileride API'ye geçişi kolaylaştırır.

---

## 5. EventForm — Oluştur ve Düzenle

TaskForm ile aynı pattern:

| Alan | Zorunlu? | Not |
|------|----------|-----|
| Başlık | ✅ | Validasyon var |
| Açıklama | Hayır | textarea |
| Tip | Evet | meeting/study/personal/custom |
| Durum | Evet | scheduled/completed/cancelled |
| Tüm gün | Checkbox | all-day event |
| Başlangıç/bitiş | Evet | date + time (tüm gün değilse) |

**Renk otomatik atama:**

```typescript
color: EVENT_COLORS[values.type]
// meeting → #3B82F6 (mavi)
// study   → #8B5CF6 (mor)
// personal→ #10B981 (yeşil)
// custom  → #6B7280 (gri)
```

**Validasyon:** Bitiş zamanı başlangıçtan önce olamaz.

---

## 6. Etkileşimler

### A) Takvimde tarih seç → yeni event

Kullanıcı boş bir alanı sürükleyerek seçer → `onDateSelect` → form açılır, tarihler dolu gelir.

### B) Event'e tıkla → düzenle

`eventClick` → ilgili `CalendarEvent` bulunur → edit modunda form açılır.

### C) Sürükle-bırak → tarih güncelle

`eventDrop` → `updateEvent(id, { startAt, endAt, allDay })` — backend olmadığı için bellekte güncellenir.

### D) Silme

Düzenleme modundayken "Etkinliği Sil" → ConfirmDialog → `deleteEvent`.

---

## 7. EventCard — Liste Görünümü

Takvim sayfasının altında "Yaklaşan Etkinlikler" listesi var. Her satır:

- Sol renk çubuğu (event tipi rengi)
- Başlık + tip badge
- Tarih/saat bilgisi
- Tıklanınca düzenleme formu açılır

All-day event'ler: `Tüm gün · 12 Haziran 2026` formatında gösterilir.

---

## 8. CSS Özelleştirme

FullCalendar kendi stillerini getirir. `globals.css`'e proje temasına uyum için override ekledik:

```css
.calendar-wrapper .fc {
  --fc-button-bg-color: #2563eb;   /* primary renk */
  --fc-today-bg-color: #eff6ff;    /* bugün vurgusu */
}
```

Butonlar, border ve event görünümü Tailwind paletiyle uyumlu.

---

## 9. Yardımcı Fonksiyonlar (`lib/utils/calendar.ts`)

| Fonksiyon | Ne yapar? |
|-----------|-----------|
| `getEventColor()` | Tip veya özel renk döner |
| `toDateTimeLocalValue()` | ISO → input[type=datetime] formatı |
| `toFullCalendarEvent()` | CalendarEvent → FC formatı |
| `buildEventPayload()` | Form değerleri → CalendarEvent alanları |
| `defaultEventTimes()` | Yeni event için varsayılan 1 saatlik slot |

---

## 10. Test Senaryoları

1. **Ay görünümü** — toolbar'dan "Ay" seç, event'ler görünmeli
2. **Hafta görünümü** — saat slotlarında event'ler
3. **Gün görünümü** — tek gün detayı
4. **Yeni event** — buton ile oluştur, takvimde görünmeli
5. **Tarih seçerek oluştur** — boş alanı sürükle, form dolu açılmalı
6. **Düzenle** — event'e tıkla, başlığı değiştir
7. **Sürükle-bırak** — event'i başka güne taşı
8. **All-day** — tüm gün checkbox, ay görünümünde üst bantta
9. **Sil** — onay dialog'u sonrası kaybolmalı
10. **Dashboard** — ana sayfadaki "Yaklaşan Etkinlikler" güncellenmeli

---

## 11. Kontrol Listesi

- [x] FullCalendar kuruldu ve yapılandırıldı
- [x] Gün / hafta / ay görünümü
- [x] EventCard bileşeni
- [x] EventForm (create + edit, all-day, validasyon)
- [x] Event CRUD (ekle, düzenle, sil)
- [x] Sürükle-bırak ile taşıma
- [x] Event tipi renk haritası (`EVENT_COLORS`)
- [x] Türkçe locale
- [x] Dashboard entegrasyonu (canlı state)

---

## Sonraki Adım

→ [`docs/03-INTERN-TASKS.md`](../03-INTERN-TASKS.md) — **Sprint 5: Süreçli Görevler (Workflow CRUD)**

Workflow step tamamlama, not ekleme ve yeni süreç oluşturma gelecek.
