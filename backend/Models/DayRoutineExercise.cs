using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Fitness.Models
{
    public class DayRoutineExercise
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int DayRoutineId { get; set; }

        [ForeignKey("DayRoutineId")]
        public DayRoutine DayRoutine { get; set; }

        [Required]
        public int ExerciseId { get; set; }

        [ForeignKey("ExerciseId")]
        public Exercise Exercise { get; set; }

        public int Sets { get; set; }

        public int Reps { get; set; }

        public float? Duration { get; set; }

        public float? Weight { get; set; }

        [Column(TypeName = "text")]
        public string? Notes { get; set; }
    }
}
