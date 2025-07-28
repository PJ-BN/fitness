using Fitness.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Fitness.Services.Interfaces
{
    public interface IExerciseService
    {
        Task<Exercise> GetExerciseByIdAsync(int id);
        Task<IEnumerable<Exercise>> GetAllExercisesAsync();
        Task<Exercise> CreateExerciseAsync(Exercise exercise);
        Task<Exercise> UpdateExerciseAsync(Exercise exercise);
        Task<bool> DeleteExerciseAsync(int id);
    }
}
