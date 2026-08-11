# Sprint 6 — Hatırlatmalar

> **Hedef:** Hatırlatma listesi, oluşturma ve event / task / workflow step hedeflerine bağlama.

Bu sprintte uygulama sadece “ne zaman ne var” demekle kalmıyor; kullanıcı **belirli bir iş için tetikleme zamanı** tanımlayabiliyor. Hatırlatmalar diğer modüllere `targetType` + `targetId` ile bağlanır.

---

## 1. Hatırlatma Nedir?

My Calendar’da bir hatırlatma şu bilgileri taşır:

| Alan | Açıklama |
|------|----------|
| `title` | Kullanıcıya görünen başlık |
| `targetType` | `event` / `task` / `workflow_step` |
| `targetId` | Hedef kaydın id’si |
| `triggerAt` | Tetikleme zamanı (ISO string) |
| `recurrence` | `once` / `daily` / `weekly` |
| `isActive` | Aktif mi, pasif mi |

**Örnek:** “Toplantı hatırlatması” → hedef: `evt-001` → 15 dakika önce tetikle.

---

## 2. Yeni Bileşenler

```
src/components/reminders/
├── ReminderItem.tsx         ← liste satırı (toggle, düzenle)
├── ReminderForm.tsx         ← oluştur / düzenle modal
├── ReminderFields.tsx       ← gömülü hatırlatma alanı (checkbox + tarih)
└── ReminderTargetSelect.tsx ← hedef tipi + hedef seçimi

src/lib/utils/
├── reminder.ts              ← hedef listesi, varsayılan zaman, form entegrasyonu
└── reminderForm.ts          ← form değerleri, entity → form dönüşümü

src/hooks/useReminders.ts    ← AppProvider üzerinden CRUD
```

---

## 3. Tipler — `src/lib/types/reminder.ts`

```typescript
export type ReminderTargetType = "event" | "task" | "workflow_step";
export type ReminderRecurrence = "once" | "daily" | "weekly";

export interface Reminder { ... }
export interface ReminderInput { enabled; triggerAt; recurrence; }
```

**`ReminderInput` vs `Reminder`:**

| Tip | Nerede kullanılır? |
|-----|---------------------|
| `ReminderInput` | Event/Task/Workflow formlarındaki opsiyonel “Hatırlatma ekle” alanı |
| `Reminder` | Tam kayıt — id, title, target, createdAt ile birlikte |

Label sabitleri: `REMINDER_TARGET_LABELS`, `REMINDER_RECURRENCE_LABELS`.

---

## 4. AppProvider — Reminder CRUD

| Fonksiyon | Ne yapar? |
|-----------|-----------|
| `addReminder` | Yeni hatırlatma oluşturur (`rem-001` formatında id) |
| `updateReminder` | Başlık, hedef, zaman, tekrar, aktif/pasif günceller |

`useReminders()` hook’u bu fonksiyonları expose eder.

**Not:** MVP’de ayrı `deleteReminder` yok; pasif yapmak için `isActive: false` kullanılır.

---

## 5. ReminderForm — Oluştur ve Düzenle

`/reminders` sayfasındaki ana form.

```typescript
interface ReminderFormProps {
  mode: "create" | "edit";
  initialReminder?: Reminder;
  onSubmit: (values: ReminderFormValues) => void;
}
```

**Form alanları:**

| Alan | Zorunlu? | Not |
|------|----------|-----|
| Başlık | ✅ | Boşsa hata |
| Hedef tipi | ✅ | event / task / workflow_step |
| Hedef seçimi | ✅ | İlgili entity dropdown |
| Tetikleme zamanı | ✅ | `DateTimeLocalInput` (mobil uyumlu) |
| Tekrar | Evet | once / daily / weekly |

**Hedef listesi:** `getReminderTargetOptions()` — seçilen tipe göre events, tasks veya workflow step’leri döner.

**Düzenleme modu:** `reminderToFormValues()` ile ISO tarih → form formatına çevrilir; kayıtta `updateReminder` çağrılır.

---

## 6. ReminderFields — Gömülü Hatırlatma

Event, Task ve Workflow formlarında ortak kullanılan blok:

```
☐ Hatırlatma ekle
   ├── Tetikleme zamanı (DateTimeLocalInput)
   └── Tekrar (select)
```

**Akıllı varsayılan zaman:**

| Form | Fonksiyon | Mantık |
|------|-----------|--------|
| EventForm | `getEventReminderDefault` | Etkinlikten 15 dk önce; all-day ise 08:45 |
| TaskForm | `getTaskReminderDefault` | Deadline varsa 1 gün önce 09:00 |
| WorkflowForm (step) | `getStepReminderDefault` | Step due date’e göre |

Kayıt sırasında `createReminderFromInput()` → `addReminder()` → ilgili entity’nin `reminderIds` dizisine id eklenir (`appendReminderId`).

---

## 7. ReminderItem — Liste Satırı

Her satırda:

- Checkbox → aktif / pasif toggle (`updateReminder`)
- Başlık, tetikleme zamanı
- Badge: hedef tipi, tekrar, aktif/pasif
- **Düzenle** butonu → `ReminderForm` edit modunda açılır

---

## 8. Hatırlatmalar Sayfası

`/reminders`:

- Filtre: “Sadece aktif hatırlatmaları göster”
- `ReminderItem` listesi + `EmptyState`
- `+ Yeni Hatırlatma` → create modu
- Satırdan **Düzenle** → edit modu

---

## 9. Dashboard — Yaklaşan Hatırlatmalar

`UpcomingReminders` bileşeni (`src/components/dashboard/UpcomingReminders.tsx`):

- `getUpcomingReminders()` — önümüzdeki 7 gün, sadece aktif
- Boş state: “Önümüzdeki 7 günde aktif hatırlatma yok”
- “Tümünü gör →” linki `/reminders`

---

## 10. Mock Veri

`src/data/reminders.json` — en az 5 kayıt:

- Farklı `targetType` değerleri (event, task, step)
- Farklı `recurrence` ve `isActive` kombinasyonları

Yükleme: `loadReminders()` → `AppProvider` → `useReminders()`.

---

## 11. Test Senaryoları

1. **Yeni hatırlatma** — görev hedefli, tetikleme zamanı + tekrar seç
2. **Etkinlik hedefi** — dropdown’da etkinlikler listelenmeli
3. **Süreç adımı hedefi** — “1. Başlık — Süreç adı” formatında görünmeli
4. **Aktif/pasif toggle** — checkbox ile pasif yap, filtreyle gizlensin
5. **Düzenle** — başlık/zaman değiştir, kaydet, listede güncellensin
6. **EventForm’dan hatırlatma** — yeni etkinlik + hatırlatma checkbox → iki kayıt oluşmalı
7. **Dashboard** — 7 gün içindeki aktif hatırlatmalar görünmeli
8. **Validasyon** — başlık veya tetikleme boş → hata mesajı

---

## 12. Kontrol Listesi

- [x] ReminderItem bileşeni
- [x] ReminderForm modal (create + edit)
- [x] ReminderFields gömülü alan
- [x] ReminderTargetSelect
- [x] Hatırlatmalar sayfası + aktif filtre
- [x] Event / Task / Workflow formlarına hatırlatma entegrasyonu
- [x] Dashboard UpcomingReminders
- [x] 3 hedef tipi + 3 tekrar seçeneği
- [x] Aktif/pasif toggle

---

## Sonraki Adım

→ [`docs/03-INTERN-TASKS.md`](../03-INTERN-TASKS.md) — **Sprint 7: Cilalama ve MVP Tamamlama**
