using System.ComponentModel.DataAnnotations;

namespace Fitness.Models.DTOs
{
    public class IntakeEntryDto
    {
        [Required]
        public Guid FoodId { get; set; }
        
        [Required]
        [Range(0.01, 10000)]
        public decimal QuantityGrams { get; set; }
        
        [Required]
        public DateTime LoggedAtLocal { get; set; }
        
        [Required]
        public string TimeZone { get; set; } = string.Empty;
        
        public string? Notes { get; set; }
    }
    
    public class IntakeEntryResponseDto : IntakeEntryDto
    {
        public Guid Id { get; set; }
        public string UserId { get; set; } = string.Empty;
        public FoodResponseDto Food { get; set; } = null!;
        public DateTime LoggedAtUtc { get; set; }
        public DateOnly LocalDate { get; set; }
        public IntakeSource Source { get; set; }
        public bool IsDeleted { get; set; }
        public DateTime CreatedAtUtc { get; set; }
        public DateTime UpdatedAtUtc { get; set; }
        
        // Computed values
        public decimal EntryCalories { get; set; }
        public decimal EntryProteinGrams { get; set; }
        public decimal EntryCarbsGrams { get; set; }
        public decimal EntryFatGrams { get; set; }
    }
    
    public class BulkIntakeRequestDto
    {
        [Required]
        [MaxLength(100)]
        public List<IntakeEntryDto> Entries { get; set; } = new List<IntakeEntryDto>();
    }
}