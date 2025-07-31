using System.Collections.Generic;
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

        [Column(TypeName = "text")]
        public string? Notes { get; set; }

        public ICollection<WorkoutSet> Sets { get; set; }
    }
}
