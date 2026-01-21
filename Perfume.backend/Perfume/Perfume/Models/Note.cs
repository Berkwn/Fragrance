namespace Perfume.Models
{
    public class Note
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string   Family { get; set; }
        public ICollection<FragranceNote> FragranceNotes { get; set; }

    }
}
