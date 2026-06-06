# Sprint 3 — Görev Sistemi (CRUD)

> **Hedef:** Görev ekleme, düzenleme, silme ve tamamlandı işaretleme.

Bu sprintte uygulamanın ilk **tam CRUD** modülünü bitirdik. CRUD = Create, Read, Update, Delete.

---

## 1. CRUD Nedir?

| Harf | Türkçe | Bizde ne? |
|------|--------|-----------|
| C | Oluştur | "Yeni Görev" butonu → TaskForm |
| R | Oku | TaskList → tüm görevleri listele |
| U | Güncelle | Düzenle butonu veya checkbox toggle |
| D | Sil | Sil butonu → onay dialog'u |

---

## 2. Yeni Bileşenler

### Dosya yapısı

```
src/components/
├── ui/
│   ├── Button.tsx         ← genel buton
│   ├── Modal.tsx          ← açılır pencere
│   └── ConfirmDialog.tsx  ← "Emin misin?" dialog'u
└── tasks/
    ├── TaskItem.tsx       ← tek görev satırı
    ├── TaskList.tsx       ← liste + filtreler
    └── TaskForm.tsx       ← oluştur/düzenle formu
```

---

## 3. Modal Bileşeni

Modal = sayfanın üstünde açılan pencere. Formlar burada gösterilir.

**Önemli detaylar:**

```tsx
// Escape tuşu ile kapatma
useEffect(() => {
  const handleEscape = (e) => {
    if (e.key === "Escape") onClose();
  };
  document.addEventListener("keydown", handleEscape);
}, [open, onClose]);

// Arka plan scroll'unu kilitle
document.body.style.overflow = "hidden";
```

**Erişilebilirlik (a11y):**
- `role="dialog"` ve `aria-modal="true"`
- `aria-labelledby` ile başlık bağlantısı
- Arka plana tıklayınca kapanma

---

## 4. TaskForm — Create ve Edit Modu

Tek form, iki mod:

```typescript
interface TaskFormProps {
  mode: "create" | "edit";
  initialTask?: Task;  // edit modunda dolu gelir
}
```

**Form alanları:**

| Alan | Zorunlu? | Not |
|------|----------|-----|
| Başlık | ✅ Evet | Boşsa hata mesajı |
| Açıklama | Hayır | textarea |
| Durum | Evet | select: not_started / in_progress / done |
| Öncelik | Evet | select: low / medium / high |
| Deadline | Hayır | date input — boş = süresiz |

**Validasyon:**

```typescript
if (!values.title.trim()) {
  setError("Başlık zorunludur.");
  return;
}
```

---

## 5. TaskItem — Tek Satır

Her görev satırında:

```
[checkbox] Başlık                    [Durum] [Öncelik] [Gecikmiş]
           Açıklama
           Deadline / Süresiz
           [Düzenle] [Sil]
```

**Checkbox toggle mantığı:**

```typescript
const handleToggle = (task: Task) => {
  const nextStatus = task.status === "done" ? "not_started" : "done";
  updateTask(task.id, {
    status: nextStatus,
    completedAt: nextStatus === "done" ? new Date().toISOString() : undefined,
  });
};
```

Tıkla → done. Tekrar tıkla → not_started.

**Overdue vurgusu:**

```typescript
const overdue =
  task.deadline &&
  task.status !== "done" &&
  isOverdue(task.deadline);
```

Deadline geçmiş ve tamamlanmamışsa kırmızı arka plan.

---

## 6. TaskList — Filtreler

İki dropdown filtre:
1. **Durum:** Tümü / Başlanmadı / Devam ediyor / Tamamlandı
2. **Öncelik:** Tümü / Yüksek / Orta / Düşük

```typescript
const filteredTasks = useMemo(() => {
  let result = filterByStatus(tasks, statusFilter);
  if (priorityFilter !== "all") {
    result = result.filter((task) => task.priority === priorityFilter);
  }
  return sortByPriority(result);
}, [tasks, statusFilter, priorityFilter]);
```

`useMemo` — filtre veya tasks değişmedikçe yeniden hesaplama yapma (performans).

---

## 7. Silme — ConfirmDialog

Kullanıcı "Sil"e tıklayınca direkt silmiyoruz. Önce soruyoruz:

```
"React hooks makalesini oku" görevini silmek istediğine emin misin?
                    [Vazgeç]  [Sil]
```

Bu UX pattern'ine **confirmation dialog** denir. Yanlışlıkla silmeyi önler.

---

## 8. TasksPage — Orkestrasyon

`src/app/tasks/page.tsx` tüm parçaları bir araya getirir:

```typescript
const [formOpen, setFormOpen] = useState(false);
const [formMode, setFormMode] = useState<"create" | "edit">("create");
const [editingTask, setEditingTask] = useState<Task>();
const [deletingTask, setDeletingTask] = useState<Task>();
```

**State yönetimi pattern'i:**
- Modal açık mı? → `formOpen`
- Oluşturma mı düzenleme mi? → `formMode`
- Hangi görev düzenleniyor? → `editingTask`
- Hangi görev siliniyor? → `deletingTask`

Bu "lifted state" pattern'i — form ve liste ayrı bileşenler ama state üst sayfada.

---

## 9. Dashboard Entegrasyonu

Sprint 2'de yazdığımız `TodayTasks` ve `OverdueSection` zaten `useTasks()` kullanıyordu.

Sprint 3'te görev ekleyince/silince dashboard **otomatik güncellenir** — ekstra iş gerekmedi. Context'in gücü bu.

---

## 10. AppProvider Güncellemesi

`updateTask` fonksiyonuna `completedAt` mantığı eklendi:

```typescript
if (updates.status === "done" && !next.completedAt) {
  next.completedAt = new Date().toISOString();
}
if (updates.status && updates.status !== "done") {
  next.completedAt = undefined;
}
```

Görev tamamlandığında bitiş zamanı kaydedilir. Geri alınırsa temizlenir.

---

## 11. Test Senaryoları

Uygulamayı aç ve şunları dene:

1. **Yeni görev ekle** — deadline'sız → listede "Süresiz" yazmalı
2. **Görev düzenle** — önceliği "yüksek" yap → badge güncellenmeli
3. **Checkbox toggle** — done yap → üstü çizili görünmeli
4. **Gecikmiş görev** — `task-004` kırmızı arka planlı olmalı
5. **Sil** — onay dialog'u çıkmalı, onaylayınca listeden kaybolmalı
6. **Dashboard** — ana sayfadaki "Bugünün Görevleri" güncellenmeli
7. **Filtre** — sadece "Tamamlandı" seç → 2 görev görünmeli

---

## 12. Kontrol Listesi

- [x] TaskItem bileşeni (checkbox, badge, overdue)
- [x] TaskList bileşeni (durum + öncelik filtresi)
- [x] TaskForm modal (create + edit, validasyon)
- [x] Görev silme (onay dialog'u)
- [x] TasksPage entegrasyonu
- [x] Dashboard canlı state'e bağlı
- [x] Deadline'sız görevler listede görünüyor

---

## Sonraki Adım

→ [`docs/03-INTERN-TASKS.md`](../03-INTERN-TASKS.md) — **Sprint 4: Takvim Sistemi**

Takvim için `@fullcalendar/react` veya custom grid kararı verilecek. Gün/hafta/ay görünümü, event ekleme ve sürükle-bırak gelecek.
