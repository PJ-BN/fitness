using System.ComponentModel.DataAnnotations;

namespace Fitness.Models.DTOs
{
    public class DayRoutineExerciseDto
    {
        [Required]
        public int DayRoutineId { get; set; }

        [Required]
        public int ExerciseId { get; set; }

        public int Sets { get; set; }

        public int Reps { get; set; }

        public float? Duration { get; set; }

        public float? Weight { get; set; }

        public string? Notes { get; set; }
    }
}
