using Microsoft.AspNetCore.Identity;

namespace Fitness.Models
{
    public class User : IdentityUser
    {
        public string Name { get; set; } = string.Empty;
        public string? DisplayName { get; set; }
        public string TimeZone { get; set; } = "UTC";
        public bool PreferredUnits { get; set; } = true;
        public string? Gender { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public decimal? WeightKg { get; set; }
        public decimal? HeightCm { get; set; }
        public int? DailyCalorieGoal { get; set; }
        public decimal? MacroProteinPct { get; set; }
        public decimal? MacroCarbsPct { get; set; }
        public decimal? MacroFatPct { get; set; }
        public string DefaultPrivacy { get; set; } = "private";
        public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAtUtc { get; set; } = DateTime.UtcNow;
    }
}