using System.ComponentModel.DataAnnotations;

namespace Fitness.Models
{
    public class AuditLog
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        
        [Required]
        public string UserId { get; set; } = string.Empty;
        public User User { get; set; } = null!;
        
        [Required]
        [MaxLength(100)]
        public string EntityType { get; set; } = string.Empty;
        
        [Required]
        public string EntityId { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(50)]
        public string Action { get; set; } = string.Empty; // create, update, delete
        
        public string? SnapshotJson { get; set; }
        
        public DateTime TimestampUtc { get; set; } = DateTime.UtcNow;
    }
}