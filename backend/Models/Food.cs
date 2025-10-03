using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Fitness.Models
{
    public class Food
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        
        [Required]
        [MaxLength(255)]
        public string Name { get; set; } = string.Empty;
        
        public bool IsSystem { get; set; } = false;
        
        public string? OwnerUserId { get; set; } // Nullable for system foods
        public User? OwnerUser { get; set; }
        
        // Nutrition per 100g
        [Range(0, 1200)]
        public int CaloriesPer100g { get; set; }
        
        [Column(TypeName = "decimal(6,2)")]
        public decimal ProteinGramsPer100g { get; set; }
        
        [Column(TypeName = "decimal(6,2)")]
        public decimal CarbsGramsPer100g { get; set; }
        
        [Column(TypeName = "decimal(6,2)")]
        public decimal FatGramsPer100g { get; set; }
        
        [Column(TypeName = "decimal(6,2)")]
        public decimal? FiberGramsPer100g { get; set; }
        
        [Column(TypeName = "decimal(6,2)")]
        public decimal? SugarGramsPer100g { get; set; }
        
        public decimal? SodiumMg { get; set; }
        
        public string[]? Tags { get; set; }
        
        public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAtUtc { get; set; } = DateTime.UtcNow;
        
        [Timestamp]
        public byte[] RowVersion { get; set; } = new byte[0];
        
        // Navigation properties
        public virtual ICollection<IntakeEntry> IntakeEntries { get; set; } = new List<IntakeEntry>();
    }
}