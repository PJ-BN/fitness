using Fitness.Models;
using Fitness.Models.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Fitness.Services.Interfaces
{
    public interface IGoalService
    {
        Task<Goal> GetGoalByIdAsync(int id);
        Task<IEnumerable<Goal>> GetAllGoalsAsync();
        Task<IEnumerable<Goal>> GetGoalsByUserIdAsync(string userId);
        Task<Goal> CreateGoalAsync(Goal goal);
        Task<Goal> UpdateGoalAsync(Goal goal);
        Task<bool> DeleteGoalAsync(int id);
        Task<IEnumerable<GoalHistoryDto>> GetGoalHistoryAsync(string userId);
    }
}
