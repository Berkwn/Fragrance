using Microsoft.EntityFrameworkCore;
using Perfume.Models;

namespace Perfume.Context
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Brand> Brands { get; set; }
        public DbSet<Fragrance> Fragrances { get; set; }
        public DbSet<Note> Notes { get; set; }
        public DbSet<FragranceNote> FragranceNotes { get; set; } // Çoka çok ara tablo
        public DbSet<FragrancePair> FragrancePairs { get; set; } // Eşleşme tablosu
        public DbSet<Review> Reviews { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<FragranceNote>()
                .HasKey(fn => new { fn.FragranceId, fn.NoteId });

           modelBuilder.Entity<FragranceNote>().HasOne(fn=>fn.Fragrance)
                .WithMany(f=>f.FragranceNotes)
                .HasForeignKey(fn=>fn.FragranceId);

            modelBuilder.Entity<FragranceNote>().HasOne(fn => fn.Note)
                .WithMany(n => n.FragranceNotes)
                .HasForeignKey(fn => fn.NoteId);

            modelBuilder.Entity<FragrancePair>().HasOne(fp => fp.OriginalFragrance)
                .WithMany(f => f.AsOriginalPairs)
                .HasForeignKey(fp => fp.OriginalFragranceId)
                .OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<FragrancePair>()
                .HasOne(fp => fp.DupeFragrance)
                .WithMany(f => f.AsDupePairs)
                .HasForeignKey(fp => fp.DupeFragranceId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Fragrance>().Property(f=>f.Price).HasColumnType("decimal(18,2)");

            modelBuilder.Entity<Review>()
                .HasOne(x=>x.User)
                .WithMany(u=>u.Reviews)
                .HasForeignKey(x=>x.UserId)
                .OnDelete(DeleteBehavior.Cascade);


            base.OnModelCreating(modelBuilder);
        }


    }

  
}
