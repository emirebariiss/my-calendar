# Sprint 2 — Global State ve Dashboard

> **Hedef:** Mock veriyi uygulama genelinde paylaş ve ana sayfada özet göster.

Sprint 1'de veriyi JSON'dan okuduk. Ama her bileşen kendi başına okursa:
- Veri tutarsız olur
- Bir görevi güncelleyince diğer sayfalar haberdar olmaz

Bu sprintte **React Context** ile merkezi bir veri deposu kurduk.

---

## 1. React Context Nedir?

Basit bir benzetme: Context, uygulamanın "ortak hafızası"dır.

```
AppProvider (hafıza)
    ├── Dashboard → tasks okur
    ├── TasksPage → tasks okur + yazar
    └── Sidebar → (şimdilik okumaz)
```

Bir yerde görev eklersen, diğer tüm bileşenler otomatik güncellenir.

### AppProvider (`src/providers/AppProvider.tsx`)

```typescript
interface AppContextValue {
  events: CalendarEvent[];
  tasks: Task[];
  workflows: Workflow[];
  reminders: Reminder[];
  addTask: (...) => void;
  updateTask: (...) => void;
  deleteTask: (...) => void;
}
```

**İlk yükleme:**

```typescript
const [tasks, setTasks] = useState<Task[]>(() => loadTasks());
```

`useState(() => loadTasks())` — fonksiyon formu. Sadece ilk render'da JSON'dan yükler.

**CRUD işlemleri (şimdilik sadece Task):**

| Fonksiyon | Ne yapar? |
|-----------|-----------|
| `addTask` | Yeni görev ekler, otomatik ID ve timestamp atar |
| `updateTask` | Mevcut görevi günceller |
| `deleteTask` | Görevi listeden çıkarır |

### createId yardımcısı

```typescript
function createId(prefix: string, items: { id: string }[]): string {
  // task-001, task-002, ... → sonraki: task-009
}
```

Mevcut ID'lerin en büyüğünü bulup +1 yapar.

---

## 2. Custom Hook'lar

Context'i doğrudan her yerde kullanmak yerine ince bir sarmalayıcı (wrapper) yazıyoruz:

```typescript
// src/hooks/useTasks.ts
export function useTasks() {
  const { tasks, addTask, updateTask, deleteTask } = useApp();
  return { tasks, addTask, updateTask, deleteTask };
}
```

**Neden?**
- Daha temiz import: `useTasks()` vs `useApp().tasks`
- İleride sadece task mantığını değiştirmek kolay
- Her entity için ayrı hook: `useEvents`, `useWorkflows`, `useReminders`

---

## 3. Paylaşılan UI Bileşenleri

`src/components/ui/` — proje genelinde tekrar kullanılan küçük parçalar:

| Bileşen | Ne işe yarar? | Kullanıldığı yer |
|---------|---------------|------------------|
| `Card` | Kenarlıklı içerik kutusu | Dashboard, listeler |
| `Badge` | Renkli etiket (durum, öncelik) | Task, event, workflow |
| `EmptyState` | Veri yokken mesaj | Tüm listeler |
| `ProgressBar` | İlerleme çubuğu | Workflow kartları |

### Badge variant'ları

```typescript
type BadgeVariant = "default" | "success" | "warning" | "danger" | "info";
```

Örnek: gecikmiş görev → `<Badge variant="danger">Gecikmiş</Badge>`

---

## 4. Dashboard Bileşenleri

Ana sayfa (`src/app/page.tsx`) 4 bölümden oluşur:

### TodayTasks

Bugünün görevleri:
- `status === "in_progress"` olanlar
- VEYA deadline'ı bugün olanlar

```typescript
const todayTasks = tasks.filter(
  (task) =>
    task.status !== "done" &&
    (task.status === "in_progress" || (task.deadline && isToday(task.deadline)))
);
```

### UpcomingEvents

Önümüzdeki 7 gün içindeki scheduled event'ler. `isUpcoming(event.startAt, 7)` ile filtrelenir.

### ActiveWorkflows

`status === "active"` olan workflow'lar. Her birinin ilerleme çubuğu gösterilir.

### OverdueSection

İki kaynaktan gecikmiş iş toplar:
1. `getOverdueTasks(tasks)` — deadline geçmiş görevler
2. `getOverdueSteps(workflows)` — due date geçmiş adımlar

Kırmızı arka plan ile vurgulanır.

---

## 5. Veri Akışı Diyagramı

```
events.json ──┐
tasks.json  ──┼── loader.ts ── AppProvider (useState)
workflows.json┤                    │
reminders.json┘                    │
                                   ▼
                          useTasks / useEvents / ...
                                   │
                                   ▼
                     Dashboard bileşenleri → UI
```

**Önemli:** Veri sadece bellekte (RAM). Sayfa yenilenince mock JSON'a geri döner. Bu MVP için bilinçli bir karar.

---

## 6. Layout Entegrasyonu

`src/app/layout.tsx`:

```tsx
<AppProvider>
  <AppShell>{children}</AppShell>
</AppProvider>
```

Tüm sayfalar otomatik olarak context'e erişebilir.

---

## 7. Henüz Eksik Olanlar (bilerek)

Sprint 2'de şunları **yapmadık** — sonraki sprintlerde gelecek:

- Event/Workflow/Reminder CRUD (sadece Task CRUD Sprint 3'te)
- Form modal'ları
- Takvim görünümü
- Veri kalıcılığı (localStorage)

---

## 8. Kontrol Listesi

- [x] AppProvider context oluşturuldu
- [x] 4 custom hook yazıldı
- [x] 4 UI bileşeni (Card, Badge, EmptyState, ProgressBar)
- [x] 4 dashboard bileşeni çalışıyor
- [x] Ana sayfa grid layout ile birleştirildi
- [x] Boş state'ler handle ediliyor
- [x] "Tümünü gör →" linkleri çalışıyor

---

## Sonraki Adım

→ [Sprint 3 — Görev Sistemi](./sprint-3-gorev-sistemi.md)
