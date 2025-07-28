using Fitness.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Fitness.Services.Interfaces
{
    public interface IUserMetricService
    {
        Task<UserMetric> GetUserMetricByIdAsync(int id);
        Task<IEnumerable<UserMetric>> GetAllUserMetricsAsync();
        Task<IEnumerable<UserMetric>> GetUserMetricsByUserIdAsync(string userId);
        Task<UserMetric> CreateUserMetricAsync(UserMetric userMetric);
        Task<UserMetric> UpdateUserMetricAsync(UserMetric userMetric);
        Task<bool> DeleteUserMetricAsync(int id);
    }
}
