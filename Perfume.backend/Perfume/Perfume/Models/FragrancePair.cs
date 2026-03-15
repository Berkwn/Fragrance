using System.ComponentModel.DataAnnotations;

namespace Perfume.Models
{
    public class FragrancePair
    {
        public int Id { get; set; }

        // 1. Orijinal Ürün Bağlantısı
        public int OriginalFragranceId { get; set; }
        public Fragrance OriginalFragrance { get; set; }

        // 2. Muadil Ürün Bağlantısı
        public int DupeFragranceId { get; set; }
        public Fragrance DupeFragrance { get; set; }

        // 3. Görsel ve Admin Yorumları (Senin isteğine göre)
        [Required]
        public string ComparisonImageUrl { get; set; } // "Photoshoplu yan yana görselin URL'i"
        [StringLength(50)]
        public string? Season { get; set; } // "Yazlık", "Kışlık", "Dört Mevsim"
        [StringLength(50)]
        public string? UsageTime { get; set; } // "Gece", "Gündüz", "Ofis"
        [StringLength(500)]
        public string? AdminComment { get; set; } // "Orijinaline %90 benzer ama daha tatlı."
        [Range(0, 100)]
        public int SimilarityScore { get; set; } // Örn: 85 (Yüzde 85 benzerlik - Opsiyonel)
    }
}
