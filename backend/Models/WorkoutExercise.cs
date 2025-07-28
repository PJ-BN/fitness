using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Fitness.Models
{
    public class WorkoutExercise
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int WorkoutId { get; set; }

        [ForeignKey("WorkoutId")]
        public Workout Workout { get; set; }

        [Required]
        public int ExerciseId { get; set; }

        [ForeignKey("ExerciseId")]
        public Exercise Exercise { get; set; }

        public int Sets { get; set; }

        public int Reps { get; set; }

        public float? Weight { get; set; }

        public float? Duration { get; set; }

        [Column(TypeName = "text")]
        public string? Notes { get; set; }
    }
}
