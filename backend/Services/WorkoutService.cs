using Fitness.Data;
using Fitness.Models;
using Fitness.Models.DTOs;
using Fitness.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Fitness.Services
{
    public class WorkoutService : IWorkoutService
    {
        private readonly ApplicationDbContext _context;

        public WorkoutService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Workout> GetWorkoutByIdAsync(int id)
        {
            return await _context.Workouts.FindAsync(id);
        }

        public async Task<IEnumerable<Workout>> GetAllWorkoutsAsync()
        {
            return await _context.Workouts.ToListAsync();
        }

        public async Task<IEnumerable<Workout>> GetWorkoutsByUserIdAsync(string userId)
        {
            return await _context.Workouts.Where(w => w.UserId == userId).ToListAsync();
        }

        public async Task<Workout> CreateWorkoutAsync(Workout workout)
        {
            _context.Workouts.Add(workout);
            await _context.SaveChangesAsync();
            return workout;
        }

        public async Task<Workout> UpdateWorkoutAsync(Workout workout)
        {
            _context.Entry(workout).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return workout;
        }

        public async Task<bool> DeleteWorkoutAsync(int id)
        {
            var workout = await _context.Workouts.FindAsync(id);
            if (workout == null)
            {
                return false;
            }

            _context.Workouts.Remove(workout);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<ApiResponse<Workout>> LogWorkoutFromRoutineAsync(string userId, LogWorkoutFromRoutineDto logWorkoutFromRoutineDto)
        {
            var workout = new Workout
            {
                UserId = userId,
                Date = logWorkoutFromRoutineDto.Date,
                Notes = logWorkoutFromRoutineDto.Notes
            };

            _context.Workouts.Add(workout);
            await _context.SaveChangesAsync();

            foreach (var completedExerciseDto in logWorkoutFromRoutineDto.CompletedExercises)
            {
                var workoutExercise = new WorkoutExercise
                {
                    WorkoutId = workout.Id,
                    ExerciseId = completedExerciseDto.ExerciseId,
                    Notes = completedExerciseDto.Notes
                };

                _context.WorkoutExercises.Add(workoutExercise);
                await _context.SaveChangesAsync();

                foreach (var workoutSetDto in completedExerciseDto.Sets)
                {
                    var workoutSet = new WorkoutSet
                    {
                        WorkoutExerciseId = workoutExercise.Id,
                        SetNumber = workoutSetDto.SetNumber,
                        Reps = workoutSetDto.Reps,
                        Weight = workoutSetDto.Weight,
                        Duration = workoutSetDto.Duration,
                        Notes = workoutSetDto.Notes
                    };
                    _context.WorkoutSets.Add(workoutSet);
                }
            }

            await _context.SaveChangesAsync();

            return ApiResponse<Workout>.SuccessResponse(workout, "Workout logged successfully.");
        }
    }
}
