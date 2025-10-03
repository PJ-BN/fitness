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
                query = query.Where(ie => ie.LocalDate == date.Value);
            }
            
            var entries = await query
                .OrderByDescending(ie => ie.LoggedAtUtc)
                .ToListAsync();
                
            return entries.Select(MapToResponseDto);
        }
        
        public async Task<IEnumerable<IntakeEntryResponseDto>> GetIntakeEntriesRangeAsync(string userId, DateOnly startDate, DateOnly endDate)
        {
            var entries = await _context.IntakeEntries
                .Include(ie => ie.Food)
                .Where(ie => ie.UserId == userId && !ie.IsDeleted && 
                           ie.LocalDate >= startDate && ie.LocalDate <= endDate)
                .OrderBy(ie => ie.LocalDate)
                .ThenByDescending(ie => ie.LoggedAtUtc)
                .ToListAsync();
                
            return entries.Select(MapToResponseDto);
        }
        
        public async Task<IntakeEntryResponseDto> CreateIntakeEntryAsync(IntakeEntryDto entryDto, string userId)
        {
            var food = await _context.Foods.FirstOrDefaultAsync(f => f.Id == entryDto.FoodId);
            if (food == null)
                throw new ArgumentException("Food not found");
                
            // Convert local time to UTC and compute LocalDate
            var timeZoneInfo = TimeZoneInfo.FindSystemTimeZoneById(entryDto.TimeZone);
            var loggedAtUtc = TimeZoneInfo.ConvertTimeToUtc(entryDto.LoggedAtLocal, timeZoneInfo);
            var localDate = DateOnly.FromDateTime(TimeZoneInfo.ConvertTimeFromUtc(loggedAtUtc, timeZoneInfo));
            
            var intakeEntry = new IntakeEntry
            {
                UserId = userId,
                FoodId = entryDto.FoodId,
                QuantityGrams = entryDto.QuantityGrams,
                LoggedAtUtc = loggedAtUtc,
                LocalDate = localDate,
                Notes = entryDto.Notes,
                Source = IntakeSource.Manual
            };
            
            _context.IntakeEntries.Add(intakeEntry);
            await _context.SaveChangesAsync();
            
            // Recompute daily summary
            await RecomputeDailySummaryAsync(userId, localDate);
            
            // Load the food for response
            await _context.Entry(intakeEntry).Reference(ie => ie.Food).LoadAsync();
            
            return MapToResponseDto(intakeEntry);
        }
        
        public async Task<IEnumerable<IntakeEntryResponseDto>> CreateBulkIntakeEntriesAsync(BulkIntakeRequestDto bulkRequest, string userId, string? idempotencyKey = null)
        {
            if (bulkRequest.Entries.Count > 100)
                throw new ArgumentException("Cannot create more than 100 entries at once");
                
            var results = new List<IntakeEntryResponseDto>();
            var affectedDates = new HashSet<DateOnly>();
            
            using var transaction = await _context.Database.BeginTransactionAsync();
            
            try
            {
                foreach (var entryDto in bulkRequest.Entries)
                {
                    var food = await _context.Foods.FirstOrDefaultAsync(f => f.Id == entryDto.FoodId);
                    if (food == null) continue; // Skip invalid foods
                    
                    var timeZoneInfo = TimeZoneInfo.FindSystemTimeZoneById(entryDto.TimeZone);
                    var loggedAtUtc = TimeZoneInfo.ConvertTimeToUtc(entryDto.LoggedAtLocal, timeZoneInfo);
                    var localDate = DateOnly.FromDateTime(TimeZoneInfo.ConvertTimeFromUtc(loggedAtUtc, timeZoneInfo));
                    
                    var intakeEntry = new IntakeEntry
                    {
                        UserId = userId,
                        FoodId = entryDto.FoodId,
                        QuantityGrams = entryDto.QuantityGrams,
                        LoggedAtUtc = loggedAtUtc,
                        LocalDate = localDate,
                        Notes = entryDto.Notes,
                        Source = IntakeSource.Bulk
                    };
                    
                    _context.IntakeEntries.Add(intakeEntry);
                    affectedDates.Add(localDate);
                    
                    intakeEntry.Food = food; // Set for response mapping
                    results.Add(MapToResponseDto(intakeEntry));
                }
                
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();
                
                // Recompute daily summaries for all affected dates
                foreach (var date in affectedDates)
                {
                    await RecomputeDailySummaryAsync(userId, date);
                }
                
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
                
            var oldLocalDate = entry.LocalDate;
            
            // Update fields
            entry.FoodId = entryDto.FoodId;
            entry.QuantityGrams = entryDto.QuantityGrams;
            entry.Notes = entryDto.Notes;
            entry.UpdatedAtUtc = DateTime.UtcNow;
            
            // Update timing if changed
            var timeZoneInfo = TimeZoneInfo.FindSystemTimeZoneById(entryDto.TimeZone);
            var loggedAtUtc = TimeZoneInfo.ConvertTimeToUtc(entryDto.LoggedAtLocal, timeZoneInfo);
            var localDate = DateOnly.FromDateTime(TimeZoneInfo.ConvertTimeFromUtc(loggedAtUtc, timeZoneInfo));
            
            entry.LoggedAtUtc = loggedAtUtc;
            entry.LocalDate = localDate;
            
            await _context.SaveChangesAsync();
            
            // Recompute daily summaries for affected dates
            await RecomputeDailySummaryAsync(userId, oldLocalDate);
            if (localDate != oldLocalDate)
            {
                await RecomputeDailySummaryAsync(userId, localDate);
            }
            
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
            
            // Recompute daily summary
            await RecomputeDailySummaryAsync(userId, entry.LocalDate);
            
            return true;
        }
        
        public async Task RecomputeDailySummaryAsync(string userId, DateOnly localDate)
        {
            var entries = await _context.IntakeEntries
                .Include(ie => ie.Food)
                .Where(ie => ie.UserId == userId && ie.LocalDate == localDate && !ie.IsDeleted)
                .ToListAsync();
                
            var totalCalories = 0;
            var totalProtein = 0m;
            var totalCarbs = 0m;
            var totalFat = 0m;
            var totalFiber = 0m;
            var totalSugar = 0m;
            var totalSodium = 0m;
            
            foreach (var entry in entries)
            {
                var factor = entry.QuantityGrams / 100m;
                totalCalories += (int)(entry.Food.CaloriesPer100g * (decimal)factor);
                totalProtein += entry.Food.ProteinGramsPer100g * factor;
                totalCarbs += entry.Food.CarbsGramsPer100g * factor;
                totalFat += entry.Food.FatGramsPer100g * factor;
                totalFiber += (entry.Food.FiberGramsPer100g ?? 0) * factor;
                totalSugar += (entry.Food.SugarGramsPer100g ?? 0) * factor;
                totalSodium += (entry.Food.SodiumMg ?? 0) * factor;
            }
            
            var existingSummary = await _context.DailySummaries
                .FirstOrDefaultAsync(ds => ds.UserId == userId && ds.LocalDate == localDate);
                
            if (existingSummary == null)
            {
                var newSummary = new DailySummary
                {
                    UserId = userId,
                    LocalDate = localDate,
                    TotalCalories = totalCalories,
                    TotalProteinGrams = totalProtein,
                    TotalCarbsGrams = totalCarbs,
                    TotalFatGrams = totalFat,
                    TotalFiberGrams = totalFiber,
                    TotalSugarGrams = totalSugar,
                    TotalSodiumMg = totalSodium,
                    EntriesCount = entries.Count
                };
                
                _context.DailySummaries.Add(newSummary);
            }
            else
            {
                existingSummary.TotalCalories = totalCalories;
                existingSummary.TotalProteinGrams = totalProtein;
                existingSummary.TotalCarbsGrams = totalCarbs;
                existingSummary.TotalFatGrams = totalFat;
                existingSummary.TotalFiberGrams = totalFiber;
                existingSummary.TotalSugarGrams = totalSugar;
                existingSummary.TotalSodiumMg = totalSodium;
                existingSummary.EntriesCount = entries.Count;
                existingSummary.LastUpdatedUtc = DateTime.UtcNow;
            }
            
            await _context.SaveChangesAsync();
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
                LocalDate = entry.LocalDate,
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