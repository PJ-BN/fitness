using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Fitness.Models
{
    public class DailySummary
    {
        [Key]
        [Column(Order = 1)]
        public string UserId { get; set; } = string.Empty;
        
        [Key] 
        [Column(Order = 2, TypeName = "date")]
        public DateOnly LocalDate { get; set; }
        
        public User User { get; set; } = null!;
        
        public int TotalCalories { get; set; }
        
        [Column(TypeName = "decimal(8,2)")]
        public decimal TotalProteinGrams { get; set; }
        
        [Column(TypeName = "decimal(8,2)")]
        public decimal TotalCarbsGrams { get; set; }
        
        [Column(TypeName = "decimal(8,2)")]
        public decimal TotalFatGrams { get; set; }
        
        [Column(TypeName = "decimal(8,2)")]
        public decimal? TotalFiberGrams { get; set; }
        
        [Column(TypeName = "decimal(8,2)")]
        public decimal? TotalSugarGrams { get; set; }
        
        public decimal? TotalSodiumMg { get; set; }
        
        public int EntriesCount { get; set; }
        
        public DateTime LastUpdatedUtc { get; set; } = DateTime.UtcNow;
    }
}