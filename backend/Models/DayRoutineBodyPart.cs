using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Fitness.Models
{
    public class DayRoutineBodyPart
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int DayRoutineId { get; set; }

        [ForeignKey("DayRoutineId")]
        public DayRoutine DayRoutine { get; set; }

        [Required]
        [Column(TypeName = "varchar(255)")]
        public string BodyPart { get; set; }
    }
}
