# Mock Veri Şemaları

Tüm veri `src/data/` altındaki JSON dosyalarından gelir. Her entity için TypeScript interface tanımlanmalıdır.

---

## 1. Calendar Event (`events.json`)

```typescript
type EventType = 'meeting' | 'study' | 'personal' | 'custom';
type EventStatus = 'scheduled' | 'completed' | 'cancelled';

interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  type: EventType;
  status: EventStatus;
  startAt: string;        // ISO 8601: "2026-06-06T09:00:00"
  endAt: string;          // ISO 8601
  allDay?: boolean;
  color?: string;         // hex veya tailwind renk adı
  reminderIds?: string[]; // bağlı reminder id'leri
  taskId?: string;        // V1+: bağlı task
  createdAt: string;
  updatedAt: string;
}
```

**Örnek kayıt:**

```json
{
  "id": "evt-001",
  "title": "Haftalık ekip toplantısı",
  "description": "Sprint review ve planlama",
  "type": "meeting",
  "status": "scheduled",
  "startAt": "2026-06-09T10:00:00",
  "endAt": "2026-06-09T11:00:00",
  "allDay": false,
  "color": "#3B82F6",
  "reminderIds": ["rem-001"],
  "createdAt": "2026-06-01T08:00:00",
  "updatedAt": "2026-06-01T08:00:00"
}
```

---

## 2. Task (`tasks.json`)

```typescript
type TaskStatus = 'not_started' | 'in_progress' | 'done';
type TaskPriority = 'low' | 'medium' | 'high';

interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  deadline?: string;      // ISO 8601 date (opsiyonel!)
  tags?: string[];
  reminderIds?: string[];
  eventId?: string;       // V1+: bağlı event
  workflowId?: string;    // workflow'a bağlı değilse undefined
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}
```

**Örnek kayıtlar:**

```json
[
  {
    "id": "task-001",
    "title": "React hooks makalesini oku",
    "status": "in_progress",
    "priority": "medium",
    "deadline": "2026-06-10",
    "tags": ["coding", "study"],
    "createdAt": "2026-06-05T10:00:00",
    "updatedAt": "2026-06-06T09:00:00"
  },
  {
    "id": "task-002",
    "title": "Spor salonu üyeliğini araştır",
    "status": "not_started",
    "priority": "low",
    "tags": ["health", "personal"],
    "createdAt": "2026-06-04T14:00:00",
    "updatedAt": "2026-06-04T14:00:00"
  }
]
```

> **Not:** `task-002`'de `deadline` yok — bu görev yine de aktif listede görünmeli.

---

## 3. Workflow (`workflows.json`)

```typescript
type StepStatus = 'pending' | 'in_progress' | 'completed' | 'skipped';

interface WorkflowStep {
  id: string;
  order: number;
  title: string;
  description?: string;
  status: StepStatus;
  dueDate?: string;       // ISO 8601 date
  notes?: string;
  completedAt?: string;
  reminderIds?: string[];
  eventId?: string;       // V1+: step calendar'a blok olarak düşebilir
}

interface Workflow {
  id: string;
  title: string;
  description?: string;
  steps: WorkflowStep[];
  status: 'active' | 'completed' | 'archived';
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}
```

**Örnek kayıt:**

```json
{
  "id": "wf-001",
  "title": "Şirkete başvuru — Acme Corp",
  "description": "Yaz stajı başvuru süreci",
  "status": "active",
  "tags": ["work"],
  "steps": [
    {
      "id": "step-001",
      "order": 1,
      "title": "Online başvuru formu",
      "status": "completed",
      "dueDate": "2026-06-01",
      "completedAt": "2026-05-28T16:00:00",
      "notes": "Başvuru numarası: APP-2026-4521"
    },
    {
      "id": "step-002",
      "order": 2,
      "title": "CV ve motivasyon mektubu gönderimi",
      "status": "in_progress",
      "dueDate": "2026-06-08",
      "reminderIds": ["rem-003"]
    },
    {
      "id": "step-003",
      "order": 3,
      "title": "Teknik mülakat",
      "status": "pending",
      "dueDate": "2026-06-15"
    },
    {
      "id": "step-004",
      "order": 4,
      "title": "Sonuç bildirimi",
      "status": "pending"
    }
  ],
  "createdAt": "2026-05-25T10:00:00",
  "updatedAt": "2026-06-06T08:00:00"
}
```

---

## 4. Reminder (`reminders.json`)

```typescript
type ReminderTargetType = 'event' | 'task' | 'workflow_step';
type ReminderRecurrence = 'once' | 'daily' | 'weekly';

interface Reminder {
  id: string;
  title: string;
  targetType: ReminderTargetType;
  targetId: string;       // event / task / step id
  triggerAt: string;        // ISO 8601
  recurrence: ReminderRecurrence;
  isActive: boolean;
  message?: string;
  createdAt: string;
}
```

**Örnek kayıtlar:**

```json
[
  {
    "id": "rem-001",
    "title": "Toplantı hatırlatması",
    "targetType": "event",
    "targetId": "evt-001",
    "triggerAt": "2026-06-09T09:45:00",
    "recurrence": "once",
    "isActive": true,
    "message": "15 dakika sonra toplantı başlıyor",
    "createdAt": "2026-06-01T08:00:00"
  },
  {
    "id": "rem-002",
    "title": "Günlük görev kontrolü",
    "targetType": "task",
    "targetId": "task-001",
    "triggerAt": "2026-06-06T08:00:00",
    "recurrence": "daily",
    "isActive": true,
    "createdAt": "2026-06-05T10:00:00"
  },
  {
    "id": "rem-003",
    "title": "CV gönderim deadline",
    "targetType": "workflow_step",
    "targetId": "step-002",
    "triggerAt": "2026-06-07T09:00:00",
    "recurrence": "once",
    "isActive": true,
    "message": "Yarın CV gönderim son günü!",
    "createdAt": "2026-06-01T08:00:00"
  }
]
```

---

## 5. Tag (`tags.json`) — V1+

```typescript
interface Tag {
  id: string;
  name: string;
  color: string;
  icon?: string;
}
```

```json
[
  { "id": "tag-work", "name": "İş", "color": "#3B82F6" },
  { "id": "tag-study", "name": "Okul", "color": "#8B5CF6" },
  { "id": "tag-personal", "name": "Kişisel", "color": "#10B981" },
  { "id": "tag-health", "name": "Sağlık", "color": "#F59E0B" },
  { "id": "tag-coding", "name": "Kodlama", "color": "#EF4444" }
]
```

---

## Mock Veri Oluşturma Kuralları

1. **Gerçekçi tarihler kullan** — bugünden önceki ve sonraki 2 hafta aralığında
2. **En az 5 event, 8 task, 3 workflow, 5 reminder** ile başla
3. **Edge case'leri kapsa:**
   - Deadline'sız task
   - All-day event
   - Tamamlanmış workflow
   - Overdue task ve step
   - Pasif (isActive: false) reminder
4. **ID formatı:** `{entity}-{3-digit}` (örn. `task-001`, `step-003`)
5. Tüm tarihler ISO 8601 formatında

## Loader Örneği

```typescript
// src/lib/mock/loader.ts
import eventsData from '@/data/events.json';
import type { CalendarEvent } from '@/lib/types/event';

export function loadEvents(): CalendarEvent[] {
  return eventsData as CalendarEvent[];
}
```
