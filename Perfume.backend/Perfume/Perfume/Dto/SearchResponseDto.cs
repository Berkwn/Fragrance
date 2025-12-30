namespace Perfume.Dto
{
    public class SearchResponseDto
    {
        public int PairId { get; set; }
        public int SimilarityScore { get; set; }
        public string AdminComment { get; set; }
        public string ComparisonImageUrl { get; set; }
        public ProductSummaryDto OriginalFragrance { get; set; }
        public ProductSummaryDto Dupe { get; set; }
    }
    public class ProductSummaryDto
    {
        public int Id { get; set; }
        public string Brand { get; set; }
        public string Name { get; set; }
        public string Price { get; set; }
        public string ImageUrl { get; set; } // Şişe resmi
    }
}
