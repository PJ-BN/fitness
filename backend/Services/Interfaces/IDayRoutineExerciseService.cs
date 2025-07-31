using Fitness.Models;
using Fitness.Models.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Fitness.Services.Interfaces
{
    public interface IDayRoutineExerciseService
    {
        Task<ApiResponse<IEnumerable<DayRoutineExercise>>> GetAllAsync();
        Task<ApiResponse<DayRoutineExercise>> GetByIdAsync(int id);
        Task<ApiResponse<DayRoutineExercise>> CreateAsync(DayRoutineExerciseDto dayRoutineExerciseDto);
        Task<ApiResponse<DayRoutineExercise>> UpdateAsync(int id, DayRoutineExerciseDto dayRoutineExerciseDto);
        Task<ApiResponse> DeleteAsync(int id);
        Task<ApiResponse<IEnumerable<DayRoutineExercise>>> GetByDayRoutineIdAsync(int dayId);
    }
}
