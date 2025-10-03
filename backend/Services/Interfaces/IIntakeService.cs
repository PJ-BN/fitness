using Fitness.Models;
using Fitness.Models.DTOs;

namespace Fitness.Services.Interfaces
{
    public interface IIntakeService
    {
        Task<IEnumerable<IntakeEntryResponseDto>> GetIntakeEntriesAsync(string userId, DateOnly? date = null);
        Task<IEnumerable<IntakeEntryResponseDto>> GetIntakeEntriesRangeAsync(string userId, DateOnly startDate, DateOnly endDate);
        Task<IntakeEntryResponseDto> CreateIntakeEntryAsync(IntakeEntryDto entryDto, string userId);
        Task<IEnumerable<IntakeEntryResponseDto>> CreateBulkIntakeEntriesAsync(BulkIntakeRequestDto bulkRequest, string userId, string? idempotencyKey = null);
        Task<IntakeEntryResponseDto?> UpdateIntakeEntryAsync(Guid id, IntakeEntryDto entryDto, string userId);
        Task<bool> DeleteIntakeEntryAsync(Guid id, string userId);
        Task RecomputeDailySummaryAsync(string userId, DateOnly localDate);
    }
}