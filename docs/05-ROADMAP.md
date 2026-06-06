# Yol Haritası

MVP sonrası özelliklerin öncelik sırası ve tahmini zaman çizelgesi.

---

## Faz 1 — MVP (Sprint 0–7)

**Süre:** ~3–4 hafta  
**Detay:** [`03-INTERN-TASKS.md`](./03-INTERN-TASKS.md)

Temel takvim, görev, workflow, hatırlatma ve dashboard.

---

## Faz 2 — V1 (MVP + 2–3 hafta)

### 2.1 Görünümler

| Özellik | Açıklama | Öncelik |
|---------|----------|---------|
| Kanban view | To do / Doing / Done sütunları, sürükle-bırak | Yüksek |
| List view | Tüm görevler compact liste, sıralama seçenekleri | Orta |
| Timeline view | Workflow step'leri zaman çizelgesinde | Orta |

### 2.2 Bağlantılar

| Özellik | Açıklama | Öncelik |
|---------|----------|---------|
| Task → Event | Görevi takvime time-block olarak ekle | Yüksek |
| Event → Task | Event'ten görev oluştur | Orta |
| Step → Calendar | Step due date'i otomatik event olarak göster | Yüksek |

### 2.3 Tag Sistemi

- Önceden tanımlı tag'ler: İş, Okul, Kişisel, Sağlık, Kodlama
- Task ve workflow'lara tag atama
- Tag bazlı filtreleme
- Özel tag oluşturma

### 2.4 Veri Kalıcılığı

- `localStorage` ile session arası veri koruma
- Import / export (JSON dosyası olarak)

---

## Faz 3 — V2 (V1 + 3–4 hafta)

### 3.1 Akıllı Planlama

- Boş zaman analizi (takvimde boş slotları bul)
- "Bunu ne zaman yapmalıyım?" önerisi
- Overbooking uyarısı (aynı saatte çakışan event'ler)
- Günlük kapasite göstergesi

### 3.2 Analytics Dashboard

- Haftalık tamamlanan görev sayısı
- Görev tamamlama oranı (%)
- Ortalama workflow tamamlama süresi
- En çok ertelenen görevler listesi
- Basit grafikler (bar chart, donut chart)

### 3.3 Notification Intelligence

- "Bu görevi X gündür ilerletmedin" uyarısı
- Deadline yaklaşırken yoğunluk önerisi
- Haftalık özet bildirimi (mock — gerçek push notification değil)

---

## Faz 4 — Gelişmiş (uzun vadeli)

### 4.1 Workflow Engine v2

| Tip | Açıklama |
|-----|----------|
| Linear | Basit sıralı step'ler (MVP'de bu var) |
| Conditional | "Şu step tamamlanırsa şu step açılır" |
| Recurring | Periyodik tekrarlayan workflow (örn. aylık review) |
| Parallel | Birden fazla step aynı anda aktif |

**Örnek — Conditional:**
```
Dil öğrenme süreci:
  Step 1: Seviye testi
  Step 2a: Başlangıç kursu (test < B1 ise)
  Step 2b: Orta kurs (test B1-B2 ise)
  Step 2c: İleri kurs (test > B2 ise)
```

### 4.2 Collaboration

- Paylaşılan task listeleri
- Grup görevleri (assignee)
- Takım takvimi
- Yorum sistemi

### 4.3 Backend Entegrasyonu

- PostgreSQL veya MongoDB
- REST veya GraphQL API
- Auth (NextAuth.js)
- Gerçek push notification

---

## Öncelik Matrisi

```
Yüksek Etki + Düşük Efor          Yüksek Etki + Yüksek Efor
┌─────────────────────────┐    ┌─────────────────────────┐
│ • Kanban view           │    │ • Workflow Engine v2    │
│ • Task → Event bağlantı │    │ • Analytics             │
│ • Tag sistemi           │    │ • Collaboration         │
│ • localStorage persist  │    │ • Backend entegrasyonu  │
└─────────────────────────┘    └─────────────────────────┘
Düşük Etki + Düşük Efor           Düşük Etki + Yüksek Efor
┌─────────────────────────┐    ┌─────────────────────────┐
│ • List view             │    │ • Push notification     │
│ • Dark mode             │    │ • Real-time sync        │
│ • Import/export         │    │ • Mobile app            │
└─────────────────────────┘    └─────────────────────────┘
```

---

## Teknik Borç ve İyileştirmeler

MVP sonrası ele alınacak:

- [ ] Unit test coverage (Vitest + Testing Library)
- [ ] E2E testler (Playwright)
- [ ] Storybook ile bileşen dokümantasyonu
- [ ] Performance: büyük listelerde virtualizasyon
- [ ] Accessibility audit (WCAG 2.1 AA)
- [ ] CI/CD pipeline (GitHub Actions)
