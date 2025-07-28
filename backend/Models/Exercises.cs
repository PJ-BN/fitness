using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Fitness.Models
{
    public class Exercise
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [Column(TypeName = "varchar(255)")]
        public string Name { get; set; }

        [Column(TypeName = "text")]
        public string? Description { get; set; }

        [Column(TypeName = "varchar(255)")]
        public string? Category { get; set; }

        [Column(TypeName = "varchar(255)")]
        public string? MuscleGroups { get; set; }

        [Column(TypeName = "varchar(255)")]
        public string? Equipment { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
