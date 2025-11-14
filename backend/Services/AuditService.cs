using Fitness.Data;
using Fitness.Models;
using Fitness.Services.Interfaces;
using System.Text.Json;
using System.Threading.Tasks;

namespace Fitness.Services
{
    public class AuditService : IAuditService
    {
        private readonly ApplicationDbContext _context;

        public AuditService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task CreateAuditLogAsync(string userId, string entityType, string entityId, string action, object? snapshot)
        {
            var auditLog = new AuditLog
            {
                UserId = userId,
                EntityType = entityType,
                EntityId = entityId,
                Action = action,
                SnapshotJson = snapshot != null ? JsonSerializer.Serialize(snapshot) : null,
                TimestampUtc = System.DateTime.UtcNow
            };

            _context.AuditLogs.Add(auditLog);
            await _context.SaveChangesAsync();
        }
    }
}
