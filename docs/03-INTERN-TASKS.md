# Stajyer Görev Listesi

Bu doküman, projeye yeni başlayan yazılım mühendisi stajyeri için sprint bazlı adım adım görevleri içerir.

**Nasıl kullanılır:**
1. Sprint'leri sırayla tamamla (Sprint 0 → Sprint 6)
2. Her görevi bitirdikten sonra checkbox'ı işaretle
3. Takıldığın yerde önce `docs/` klasöründeki ilgili dokümana bak
4. Her sprint sonunda kısa bir demo hazırla

**Tahmini süre:** 3–4 hafta (part-time)

---

## Sprint 0 — Proje Kurulumu (1–2 gün)

**Hedef:** Çalışan bir Next.js iskeleti ve temel navigasyon.

### Görevler

- [ ] **0.1** Next.js projesi oluştur
  ```bash
  npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
  ```
- [ ] **0.2** Klasör yapısını oluştur (`docs/01-ARCHITECTURE.md` referans al)
  - `src/components/ui/`
  - `src/components/layout/`
  - `src/data/`
  - `src/hooks/`
  - `src/lib/types/`
  - `src/lib/utils/`
  - `src/providers/`
- [ ] **0.3** TypeScript strict mode'un açık olduğunu doğrula (`tsconfig.json`)
- [ ] **0.4** Temel layout bileşenlerini yaz
  - `Sidebar` — navigasyon linkleri: Dashboard, Takvim, Görevler, Süreçler, Hatırlatmalar
  - `Header` — sayfa başlığı + basit kullanıcı alanı (mock)
  - `RootLayout` — sidebar + header + main content
- [ ] **0.5** Boş sayfa route'larını oluştur
  - `/` → "Dashboard — yakında"
  - `/calendar` → "Takvim — yakında"
  - `/tasks` → "Görevler — yakında"
  - `/workflows` → "Süreçler — yakında"
  - `/reminders` → "Hatırlatmalar — yakında"
- [ ] **0.6** Aktif route'u sidebar'da vurgula (usePathname)
- [ ] **0.7** `npm run dev` ile çalıştığını doğrula

**Kabul kriteri:** Tüm sayfalar arası navigasyon çalışıyor, responsive sidebar görünüyor.

---

## Sprint 1 — Tipler ve Mock Veri (2 gün)

**Hedef:** Tüm entity tipleri tanımlı, mock JSON dosyaları hazır, veri yüklenebiliyor.

### Görevler

- [ ] **1.1** TypeScript interface'lerini yaz (`docs/02-MOCK-DATA.md` referans al)
  - `src/lib/types/event.ts` → `CalendarEvent`, `EventType`, `EventStatus`
  - `src/lib/types/task.ts` → `Task`, `TaskStatus`, `TaskPriority`
  - `src/lib/types/workflow.ts` → `Workflow`, `WorkflowStep`, `StepStatus`
  - `src/lib/types/reminder.ts` → `Reminder`, `ReminderTargetType`, `ReminderRecurrence`
  - `src/lib/types/index.ts` → barrel export
- [ ] **1.2** Mock JSON dosyalarını oluştur (`src/data/`)
  - `events.json` — en az 5 kayıt (farklı tipler ve tarihler)
  - `tasks.json` — en az 8 kayıt (deadline'lı + deadline'sız karışık)
  - `workflows.json` — en az 3 kayıt (1 tamamlanmış, 1 aktif, 1 yeni)
  - `reminders.json` — en az 5 kayıt (event, task, step hedefli)
- [ ] **1.3** Mock loader yaz
  - `src/lib/mock/loader.ts` → `loadEvents()`, `loadTasks()`, `loadWorkflows()`, `loadReminders()`
- [ ] **1.4** Tarih yardımcı fonksiyonları yaz (`src/lib/utils/date.ts`)
  - `formatDate(date, format?)` — Türkçe tarih formatı
  - `formatTime(date)` — saat:dakika
  - `isToday(date)` — bugün mü?
  - `isOverdue(deadline)` — geçmiş mi?
  - `isUpcoming(date, days?)` — önümüzdeki N gün içinde mi?
- [ ] **1.5** Filtre/sıralama yardımcıları (`src/lib/utils/filters.ts`)
  - `filterByStatus(items, status)`
  - `sortByPriority(tasks)`
  - `getOverdueTasks(tasks)`
  - `getActiveWorkflows(workflows)`

**Kabul kriteri:** JSON dosyaları import edilebiliyor, tip hatası yok, utility fonksiyonlar basit test ile doğrulanmış.

---

## Sprint 2 — Global State ve Dashboard (2–3 gün)

**Hedef:** Mock veri global state'te, dashboard özet bilgileri gösteriyor.

### Görevler

- [ ] **2.1** `AppProvider` context oluştur (`src/providers/AppProvider.tsx`)
  - State: `events`, `tasks`, `workflows`, `reminders`
  - Actions: `add*`, `update*`, `delete*` (her entity için)
  - İlk yükleme: mock JSON'dan
- [ ] **2.2** Custom hook'ları yaz
  - `useEvents()` — events state + CRUD
  - `useTasks()` — tasks state + CRUD
  - `useWorkflows()` — workflows state + CRUD
  - `useReminders()` — reminders state + CRUD
- [ ] **2.3** Paylaşılan UI bileşenleri (`src/components/ui/`)
  - `Badge` — status ve priority için renkli etiket
  - `Card` — içerik kartı
  - `EmptyState` — veri yokken gösterilecek mesaj
  - `ProgressBar` — workflow ilerleme çubuğu
- [ ] **2.4** Dashboard bileşenleri (`src/components/dashboard/`)
  - `TodayTasks` — bugün deadline'ı olan veya in_progress task'lar
  - `UpcomingEvents` — önümüzdeki 7 gün event'leri
  - `ActiveWorkflows` — status: active workflow'lar + ilerleme
  - `OverdueSection` — gecikmiş task ve step'ler
- [ ] **2.5** Dashboard sayfasını birleştir (`src/app/page.tsx`)
  - 4 bölümü grid layout ile yerleştir
  - Her bölümde "Tümünü gör →" linki ilgili sayfaya yönlendirsin
- [ ] **2.6** Boş state'leri handle et (hiç task yoksa EmptyState göster)

**Kabul kriteri:** Ana sayfa mock veriden gerçek özet bilgileri gösteriyor. Overdue bölümü gecikmiş işleri doğru listeliyor.

---

## Sprint 3 — Görev Sistemi (2–3 gün)

**Hedef:** Görev listesi, ekleme/düzenleme, filtreleme çalışıyor.

### Görevler

- [ ] **3.1** `TaskItem` bileşeni
  - Başlık, öncelik badge, durum badge, deadline (varsa)
  - Deadline yoksa "Süresiz" etiketi göster
  - Overdue ise kırmızı vurgu
  - Checkbox ile done/not_started toggle
- [ ] **3.2** `TaskList` bileşeni
  - TaskItem listesi
  - Durum filtresi: Tümü / Yapılmadı / Devam ediyor / Tamamlandı
  - Öncelik filtresi: Tümü / Düşük / Orta / Yüksek
- [ ] **3.3** `TaskForm` modal/drawer
  - Alanlar: başlık*, açıklama, durum, öncelik, deadline (opsiyonel)
  - Validasyon: başlık zorunlu
  - Create ve Edit modu
- [ ] **3.4** Görevler sayfası (`src/app/tasks/page.tsx`)
  - Üstte "Yeni Görev" butonu
  - TaskList + filtreler
  - TaskForm modal entegrasyonu
- [ ] **3.5** Görev silme — onay dialog'u ile
- [ ] **3.6** Dashboard'daki TodayTasks ve OverdueSection'ı canlı state'e bağla

**Kabul kriteri:** Görev CRUD tam çalışıyor. Deadline'sız görevler listede görünüyor. Filtreler doğru çalışıyor.

---

## Sprint 4 — Takvim Sistemi (3–4 gün)

**Hedef:** Gün/hafta/ay görünümü, event ekleme ve görüntüleme.

### Görevler

- [ ] **4.1** Takvim kütüphanesi kararı ver ve kur
  - Seçenek A: `@fullcalendar/react` (hızlı, feature-rich)
  - Seçenek B: Custom grid (daha fazla kontrol, daha fazla iş)
  - Kararı `docs/01-ARCHITECTURE.md`'deki "Karar Kayıtları" bölümüne not et
- [ ] **4.2** `EventCard` bileşeni — event özeti (başlık, saat, tip rengi)
- [ ] **4.3** `EventForm` modal
  - Alanlar: başlık*, açıklama, tip, başlangıç/bitiş, all-day toggle
  - Event tipine göre renk otomatik atansın
- [ ] **4.4** `CalendarView` bileşeni
  - Gün / hafta / ay görünüm toggle
  - Event'leri takvimde göster
  - Event'e tıklayınca detay / düzenleme
- [ ] **4.5** Sürükle-bırak ile event taşıma (kütüphane destekliyorsa)
  - Taşıma sonrası `updateEvent` çağrılsın
- [ ] **4.6** Takvim sayfası (`src/app/calendar/page.tsx`)
  - CalendarView + "Yeni Event" butonu
  - EventForm entegrasyonu
- [ ] **4.7** Event tipi renk haritası tanımla
  ```typescript
  const EVENT_COLORS = {
    meeting: '#3B82F6',
    study: '#8B5CF6',
    personal: '#10B981',
    custom: '#6B7280',
  };
  ```

**Kabul kriteri:** 3 görünüm modu çalışıyor. Event ekleme/düzenleme/silme yapılabiliyor. Event tipleri renk ile ayırt ediliyor.

---

## Sprint 5 — Süreçli Görevler / Workflow (3–4 gün)

**Hedef:** Workflow listesi, detay sayfası, step yönetimi — ürünün ana farkı.

### Görevler

- [ ] **5.1** `WorkflowCard` bileşeni
  - Başlık, açıklama, ilerleme çubuğu (X/Y step tamamlandı)
  - Aktif step vurgusu
  - Status badge (active / completed)
- [ ] **5.2** `StepItem` bileşeni
  - Sıra numarası, başlık, durum badge
  - Due date (varsa), overdue vurgusu
  - Tamamla butonu / checkbox
  - Not alanı (expand/collapse)
- [ ] **5.3** `StepList` bileşeni — sıralı step listesi
- [ ] **5.4** `WorkflowForm` modal
  - Başlık*, açıklama
  - Dinamik step ekleme/çıkarma (en az 2 step)
  - Her step: başlık*, opsiyonel due date
- [ ] **5.5** Süreçler listesi sayfası (`src/app/workflows/page.tsx`)
  - Aktif / tamamlanmış filtre
  - WorkflowCard grid
  - "Yeni Süreç" butonu
- [ ] **5.6** Süreç detay sayfası (`src/app/workflows/[id]/page.tsx`)
  - Workflow başlık + açıklama
  - StepList — step tamamlama, not ekleme
  - Genel ilerleme göstergesi
  - Tüm step'ler tamamlanınca workflow status → completed
- [ ] **5.7** Dashboard ActiveWorkflows bölümünü canlı state'e bağla

**Kabul kriteri:** Workflow oluşturulabiliyor. Step'ler bağımsız tamamlanabiliyor. İlerleme doğru hesaplanıyor. Not eklenebiliyor.

---

## Sprint 6 — Hatırlatmalar (2 gün)

**Hedef:** Reminder listesi ve oluşturma; event/task/step'e bağlama.

### Görevler

- [ ] **6.1** `ReminderItem` bileşeni
  - Başlık, hedef tipi (event/task/step), tetikleme zamanı
  - Tekrar bilgisi (once/daily/weekly)
  - Aktif/pasif toggle
- [ ] **6.2** `ReminderForm` modal
  - Alanlar: başlık*, hedef tipi*, hedef seçimi (dropdown), tetikleme zamanı*, tekrar
  - Hedef seçiminde ilgili entity listesi gösterilsin
- [ ] **6.3** Hatırlatmalar sayfası (`src/app/reminders/page.tsx`)
  - ReminderItem listesi
  - Aktif/pasif filtre
  - "Yeni Hatırlatma" butonu
- [ ] **6.4** Event/Task/Step formlarına "Hatırlatma ekle" opsiyonel alanı
  - Form kaydedilirken reminder da oluşturulsun
- [ ] **6.5** Dashboard'da yaklaşan hatırlatmalar mini bölümü (opsiyonel bonus)

**Kabul kriteri:** 3 hedef tipine reminder oluşturulabiliyor. Tekrar seçenekleri çalışıyor. Aktif/pasif toggle çalışıyor.

---

## Sprint 7 — Cilalama ve MVP Tamamlama (2–3 gün)

**Hedef:** MVP kabul kriterlerinin tamamı karşılanmış, temiz kod.

### Görevler

- [ ] **7.1** `docs/04-MVP-CHECKLIST.md` maddelerini tek tek kontrol et
- [ ] **7.2** Responsive tasarım gözden geçir (mobile, tablet, desktop)
- [ ] **7.3** Loading state'leri ekle (veri yüklenirken skeleton veya spinner)
- [ ] **7.4** Hata durumlarını handle et (geçersiz ID ile detay sayfası → 404)
- [ ] **7.5** Tutarlı boş state mesajları (her listede EmptyState)
- [ ] **7.6** Kod temizliği
  - Kullanılmayan import'ları sil
  - Magic string'leri constant'a taşı
  - Büyük bileşenleri parçala (200 satır üstü)
- [ ] **7.7** `npm run build` hatasız çalışsın
- [ ] **7.8** `npm run lint` hatasız çalışsın
- [ ] **7.9** Kısa demo video veya screenshot'lar hazırla

**Kabul kriteri:** MVP checklist %100, build ve lint temiz.

---

## Bonus Görevler (MVP sonrası)

Stajyer MVP'yi erken bitirirse bu görevlere geçebilir:

- [ ] **B.1** Kanban görünümü (To do / Doing / Done sütunları)
- [ ] **B.2** Tag sistemi — task ve workflow'lara tag ekleme/filtreleme
- [ ] **B.3** Task → Event bağlantısı (task'a "Takvime ekle" butonu)
- [ ] **B.4** Step → Calendar blok (step due date'i takvimde event olarak göster)
- [ ] **B.5** localStorage persist (sayfa yenilenince veri kaybolmasın)
- [ ] **B.6** Dark mode

---

## İletişim ve Destek

| Durum | Ne yap |
|-------|--------|
| Görev anlaşılmadı | İlgili `docs/` dosyasını oku, sonra sor |
| Teknik takılma | Önce 30 dk kendi araştır, sonra issue aç |
| Scope dışı özellik | Issue aç, onay bekle |
| Sprint bitti | Demo hazırla, checklist'i güncelle |

**Branch stratejisi:**
```
main
└── feat/sprint-0-setup
└── feat/sprint-1-mock-data
└── feat/sprint-2-dashboard
    ...
```

Her sprint için ayrı branch, sprint bitince `main`'e PR aç.
