using System.ComponentModel.DataAnnotations;

namespace Fitness.Models.DTOs
{
    public class FoodDto
    {
        [Required]
        [MaxLength(255)]
        public string Name { get; set; } = string.Empty;
        
        [Range(0, 1200)]
        public int CaloriesPer100g { get; set; }
        
        [Range(0, 100)]
        public decimal ProteinGramsPer100g { get; set; }
        
        [Range(0, 100)]
        public decimal CarbsGramsPer100g { get; set; }
        
        [Range(0, 100)]
        public decimal FatGramsPer100g { get; set; }
        
        public decimal? FiberGramsPer100g { get; set; }
        public decimal? SugarGramsPer100g { get; set; }
        public decimal? SodiumMg { get; set; }
        
        public string[]? Tags { get; set; }
    }
    
    public class FoodResponseDto : FoodDto
    {
        public Guid Id { get; set; }
        public bool IsSystem { get; set; }
        public string? OwnerUserId { get; set; }
        public DateTime CreatedAtUtc { get; set; }
        public DateTime UpdatedAtUtc { get; set; }
        public string RowVersion { get; set; } = string.Empty;
    }
    
    public class FoodSearchDto
    {
        public string? NameContains { get; set; }
        public decimal? MinProteinPer100g { get; set; }
        public decimal? MaxCaloriesPer100g { get; set; }
        public string? Tags { get; set; } // comma-separated
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 25;
        public string Sort { get; set; } = "name:asc"; // name:asc, calories:desc, etc
    }
}