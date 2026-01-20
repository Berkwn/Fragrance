namespace Perfume.Dto;

public record ScrapedDataDto
{
    public string MuadilMarka { get; set; }
    public string MuadilKod { get; set; }
    public string OrijinalMarka { get; set; }
    public string OrijinalIsim { get; set; }
    public string Notalar { get; set; }
    public string AdminYorum { get; set; }
    public string Cinsiyet { get; set; }
    public string OrijinalGorselUrl { get; set; }
    public string MuadilGorselUrl { get; set; }
}