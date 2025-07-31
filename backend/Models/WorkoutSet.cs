using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Fitness.Models
{
    public class WorkoutSet
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int WorkoutExerciseId { get; set; }

        [ForeignKey("WorkoutExerciseId")]
        public WorkoutExercise WorkoutExercise { get; set; }

        public int SetNumber { get; set; }

        public int Reps { get; set; }

        public float? Weight { get; set; }

        public float? Duration { get; set; }

        [Column(TypeName = "text")]
        public string? Notes { get; set; }
    }
}
