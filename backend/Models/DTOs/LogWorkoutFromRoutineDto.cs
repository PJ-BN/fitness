using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Fitness.Models.DTOs
{
    public class LogWorkoutFromRoutineDto
    {
        [Required]
        public int DayRoutineId { get; set; }

        public DateTime Date { get; set; } = DateTime.UtcNow;

        public string? Notes { get; set; }

        public ICollection<CompletedExerciseDto> CompletedExercises { get; set; }
    }
}
