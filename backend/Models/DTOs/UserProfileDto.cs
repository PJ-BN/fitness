namespace Fitness.Models.DTOs
{
    public class UserProfileDto
    {
        public string Id { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string? DisplayName { get; set; }
        public string TimeZone { get; set; } = "UTC";
        public bool PreferredUnits { get; set; }
        public string? Gender { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public decimal? WeightKg { get; set; }
        public decimal? HeightCm { get; set; }
        public string DefaultPrivacy { get; set; } = "private";
        public DateTime CreatedAtUtc { get; set; }
    }

    public class UpdateUserProfileDto
    {
        public string? DisplayName { get; set; }
        public string? TimeZone { get; set; }
        public bool? PreferredUnits { get; set; }
        public string? Gender { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public decimal? WeightKg { get; set; }
        public decimal? HeightCm { get; set; }
        public string? DefaultPrivacy { get; set; }
    }
}