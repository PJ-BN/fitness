namespace Fitness.Models.DTOs
{
    public class DailySummaryDto
    {
        public DateOnly Date { get; set; }
        public int TotalCalories { get; set; }
        public MacrosDto Macros { get; set; } = new MacrosDto();
        public int EntriesCount { get; set; }
        public GoalComparisonDto? Goal { get; set; }
        public ComparisonDto? ComparisonToYesterday { get; set; }
    }
    
    public class MacrosDto
    {
        public decimal ProteinGrams { get; set; }
        public decimal CarbsGrams { get; set; }
        public decimal FatGrams { get; set; }
        public decimal? FiberGrams { get; set; }
        public decimal? SugarGrams { get; set; }
        public decimal? SodiumMg { get; set; }
        public CalorieBreakdownDto CalorieBreakdown { get; set; } = new CalorieBreakdownDto();
    }
    
    public class CalorieBreakdownDto
    {
        public decimal ProteinPct { get; set; }
        public decimal CarbsPct { get; set; }
        public decimal FatPct { get; set; }
    }
    
    public class GoalComparisonDto
    {
        public int? CalorieGoal { get; set; }
        public int? CaloriesRemaining { get; set; }
        public decimal? PercentOfGoal { get; set; }
        public MacroGoalsDto? MacroGoals { get; set; }
    }
    
    public class MacroGoalsDto
    {
        public decimal? ProteinGoalGrams { get; set; }
        public decimal? CarbsGoalGrams { get; set; }
        public decimal? FatGoalGrams { get; set; }
    }
    
    public class ComparisonDto
    {
        public int DeltaCalories { get; set; }
        public decimal PercentChange { get; set; }
    }
    
    public class WeeklySummaryDto
    {
        public DateOnly WeekStart { get; set; }
        public List<DailySummaryDto> Days { get; set; } = new List<DailySummaryDto>();
        public decimal AverageCalories { get; set; }
        public decimal? PreviousWeekAverageCalories { get; set; }
        public decimal? DeltaAverageCalories { get; set; }
        public decimal? PercentChange { get; set; }
    }
    
    public class MonthlySummaryDto
    {
        public int Year { get; set; }
        public int Month { get; set; }
        public List<DailySummaryDto> Days { get; set; } = new List<DailySummaryDto>();
        public decimal AverageCalories { get; set; }
        public int TotalCalories { get; set; }
        public decimal? PreviousMonthAverageCalories { get; set; }
        public decimal? DeltaAverageCalories { get; set; }
        public decimal? PercentChange { get; set; }
    }
    
    public class TrendDataDto
    {
        public List<TrendPointDto> Points { get; set; } = new List<TrendPointDto>();
    }
    
    public class TrendPointDto
    {
        public DateOnly Date { get; set; }
        public int Calories { get; set; }
    }
    
    public class GoalAdherenceDto
    {
        public List<GoalAdherencePointDto> Days { get; set; } = new List<GoalAdherencePointDto>();
    }
    
    public class GoalAdherencePointDto
    {
        public DateOnly Date { get; set; }
        public int CaloriesConsumed { get; set; }
        public int? CalorieGoal { get; set; }
        public decimal? PercentOfGoal { get; set; }
    }

    public class RollingWeeklySummaryDto
    {
        public DateOnly EndDate { get; set; }
        public List<DailySummaryDto> Days { get; set; } = new List<DailySummaryDto>();
        public decimal AverageCalories { get; set; }
        public decimal? PreviousPeriodAverageCalories { get; set; }
        public decimal? DeltaAverageCalories { get; set; }
        public decimal? PercentChange { get; set; }
    }
}