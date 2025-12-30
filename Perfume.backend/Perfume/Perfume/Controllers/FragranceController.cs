using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Perfume.Context;
using System.Security.Claims;
using Perfume.Dto;
using Perfume.Models;
using System.Threading.Tasks;

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
                    Price = $"${x.OriginalFragrance.Price}"
                    
                    
                },
                Dupe=new ProductSummaryDto
                {
                    Id = x.DupeFragrance.Id,
                    Name = x.DupeFragrance.Name,
                    Brand = x.DupeFragrance.Brand != null ? x.DupeFragrance.Brand.Name : "Unknown",
                    Price = $"${x.DupeFragrance.Price}"
                }
            }).ToList();

            return Ok(result);
        }

        [HttpPost] 
        public async Task<ActionResult<List<FragranceDto>>> Recommend([FromBody] SearchRequest request)
        {
            // Frontend'den gelen listeyi alıyoruz
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
