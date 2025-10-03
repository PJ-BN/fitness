using Fitness.Data;
using Fitness.Models;
using Fitness.Models.DTOs;
using Fitness.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Fitness.Services
{
    public class ReportService : IReportService
    {
        private readonly ApplicationDbContext _context;
        
        public ReportService(ApplicationDbContext context)
        {
            _context = context;
        }
        
        public async Task<DailySummaryDto> GetDailySummaryAsync(string userId, DateOnly? date = null)
        {
            var targetDate = date ?? DateOnly.FromDateTime(DateTime.Today);
            
            var summary = await _context.DailySummaries
                .FirstOrDefaultAsync(ds => ds.UserId == userId && ds.LocalDate == targetDate);
                
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
            
            var result = new DailySummaryDto
            {
                Date = targetDate,
                TotalCalories = summary?.TotalCalories ?? 0,
                Macros = new MacrosDto
                {
                    ProteinGrams = summary?.TotalProteinGrams ?? 0,
                    CarbsGrams = summary?.TotalCarbsGrams ?? 0,
                    FatGrams = summary?.TotalFatGrams ?? 0,
                    FiberGrams = summary?.TotalFiberGrams ?? 0,
                    SugarGrams = summary?.TotalSugarGrams ?? 0,
                    SodiumMg = summary?.TotalSodiumMg ?? 0,
                    CalorieBreakdown = CalculateCalorieBreakdown(
                        summary?.TotalProteinGrams ?? 0,
                        summary?.TotalCarbsGrams ?? 0,
                        summary?.TotalFatGrams ?? 0)
                },
                EntriesCount = summary?.EntriesCount ?? 0
            };
            
            // Add goal comparison if user has goals set
            if (user?.DailyCalorieGoal.HasValue == true)
            {
                result.Goal = new GoalComparisonDto
                {
                    CalorieGoal = user.DailyCalorieGoal.Value,
                    CaloriesRemaining = user.DailyCalorieGoal.Value - result.TotalCalories,
                    PercentOfGoal = user.DailyCalorieGoal.Value > 0 
                        ? (decimal)result.TotalCalories / user.DailyCalorieGoal.Value * 100 
                        : 0
                };
                
                // Add macro goals if set
                if (user.MacroProteinPct.HasValue && user.MacroCarbsPct.HasValue && user.MacroFatPct.HasValue)
                {
                    result.Goal.MacroGoals = new MacroGoalsDto
                    {
                        ProteinGoalGrams = (user.MacroProteinPct.Value / 100 * user.DailyCalorieGoal.Value) / 4,
                        CarbsGoalGrams = (user.MacroCarbsPct.Value / 100 * user.DailyCalorieGoal.Value) / 4,
                        FatGoalGrams = (user.MacroFatPct.Value / 100 * user.DailyCalorieGoal.Value) / 9
                    };
                }
            }
            
            // Add comparison to yesterday
            var yesterday = targetDate.AddDays(-1);
            var yesterdaySummary = await _context.DailySummaries
                .FirstOrDefaultAsync(ds => ds.UserId == userId && ds.LocalDate == yesterday);
                
            if (yesterdaySummary != null)
            {
                var deltaCalories = result.TotalCalories - yesterdaySummary.TotalCalories;
                result.ComparisonToYesterday = new ComparisonDto
                {
                    DeltaCalories = deltaCalories,
                    PercentChange = yesterdaySummary.TotalCalories > 0 
                        ? (decimal)deltaCalories / yesterdaySummary.TotalCalories * 100 
                        : 0
                };
            }
            
            return result;
        }
        
        public async Task<IEnumerable<DailySummaryDto>> GetRangeSummaryAsync(string userId, DateOnly startDate, DateOnly endDate)
        {
            var summaries = await _context.DailySummaries
                .Where(ds => ds.UserId == userId && ds.LocalDate >= startDate && ds.LocalDate <= endDate)
                .OrderBy(ds => ds.LocalDate)
                .ToListAsync();
                
            var results = new List<DailySummaryDto>();
            
            // Fill in missing dates with zero values
            for (var date = startDate; date <= endDate; date = date.AddDays(1))
            {
                var summary = summaries.FirstOrDefault(s => s.LocalDate == date);
                
                results.Add(new DailySummaryDto
                {
                    Date = date,
                    TotalCalories = summary?.TotalCalories ?? 0,
                    Macros = new MacrosDto
                    {
                        ProteinGrams = summary?.TotalProteinGrams ?? 0,
                        CarbsGrams = summary?.TotalCarbsGrams ?? 0,
                        FatGrams = summary?.TotalFatGrams ?? 0,
                        FiberGrams = summary?.TotalFiberGrams ?? 0,
                        SugarGrams = summary?.TotalSugarGrams ?? 0,
                        SodiumMg = summary?.TotalSodiumMg ?? 0,
                        CalorieBreakdown = CalculateCalorieBreakdown(
                            summary?.TotalProteinGrams ?? 0,
                            summary?.TotalCarbsGrams ?? 0,
                            summary?.TotalFatGrams ?? 0)
                    },
                    EntriesCount = summary?.EntriesCount ?? 0
                });
            }
            
            return results;
        }
        
        public async Task<WeeklySummaryDto> GetWeeklySummaryAsync(string userId, DateOnly weekStart)
        {
            // Ensure weekStart is Monday
            var monday = weekStart.AddDays(-(int)weekStart.DayOfWeek + 1);
            var sunday = monday.AddDays(6);
            
            var dailySummaries = await GetRangeSummaryAsync(userId, monday, sunday);
            var averageCalories = dailySummaries.Average(d => d.TotalCalories);
            
            // Get previous week for comparison
            var previousMonday = monday.AddDays(-7);
            var previousSunday = previousMonday.AddDays(6);
            var previousWeekSummaries = await GetRangeSummaryAsync(userId, previousMonday, previousSunday);
            var previousAverageCalories = previousWeekSummaries.Average(d => d.TotalCalories);
            
            var result = new WeeklySummaryDto
            {
                WeekStart = monday,
                Days = dailySummaries.ToList(),
                AverageCalories = (decimal)averageCalories,
                PreviousWeekAverageCalories = (decimal?)previousAverageCalories,
                DeltaAverageCalories = (decimal?)averageCalories - (decimal?)previousAverageCalories,
                PercentChange = (decimal?)previousAverageCalories > 0 
                    ? ((decimal?)averageCalories - (decimal?)previousAverageCalories) / (decimal?)previousAverageCalories * 100 
                    : 0
            };
            
            return result;
        }
        
        public async Task<MonthlySummaryDto> GetMonthlySummaryAsync(string userId, int year, int month)
        {
            var startDate = new DateOnly(year, month, 1);
            var endDate = startDate.AddMonths(1).AddDays(-1);
            
            var dailySummaries = await GetRangeSummaryAsync(userId, startDate, endDate);
            var totalCalories = dailySummaries.Sum(d => d.TotalCalories);
            var averageCalories = dailySummaries.Average(d => d.TotalCalories);
            
            // Get previous month for comparison
            var previousStartDate = startDate.AddMonths(-1);
            var previousEndDate = previousStartDate.AddMonths(1).AddDays(-1);
            var previousMonthSummaries = await GetRangeSummaryAsync(userId, previousStartDate, previousEndDate);
            var previousAverageCalories = previousMonthSummaries.Average(d => d.TotalCalories);
            
            var result = new MonthlySummaryDto
            {
                Year = year,
                Month = month,
                Days = dailySummaries.ToList(),
                TotalCalories = totalCalories,
                AverageCalories = (decimal)averageCalories,
                PreviousMonthAverageCalories = (decimal?)previousAverageCalories,
                DeltaAverageCalories = (decimal?)averageCalories - (decimal?)previousAverageCalories,
                PercentChange = (decimal?)previousAverageCalories > 0 
                    ? ((decimal?)averageCalories - (decimal?)previousAverageCalories) / (decimal?)previousAverageCalories * 100 
                    : 0
            };
            
            return result;
        }
        
        public async Task<TrendDataDto> GetTrendDataAsync(string userId, int days)
        {
            var endDate = DateOnly.FromDateTime(DateTime.Today);
            var startDate = endDate.AddDays(-days + 1);
            
            var summaries = await _context.DailySummaries
                .Where(ds => ds.UserId == userId && ds.LocalDate >= startDate && ds.LocalDate <= endDate)
                .OrderBy(ds => ds.LocalDate)
                .ToListAsync();
                
            var points = new List<TrendPointDto>();
            
            for (var date = startDate; date <= endDate; date = date.AddDays(1))
            {
                var summary = summaries.FirstOrDefault(s => s.LocalDate == date);
                points.Add(new TrendPointDto
                {
                    Date = date,
                    Calories = summary?.TotalCalories ?? 0
                });
            }
            
            return new TrendDataDto { Points = points };
        }
        
        public async Task<GoalAdherenceDto> GetGoalAdherenceAsync(string userId, int days)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
            var endDate = DateOnly.FromDateTime(DateTime.Today);
            var startDate = endDate.AddDays(-days + 1);
            
            var summaries = await _context.DailySummaries
                .Where(ds => ds.UserId == userId && ds.LocalDate >= startDate && ds.LocalDate <= endDate)
                .OrderBy(ds => ds.LocalDate)
                .ToListAsync();
                
            var points = new List<GoalAdherencePointDto>();
            
            for (var date = startDate; date <= endDate; date = date.AddDays(1))
            {
                var summary = summaries.FirstOrDefault(s => s.LocalDate == date);
                var calories = summary?.TotalCalories ?? 0;
                
                points.Add(new GoalAdherencePointDto
                {
                    Date = date,
                    CaloriesConsumed = calories,
                    CalorieGoal = user?.DailyCalorieGoal,
                    PercentOfGoal = user?.DailyCalorieGoal > 0 
                        ? (decimal)calories / user.DailyCalorieGoal.Value * 100 
                        : null
                });
            }
            
            return new GoalAdherenceDto { Days = points };
        }
        
        public async Task<MacrosDto> GetMacroBreakdownAsync(string userId, DateOnly date)
        {
            var summary = await _context.DailySummaries
                .FirstOrDefaultAsync(ds => ds.UserId == userId && ds.LocalDate == date);
                
            if (summary == null)
            {
                return new MacrosDto 
                { 
                    CalorieBreakdown = new CalorieBreakdownDto() 
                };
            }
            
            return new MacrosDto
            {
                ProteinGrams = summary.TotalProteinGrams,
                CarbsGrams = summary.TotalCarbsGrams,
                FatGrams = summary.TotalFatGrams,
                FiberGrams = summary.TotalFiberGrams,
                SugarGrams = summary.TotalSugarGrams,
                SodiumMg = summary.TotalSodiumMg,
                CalorieBreakdown = CalculateCalorieBreakdown(
                    summary.TotalProteinGrams,
                    summary.TotalCarbsGrams,
                    summary.TotalFatGrams)
            };
        }
        
        private CalorieBreakdownDto CalculateCalorieBreakdown(decimal protein, decimal carbs, decimal fat)
        {
            var totalCaloriesFromMacros = (protein * 4) + (carbs * 4) + (fat * 9);
            
            if (totalCaloriesFromMacros == 0)
            {
                return new CalorieBreakdownDto
                {
                    ProteinPct = 0,
                    CarbsPct = 0,
                    FatPct = 0
                };
            }
            
            return new CalorieBreakdownDto
            {
                ProteinPct = Math.Round((protein * 4) / totalCaloriesFromMacros * 100, 1),
                CarbsPct = Math.Round((carbs * 4) / totalCaloriesFromMacros * 100, 1),
                FatPct = Math.Round((fat * 9) / totalCaloriesFromMacros * 100, 1)
            };
        }

        public async Task<RollingWeeklySummaryDto> GetRollingWeeklySummaryAsync(string userId, DateOnly? endDate = null)
        {
            var end = endDate ?? DateOnly.FromDateTime(DateTime.Today);
            var start = end.AddDays(-6);

            var dailySummaries = await GetRangeSummaryAsync(userId, start, end);
            var averageCalories = dailySummaries.Any() ? dailySummaries.Average(d => d.TotalCalories) : 0;

            // Get previous period for comparison
            var previousEnd = start.AddDays(-1);
            var previousStart = previousEnd.AddDays(-6);
            var previousPeriodSummaries = await GetRangeSummaryAsync(userId, previousStart, previousEnd);
            var previousAverageCalories = previousPeriodSummaries.Any() ? previousPeriodSummaries.Average(d => d.TotalCalories) : 0;
            
            var percentChange = (decimal?)previousAverageCalories > 0
                ? ((decimal?)averageCalories - (decimal?)previousAverageCalories) / (decimal?)previousAverageCalories * 100
                : ((decimal?)averageCalories > 0 ? 100.0m : 0);

            var result = new RollingWeeklySummaryDto
            {
                EndDate = end,
                Days = dailySummaries.ToList(),
                AverageCalories = (decimal)averageCalories,
                PreviousPeriodAverageCalories = (decimal?)previousAverageCalories,
                DeltaAverageCalories = (decimal?)averageCalories - (decimal?)previousAverageCalories,
                PercentChange = percentChange
            };

            return result;
        }
    }
}