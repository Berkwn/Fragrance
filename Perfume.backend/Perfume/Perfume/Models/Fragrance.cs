namespace Perfume.Models
{
    public class Fragrance
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int BrandId { get; set; }
        public Brand Brand { get; set; }
        public decimal Price { get; set; }
        public string Gender { get; set; }
        public bool IsOriginal { get; set; }
        public ICollection<FragranceNote> FragranceNotes { get; set; }
        public ICollection<Review> Reviews { get; set; }
        public ICollection<FragrancePair> AsDupePairs { get; set; }
        public ICollection<FragrancePair> AsOriginalPairs { get; set; }

    }
}
