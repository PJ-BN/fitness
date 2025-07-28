using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Fitness.Models.DTOs
{
    public class WorkoutExerciseDto
    {
        [Required]
        public int WorkoutId { get; set; }

        [Required]
        public int ExerciseId { get; set; }

        public int Sets { get; set; }

        public int Reps { get; set; }

        public float? Weight { get; set; }

        public float? Duration { get; set; }

        [Column(TypeName = "text")]
        public string? Notes { get; set; }
    }
}