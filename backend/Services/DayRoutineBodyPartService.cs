using Fitness.Data;
using Fitness.Models;
using Fitness.Models.DTOs;
using Fitness.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Fitness.Services
{
    public class DayRoutineBodyPartService : IDayRoutineBodyPartService
    {
        private readonly ApplicationDbContext _context;

        public DayRoutineBodyPartService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<ApiResponse<IEnumerable<DayRoutineBodyPart>>> GetAllAsync()
        {
            var bodyParts = await _context.DayRoutineBodyParts.ToListAsync();
            return ApiResponse<IEnumerable<DayRoutineBodyPart>>.SuccessResponse(bodyParts);
        }

        public async Task<ApiResponse<DayRoutineBodyPart>> GetByIdAsync(int id)
        {
            var bodyPart = await _context.DayRoutineBodyParts.FindAsync(id);
            if (bodyPart == null)
            {
                return ApiResponse<DayRoutineBodyPart>.ErrorResponse("Body part not found.");
            }
            return ApiResponse<DayRoutineBodyPart>.SuccessResponse(bodyPart);
        }

        public async Task<ApiResponse<DayRoutineBodyPart>> CreateAsync(DayRoutineBodyPartDto dayRoutineBodyPartDto)
        {
            var bodyPart = new DayRoutineBodyPart
            {
                DayRoutineId = dayRoutineBodyPartDto.DayRoutineId,
                BodyPart = dayRoutineBodyPartDto.BodyPart
            };

            _context.DayRoutineBodyParts.Add(bodyPart);
            await _context.SaveChangesAsync();

            return ApiResponse<DayRoutineBodyPart>.SuccessResponse(bodyPart);
        }

        public async Task<ApiResponse<DayRoutineBodyPart>> UpdateAsync(int id, DayRoutineBodyPartDto dayRoutineBodyPartDto)
        {
            var bodyPart = await _context.DayRoutineBodyParts.FindAsync(id);
            if (bodyPart == null)
            {
                return ApiResponse<DayRoutineBodyPart>.ErrorResponse("Body part not found.");
            }

            bodyPart.BodyPart = dayRoutineBodyPartDto.BodyPart;

            await _context.SaveChangesAsync();

            return ApiResponse<DayRoutineBodyPart>.SuccessResponse(bodyPart);
        }

        public async Task<ApiResponse> DeleteAsync(int id)
        {
            var bodyPart = await _context.DayRoutineBodyParts.FindAsync(id);
            if (bodyPart == null)
            {
                return ApiResponse.ErrorResponse("Body part not found.");
            }

            _context.DayRoutineBodyParts.Remove(bodyPart);
            await _context.SaveChangesAsync();

            return ApiResponse.SuccessResponse();
        }

        public async Task<ApiResponse<IEnumerable<DayRoutineBodyPart>>> GetByDayRoutineIdAsync(int dayId)
        {
            var bodyParts = await _context.DayRoutineBodyParts.Where(bp => bp.DayRoutineId == dayId).ToListAsync();
            return ApiResponse<IEnumerable<DayRoutineBodyPart>>.SuccessResponse(bodyParts);
        }

        public async Task<ApiResponse> DeleteByDayRoutineIdAndBodyPartAsync(int dayId, string bodyPart)
        {
            var bodyPartToDelete = await _context.DayRoutineBodyParts.FirstOrDefaultAsync(bp => bp.DayRoutineId == dayId && bp.BodyPart == bodyPart);
            if (bodyPartToDelete == null)
            {
                return ApiResponse.ErrorResponse("Body part not found.");
            }

            _context.DayRoutineBodyParts.Remove(bodyPartToDelete);
            await _context.SaveChangesAsync();

            return ApiResponse.SuccessResponse();
        }
    }
}
