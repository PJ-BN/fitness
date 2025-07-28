using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Fitness.Models.DTOs
{
    public class WorkoutDto
    {
        [Required]
        public string UserId { get; set; }

        public DateTime Date { get; set; }

        [Column(TypeName = "text")]
        public string? Notes { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}