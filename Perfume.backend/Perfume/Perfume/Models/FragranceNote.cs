namespace Perfume.Models
{
    public class FragranceNote
    {
        public int FragranceId { get; set; }
        public Fragrance Fragrance { get; set; }

        public int NoteId { get; set; }
        public Note Note { get; set; }
    }
}
