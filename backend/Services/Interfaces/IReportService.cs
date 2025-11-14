using Fitness.Models.DTOs;

namespace Fitness.Services.Interfaces
{
    public interface IReportService
    {
        Task<DailySummaryDto> GetDailySummaryAsync(string userId, DateOnly? date = null);
        Task<IEnumerable<DailySummaryDto>> GetRangeSummaryAsync(string userId, DateOnly startDate, DateOnly endDate);
        Task<WeeklySummaryDto> GetWeeklySummaryAsync(string userId, DateOnly weekStart);
        Task<MonthlySummaryDto> GetMonthlySummaryAsync(string userId, int year, int month);
        Task<TrendDataDto> GetTrendDataAsync(string userId, int days);
        Task<GoalAdherenceDto> GetGoalAdherenceAsync(string userId, int days);
        Task<MacrosDto> GetMacroBreakdownAsync(string userId, DateOnly date);
        Task<RollingWeeklySummaryDto> GetRollingWeeklySummaryAsync(string userId, DateOnly? endDate = null);
    }
}