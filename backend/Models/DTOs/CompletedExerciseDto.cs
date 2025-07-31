using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Fitness.Models.DTOs
{
    public class CompletedExerciseDto
    {
        [Required]
        public int ExerciseId { get; set; }

        public string? Notes { get; set; }

        public ICollection<WorkoutSetDto> Sets { get; set; }
    }
}
