using Fitness.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Fitness.Services.Interfaces
{
    public interface IWorkoutService
    {
        Task<Workout> GetWorkoutByIdAsync(int id);
        Task<IEnumerable<Workout>> GetAllWorkoutsAsync();
        Task<IEnumerable<Workout>> GetWorkoutsByUserIdAsync(string userId);
        Task<Workout> CreateWorkoutAsync(Workout workout);
        Task<Workout> UpdateWorkoutAsync(Workout workout);
        Task<bool> DeleteWorkoutAsync(int id);
    }
}
