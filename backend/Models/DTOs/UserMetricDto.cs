using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Fitness.Models.DTOs
{
    public class UserMetricDto
    {
        [Required]
        public string UserId { get; set; }

        public DateTime Date { get; set; }

        public float Weight { get; set; }

        public float? BodyFatPercentage { get; set; }
    }
}