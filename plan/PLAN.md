# TopLoyalty — Proje Planı

## Proje Özeti

Multi-tenant loyalty & review gamification platformu. Her marka kendi panelinden yönetim yapar. Müşteriler QR okutarak sisteme girer, yorum bırakır, ödül kazanır.

**URL:** toployalty.raspyai.com (geçici) → toployalty.io (kalıcı)
**Teknoloji Stack:** Next.js 16.2.1 (App Router) + TypeScript + Prisma + SQLite + NextAuth.js
**Deploy:** Raspberry Pi 4, PM2, Cloudflare Tunnel

---

## Kullanıcı Rolleri

- **Super Admin:** Tüm markaları yönetir, sistem ayarları
- **Brand Admin:** Kendi markasını yönetir (şubeler, ödüller, raporlar)
- **Customer (anonim):** QR ile gelen müşteri, yorum yapar ödül alır

---

## Temel Modüller

### 1. Admin Panel (/admin)

- Marka listesi (aktif/pasif durumu)
- Yeni marka ekleme:
  - Marka adı, logo upload
  - Yetkili kişi: ad soyad, telefon
  - Giriş için: e-posta + şifre tanımlama
  - Aktif/pasif toggle
- Şube yönetimi (admin tüm markaların şubelerini görebilir)
- Tüm marka loglarını görüntüleme

### 2. Marka Paneli (/brand)

- Login (e-posta + şifre)
- Dashboard:
  - Toplam yorum sayısı
  - Toplam ödül verildi
  - Şube bazlı özet kartlar
  - Takvim componenti ile günlük görünüm
- Şube yönetimi:
  - Şube adı, Google Maps CID/review URL girişi
  - URL parse kontrolü (geçerli Maps linki mi?)
  - QR kod üretme (marka logosu ile birleşik)
  - QR indirme
- Ödül yönetimi:
  - Şube bazında günlük ödül ekleme
  - Her ödül için: ad, görsel (opsiyonel), günlük adet limiti
  - Kalan stok görüntüleme
  - Ödül aktif/pasif yapma
- Kazanılan ödüller listesi:
  - Kullanıcı adı, şube, tarih, ödül adı, IP
  - Filtreleme: şube, tarih aralığı
- Log görüntüleme:
  - Ödül ekleme/çıkarma/değişiklik logları
  - Günlük bazlı görünüm

### 3. Müşteri Deneyim Sayfası (/r/[brandSlug])

Kurgu: **MapsForwardWithAward**

Adımlar:

1. Sayfa açılır → Marka logosu + "Hangi şubedeysiniz?" sorusu
2. Şubeler buton listesi olarak gösterilir
3. Şube seçilir → "Sana bir sürprizimiz var..." mesajı + "Yorum Bırakmak İçin Tıklayın" butonu
4. Butona basılır → Google Maps review deeplink'i açılır (yeni sekme/uygulama)
5. Kullanıcı yorumu yapar, ekran görüntüsü alır
6. Sayfaya döner → "Ekran Görüntüsü Yükle" butonu
7. Görsel yüklenir → AI doğrulama (Gemini Vision):
   - Yorumun gerçek bir Google Maps yorumu olup olmadığı
   - Yorumun son 1 saat içinde yapılıp yapılmadığı
   - Yorum yapan kullanıcı adı okunabiliyorsa kayıt edilir
8. Doğrulama başarılı → Kullanıcıdan yalnızca ad soyad istenir
9. Sistem, şubede stokta olan ödüllerden birini otomatik olarak seçer ve stoktan düşer
10. Ekranda en üstte "Lütfen bu ekranı kasaya gösteriniz" yazar. Altında kullanıcının adı soyadı ve kazandığı ödülün adı ile görseli (varsa) gösterilir. Kullanıcı bu ekranı kasaya göstererek ödülünü alır.

---

## Veritabanı Şeması (Prisma)

### Brand

- id, name, slug, logoUrl
- contactName, contactPhone
- email (login için), passwordHash
- active (boolean)
- createdAt, updatedAt

### Branch

- id, brandId
- name
- googleMapsCID (büyük int)
- reviewUrl (https://search.google.com/local/writereview?cid=...)
- mapsUrl (https://www.google.com/maps?cid=...)
- qrImagePath
- active
- createdAt

### Scenario (sabit kayıtlar, kod ile seed edilir)

- id, name, slug
- description

### BrandScenario

- brandId, scenarioId

### Reward

- id, brandId, branchId
- name, imageUrl
- dailyLimit, date
- createdAt

### RewardStock

- id, rewardId, date
- totalCount, remainingCount

### ReviewSubmission

- id, branchId
- customerName, customerPhone (null — sonradan doldurulur)
- screenshotPath
- verificationStatus (pending/approved/rejected)
- verificationNote
- aiDetectedName (AI'nın okuduğu Maps kullanıcı adı)
- rewardId (null olabilir — ödül verilmediyse)
- ipAddress
- userAgent
- createdAt

### RewardGiven

- id, submissionId, rewardId
- customerName
- branchId, brandId
- createdAt

### ActivityLog

- id, brandId (null = admin işlemi)
- action (reward_added, reward_removed, reward_updated, reward_given, branch_added vb.)
- entityType, entityId
- oldValue (JSON), newValue (JSON)
- performedBy (admin/brand email)
- createdAt

---

## QR Kod Üretimi

- Şube eklendikten sonra "QR Üret" butonu aktif olur
- Her şube için benzersiz bir QR URL: toployalty.raspyai.com/r/[brandSlug]?branch=[branchId]
- QR görsel üretimi: qrcode kütüphanesi + sharp ile marka logosu ortaya yerleştirilir
- PNG olarak sunucuda saklanır, indirilebilir

---

## Google Maps URL Doğrulama

Girilen URL'den CID çıkarma mantığı:

- maps.app.goo.gl kısa link → curl ile redirect takip → ftid parametresinden CID çıkar
- google.com/maps URL → !1s parametresinden ftid çıkar → CID hesapla
- Geçersiz URL → kullanıcıya hata göster

---

## Kurgular (Scenarios)

Sistem kurgu bazlı çalışır. Her marka bir kurguya bağlanır.

### Kurgu 1: MapsForwardWithAward (aktif)

Yukarıda detaylandırıldı.

### Kurgu 2: (Gelecekte eklenecek)

Farklı bir yönlendirme/ödüllendirme mantığı.

---

## Dizin Yapısı

```
/Users/raspy/raspy-prod/TopLoyalty/
├── plan/
│   └── PLAN.md (bu dosya)
├── src/
│   ├── app/
│   │   ├── (admin)/
│   │   │   ├── layout.tsx
│   │   │   ├── dashboard/
│   │   │   └── brands/
│   │   ├── (brand)/
│   │   │   ├── layout.tsx
│   │   │   ├── dashboard/
│   │   │   ├── branches/
│   │   │   ├── rewards/
│   │   │   └── reports/
│   │   ├── (public)/
│   │   │   └── r/[brandSlug]/
│   │   │       └── page.tsx (müşteri sayfası)
│   │   └── api/
│   │       ├── auth/
│   │       ├── brands/
│   │       ├── branches/
│   │       ├── rewards/
│   │       ├── submissions/
│   │       └── qr/
│   ├── components/
│   │   ├── admin/
│   │   ├── brand/
│   │   ├── customer/
│   │   └── shared/
│   ├── lib/
│   │   ├── prisma.ts
│   │   ├── auth.ts
│   │   ├── qr-generator.ts
│   │   ├── maps-parser.ts (URL → CID çıkarma)
│   │   ├── ai-verifier.ts (Gemini Vision ile doğrulama)
│   │   └── scenarios/
│   │       └── MapsForwardWithAward.ts
│   └── styles/
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── public/
│   └── uploads/ (logo, ödül görselleri, QR kodlar)
├── package.json
└── next.config.ts
```

---

## Geliştirme Aşamaları

### Faz 1 — Temel Altyapı

- [ ] Next.js projesi kurulumu
- [ ] Prisma şeması + SQLite
- [ ] NextAuth.js (admin + brand rolleri)
- [ ] Admin: marka ekleme/düzenleme/aktif-pasif
- [ ] Marka: şube ekleme, URL doğrulama

### Faz 2 — QR ve Müşteri Akışı

- [ ] QR kod üretimi (logo ile)
- [ ] Müşteri sayfası (MapsForwardWithAward kurgusu)
- [ ] AI doğrulama (Gemini Vision)
- [ ] Ödül sistemi (stok, günlük limit)

### Faz 3 — Raporlama ve Loglar

- [ ] Takvim komponenti
- [ ] Günlük/şube bazlı istatistikler
- [ ] ActivityLog sistemi
- [ ] Ödül kazananlar listesi

### Faz 4 — Cloudflare + Deploy

- [ ] PM2 konfigürasyonu
- [ ] Cloudflare Tunnel yönlendirmesi (toployalty.raspyai.com)
- [ ] Logo + görsel upload (multer/formidable)

---

## Önemli Notlar

- Google Maps URL'leri parse edilirken hem goo.gl kısa link hem de tam URL desteklenecek
- AI doğrulama için Gemini Vision kullanılacak (mevcut API key ile)
- QR kodlar marka logosu ortada olacak şekilde üretilecek
- Tüm stok değişimleri ActivityLog'a yazılacak
- Müşteri sayfası tamamen mobil öncelikli tasarlanacak (QR'dan telefonda açılıyor)
- IP bazlı spam koruması: aynı IP'den aynı gün aynı şubeye max 1 başvuru

---

*Oluşturulma: 25 Mart 2026 | Hazırlayan: İsmet Demirer*
