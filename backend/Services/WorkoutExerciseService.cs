using Fitness.Data;
using Fitness.Models;
using Fitness.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Fitness.Services
{
    public class WorkoutExerciseService : IWorkoutExerciseService
    {
        private readonly ApplicationDbContext _context;

        public WorkoutExerciseService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<WorkoutExercise> GetWorkoutExerciseByIdAsync(int id)
        {
            return await _context.WorkoutExercises.FindAsync(id);
        }

        public async Task<IEnumerable<WorkoutExercise>> GetWorkoutExercisesByWorkoutIdAsync(int workoutId)
        {
            return await _context.WorkoutExercises.Where(we => we.WorkoutId == workoutId).ToListAsync();
        }

        public async Task<WorkoutExercise> CreateWorkoutExerciseAsync(WorkoutExercise workoutExercise)
        {
            _context.WorkoutExercises.Add(workoutExercise);
            await _context.SaveChangesAsync();
            return workoutExercise;
        }

        public async Task<WorkoutExercise> UpdateWorkoutExerciseAsync(WorkoutExercise workoutExercise)
        {
            _context.Entry(workoutExercise).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return workoutExercise;
        }

        public async Task<bool> DeleteWorkoutExerciseAsync(int id)
        {
            var workoutExercise = await _context.WorkoutExercises.FindAsync(id);
            if (workoutExercise == null)
            {
                return false;
            }

            _context.WorkoutExercises.Remove(workoutExercise);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
