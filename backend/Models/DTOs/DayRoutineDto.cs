using System.ComponentModel.DataAnnotations;

namespace Fitness.Models.DTOs
{
    public class DayRoutineDto
    {
        [Required]
        public int WeeklyRoutineId { get; set; }

        [Required]
        public int DayOfWeek { get; set; }

        [Required]
        public string DayName { get; set; }

        public bool IsRestDay { get; set; }
    }
}
