using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Perfume.Context;
using Perfume.Dto;
using Perfume.Models;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Transactions;
using static System.Net.WebRequestMethods;

namespace Perfume.Controllers
{
    [Route("[controller]/[action]")]
    [ApiController]
    public class FragranceController : ControllerBase
    {
        private readonly AppDbContext _context;

        public FragranceController(AppDbContext context)
        {
            _context = context;
        }


        [HttpGet]
        public async Task<IActionResult> GetAllFragrances()
        {
            var notes = _context.Notes.Select(x => new { x.Id, x.Name, Family = "Popular" }).ToList();

            return Ok(notes);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> AddReview([FromBody] AddReviewDto request)
        {
            // 1. KULLANICI ID'SİNİ BULMA (Çoklu Kontrol)
            // Önce standart .NET ismine bakıyoruz, yoksa 'id'ye, o da yoksa 'sub'a bakıyoruz.
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                            ?? User.FindFirst("id")?.Value
                            ?? User.FindFirst("sub")?.Value;

            // Eğer hala bulamadıysa, konsola veya ekrana mevcut claimleri basalım ki hatayı görelim
            if (string.IsNullOrEmpty(userIdString))
            {
                var mevcutClaimler = string.Join(", ", User.Claims.Select(c => $"{c.Type}: {c.Value}"));
                return Unauthorized($"Kullanıcı ID bulunamadı. Gelen Token verileri: {mevcutClaimler}");
            }

            // 2. ID'yi Sayıya Çevir
            if (!int.TryParse(userIdString, out int userId))
            {
                return BadRequest($"Kullanıcı ID'si sayısal değil: {userIdString}");
            }

            // 3. Yorumu Oluştur
            var review = new Review
            {
                FragranceId = request.FragranceId,
                UserId = userId,
                Comment = request.Comment,
                Rating = request.Rating,
                CreatedAt = DateTime.UtcNow
            };

            // 4. Kaydet
            _context.Reviews.Add(review);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "İnceleme başarıyla eklendi" });
        }

        [HttpGet("{fragranceId}")]
        public async Task<ActionResult<List<ReviewDto>>> GetReviews(int fragranceId)
        {
            var reviews = await _context.Reviews.Where(x => x.FragranceId == fragranceId)
                .Include(x => x.User).Select(x => new ReviewDto
                {
                    Comment = x.Comment,
                    DateTime = x.CreatedAt,
                    Id = x.Id,
                    Rating = x.Rating,
                    UserName = x.User.Username
                }).ToListAsync();

            return Ok(reviews);

        }

        [HttpGet]
        public async Task<ActionResult<List<SearchResponseDto>>> Search([FromQuery] string query)
        {
            if(string.IsNullOrWhiteSpace(query))
            {
                return Ok(new List<SearchResponseDto>());

            }

            query=query.ToLower();

            var pairs = await _context.FragrancePairs.Include(x => x.OriginalFragrance).ThenInclude(x => x.Brand)
                .Include(x => x.DupeFragrance).ThenInclude(x => x.Brand).Where(x =>
                x.OriginalFragrance.Name.ToLower().Contains(query) ||
                x.DupeFragrance.Name.ToLower().Contains(query) ||
                x.OriginalFragrance.Brand.Name.ToLower().Contains(query)).ToListAsync();


            var result = pairs.Select(x => new SearchResponseDto
            {
                PairId = x.Id,
                AdminComment = x.AdminComment,
                ComparisonImageUrl = x.ComparisonImageUrl,
                SimilarityScore = x.SimilarityScore,
                

                OriginalFragrance = new ProductSummaryDto
                {
                    Id = x.OriginalFragrance.Id,
                    Name = x.OriginalFragrance.Name,
                    Brand = x.OriginalFragrance.Brand != null ? x.OriginalFragrance.Brand.Name : "Unknown",
                    ImageUrl=x.OriginalFragrance.ImageUrl,
                    Price = $"${x.OriginalFragrance.Price}"
                    
                    
                },
                Dupe=new ProductSummaryDto
                {
                    Id = x.DupeFragrance.Id,
                    Name = x.DupeFragrance.Name,
                    Brand = x.DupeFragrance.Brand != null ? x.DupeFragrance.Brand.Name : "Unknown",
                    Price = $"${x.DupeFragrance.Price}",
                    ImageUrl=x.DupeFragrance.ImageUrl

                }
            }).ToList();

            return Ok(result);
        }

        [HttpPost("ImportJsonData")]
        public async Task<IActionResult> ImportJsonData([FromBody] List<ScrapedDataDto> scrapedDataDtos)
        {
            if (scrapedDataDtos == null || !scrapedDataDtos.Any())
                return BadRequest("Gönderilen veri boş.");

            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                foreach (var item in scrapedDataDtos)
                {
                    // 1. MARKALARI AYARLA
                    var dupeBrand = await _context.Brands.FirstOrDefaultAsync(x => x.Name.ToLower() == item.MuadilMarka.ToLower());
                    if (dupeBrand == null) { dupeBrand = new Brand { Name = item.MuadilMarka }; _context.Brands.Add(dupeBrand); await _context.SaveChangesAsync(); }

                    var originalBrand = await _context.Brands.FirstOrDefaultAsync(x => x.Name.ToLower() == item.OrijinalMarka.ToLower());
                    if (originalBrand == null) { originalBrand = new Brand { Name = item.OrijinalMarka }; _context.Brands.Add(originalBrand); await _context.SaveChangesAsync(); }

                    // 2. ORİJİNAL PARFÜMÜ GÜNCELLE/EKLE
                    string descText = $"{item.OrijinalMarka} markasının ikonik {item.OrijinalIsim} parfümü.";
                    if (!string.IsNullOrEmpty(item.Notalar)) descText += $"\n\n✨ Koku Notaları: {item.Notalar}";

                    var originalFragrance = await _context.Fragrances.FirstOrDefaultAsync(x => x.Name.ToLower() == item.OrijinalIsim.ToLower() && x.BrandId == originalBrand.Id);

                    if (originalFragrance == null)
                    {
                        originalFragrance = new Fragrance
                        {
                            Name = item.OrijinalIsim,
                            BrandId = originalBrand.Id,
                            Gender = item.Cinsiyet ?? "Unisex",
                            Price = 6000,
                           
                            ImageUrl = item.OrijinalGorselUrl // RESİM BURAYA
                        };
                        _context.Fragrances.Add(originalFragrance);
                    }
                    else
                    {
                        // Varsa resmini güncelle
                        originalFragrance.ImageUrl = item.OrijinalGorselUrl;
                        _context.Fragrances.Update(originalFragrance);
                    }
                    await _context.SaveChangesAsync();

                    // 3. MUADİL PARFÜMÜ GÜNCELLE/EKLE
                    var dupeFragrance = await _context.Fragrances.FirstOrDefaultAsync(x => x.Name.ToLower() == item.MuadilKod.ToLower() && x.BrandId == dupeBrand.Id);

                    // Muadil görseli yoksa otomatik oluştur
                    string finalDupeImage = !string.IsNullOrEmpty(item.MuadilGorselUrl)
                        ? item.MuadilGorselUrl
                        : $"https://placehold.co/400x600/orange/white?text={item.MuadilMarka}+{item.MuadilKod}";

                    if (dupeFragrance == null)
                    {
                        dupeFragrance = new Fragrance
                        {
                            Name = item.MuadilKod,
                            BrandId = dupeBrand.Id,
                            Gender = item.Cinsiyet ?? "Unisex",
                            Price = 400,
                            ImageUrl = finalDupeImage // RESİM BURAYA
                        };
                        _context.Fragrances.Add(dupeFragrance);
                    }
                    else
                    {
                        dupeFragrance.ImageUrl = finalDupeImage;
                        _context.Fragrances.Update(dupeFragrance);
                    }
                    await _context.SaveChangesAsync();

                    // 4. NOTALARI İŞLE (Önceki kodun aynısı - ID garantili versiyon)
                    if (!string.IsNullOrEmpty(item.Notalar))
                    {
                        var noteNames = item.Notalar.Split(',', StringSplitOptions.TrimEntries | StringSplitOptions.RemoveEmptyEntries);
                        foreach (var noteName in noteNames)
                        {
                            var noteEntity = await _context.Notes.FirstOrDefaultAsync(n => n.Name.ToLower() == noteName.ToLower());
                            if (noteEntity == null) { noteEntity = new Note { Name = noteName }; _context.Notes.Add(noteEntity); await _context.SaveChangesAsync(); }

                            if (!await _context.FragranceNotes.AnyAsync(fn => fn.FragranceId == originalFragrance.Id && fn.NoteId == noteEntity.Id))
                            { _context.FragranceNotes.Add(new FragranceNote { FragranceId = originalFragrance.Id, NoteId = noteEntity.Id }); await _context.SaveChangesAsync(); }

                            if (!await _context.FragranceNotes.AnyAsync(fn => fn.FragranceId == dupeFragrance.Id && fn.NoteId == noteEntity.Id))
                            { _context.FragranceNotes.Add(new FragranceNote { FragranceId = dupeFragrance.Id, NoteId = noteEntity.Id }); await _context.SaveChangesAsync(); }
                        }
                    }

                    // 5. EŞLEŞTİRME (PAIR)
                    var existingPair = await _context.FragrancePairs.FirstOrDefaultAsync(x => x.OriginalFragranceId == originalFragrance.Id && x.DupeFragranceId == dupeFragrance.Id);
                    string adminComment = item.AdminYorum ?? "Fiyat/performans ürünü.";

                    if (existingPair == null)
                    {
                        var newPair = new FragrancePair
                        {
                            OriginalFragranceId = originalFragrance.Id,
                            DupeFragranceId = dupeFragrance.Id,
                            SimilarityScore = 90,
                            ComparisonImageUrl = item.OrijinalGorselUrl, // Kapak resmi olarak orijinali kullanıyoruz
                            AdminComment = adminComment
                        };
                        _context.FragrancePairs.Add(newPair);
                    }
                    else
                    {
                        existingPair.ComparisonImageUrl = item.OrijinalGorselUrl;
                        existingPair.AdminComment = adminComment;
                        _context.FragrancePairs.Update(existingPair);
                    }
                    await _context.SaveChangesAsync();
                }

                await transaction.CommitAsync();
                return Ok(new { Message = "Tüm veriler görsellerle güncellendi! 🚀" });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, $"Hata: {ex.Message} {ex.InnerException?.Message}");
            }
        }



        [HttpPost] 
        public async Task<ActionResult<List<FragranceDto>>> Recommend([FromBody] SearchRequest request)
        {
            // Frontend'den ge)len listeyi alıyoruz
            var notesToSearch = request.SelectedNotes;

            // Fragrance -> FragranceNotes -> Note ilişkisini çekiyoruz
            var query = _context.Fragrances
                                .Include(f => f.Brand)
                                .Include(f => f.FragranceNotes)
                                    .ThenInclude(fn => fn.Note)
                                .AsQueryable();

            if (notesToSearch != null && notesToSearch.Any())
            {
                // notesToSearch değişkenini kullanıyoruz
                query = query.Where(f => f.FragranceNotes.Any(fn => notesToSearch.Contains(fn.Note.Name)));
            }

            var fragrances = await query.ToListAsync();

            // ... (Kodun geri kalanı yani DTO çevirme kısmı AYNI kalacak) ...
            // Sadece yukarıdaki result hesaplarken de selectedNotes yerine notesToSearch kullan:

            var result = fragrances.Select(f => {
                var perfumeNotes = f.FragranceNotes.Select(fn => fn.Note.Name).ToList();

                // Burayı da güncelle:
                int matchCount = perfumeNotes.Count(n => notesToSearch.Contains(n));

                int matchPercentage = notesToSearch.Any()
                    ? (int)((double)matchCount / notesToSearch.Count * 100)
                    : 100;

                // ... Görsel atama kodları aynı ...

                // Önceki kodları kopyala yapıştır yapabilirsin, sadece matchCount mantığında
                // selectedNotes yerine notesToSearch kullanman yeterli.

                return new FragranceDto
                {
                    Id = f.Id,
                    Brand = f.Brand != null ? f.Brand.Name : "Bilinmiyor",
                    Name = f.Name,
                    Price = $"${f.Price}",
                    Match = $"{matchPercentage}%",
                    Notes = perfumeNotes,
                    BottleShape = "rect", // (Buradaki switch case/rastgele atama kodunu koru)
                    GradientFrom = "from-gray-800",
                    GradientTo = "to-black"
                };
            }).OrderByDescending(x => x.Match).ToList();

            return Ok(result);
        }
    }


}
