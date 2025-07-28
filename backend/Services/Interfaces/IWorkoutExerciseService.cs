using Fitness.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Fitness.Services.Interfaces
{
    public interface IWorkoutExerciseService
    {
        Task<WorkoutExercise> GetWorkoutExerciseByIdAsync(int id);
        Task<IEnumerable<WorkoutExercise>> GetWorkoutExercisesByWorkoutIdAsync(int workoutId);
        Task<WorkoutExercise> CreateWorkoutExerciseAsync(WorkoutExercise workoutExercise);
        Task<WorkoutExercise> UpdateWorkoutExerciseAsync(WorkoutExercise workoutExercise);
        Task<bool> DeleteWorkoutExerciseAsync(int id);
    }
}
