# 🚀 Proje Görevi: NestFood Backend API (Staj Projesi)

**Tarih:** 10.02.2026
**Konu:** NestJS, TypeORM ve İleri Seviye İlişkisel Veritabanı Tasarımı
**Tahmini Süre:** 1 Hafta

---

## 1. Proje Özeti
**NestFood**, kullanıcıların farklı restoranlardan yemek siparişi verebildiği, ürünlere opsiyon (sos, içecek vb.) ekleyebildiği ve sepetlerini yönetebildiği bir "Yemek Sepeti" benzeri pazaryeri (marketplace) backend projesidir.

**Temel Amaç:**
Bu projenin amacı bir iş fikrini hayata geçirmekten ziyade; **NestJS** mimarisini, **TypeORM** ilişkilerini (One-to-Many, Many-to-Many) ve **Transaction** (Veritabanı işlem bütünlüğü) yönetimini derinlemesine öğrenmektir.

---

## 2. Teknoloji Yığını (Tech Stack)

* **Framework:** NestJS (Node.js)
* **Dil:** TypeScript
* **Veritabanı:** MySQL
* **ORM:** TypeORM
* **Validasyon:** class-validator & class-transformer
* **Authentication:** JWT (Passport Strategy)

---

## 3. Veritabanı Mimarisi (Entity & Relations)

Aşağıdaki varlıkları (Entity) ve ilişkileri kurman beklenmektedir. ER Diyagramını kodlamaya başlamadan önce kağıt üzerinde veya `draw.io` ile çizmelisin.

### A. Kullanıcı Yönetimi
* **User (Kullanıcı):**
    * Alanlar: `id`, `email`, `password`, `fullName`, `role` (CUSTOMER, ADMIN).
    * *İlişki:* Bir kullanıcının **1 tane** Sepeti (`Cart`) olur (One-to-One).
    * *İlişki:* Bir kullanıcının **N tane** Siparişi (`Order`) olur (One-to-Many).
* **Address (Adres):**
    * Alanlar: `id`, `title` (Ev, İş), `city`, `district`, `openAddress`.
    * *İlişki:* Bir Kullanıcının **N tane** adresi olabilir (**Many-to-One** -> User).

### B. Restoran ve Ürün Yapısı
* **Category (Kategori):**
    * Alanlar: `id`, `name` (Ör: Burger, Pizza, Tatlı).
    * *İlişki:* Bir Restoran **N tane** Kategoriye sahip olabilir. Bir Kategori **N tane** Restoranda olabilir (**Many-to-Many**).
* **Restaurant (Restoran):**
    * Alanlar: `id`, `name`, `imageUrl`, `minCartPrice`.
    * *İlişki:* Kategorilerle (**Many-to-Many**).
    * *İlişki:* Ürünlerle (**One-to-Many** -> Product).
* **Product (Ürün):**
    * Alanlar: `id`, `name`, `price`, `description`, `imageUrl`.
    * *İlişki:* Bir Restorana aittir (**Many-to-One**).
    * *İlişki:* Opsiyonlarla (**Many-to-Many**). *Ör: Bir burgerde hem "Ekstra Peynir" hem "Soğan" seçilebilir.*
* **Option (Opsiyon/Ek Malzeme):**
    * Alanlar: `id`, `name` (Ekstra Peynir), `priceModifier` (+10 TL).
    * *İlişki:* Ürünlerle (**Many-to-Many**).

### C. Sepet ve Sipariş (Kritik Bölüm)
* **Cart (Sepet):**
    * Alanlar: `id`, `totalPrice`.
    * *İlişki:* Kullanıcı ile (**One-to-One**). *Her kullanıcının DB'de kalıcı bir sepeti vardır.*
    * *İlişki:* Sepet Kalemleri ile (**One-to-Many** -> CartItem).
* **CartItem (Sepet Kalemi):**
    * Alanlar: `id`, `quantity` (Adet).
    * *İlişki:* Hangi Sepete ait? (**Many-to-One** -> Cart).
    * *İlişki:* Hangi Ürün? (**Many-to-One** -> Product).
* **Order (Sipariş):**
    * Alanlar: `id`, `finalPrice`, `status` (PENDING, PREPARING, DELIVERED), `createdAt`.
    * *İlişki:* Hangi Kullanıcı? (**Many-to-One**).
    * *İlişki:* Hangi Restoran? (**Many-to-One**).
    * *İlişki:* Sipariş Kalemleri (**One-to-Many** -> OrderItem).
* **OrderItem (Sipariş Detayı):**
    * *Not:* Sipariş oluştuğunda CartItem verisi buraya kopyalanır. Ürünün o anki fiyatı (`priceAtTime`) burada saklanmalıdır.

---

## 4. İstenen İş Mantığı (Business Logic)

### 🟢 Aşama 1: Temel API & Auth
* Kullanıcı kayıt (`/auth/register`) ve giriş (`/auth/login`) işlemleri.
* Admin, Restoran ve Kategori oluşturabilmeli.
* Restoranlar listelenirken "Kategoriye göre" filtreleme yapılabilmeli (QueryBuilder kullanılacak).

### 🟡 Aşama 2: Sepet Mantığı (Cart Logic)
* **POST /cart:** Sepete ürün ekleme.
    * *Kural 1:* Sepette zaten aynı ürün (aynı opsiyonlarla) varsa yeni satır ekleme, `quantity` artır.
    * *Kural 2:* Sepette **farklı bir restorandan** ürün varsa, hata fırlat veya kullanıcıya sorup sepeti temizleyerek yenisini ekle.
* **GET /cart:** Sepeti görüntüle (Ürün detayları ve toplam fiyat hesaplanmış olarak).

### 🔴 Aşama 3: Sipariş (Checkout & Transaction)
* **POST /order:** Sepeti siparişe dönüştür.
    * Bu işlem **Database Transaction** (QueryRunner) içinde yapılmalıdır.
    * **Adım 1:** Sepetteki ürünleri `Order` ve `OrderItem` tablolarına kopyala. (Fiyatları o anki fiyattan sabitle!).
    * **Adım 2:** Sepeti temizle (`Cart` içini boşalt).
    * **Adım 3:** Hata olursa tüm işlemleri geri al (Rollback).

---

## 5. Gerekli Endpoint Listesi (API Haritası)

Projenin tamamlanmış sayılması için aşağıdaki endpointlerin çalışır durumda olması gerekmektedir. Veritabanına elle (manuel) veri girişi yapılmamalı, tüm veriler bu API'ler üzerinden akmalıdır.

### 🔐 A. Kimlik Doğrulama (Auth)
* `POST /auth/register`: Yeni kullanıcı kaydı (Default rol: `CUSTOMER`).
* `POST /auth/login`: Giriş yap ve JWT Token dön.

### 🏪 B. Restoran & Kategori Yönetimi (Admin)
* `POST /categories`: Yeni kategori oluştur (Ör: "Fast Food", "Tatlı").
* `GET /categories`: Tüm kategorileri listele.
* `POST /restaurants`: Yeni restoran oluştur.
    * *Body:* `{ name: "Burger King", categoryIds: [1, 3] }` -> İlişki kurulumu.
* `GET /restaurants`: Restoranları listele (Query param: `?categoryId=1`).
* `GET /restaurants/:id`: Tek bir restoranı ve **içindeki ürünleri** getir.

### 🍔 C. Ürün ve Opsiyon Yönetimi
* `POST /products`: Sisteme yeni ürün ekle.
    * *Body:* `{ name: "Whopper", price: 250, restaurantId: 5 }`
* `POST /options`: Ürünlere eklenebilecek opsiyonları oluştur.
    * *Body:* `{ name: "Ekstra Peynir", priceModifier: 20 }`
* `POST /products/:id/options`: Var olan bir ürüne opsiyon bağla (İlişki endpointi).

### 🛒 D. Sepet İşlemleri (Cart)
* `GET /cart`: Kullanıcının o anki sepetini getir.
* `POST /cart`: Sepete ürün ekle.
    * *Body:* `{ productId: 10, quantity: 1, optionIds: [2, 5] }`
* `DELETE /cart/item/:id`: Sepetten spesifik bir kalemi sil.
* `DELETE /cart`: Sepeti tamamen boşalt.

### 📦 E. Sipariş ve Kullanıcı
* `POST /orders`: (Checkout) Sepeti siparişe dönüştür.
* `GET /orders`: Giriş yapmış kullanıcının geçmiş siparişlerini listele.
* `POST /users/address`: Kullanıcıya yeni teslimat adresi ekle.

---

## 6. Başarı Kriterleri
1.  **Swagger:** Tüm endpointler Swagger ile dokümante edilmeli.
2.  **DTO:** Gelen tüm veriler (ValidationPipe) kontrol edilmeli.
3.  **Clean Code:** Service ve Controller katmanları ayrılmalı, iş mantığı Service'te tutulmalı.
4.  **İlişkiler:** Postman ile yapılan bir sorguda `relations: true` mantığı ile iç içe verilerin (Restoran -> Ürün -> Opsiyon) doğru geldiği görülmeli.

Başarılar! 🚀