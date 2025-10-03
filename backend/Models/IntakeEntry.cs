using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Fitness.Models
{
    public class IntakeEntry
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        
        [Required]
        public string UserId { get; set; } = string.Empty;
        public User User { get; set; } = null!;
        
        [Required]
        public Guid FoodId { get; set; }
        public Food Food { get; set; } = null!;
        
        [Column(TypeName = "decimal(7,2)")]
        [Range(0.01, 10000)]
        public decimal QuantityGrams { get; set; }
        
        public DateTime LoggedAtUtc { get; set; }
        
        [Column(TypeName = "date")]
        public DateOnly LocalDate { get; set; } // Computed daily bucket in user's timezone
        
        public IntakeSource Source { get; set; } = IntakeSource.Manual;
        
        public string? Notes { get; set; }
        
        public bool IsDeleted { get; set; } = false;
        
        public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAtUtc { get; set; } = DateTime.UtcNow;
    }
    
    public enum IntakeSource
    {
        Manual,
        Import,
        Bulk
    }
}