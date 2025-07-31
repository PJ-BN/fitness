using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Fitness.Models
{
    public class DayRoutine
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int WeeklyRoutineId { get; set; }

        [ForeignKey("WeeklyRoutineId")]
        public WeeklyRoutine WeeklyRoutine { get; set; }

        public int DayOfWeek { get; set; }

        [Column(TypeName = "varchar(50)")]
        public string DayName { get; set; }

        public bool IsRestDay { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
