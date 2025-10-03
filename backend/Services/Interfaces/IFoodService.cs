using Fitness.Models;
using Fitness.Models.DTOs;

namespace Fitness.Services.Interfaces
{
    public interface IFoodService
    {
        Task<(IEnumerable<FoodResponseDto> Foods, int TotalCount)> SearchFoodsAsync(FoodSearchDto searchDto, string? userId);
        Task<FoodResponseDto?> GetFoodByIdAsync(Guid id, string? userId);
        Task<FoodResponseDto> CreateFoodAsync(FoodDto foodDto, string userId);
        Task<FoodResponseDto?> UpdateFoodAsync(Guid id, FoodDto foodDto, string userId, string ifMatch);
        Task<bool> DeleteFoodAsync(Guid id, string userId);
        Task<FoodResponseDto?> CloneFoodAsync(Guid systemFoodId, string userId);
        Task<bool> ValidateCaloriesFromMacrosAsync(FoodDto foodDto);
    }
}