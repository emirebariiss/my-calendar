# Ürün Tanımı

## Vizyon

**My Calendar**, insan hayatındaki işleri modelleyen esnek bir planlama sistemidir.

Klasik "takvim + todo" uygulamalarından farkı:

| Klasik yaklaşım | My Calendar yaklaşımı |
|-----------------|----------------------|
| Görev = yapılır / biter | Görev = aşamalı süreç olabilir |
| Her şeyin deadline'ı var | Deadline'sız aktif görevler desteklenir |
| Takvim ve görevler ayrı dünyalar | Event, task ve step birbirine bağlanabilir |
| Tek adımlı işler | Multi-step workflow engine |

## Üç Ana Modül

### 1. Takvim (Calendar Events)

Zaman bazlı planlama. Time-blocking ile gününü organize et.

**Event tipleri:**
- `meeting` — Toplantı
- `study` — Çalışma oturumu
- `personal` — Kişisel blok
- `custom` — Özel

### 2. Görevler (Tasks)

Basit, tek adımlı işler.

**Durumlar:** `not_started` | `in_progress` | `done`

**Öncelik:** `low` | `medium` | `high`

**Kritik kural:** Deadline olmayan görevler de aktif listede görünür.

### 3. Süreçli Görevler (Workflows)

Ürünün fark yaratan özelliği. Bir görev birden fazla aşamadan oluşur.

**Örnek — "Şirkete başvuru":**

| Step | Açıklama | Durum |
|------|----------|-------|
| 1 | Online başvuru | ✅ Tamamlandı |
| 2 | CV gönderimi | 🔄 Devam ediyor |
| 3 | Mülakat | ⏳ Bekliyor |
| 4 | Sonuç | ⏳ Bekliyor |

Her step:
- Ayrı tarih alabilir
- Bağımsız tamamlanabilir
- Not eklenebilir
- Kendi hatırlatmasına sahip olabilir

## MVP Özellikleri

### A) Takvim
- [ ] Gün / hafta / ay görünümü
- [ ] Saat bazlı planlama (time-blocking)
- [ ] Sürükle-bırak ile event ekleme / taşıma
- [ ] Event tipi seçimi

### B) Görevler
- [ ] Görev ekleme / düzenleme / silme
- [ ] Opsiyonel deadline
- [ ] Durum ve öncelik yönetimi
- [ ] Deadline'sız görevlerin aktif listede kalması

### C) Süreçli Görevler
- [ ] Workflow oluşturma (başlık + step listesi)
- [ ] Step tamamlama
- [ ] Step'e tarih ve not ekleme
- [ ] Genel ilerleme göstergesi (örn. 2/4 tamamlandı)

### D) Hatırlatmalar
- [ ] Tek seferlik reminder
- [ ] Günlük / haftalık tekrar
- [ ] Event bazlı reminder
- [ ] Task bazlı reminder
- [ ] Step bazlı reminder

### E) Dashboard
- [ ] Bugünün görevleri
- [ ] Yaklaşan eventler
- [ ] Aktif süreçli görevler
- [ ] Overdue (gecikmiş) işler

## V1+ Özellikleri (MVP sonrası)

- Kanban, Timeline, List görünümleri
- Task ↔ Event bağlantısı
- Tag sistemi (School, Work, Personal, Health, Coding)
- Akıllı planlama önerileri
- Analytics (haftalık verim, tamamlanma oranı)

## Gelişmiş Özellikler (uzun vadeli)

- Conditional workflow (şartlı step açılması)
- Recurring workflow
- Collaboration (paylaşılan listeler, takım takvimi)
- Notification intelligence

Detaylı yol haritası → [`05-ROADMAP.md`](./05-ROADMAP.md)
