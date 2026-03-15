namespace Perfume.Models
{
    public class Brand
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public DateTime CreatedAt { get; set; }
        public ICollection<Fragrance> Fragrances { get; set; }

    }
}
