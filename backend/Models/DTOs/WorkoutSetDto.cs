using System.ComponentModel.DataAnnotations;

namespace Fitness.Models.DTOs
{
    public class WorkoutSetDto
    {
        public int SetNumber { get; set; }

        public int Reps { get; set; }

        public float? Weight { get; set; }

        public float? Duration { get; set; }

        public string? Notes { get; set; }
    }
}
