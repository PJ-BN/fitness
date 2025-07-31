using Fitness.Data;
using Fitness.Models;
using Fitness.Models.DTOs;
using Fitness.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Fitness.Services
{
    public class DayRoutineService : IDayRoutineService
    {
        private readonly ApplicationDbContext _context;

        public DayRoutineService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<ApiResponse<IEnumerable<DayRoutine>>> GetAllAsync()
        {
            var routines = await _context.DayRoutines.ToListAsync();
            return ApiResponse<IEnumerable<DayRoutine>>.SuccessResponse(routines);
        }

        public async Task<ApiResponse<DayRoutine>> GetByIdAsync(int id)
        {
            var routine = await _context.DayRoutines.FindAsync(id);
            if (routine == null)
            {
                return ApiResponse<DayRoutine>.ErrorResponse("Routine not found.");
            }
            return ApiResponse<DayRoutine>.SuccessResponse(routine);
        }

        public async Task<ApiResponse<DayRoutine>> CreateAsync(DayRoutineDto dayRoutineDto)
        {
            var routine = new DayRoutine
            {
                WeeklyRoutineId = dayRoutineDto.WeeklyRoutineId,
                DayOfWeek = dayRoutineDto.DayOfWeek,
                DayName = dayRoutineDto.DayName,
                IsRestDay = dayRoutineDto.IsRestDay
            };

            _context.DayRoutines.Add(routine);
            await _context.SaveChangesAsync();

            return ApiResponse<DayRoutine>.SuccessResponse(routine);
        }

        public async Task<ApiResponse<DayRoutine>> UpdateAsync(int id, DayRoutineDto dayRoutineDto)
        {
            var routine = await _context.DayRoutines.FindAsync(id);
            if (routine == null)
            {
                return ApiResponse<DayRoutine>.ErrorResponse("Routine not found.");
            }

            routine.DayOfWeek = dayRoutineDto.DayOfWeek;
            routine.DayName = dayRoutineDto.DayName;
            routine.IsRestDay = dayRoutineDto.IsRestDay;
            routine.UpdatedAt = System.DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return ApiResponse<DayRoutine>.SuccessResponse(routine);
        }

        public async Task<ApiResponse> DeleteAsync(int id)
        {
            var routine = await _context.DayRoutines.FindAsync(id);
            if (routine == null)
            {
                return ApiResponse.ErrorResponse("Routine not found.");
            }

            _context.DayRoutines.Remove(routine);
            await _context.SaveChangesAsync();

            return ApiResponse.SuccessResponse();
        }

        public async Task<ApiResponse<IEnumerable<DayRoutine>>> GetByWeeklyRoutineIdAsync(int routineId)
        {
            var routines = await _context.DayRoutines.Where(r => r.WeeklyRoutineId == routineId).ToListAsync();
            return ApiResponse<IEnumerable<DayRoutine>>.SuccessResponse(routines);
        }

        public async Task<ApiResponse<DayRoutine>> UpdateByDayOfWeekAsync(int routineId, int dayOfWeek, DayRoutineDto dayRoutineDto)
        {
            var routine = await _context.DayRoutines.FirstOrDefaultAsync(r => r.WeeklyRoutineId == routineId && r.DayOfWeek == dayOfWeek);
            if (routine == null)
            {
                return ApiResponse<DayRoutine>.ErrorResponse("Routine not found.");
            }

            routine.DayName = dayRoutineDto.DayName;
            routine.IsRestDay = dayRoutineDto.IsRestDay;
            routine.UpdatedAt = System.DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return ApiResponse<DayRoutine>.SuccessResponse(routine);
        }

        public async Task<ApiResponse<DayRoutine>> GetByDayOfWeekAsync(int routineId, int dayOfWeek)
        {
            var routine = await _context.DayRoutines.FirstOrDefaultAsync(r => r.WeeklyRoutineId == routineId && r.DayOfWeek == dayOfWeek);
            if (routine == null)
            {
                return ApiResponse<DayRoutine>.ErrorResponse("Routine not found.");
            }
            return ApiResponse<DayRoutine>.SuccessResponse(routine);
        }
    }
}
