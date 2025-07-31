using Fitness.Data;
using Fitness.Models;
using Fitness.Models.DTOs;
using Fitness.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Fitness.Services
{
    public class WeeklyRoutineService : IWeeklyRoutineService
    {
        private readonly ApplicationDbContext _context;

        public WeeklyRoutineService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<ApiResponse<IEnumerable<WeeklyRoutine>>> GetAllAsync()
        {
            var routines = await _context.WeeklyRoutines.ToListAsync();
            return ApiResponse<IEnumerable<WeeklyRoutine>>.SuccessResponse(routines);
        }

        public async Task<ApiResponse<WeeklyRoutine>> GetByIdAsync(int id)
        {
            var routine = await _context.WeeklyRoutines.FindAsync(id);
            if (routine == null)
            {
                return ApiResponse<WeeklyRoutine>.ErrorResponse("Routine not found.");
            }
            return ApiResponse<WeeklyRoutine>.SuccessResponse(routine);
        }

        public async Task<ApiResponse<WeeklyRoutine>> CreateAsync(WeeklyRoutineDto weeklyRoutineDto)
        {
            var routine = new WeeklyRoutine
            {
                UserId = weeklyRoutineDto.UserId,
                Name = weeklyRoutineDto.Name,
                Description = weeklyRoutineDto.Description,
                IsActive = weeklyRoutineDto.IsActive
            };

            _context.WeeklyRoutines.Add(routine);
            await _context.SaveChangesAsync();

            return ApiResponse<WeeklyRoutine>.SuccessResponse(routine);
        }

        public async Task<ApiResponse<WeeklyRoutine>> UpdateAsync(int id, WeeklyRoutineDto weeklyRoutineDto)
        {
            var routine = await _context.WeeklyRoutines.FindAsync(id);
            if (routine == null)
            {
                return ApiResponse<WeeklyRoutine>.ErrorResponse("Routine not found.");
            }

            routine.Name = weeklyRoutineDto.Name;
            routine.Description = weeklyRoutineDto.Description;
            routine.IsActive = weeklyRoutineDto.IsActive;
            routine.UpdatedAt = System.DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return ApiResponse<WeeklyRoutine>.SuccessResponse(routine);
        }

        public async Task<ApiResponse> DeleteAsync(int id)
        {
            var routine = await _context.WeeklyRoutines.FindAsync(id);
            if (routine == null)
            {
                return ApiResponse.ErrorResponse("Routine not found.");
            }

            _context.WeeklyRoutines.Remove(routine);
            await _context.SaveChangesAsync();

            return ApiResponse.SuccessResponse();
        }

        public async Task<ApiResponse<IEnumerable<WeeklyRoutine>>> GetRoutinesForUserAsync(string userId)
        {
            var routines = await _context.WeeklyRoutines.Where(r => r.UserId == userId).ToListAsync();
            return ApiResponse<IEnumerable<WeeklyRoutine>>.SuccessResponse(routines);
        }
    }
}
