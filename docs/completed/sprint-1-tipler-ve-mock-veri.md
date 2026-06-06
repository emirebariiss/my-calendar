# Sprint 1 — Tipler ve Mock Veri

> **Hedef:** Uygulamanın veri modelini tanımla ve sahte (mock) verilerle doldur.

Bu sprintte backend yok. Gerçek bir API'ye bağlanmıyoruz. Bunun yerine JSON dosyalarından veri okuyoruz. Bu yaklaşıma **mock-first development** denir — önce arayüzü çalıştır, backend'i sonra ekle.

---

## 1. Neden TypeScript Tipleri?

JavaScript'te şöyle bir hata yapabilirsin:

```js
task.staus = "done"; // typo — hata fark edilmez
```

TypeScript ile `Task` interface'i tanımlayınca editör anında uyarır. Projemizde 4 ana entity var:

| Entity | Dosya | Açıklama |
|--------|-------|----------|
| CalendarEvent | `src/lib/types/event.ts` | Takvim etkinlikleri |
| Task | `src/lib/types/task.ts` | Tek adımlı görevler |
| Workflow | `src/lib/types/workflow.ts` | Çok adımlı süreçler |
| Reminder | `src/lib/types/reminder.ts` | Hatırlatmalar |

### Örnek — Task tipi

```typescript
export type TaskStatus = "not_started" | "in_progress" | "done";
export type TaskPriority = "low" | "medium" | "high";

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  deadline?: string;  // ? = opsiyonel alan
  // ...
}
```

**Dikkat:** `deadline?` opsiyonel. Bu ürünün önemli kuralı — deadline olmayan görevler de listede kalır.

### Union Type nedir?

`"not_started" | "in_progress" | "done"` — sadece bu 3 string kabul edilir. Yanlış değer yazarsan TypeScript hata verir.

### Barrel Export

`src/lib/types/index.ts` tüm tipleri tek yerden export eder:

```typescript
export * from "./event";
export * from "./task";
// ...
```

Böylece `import { Task, CalendarEvent } from "@/lib/types"` yazabilirsin.

---

## 2. Mock JSON Dosyaları

`src/data/` klasöründe 4 JSON dosyası var:

| Dosya | Kayıt sayısı | Önemli edge case |
|-------|-------------|------------------|
| `events.json` | 6 | All-day event, tamamlanmış event |
| `tasks.json` | 8 | Deadline'sız görev (`task-002`), gecikmiş görev (`task-004`) |
| `workflows.json` | 3 | Aktif, tamamlanmış, çok adımlı |
| `reminders.json` | 6 | Event/task/step hedefli, pasif reminder |

### ID formatı

Tutarlı ID'ler kullanıyoruz: `task-001`, `evt-003`, `wf-001`, `step-002`, `rem-004`

Yeni kayıt eklerken `createId()` fonksiyonu bu formatı korur (Sprint 2'de AppProvider'da).

### Tarih formatı

Tüm tarihler **ISO 8601** formatında:

```
"2026-06-09T10:00:00"   → tam tarih + saat
"2026-06-10"            → sadece gün (deadline için)
```

---

## 3. Mock Loader

`src/lib/mock/loader.ts` — JSON dosyalarını TypeScript tipine dönüştürür:

```typescript
import eventsData from "@/data/events.json";
import type { CalendarEvent } from "@/lib/types";

export function loadEvents(): CalendarEvent[] {
  return eventsData as CalendarEvent[];
}
```

**Neden `as CalendarEvent[]`?**  
JSON import'u TypeScript'e generic `any` gibi gelir. Biz "bu veri CalendarEvent tipindedir" diyoruz.

**Neden ayrı fonksiyon?**  
İleride gerçek API'ye geçince sadece loader'ı değiştirirsin, geri kalan kod aynı kalır.

---

## 4. Yardımcı Fonksiyonlar

### Tarih — `src/lib/utils/date.ts`

`date-fns` kütüphanesi kullanıyoruz. Önemli fonksiyonlar:

| Fonksiyon | Ne yapar? | Örnek |
|-----------|-----------|-------|
| `formatDate()` | Türkçe tarih | "6 Haziran 2026" |
| `formatTime()` | Saat:dakika | "14:00" |
| `isToday()` | Bugün mü? | `true/false` |
| `isOverdue()` | Deadline geçti mi? | `true/false` |
| `isUpcoming()` | Önümüzdeki N gün içinde mi? | `true/false` |

```typescript
import { tr } from "date-fns/locale";

format(parseISO("2026-06-06"), "d MMMM yyyy", { locale: tr });
// → "6 Haziran 2026"
```

### Filtre — `src/lib/utils/filters.ts`

| Fonksiyon | Ne yapar? |
|-----------|-----------|
| `filterByStatus()` | Duruma göre filtrele |
| `sortByPriority()` | high → medium → low sırala |
| `getOverdueTasks()` | Gecikmiş görevleri bul |
| `getActiveWorkflows()` | Aktif süreçleri getir |
| `getWorkflowProgress()` | X/Y tamamlanma yüzdesi |
| `getOverdueSteps()` | Gecikmiş workflow adımları |

---

## 5. Label Sabitleri

Kullanıcıya İngilizce enum değil, Türkçe metin göstermek için:

```typescript
export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  not_started: "Başlanmadı",
  in_progress: "Devam ediyor",
  done: "Tamamlandı",
};
```

UI'da: `TASK_STATUS_LABELS[task.status]` → "Devam ediyor"

---

## 6. Pratik Alıştırma

Kendini test et:

1. `src/data/tasks.json` dosyasına yeni bir görev ekle (deadline'sız)
2. `npm run dev` ile uygulamayı aç
3. Görevler sayfasında yeni görevin göründüğünü doğrula
4. `task.staus` yazmayı dene — TypeScript hata vermeli

---

## 7. Kontrol Listesi

- [x] 4 entity için TypeScript interface'leri yazıldı
- [x] 4 mock JSON dosyası oluşturuldu
- [x] Loader fonksiyonları çalışıyor
- [x] Tarih ve filtre yardımcıları hazır
- [x] `npm run build` tip hatası vermiyor

---

## Sonraki Adım

→ [Sprint 2 — Global State ve Dashboard](./sprint-2-global-state-ve-dashboard.md)
