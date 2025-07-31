using Fitness.Models;
using Fitness.Models.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Fitness.Services.Interfaces
{
    public interface IDayRoutineBodyPartService
    {
        Task<ApiResponse<IEnumerable<DayRoutineBodyPart>>> GetAllAsync();
        Task<ApiResponse<DayRoutineBodyPart>> GetByIdAsync(int id);
        Task<ApiResponse<DayRoutineBodyPart>> CreateAsync(DayRoutineBodyPartDto dayRoutineBodyPartDto);
        Task<ApiResponse<DayRoutineBodyPart>> UpdateAsync(int id, DayRoutineBodyPartDto dayRoutineBodyPartDto);
        Task<ApiResponse> DeleteAsync(int id);
        Task<ApiResponse<IEnumerable<DayRoutineBodyPart>>> GetByDayRoutineIdAsync(int dayId);
        Task<ApiResponse> DeleteByDayRoutineIdAndBodyPartAsync(int dayId, string bodyPart);
    }
}
