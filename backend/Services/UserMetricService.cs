using Fitness.Data;
using Fitness.Models;
using Fitness.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Fitness.Services
{
    public class UserMetricService : IUserMetricService
    {
        private readonly ApplicationDbContext _context;

        public UserMetricService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<UserMetric> GetUserMetricByIdAsync(int id)
        {
            return await _context.UserMetrics.FindAsync(id);
        }

        public async Task<IEnumerable<UserMetric>> GetAllUserMetricsAsync()
        {
            return await _context.UserMetrics.ToListAsync();
        }

        public async Task<IEnumerable<UserMetric>> GetUserMetricsByUserIdAsync(string userId)
        {
            return await _context.UserMetrics.Where(um => um.UserId == userId).ToListAsync();
        }

        public async Task<UserMetric> CreateUserMetricAsync(UserMetric userMetric)
        {
            _context.UserMetrics.Add(userMetric);
            await _context.SaveChangesAsync();
            return userMetric;
        }

        public async Task<UserMetric> UpdateUserMetricAsync(UserMetric userMetric)
        {
            _context.Entry(userMetric).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return userMetric;
        }

        public async Task<bool> DeleteUserMetricAsync(int id)
        {
            var userMetric = await _context.UserMetrics.FindAsync(id);
            if (userMetric == null)
            {
                return false;
            }

            _context.UserMetrics.Remove(userMetric);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
