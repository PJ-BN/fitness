using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Fitness.Models
{
    public class GoalHistory
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public string UserId { get; set; }

        [ForeignKey("UserId")]
        public virtual User User { get; set; }

        [Required]
        public DateTime EffectiveFromDate { get; set; }

        public int? DailyCalorieGoal { get; set; }

        public decimal? MacroProteinPct { get; set; }
        public decimal? MacroCarbsPct { get; set; }
        public decimal? MacroFatPct { get; set; }

        public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
    }
}
