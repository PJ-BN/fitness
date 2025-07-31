using Fitness.Models;
using Fitness.Models.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Fitness.Services.Interfaces
{
    public interface IDayRoutineService
    {
        Task<ApiResponse<IEnumerable<DayRoutine>>> GetAllAsync();
        Task<ApiResponse<DayRoutine>> GetByIdAsync(int id);
        Task<ApiResponse<DayRoutine>> CreateAsync(DayRoutineDto dayRoutineDto);
        Task<ApiResponse<DayRoutine>> UpdateAsync(int id, DayRoutineDto dayRoutineDto);
        Task<ApiResponse> DeleteAsync(int id);
        Task<ApiResponse<IEnumerable<DayRoutine>>> GetByWeeklyRoutineIdAsync(int routineId);
        Task<ApiResponse<DayRoutine>> UpdateByDayOfWeekAsync(int routineId, int dayOfWeek, DayRoutineDto dayRoutineDto);
        Task<ApiResponse<DayRoutine>> GetByDayOfWeekAsync(int routineId, int dayOfWeek);
    }
}
