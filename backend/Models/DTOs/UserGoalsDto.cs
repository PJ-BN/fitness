using System.ComponentModel.DataAnnotations;

namespace Fitness.Models.DTOs
{
    public class UserGoalsDto
    {
        public int? DailyCalorieGoal { get; set; }
        public decimal? MacroProteinPct { get; set; }
        public decimal? MacroCarbsPct { get; set; }
        public decimal? MacroFatPct { get; set; }
        public MacroGoalsDto? RecommendedMacroGrams { get; set; }
    }

    public class UpdateUserGoalsDto
    {
        [Range(800, 5000)]
        public int? DailyCalorieGoal { get; set; }
        
        [Range(0, 100)]
        public decimal? MacroProteinPct { get; set; }
        
        [Range(0, 100)]
        public decimal? MacroCarbsPct { get; set; }
        
        [Range(0, 100)]
        public decimal? MacroFatPct { get; set; }
    }
}