# Stajyer Görev Listesi

Bu doküman, projeye yeni başlayan yazılım mühendisi stajyeri için sprint bazlı adım adım görevleri içerir.

**Nasıl kullanılır:**
1. Sprint'leri sırayla tamamla (Sprint 0 → Sprint 7)
2. Her görevi bitirdikten sonra checkbox'ı işaretle
3. **Biten sprintler için önce** [`docs/completed/`](./completed/README.md) klasöründeki detaylı rehberi oku
4. Cursor kullanıyorsan `.cursor/AGENTS.md` ve `.cursor/rules/` dosyalarına bak
5. Takıldığın yerde `docs/` klasöründeki ilgili dokümana bak
6. Her sprint sonunda kısa bir demo hazırla

**Tahmini süre:** 3–4 hafta (part-time)

**Güncel durum:** Sprint 0–4 tamamlandı. Sprint 5'ten devam et.

---

## Sprint 0 — Proje Kurulumu (1–2 gün)

**Hedef:** Çalışan bir Next.js iskeleti ve temel navigasyon.

### Görevler

- [x] **0.1** Next.js projesi oluştur
  ```bash
  npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
  ```
- [x] **0.2** Klasör yapısını oluştur (`docs/01-ARCHITECTURE.md` referans al)
  - `src/components/ui/`
  - `src/components/layout/`
  - `src/data/`
  - `src/hooks/`
  - `src/lib/types/`
  - `src/lib/utils/`
  - `src/providers/`
- [x] **0.3** TypeScript strict mode'un açık olduğunu doğrula (`tsconfig.json`)
- [x] **0.4** Temel layout bileşenlerini yaz
  - `Sidebar` — navigasyon linkleri: Dashboard, Takvim, Görevler, Süreçler, Hatırlatmalar
  - `Header` — sayfa başlığı + basit kullanıcı alanı (mock)
  - `RootLayout` — sidebar + header + main content
- [x] **0.5** Boş sayfa route'larını oluştur
  - `/` → "Dashboard — yakında"
  - `/calendar` → "Takvim — yakında"
  - `/tasks` → "Görevler — yakında"
  - `/workflows` → "Süreçler — yakında"
  - `/reminders` → "Hatırlatmalar — yakında"
- [x] **0.6** Aktif route'u sidebar'da vurgula (usePathname)
- [x] **0.7** `npm run dev` ile çalıştığını doğrula

**Kabul kriteri:** ✅ Tüm sayfalar arası navigasyon çalışıyor, responsive sidebar görünüyor.

📖 Detaylı açıklama → [`docs/completed/sprint-0-proje-kurulumu.md`](./completed/sprint-0-proje-kurulumu.md)

---

## Sprint 1 — Tipler ve Mock Veri (2 gün)

**Hedef:** Tüm entity tipleri tanımlı, mock JSON dosyaları hazır, veri yüklenebiliyor.

### Görevler

- [x] **1.1** TypeScript interface'lerini yaz (`docs/02-MOCK-DATA.md` referans al)
  - `src/lib/types/event.ts` → `CalendarEvent`, `EventType`, `EventStatus`
  - `src/lib/types/task.ts` → `Task`, `TaskStatus`, `TaskPriority`
  - `src/lib/types/workflow.ts` → `Workflow`, `WorkflowStep`, `StepStatus`
  - `src/lib/types/reminder.ts` → `Reminder`, `ReminderTargetType`, `ReminderRecurrence`
  - `src/lib/types/index.ts` → barrel export
- [x] **1.2** Mock JSON dosyalarını oluştur (`src/data/`)
  - `events.json` — en az 5 kayıt (farklı tipler ve tarihler)
  - `tasks.json` — en az 8 kayıt (deadline'lı + deadline'sız karışık)
  - `workflows.json` — en az 3 kayıt (1 tamamlanmış, 1 aktif, 1 yeni)
  - `reminders.json` — en az 5 kayıt (event, task, step hedefli)
- [x] **1.3** Mock loader yaz
  - `src/lib/mock/loader.ts` → `loadEvents()`, `loadTasks()`, `loadWorkflows()`, `loadReminders()`
- [x] **1.4** Tarih yardımcı fonksiyonları yaz (`src/lib/utils/date.ts`)
  - `formatDate(date, format?)` — Türkçe tarih formatı
  - `formatTime(date)` — saat:dakika
  - `isToday(date)` — bugün mü?
  - `isOverdue(deadline)` — geçmiş mi?
  - `isUpcoming(date, days?)` — önümüzdeki N gün içinde mi?
- [x] **1.5** Filtre/sıralama yardımcıları (`src/lib/utils/filters.ts`)
  - `filterByStatus(items, status)`
  - `sortByPriority(tasks)`
  - `getOverdueTasks(tasks)`
  - `getActiveWorkflows(workflows)`

**Kabul kriteri:** ✅ JSON dosyaları import edilebiliyor, tip hatası yok, utility fonksiyonlar hazır.

📖 Detaylı açıklama → [`docs/completed/sprint-1-tipler-ve-mock-veri.md`](./completed/sprint-1-tipler-ve-mock-veri.md)

---

## Sprint 2 — Global State ve Dashboard (2–3 gün)

**Hedef:** Mock veri global state'te, dashboard özet bilgileri gösteriyor.

### Görevler

- [x] **2.1** `AppProvider` context oluştur (`src/providers/AppProvider.tsx`)
  - State: `events`, `tasks`, `workflows`, `reminders`
  - Actions: `add*`, `update*`, `delete*` (her entity için)
  - İlk yükleme: mock JSON'dan
- [x] **2.2** Custom hook'ları yaz
  - `useEvents()` — events state + CRUD
  - `useTasks()` — tasks state + CRUD
  - `useWorkflows()` — workflows state + CRUD
  - `useReminders()` — reminders state + CRUD
- [x] **2.3** Paylaşılan UI bileşenleri (`src/components/ui/`)
  - `Badge` — status ve priority için renkli etiket
  - `Card` — içerik kartı
  - `EmptyState` — veri yokken gösterilecek mesaj
  - `ProgressBar` — workflow ilerleme çubuğu
- [x] **2.4** Dashboard bileşenleri (`src/components/dashboard/`)
  - `TodayTasks` — bugün deadline'ı olan veya in_progress task'lar
  - `UpcomingEvents` — önümüzdeki 7 gün event'leri
  - `ActiveWorkflows` — status: active workflow'lar + ilerleme
  - `OverdueSection` — gecikmiş task ve step'ler
- [x] **2.5** Dashboard sayfasını birleştir (`src/app/page.tsx`)
  - 4 bölümü grid layout ile yerleştir
  - Her bölümde "Tümünü gör →" linki ilgili sayfaya yönlendirsin
- [x] **2.6** Boş state'leri handle et (hiç task yoksa EmptyState göster)

**Kabul kriteri:** ✅ Ana sayfa mock veriden gerçek özet bilgileri gösteriyor. Overdue bölümü gecikmiş işleri doğru listeliyor.

📖 Detaylı açıklama → [`docs/completed/sprint-2-global-state-ve-dashboard.md`](./completed/sprint-2-global-state-ve-dashboard.md)

---

## Sprint 3 — Görev Sistemi (2–3 gün)

**Hedef:** Görev listesi, ekleme/düzenleme, filtreleme çalışıyor.

### Görevler

- [x] **3.1** `TaskItem` bileşeni
  - Başlık, öncelik badge, durum badge, deadline (varsa)
  - Deadline yoksa "Süresiz" etiketi göster
  - Overdue ise kırmızı vurgu
  - Checkbox ile done/not_started toggle
- [x] **3.2** `TaskList` bileşeni
  - TaskItem listesi
  - Durum filtresi: Tümü / Yapılmadı / Devam ediyor / Tamamlandı
  - Öncelik filtresi: Tümü / Düşük / Orta / Yüksek
- [x] **3.3** `TaskForm` modal/drawer
  - Alanlar: başlık*, açıklama, durum, öncelik, deadline (opsiyonel)
  - Validasyon: başlık zorunlu
  - Create ve Edit modu
- [x] **3.4** Görevler sayfası (`src/app/tasks/page.tsx`)
  - Üstte "Yeni Görev" butonu
  - TaskList + filtreler
  - TaskForm modal entegrasyonu
- [x] **3.5** Görev silme — onay dialog'u ile
- [x] **3.6** Dashboard'daki TodayTasks ve OverdueSection'ı canlı state'e bağla

**Kabul kriteri:** ✅ Görev CRUD tam çalışıyor. Deadline'sız görevler listede görünüyor. Filtreler doğru çalışıyor.

📖 Detaylı açıklama → [`docs/completed/sprint-3-gorev-sistemi.md`](./completed/sprint-3-gorev-sistemi.md)

---

## Sprint 4 — Takvim Sistemi (3–4 gün)

**Hedef:** Gün/hafta/ay görünümü, event ekleme ve görüntüleme.

### Görevler

- [x] **4.1** Takvim kütüphanesi kararı ver ve kur
  - Seçenek A: `@fullcalendar/react` (hızlı, feature-rich)
  - Seçenek B: Custom grid (daha fazla kontrol, daha fazla iş)
  - Kararı `docs/01-ARCHITECTURE.md`'deki "Karar Kayıtları" bölümüne not et
- [x] **4.2** `EventCard` bileşeni — event özeti (başlık, saat, tip rengi)
- [x] **4.3** `EventForm` modal
  - Alanlar: başlık*, açıklama, tip, başlangıç/bitiş, all-day toggle
  - Event tipine göre renk otomatik atansın
- [x] **4.4** `CalendarView` bileşeni
  - Gün / hafta / ay görünüm toggle
  - Event'leri takvimde göster
  - Event'e tıklayınca detay / düzenleme
- [x] **4.5** Sürükle-bırak ile event taşıma (kütüphane destekliyorsa)
  - Taşıma sonrası `updateEvent` çağrılsın
- [x] **4.6** Takvim sayfası (`src/app/calendar/page.tsx`)
  - CalendarView + "Yeni Event" butonu
  - EventForm entegrasyonu
- [x] **4.7** Event tipi renk haritası tanımla
  ```typescript
  const EVENT_COLORS = {
    meeting: '#3B82F6',
    study: '#8B5CF6',
    personal: '#10B981',
    custom: '#6B7280',
  };
  ```

**Kabul kriteri:** ✅ 3 görünüm modu çalışıyor. Event ekleme/düzenleme/silme yapılabiliyor. Event tipleri renk ile ayırt ediliyor.

📖 Detaylı açıklama → [`docs/completed/sprint-4-takvim-sistemi.md`](./completed/sprint-4-takvim-sistemi.md)

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
