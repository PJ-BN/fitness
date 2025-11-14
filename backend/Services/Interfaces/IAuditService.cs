using System.Threading.Tasks;

namespace Fitness.Services.Interfaces
{
    public interface IAuditService
    {
        Task CreateAuditLogAsync(string userId, string entityType, string entityId, string action, object? snapshot);
    }
}
