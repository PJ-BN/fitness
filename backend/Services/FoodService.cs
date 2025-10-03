using Fitness.Data;
using Fitness.Models;
using Fitness.Models.DTOs;
using Fitness.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Text;

namespace Fitness.Services
{
    public class FoodService : IFoodService
    {
        private readonly ApplicationDbContext _context;
        private readonly IAuditService _auditService;

        public FoodService(ApplicationDbContext context, IAuditService auditService)
        {
            _context = context;
            _auditService = auditService;
        }
        
        public async Task<(IEnumerable<FoodResponseDto> Foods, int TotalCount)> SearchFoodsAsync(FoodSearchDto searchDto, string? userId)
        {
            var query = _context.Foods.AsQueryable();
            
            // Filter by access rights - system foods + user's custom foods
            query = query.Where(f => f.IsSystem || f.OwnerUserId == userId);
            
            // Apply search filters
            if (!string.IsNullOrEmpty(searchDto.NameContains))
            {
                query = query.Where(f => f.Name.ToLower().Contains(searchDto.NameContains.ToLower()));
            }
            
            if (searchDto.MinProteinPer100g.HasValue)
            {
                query = query.Where(f => f.ProteinGramsPer100g >= searchDto.MinProteinPer100g.Value);
            }
            
            if (searchDto.MaxCaloriesPer100g.HasValue)
            {
                query = query.Where(f => f.CaloriesPer100g <= searchDto.MaxCaloriesPer100g.Value);
            }
            
            if (!string.IsNullOrEmpty(searchDto.Tags))
            {
                var tags = searchDto.Tags.Split(',', StringSplitOptions.RemoveEmptyEntries);
                foreach (var tag in tags)
                {
                    var trimmedTag = tag.Trim();
                    query = query.Where(f => f.Tags != null && f.Tags.Contains(trimmedTag));
                }
            }
            
            // Get total count before pagination
            var totalCount = await query.CountAsync();
            
            // Apply sorting
            query = ApplySorting(query, searchDto.Sort);
            
            // Apply pagination
            var foods = await query
                .Skip((searchDto.Page - 1) * searchDto.PageSize)
                .Take(searchDto.PageSize)
                .Select(f => new FoodResponseDto
                {
                    Id = f.Id,
                    Name = f.Name,
                    IsSystem = f.IsSystem,
                    OwnerUserId = f.OwnerUserId,
                    CaloriesPer100g = f.CaloriesPer100g,
                    ProteinGramsPer100g = f.ProteinGramsPer100g,
                    CarbsGramsPer100g = f.CarbsGramsPer100g,
                    FatGramsPer100g = f.FatGramsPer100g,
                    FiberGramsPer100g = f.FiberGramsPer100g,
                    SugarGramsPer100g = f.SugarGramsPer100g,
                    SodiumMg = f.SodiumMg,
                    Tags = f.Tags,
                    CreatedAtUtc = f.CreatedAtUtc,
                    UpdatedAtUtc = f.UpdatedAtUtc,
                    RowVersion = Convert.ToBase64String(f.RowVersion)
                })
                .ToListAsync();
                
            return (foods, totalCount);
        }
        
        public async Task<FoodResponseDto?> GetFoodByIdAsync(Guid id, string? userId)
        {
            var food = await _context.Foods
                .Where(f => f.Id == id && (f.IsSystem || f.OwnerUserId == userId))
                .Select(f => new FoodResponseDto
                {
                    Id = f.Id,
                    Name = f.Name,
                    IsSystem = f.IsSystem,
                    OwnerUserId = f.OwnerUserId,
                    CaloriesPer100g = f.CaloriesPer100g,
                    ProteinGramsPer100g = f.ProteinGramsPer100g,
                    CarbsGramsPer100g = f.CarbsGramsPer100g,
                    FatGramsPer100g = f.FatGramsPer100g,
                    FiberGramsPer100g = f.FiberGramsPer100g,
                    SugarGramsPer100g = f.SugarGramsPer100g,
                    SodiumMg = f.SodiumMg,
                    Tags = f.Tags,
                    CreatedAtUtc = f.CreatedAtUtc,
                    UpdatedAtUtc = f.UpdatedAtUtc,
                    RowVersion = Convert.ToBase64String(f.RowVersion)
                })
                .FirstOrDefaultAsync();
                
            return food;
        }
        
        public async Task<FoodResponseDto> CreateFoodAsync(FoodDto foodDto, string userId)
        {
            // Validate calories from macros
            if (!await ValidateCaloriesFromMacrosAsync(foodDto))
            {
                throw new ArgumentException("Calories do not match macronutrient values within acceptable tolerance");
            }
            
            var food = new Food
            {
                Name = foodDto.Name,
                IsSystem = false,
                OwnerUserId = userId,
                CaloriesPer100g = foodDto.CaloriesPer100g,
                ProteinGramsPer100g = foodDto.ProteinGramsPer100g,
                CarbsGramsPer100g = foodDto.CarbsGramsPer100g,
                FatGramsPer100g = foodDto.FatGramsPer100g,
                FiberGramsPer100g = foodDto.FiberGramsPer100g,
                SugarGramsPer100g = foodDto.SugarGramsPer100g,
                SodiumMg = foodDto.SodiumMg,
                Tags = foodDto.Tags
            };
            
            _context.Foods.Add(food);
            await _context.SaveChangesAsync();

            var foodResponse = new FoodResponseDto
            {
                Id = food.Id,
                Name = food.Name,
                IsSystem = food.IsSystem,
                OwnerUserId = food.OwnerUserId,
                CaloriesPer100g = food.CaloriesPer100g,
                ProteinGramsPer100g = food.ProteinGramsPer100g,
                CarbsGramsPer100g = food.CarbsGramsPer100g,
                FatGramsPer100g = food.FatGramsPer100g,
                FiberGramsPer100g = food.FiberGramsPer100g,
                SugarGramsPer100g = food.SugarGramsPer100g,
                SodiumMg = food.SodiumMg,
                Tags = food.Tags,
                CreatedAtUtc = food.CreatedAtUtc,
                UpdatedAtUtc = food.UpdatedAtUtc,
                RowVersion = Convert.ToBase64String(food.RowVersion)
            };

            await _auditService.CreateAuditLogAsync(userId, "Food", food.Id.ToString(), "Create", foodResponse);

            return foodResponse;
        }
        
        public async Task<FoodResponseDto?> UpdateFoodAsync(Guid id, FoodDto foodDto, string userId, string ifMatch)
        {
            var food = await _context.Foods.FirstOrDefaultAsync(f => f.Id == id && f.OwnerUserId == userId && !f.IsSystem);
            if (food == null) return null;
            
            // Check concurrency
            var currentRowVersion = Convert.ToBase64String(food.RowVersion);
            if (currentRowVersion != ifMatch)
            {
                throw new InvalidOperationException("Concurrency conflict - food has been modified by another user");
            }
            
            // Validate calories from macros
            if (!await ValidateCaloriesFromMacrosAsync(foodDto))
            {
                throw new ArgumentException("Calories do not match macronutrient values within acceptable tolerance");
            }
            
            food.Name = foodDto.Name;
            food.CaloriesPer100g = foodDto.CaloriesPer100g;
            food.ProteinGramsPer100g = foodDto.ProteinGramsPer100g;
            food.CarbsGramsPer100g = foodDto.CarbsGramsPer100g;
            food.FatGramsPer100g = foodDto.FatGramsPer100g;
            food.FiberGramsPer100g = foodDto.FiberGramsPer100g;
            food.SugarGramsPer100g = foodDto.SugarGramsPer100g;
            food.SodiumMg = foodDto.SodiumMg;
            food.Tags = foodDto.Tags;
            food.UpdatedAtUtc = DateTime.UtcNow;
            
            await _context.SaveChangesAsync();

            var foodResponse = new FoodResponseDto
            {
                Id = food.Id,
                Name = food.Name,
                IsSystem = food.IsSystem,
                OwnerUserId = food.OwnerUserId,
                CaloriesPer100g = food.CaloriesPer100g,
                ProteinGramsPer100g = food.ProteinGramsPer100g,
                CarbsGramsPer100g = food.CarbsGramsPer100g,
                FatGramsPer100g = food.FatGramsPer100g,
                FiberGramsPer100g = food.FiberGramsPer100g,
                SugarGramsPer100g = food.SugarGramsPer100g,
                SodiumMg = food.SodiumMg,
                Tags = food.Tags,
                CreatedAtUtc = food.CreatedAtUtc,
                UpdatedAtUtc = food.UpdatedAtUtc,
                RowVersion = Convert.ToBase64String(food.RowVersion)
            };

            await _auditService.CreateAuditLogAsync(userId, "Food", food.Id.ToString(), "Update", foodResponse);

            return foodResponse;
        }
        
        public async Task<bool> DeleteFoodAsync(Guid id, string userId)
        {
            var food = await _context.Foods
                .Include(f => f.IntakeEntries)
                .FirstOrDefaultAsync(f => f.Id == id && f.OwnerUserId == userId && !f.IsSystem);
                
            if (food == null) return false;
            
            // Check if food is referenced by any intake entries
            if (food.IntakeEntries.Any(ie => !ie.IsDeleted))
            {
                throw new InvalidOperationException("Cannot delete food that has intake entries associated with it");
            }

            var foodToDelete = new FoodResponseDto
            {
                Id = food.Id,
                Name = food.Name,
                IsSystem = food.IsSystem,
                OwnerUserId = food.OwnerUserId,
                CaloriesPer100g = food.CaloriesPer100g,
                ProteinGramsPer100g = food.ProteinGramsPer100g,
                CarbsGramsPer100g = food.CarbsGramsPer100g,
                FatGramsPer100g = food.FatGramsPer100g,
                FiberGramsPer100g = food.FiberGramsPer100g,
                SugarGramsPer100g = food.SugarGramsPer100g,
                SodiumMg = food.SodiumMg,
                Tags = food.Tags,
                CreatedAtUtc = food.CreatedAtUtc,
                UpdatedAtUtc = food.UpdatedAtUtc,
                RowVersion = Convert.ToBase64String(food.RowVersion)
            };
            
            _context.Foods.Remove(food);
            await _context.SaveChangesAsync();

            await _auditService.CreateAuditLogAsync(userId, "Food", id.ToString(), "Delete", foodToDelete);

            return true;
        }
        
        public async Task<FoodResponseDto?> CloneFoodAsync(Guid systemFoodId, string userId)
        {
            var systemFood = await _context.Foods
                .FirstOrDefaultAsync(f => f.Id == systemFoodId && f.IsSystem);
                
            if (systemFood == null) return null;
            
            var clonedFood = new Food
            {
                Name = systemFood.Name,
                IsSystem = false,
                OwnerUserId = userId,
                CaloriesPer100g = systemFood.CaloriesPer100g,
                ProteinGramsPer100g = systemFood.ProteinGramsPer100g,
                CarbsGramsPer100g = systemFood.CarbsGramsPer100g,
                FatGramsPer100g = systemFood.FatGramsPer100g,
                FiberGramsPer100g = systemFood.FiberGramsPer100g,
                SugarGramsPer100g = systemFood.SugarGramsPer100g,
                SodiumMg = systemFood.SodiumMg,
                Tags = systemFood.Tags
            };
            
            _context.Foods.Add(clonedFood);
            await _context.SaveChangesAsync();
            
            return new FoodResponseDto
            {
                Id = clonedFood.Id,
                Name = clonedFood.Name,
                IsSystem = clonedFood.IsSystem,
                OwnerUserId = clonedFood.OwnerUserId,
                CaloriesPer100g = clonedFood.CaloriesPer100g,
                ProteinGramsPer100g = clonedFood.ProteinGramsPer100g,
                CarbsGramsPer100g = clonedFood.CarbsGramsPer100g,
                FatGramsPer100g = clonedFood.FatGramsPer100g,
                FiberGramsPer100g = clonedFood.FiberGramsPer100g,
                SugarGramsPer100g = clonedFood.SugarGramsPer100g,
                SodiumMg = clonedFood.SodiumMg,
                Tags = clonedFood.Tags,
                CreatedAtUtc = clonedFood.CreatedAtUtc,
                UpdatedAtUtc = clonedFood.UpdatedAtUtc,
                RowVersion = Convert.ToBase64String(clonedFood.RowVersion)
            };
        }
        
        public async Task<bool> ValidateCaloriesFromMacrosAsync(FoodDto foodDto)
        {
            // Calculate calories from macros: P=4, C=4, F=9 kcal/g
            var computedCalories = (foodDto.ProteinGramsPer100g * 4) + 
                                 (foodDto.CarbsGramsPer100g * 4) + 
                                 (foodDto.FatGramsPer100g * 9);
            
            if (foodDto.CaloriesPer100g == 0) return true; // Allow zero calories
            
            var difference = Math.Abs((decimal)foodDto.CaloriesPer100g - computedCalories);
            var percentDifference = difference / (decimal)foodDto.CaloriesPer100g;
            
            return percentDifference <= 0.1m; // 10% tolerance
        }
        
        private IQueryable<Food> ApplySorting(IQueryable<Food> query, string sort)
        {
            var parts = sort.Split(':');
            var field = parts[0].ToLower();
            var direction = parts.Length > 1 ? parts[1].ToLower() : "asc";
            
            return field switch
            {
                "name" => direction == "desc" ? query.OrderByDescending(f => f.Name) : query.OrderBy(f => f.Name),
                "calories" => direction == "desc" ? query.OrderByDescending(f => f.CaloriesPer100g) : query.OrderBy(f => f.CaloriesPer100g),
                "updated" => direction == "desc" ? query.OrderByDescending(f => f.UpdatedAtUtc) : query.OrderBy(f => f.UpdatedAtUtc),
                _ => query.OrderBy(f => f.Name)
            };
        }
    }
}