using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Fitness.Models.DTOs
{
    public class GoalDto
    {
        [Required]
        public string UserId { get; set; }

        [Required]
        [Column(TypeName = "varchar(255)")]
        public string Description { get; set; }

        public float TargetValue { get; set; }

        public float CurrentValue { get; set; }

        public DateTime Deadline { get; set; }

        [Column(TypeName = "varchar(50)")]
        public string Status { get; set; }
    }
}