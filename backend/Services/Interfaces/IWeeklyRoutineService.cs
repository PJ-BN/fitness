using Fitness.Models;
using Fitness.Models.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Fitness.Services.Interfaces
{
    public interface IWeeklyRoutineService
    {
        Task<ApiResponse<IEnumerable<WeeklyRoutine>>> GetAllAsync();
        Task<ApiResponse<WeeklyRoutine>> GetByIdAsync(int id);
        Task<ApiResponse<WeeklyRoutine>> CreateAsync(WeeklyRoutineDto weeklyRoutineDto);
        Task<ApiResponse<WeeklyRoutine>> UpdateAsync(int id, WeeklyRoutineDto weeklyRoutineDto);
        Task<ApiResponse> DeleteAsync(int id);
        Task<ApiResponse<IEnumerable<WeeklyRoutine>>> GetRoutinesForUserAsync(string userId);
    }
}
