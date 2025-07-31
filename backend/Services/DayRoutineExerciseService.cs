using Fitness.Data;
using Fitness.Models;
using Fitness.Models.DTOs;
using Fitness.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Fitness.Services
{
    public class DayRoutineExerciseService : IDayRoutineExerciseService
    {
        private readonly ApplicationDbContext _context;

        public DayRoutineExerciseService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<ApiResponse<IEnumerable<DayRoutineExercise>>> GetAllAsync()
        {
            var exercises = await _context.DayRoutineExercises.ToListAsync();
            return ApiResponse<IEnumerable<DayRoutineExercise>>.SuccessResponse(exercises);
        }

        public async Task<ApiResponse<DayRoutineExercise>> GetByIdAsync(int id)
        {
            var exercise = await _context.DayRoutineExercises.FindAsync(id);
            if (exercise == null)
            {
                return ApiResponse<DayRoutineExercise>.ErrorResponse("Exercise not found.");
            }
            return ApiResponse<DayRoutineExercise>.SuccessResponse(exercise);
        }

        public async Task<ApiResponse<DayRoutineExercise>> CreateAsync(DayRoutineExerciseDto dayRoutineExerciseDto)
        {
            var exercise = new DayRoutineExercise
            {
                DayRoutineId = dayRoutineExerciseDto.DayRoutineId,
                ExerciseId = dayRoutineExerciseDto.ExerciseId,
                Sets = dayRoutineExerciseDto.Sets,
                Reps = dayRoutineExerciseDto.Reps,
                Duration = dayRoutineExerciseDto.Duration,
                Weight = dayRoutineExerciseDto.Weight,
                Notes = dayRoutineExerciseDto.Notes
            };

            _context.DayRoutineExercises.Add(exercise);
            await _context.SaveChangesAsync();

            return ApiResponse<DayRoutineExercise>.SuccessResponse(exercise);
        }

        public async Task<ApiResponse<DayRoutineExercise>> UpdateAsync(int id, DayRoutineExerciseDto dayRoutineExerciseDto)
        {
            var exercise = await _context.DayRoutineExercises.FindAsync(id);
            if (exercise == null)
            {
                return ApiResponse<DayRoutineExercise>.ErrorResponse("Exercise not found.");
            }

            exercise.Sets = dayRoutineExerciseDto.Sets;
            exercise.Reps = dayRoutineExerciseDto.Reps;
            exercise.Duration = dayRoutineExerciseDto.Duration;
            exercise.Weight = dayRoutineExerciseDto.Weight;
            exercise.Notes = dayRoutineExerciseDto.Notes;

            await _context.SaveChangesAsync();

            return ApiResponse<DayRoutineExercise>.SuccessResponse(exercise);
        }

        public async Task<ApiResponse> DeleteAsync(int id)
        {
            var exercise = await _context.DayRoutineExercises.FindAsync(id);
            if (exercise == null)
            {
                return ApiResponse.ErrorResponse("Exercise not found.");
            }

            _context.DayRoutineExercises.Remove(exercise);
            await _context.SaveChangesAsync();

            return ApiResponse.SuccessResponse();
        }

        public async Task<ApiResponse<IEnumerable<DayRoutineExercise>>> GetByDayRoutineIdAsync(int dayId)
        {
            var exercises = await _context.DayRoutineExercises.Where(e => e.DayRoutineId == dayId).ToListAsync();
            return ApiResponse<IEnumerable<DayRoutineExercise>>.SuccessResponse(exercises);
        }
    }
}
