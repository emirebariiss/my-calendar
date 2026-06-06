# Mimari ve Teknik Tasarım

## Teknoloji Stack

| Katman | Seçim | Not |
|--------|-------|-----|
| Framework | Next.js 15+ (App Router) | SSR/SSG gerekmez; client-heavy UI |
| Dil | TypeScript | Strict mode açık |
| Stil | Tailwind CSS | shadcn/ui opsiyonel |
| Veri | Mock JSON | `src/data/` klasörü |
| State | React Context veya Zustand | Basit MVP için Context yeterli |
| Tarih | date-fns veya dayjs | Hafif, tree-shakeable |
| Takvim UI | FullCalendar veya custom grid | Sprint 2'de karar verilecek |

## Klasör Yapısı

```
src/
├── app/
│   ├── layout.tsx              # Root layout, font, providers
│   ├── page.tsx                # Dashboard (ana sayfa)
│   ├── calendar/
│   │   └── page.tsx            # Takvim görünümü
│   ├── tasks/
│   │   └── page.tsx            # Görev listesi
│   ├── workflows/
│   │   ├── page.tsx            # Süreç listesi
│   │   └── [id]/page.tsx       # Süreç detayı (step'ler)
│   └── reminders/
│       └── page.tsx            # Hatırlatma yönetimi
│
├── components/
│   ├── layout/                 # Sidebar, Header, Nav
│   ├── ui/                     # Button, Badge, Card, Modal (paylaşılan)
│   ├── calendar/               # CalendarGrid, EventCard, EventForm
│   ├── tasks/                  # TaskList, TaskItem, TaskForm
│   ├── workflows/              # WorkflowCard, StepList, StepItem
│   ├── reminders/              # ReminderList, ReminderForm
│   └── dashboard/              # TodayTasks, UpcomingEvents, OverdueList
│
├── data/
│   ├── events.json
│   ├── tasks.json
│   ├── workflows.json
│   └── reminders.json
│
├── hooks/
│   ├── useEvents.ts
│   ├── useTasks.ts
│   ├── useWorkflows.ts
│   └── useReminders.ts
│
├── lib/
│   ├── types/
│   │   ├── event.ts
│   │   ├── task.ts
│   │   ├── workflow.ts
│   │   └── reminder.ts
│   ├── utils/
│   │   ├── date.ts             # formatDate, isOverdue, isToday
│   │   └── filters.ts          # filterByStatus, sortByPriority
│   └── mock/
│       └── loader.ts           # JSON import + tip dönüşümü
│
├── providers/
│   └── AppProvider.tsx         # Global state context
│
└── stores/                     # Zustand kullanılırsa
    └── appStore.ts
```

## Veri Akışı (Mock)

```
src/data/*.json
      ↓
lib/mock/loader.ts  →  TypeScript tiplerine dönüştür
      ↓
hooks (useTasks, useEvents, ...)  →  CRUD operasyonları (bellekte)
      ↓
components  →  UI render
```

**Önemli:** MVP'de veri kalıcılığı yok. Sayfa yenilendiğinde mock JSON'a döner. İleride `localStorage` veya gerçek API eklenebilir.

## Sayfa Haritası

| Route | Sayfa | Açıklama |
|-------|-------|----------|
| `/` | Dashboard | Özet görünüm |
| `/calendar` | Takvim | Gün/hafta/ay |
| `/tasks` | Görevler | Liste + filtre |
| `/workflows` | Süreçler | Aktif workflow listesi |
| `/workflows/[id]` | Süreç detay | Step yönetimi |
| `/reminders` | Hatırlatmalar | Tüm reminder'lar |

## Bileşen Hiyerarşisi (örnek: Dashboard)

```
DashboardPage
├── DashboardHeader
├── StatsRow (opsiyonel MVP+)
├── TodayTasks
│   └── TaskItem[]
├── UpcomingEvents
│   └── EventCard[]
├── ActiveWorkflows
│   └── WorkflowCard[]
└── OverdueSection
    └── OverdueItem[]
```

## State Tasarımı

### Seçenek A: React Context (önerilen — MVP)

```typescript
// providers/AppProvider.tsx
interface AppState {
  events: CalendarEvent[];
  tasks: Task[];
  workflows: Workflow[];
  reminders: Reminder[];
  // CRUD actions
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  // ...
}
```

### Seçenek B: Zustand (daha karmaşık state için)

Tek store veya feature bazlı slice'lar.

## Karar Kayıtları

| Karar | Seçim | Gerekçe |
|-------|-------|---------|
| Backend yok | Mock JSON | Hızlı MVP, stajyer odaklı frontend |
| App Router | Evet | Next.js modern standart |
| Persist yok | MVP'de hayır | Scope küçük tutulsun |
| i18n | Sadece TR | MVP kapsamı |
