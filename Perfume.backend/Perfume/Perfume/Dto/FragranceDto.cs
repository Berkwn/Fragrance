namespace Perfume.Dto
{
    public class FragranceDto
    {
        public int Id { get; set; }
        public string Brand { get; set; }
        public string Name { get; set; }
        public string Price { get; set; }
        public string Match { get; set; }
        public List<string> Notes { get; set; }

        public string ImageUrl { get; set; }
        // Tasarım için rastgele atanacak görsellikler
        public string GradientFrom { get; set; }
        public string GradientTo { get; set; }
        public string BottleShape { get; set; }
    }
    public class SearchRequest
    {
        public List<string> SelectedNotes { get; set; } = new List<string>();
    }
}
