using Fitness.Data;
using Fitness.Models;
using Fitness.Models.DTOs;
using Fitness.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace Fitness.Services
{
    public class IntakeService : IIntakeService
    {
        private readonly ApplicationDbContext _context;
        
        public IntakeService(ApplicationDbContext context)
        {
            _context = context;
        }
        
        public async Task<IEnumerable<IntakeEntryResponseDto>> GetIntakeEntriesAsync(string userId, DateOnly? date = null)
        {
            var query = _context.IntakeEntries
                .Include(ie => ie.Food)
                .Where(ie => ie.UserId == userId && !ie.IsDeleted);
                
            if (date.HasValue)
            {
                var startDate = DateTime.SpecifyKind(date.Value.ToDateTime(TimeOnly.MinValue), DateTimeKind.Utc);
                var endDate = DateTime.SpecifyKind(date.Value.ToDateTime(TimeOnly.MaxValue), DateTimeKind.Utc);
                query = query.Where(ie => ie.LoggedAtUtc >= startDate && ie.LoggedAtUtc <= endDate);
            }
            
            var entries = await query
                .OrderByDescending(ie => ie.LoggedAtUtc)
                .ToListAsync();
                
            return entries.Select(MapToResponseDto);
        }
        
        public async Task<IEnumerable<IntakeEntryResponseDto>> GetIntakeEntriesRangeAsync(string userId, DateOnly startDate, DateOnly endDate)
        {
            var startDateTime = DateTime.SpecifyKind(startDate.ToDateTime(TimeOnly.MinValue), DateTimeKind.Utc);
            var endDateTime = DateTime.SpecifyKind(endDate.ToDateTime(TimeOnly.MaxValue), DateTimeKind.Utc);
            
            var entries = await _context.IntakeEntries
                .Include(ie => ie.Food)
                .Where(ie => ie.UserId == userId && !ie.IsDeleted && 
                           ie.LoggedAtUtc >= startDateTime && ie.LoggedAtUtc <= endDateTime)
                .OrderByDescending(ie => ie.LoggedAtUtc)
                .ToListAsync();
                
            return entries.Select(MapToResponseDto);
        }
        
        public async Task<IntakeEntryResponseDto> CreateIntakeEntryAsync(IntakeEntryDto entryDto, string userId)
        {
            // Convert email to actual user ID if needed
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == userId || u.Id == userId);
            if (user == null)
                throw new ArgumentException("User not found");
                
            var actualUserId = user.Id;
                
            var food = await _context.Foods.FirstOrDefaultAsync(f => f.Id == entryDto.FoodId);
            if (food == null)
                throw new ArgumentException("Food not found");
                
            var intakeEntry = new IntakeEntry
            {
                UserId = actualUserId,
                FoodId = entryDto.FoodId,
                QuantityGrams = entryDto.QuantityGrams,
                LoggedAtUtc = DateTime.UtcNow,
                Notes = entryDto.Notes,
                Source = IntakeSource.Manual
            };
            
            _context.IntakeEntries.Add(intakeEntry);
            await _context.SaveChangesAsync();
            
            // Load the food for response
            await _context.Entry(intakeEntry).Reference(ie => ie.Food).LoadAsync();
            
            return MapToResponseDto(intakeEntry);
        }
        
        public async Task<IEnumerable<IntakeEntryResponseDto>> CreateBulkIntakeEntriesAsync(BulkIntakeRequestDto bulkRequest, string userId, string? idempotencyKey = null)
        {
            if (bulkRequest.Entries.Count > 100)
                throw new ArgumentException("Cannot create more than 100 entries at once");
                
            var results = new List<IntakeEntryResponseDto>();
            
            using var transaction = await _context.Database.BeginTransactionAsync();
            
            try
            {
                foreach (var entryDto in bulkRequest.Entries)
                {
                    var food = await _context.Foods.FirstOrDefaultAsync(f => f.Id == entryDto.FoodId);
                    if (food == null) continue; // Skip invalid foods
                    
                    var intakeEntry = new IntakeEntry
                    {
                        UserId = userId,
                        FoodId = entryDto.FoodId,
                        QuantityGrams = entryDto.QuantityGrams,
                        LoggedAtUtc = DateTime.UtcNow,
                        Notes = entryDto.Notes,
                        Source = IntakeSource.Bulk
                    };
                    
                    _context.IntakeEntries.Add(intakeEntry);
                    
                    intakeEntry.Food = food; // Set for response mapping
                    results.Add(MapToResponseDto(intakeEntry));
                }
                
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();
                
                return results;
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }
        
        public async Task<IntakeEntryResponseDto?> UpdateIntakeEntryAsync(Guid id, IntakeEntryDto entryDto, string userId)
        {
            var entry = await _context.IntakeEntries
                .Include(ie => ie.Food)
                .FirstOrDefaultAsync(ie => ie.Id == id && ie.UserId == userId && !ie.IsDeleted);
                
            if (entry == null) return null;
            
            // Check retention window (90 days)
            if ((DateTime.UtcNow - entry.CreatedAtUtc).TotalDays > 90)
                throw new InvalidOperationException("Cannot update entries older than 90 days");
            
            // Update fields
            entry.FoodId = entryDto.FoodId;
            entry.QuantityGrams = entryDto.QuantityGrams;
            entry.Notes = entryDto.Notes;
            entry.UpdatedAtUtc = DateTime.UtcNow;
            
            await _context.SaveChangesAsync();
            
            // Reload food for response
            await _context.Entry(entry).Reference(ie => ie.Food).LoadAsync();
            
            return MapToResponseDto(entry);
        }
        
        public async Task<bool> DeleteIntakeEntryAsync(Guid id, string userId)
        {
            var entry = await _context.IntakeEntries
                .FirstOrDefaultAsync(ie => ie.Id == id && ie.UserId == userId && !ie.IsDeleted);
                
            if (entry == null) return false;
            
            entry.IsDeleted = true;
            entry.UpdatedAtUtc = DateTime.UtcNow;
            
            await _context.SaveChangesAsync();
            
            return true;
        }
        
        private IntakeEntryResponseDto MapToResponseDto(IntakeEntry entry)
        {
            var factor = entry.QuantityGrams / 100m;
            
            return new IntakeEntryResponseDto
            {
                Id = entry.Id,
                UserId = entry.UserId,
                FoodId = entry.FoodId,
                Food = new FoodResponseDto
                {
                    Id = entry.Food.Id,
                    Name = entry.Food.Name,
                    IsSystem = entry.Food.IsSystem,
                    OwnerUserId = entry.Food.OwnerUserId,
                    CaloriesPer100g = entry.Food.CaloriesPer100g,
                    ProteinGramsPer100g = entry.Food.ProteinGramsPer100g,
                    CarbsGramsPer100g = entry.Food.CarbsGramsPer100g,
                    FatGramsPer100g = entry.Food.FatGramsPer100g,
                    FiberGramsPer100g = entry.Food.FiberGramsPer100g,
                    SugarGramsPer100g = entry.Food.SugarGramsPer100g,
                    SodiumMg = entry.Food.SodiumMg,
                    Tags = entry.Food.Tags,
                    CreatedAtUtc = entry.Food.CreatedAtUtc,
                    UpdatedAtUtc = entry.Food.UpdatedAtUtc,
                },
                QuantityGrams = entry.QuantityGrams,
                LoggedAtUtc = entry.LoggedAtUtc,
                Source = entry.Source,
                Notes = entry.Notes,
                IsDeleted = entry.IsDeleted,
                CreatedAtUtc = entry.CreatedAtUtc,
                UpdatedAtUtc = entry.UpdatedAtUtc,
                
                // Computed values
                EntryCalories = (decimal)(entry.Food.CaloriesPer100g * (decimal)factor),
                EntryProteinGrams = entry.Food.ProteinGramsPer100g * factor,
                EntryCarbsGrams = entry.Food.CarbsGramsPer100g * factor,
                EntryFatGrams = entry.Food.FatGramsPer100g * factor
            };
        }
    }
}