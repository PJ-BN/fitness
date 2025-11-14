using System;

namespace Fitness.Models.DTOs
{
    public class GoalHistoryDto
    {
        public Guid Id { get; set; }
        public string UserId { get; set; }
        public DateTime EffectiveFromDate { get; set; }
        public int? DailyCalorieGoal { get; set; }
        public decimal? MacroProteinPct { get; set; }
        public decimal? MacroCarbsPct { get; set; }
        public decimal? MacroFatPct { get; set; }
        public DateTime CreatedAtUtc { get; set; }
    }
}
