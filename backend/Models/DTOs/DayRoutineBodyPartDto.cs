using System.ComponentModel.DataAnnotations;

namespace Fitness.Models.DTOs
{
    public class DayRoutineBodyPartDto
    {
        [Required]
        public int DayRoutineId { get; set; }

        [Required]
        public string BodyPart { get; set; }
    }
}
