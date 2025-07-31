using System;
using System.ComponentModel.DataAnnotations;

namespace Fitness.Models.DTOs
{
    public class WeeklyRoutineDto
    {
        [Required]
        public string UserId { get; set; }

        [Required]
        public string Name { get; set; }

        public string? Description { get; set; }

        public bool IsActive { get; set; }
    }
}
