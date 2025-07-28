using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Fitness.Models
{
    public class Goal
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string UserId { get; set; }

        [ForeignKey("UserId")]
        public User User { get; set; }

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
