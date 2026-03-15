🌸 ScentFinder - Muadil Parfüm Keşfetme Platformu
ScentFinder, yüksek fiyatlı lüks parfümlerin (Dior, Chanel, Creed vb.) uygun fiyatlı muadillerini (Bargello, MAD vb.) bulmanızı, içeriklerini karşılaştırmanızı ve kullanıcı deneyimlerini incelemenizi sağlayan Full-Stack bir web uygulamasıdır.

🚀 Özellikler
🔍 Akıllı Arama: Marka veya parfüm adına göre anlık arama yapabilme.

⚖️ Karşılaştırma Kartları: Orijinal ve Muadil parfümü yan yana; fiyat, görsel ve benzerlik oranıyla kıyaslama.

✨ Koku Notaları: Parfümlerin üst, orta ve alt notalarını detaylı görüntüleme.

💬 Kullanıcı Yorumları: Kullanıcıların parfümleri puanlayabilmesi ve yorum yapabilmesi.

📊 İstatistikler: Yıldız dağılımı ve ortalama puan hesaplamaları.

📝 Editör Notları: Her eşleşme için özel, yapay zeka destekli admin yorumları.

🖼️ Görsel Odaklı: Orijinal şişe görselleri ve temsil muadil görselleriyle zengin arayüz.

🛠️ Teknolojiler
Bu proje Modern Web Mimarisi kullanılarak geliştirilmiştir.

Backend (Sunucu Tarafı)
.NET 7 / 8 (Core): Yüksek performanslı RESTful API.

Entity Framework Core: ORM ve Veritabanı yönetimi.

SQL Server: İlişkisel veritabanı.

Swagger UI: API dokümantasyonu ve testi.

Frontend (İstemci Tarafı)
React.js: Komponent bazlı modern UI kütüphanesi.

Tailwind CSS: Hızlı ve esnek stil tasarımı.

Axios: HTTP istekleri yönetimi.

React Icons: Modern ikon setleri.

⚙️ Kurulum ve Çalıştırma
Projeyi yerel makinenizde çalıştırmak için aşağıdaki adımları izleyin.

1. Ön Koşullar
Node.js (v16+)

.NET SDK (v7.0 veya v8.0)

SQL Server (LocalDB veya Express)

2. Backend Kurulumu
Termimali açıp Backend klasörüne gidin:

Bash

cd Backend
appsettings.json dosyasındaki Connection String'i kendi veritabanınıza göre düzenleyin. Ardından veritabanını oluşturun:

Bash

dotnet restore
dotnet ef database update
dotnet run
Backend şu adreste çalışacaktır: https://localhost:7000 (veya benzeri).

3. Frontend Kurulumu
Yeni bir terminal açıp Frontend klasörüne gidin:

Bash

cd Frontend
npm install
npm start
Uygulama tarayıcınızda http://localhost:3000 adresinde açılacaktır.

📥 Veri Yükleme (Seeding)
Veritabanını başlatmak ve içerisine 100+ parfüm verisini (Notalar, Görseller ve Yorumlar dahil) eklemek için özel bir API endpoint'i geliştirilmiştir.

Backend çalışırken Swagger arayüzüne gidin (/swagger).

POST /api/Import/ImportJsonData metodunu bulun.

Proje dokümanlarında bulunan (veya repo içerisindeki data.json) JSON verisini yapıştırıp Execute butonuna basın.

Sistem otomatik olarak:

Markaları oluşturur.

Parfümleri ekler.

Notaları ayrıştırıp ilişkilendirir.

Eşleşmeleri ve görselleri kaydeder.

Örnek JSON Veri Formatı:

JSON

[
  {
    "MuadilMarka": "Bargello",
    "MuadilKod": "709",
    "OrijinalMarka": "Dior",
    "OrijinalIsim": "Sauvage",
    "Cinsiyet": "Erkek",
    "Notalar": "Biber, Bergamot, Ambroxan",
    "AdminYorum": "Modern erkeğin imzası.",
    "OrijinalGorselUrl": "https://orijinal-link.jpg",
    "MuadilGorselUrl": "https://muadil-link.jpg"
  }
]
📸 Ekran Görüntüleri
(Buraya projenin bitmiş halinden 1-2 ekran görüntüsü ekleyebilirsin)

🤝 Katkıda Bulunma
Bu projeyi Fork'layın.

Yeni bir Branch oluşturun (git checkout -b feature/YeniOzellik).

Değişikliklerinizi Commit'leyin (git commit -m 'Yeni özellik eklendi').

Branch'inizi Push'layın (git push origin feature/YeniOzellik).

Bir Pull Request oluşturun.

📄 Lisans
Bu proje MIT Lisansı ile lisanslanmıştır. Detaylar için LICENSE dosyasına bakınız.
