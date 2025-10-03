using Fitness.Models;
using Fitness.Models.DTOs;
using Fitness.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Fitness.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ReportsController : ControllerBase
    {
        private readonly IReportService _reportService;
        
        public ReportsController(IReportService reportService)
        {
            _reportService = reportService;
        }
        
        [HttpGet("daily")]
        public async Task<ActionResult<ApiResponse<DailySummaryDto>>> GetDailyReport([FromQuery] string? date)
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
                DateOnly? parsedDate = null;
                
                if (!string.IsNullOrEmpty(date) && DateOnly.TryParse(date, out var d))
                {
                    parsedDate = d;
                }
                
                var summary = await _reportService.GetDailySummaryAsync(userId, parsedDate);
                
                return Ok(new ApiResponse<DailySummaryDto>
                {
                    Success = true,
                    Data = summary,
                    Message = "Daily report retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<DailySummaryDto>
                {
                    Success = false,
                    Message = "An error occurred while retrieving daily report"
                });
            }
        }
        
        [HttpGet("range")]
        public async Task<ActionResult<ApiResponse<IEnumerable<DailySummaryDto>>>> GetRangeReport(
            [FromQuery] string start, 
            [FromQuery] string end)
        {
            try
            {
                if (!DateOnly.TryParse(start, out var startDate) || !DateOnly.TryParse(end, out var endDate))
                {
                    return BadRequest(new ApiResponse<IEnumerable<DailySummaryDto>>
                    {
                        Success = false,
                        Message = "Invalid date format. Use YYYY-MM-DD"
                    });
                }
                
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
                var summaries = await _reportService.GetRangeSummaryAsync(userId, startDate, endDate);
                
                return Ok(new ApiResponse<IEnumerable<DailySummaryDto>>
                {
                    Success = true,
                    Data = summaries,
                    Message = "Range report retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<IEnumerable<DailySummaryDto>>
                {
                    Success = false,
                    Message = "An error occurred while retrieving range report"
                });
            }
        }
        
        [HttpGet("weekly")]
        public async Task<ActionResult<ApiResponse<WeeklySummaryDto>>> GetWeeklyReport([FromQuery] string weekStart)
        {
            try
            {
                if (!DateOnly.TryParse(weekStart, out var weekStartDate))
                {
                    return BadRequest(new ApiResponse<WeeklySummaryDto>
                    {
                        Success = false,
                        Message = "Invalid date format. Use YYYY-MM-DD"
                    });
                }
                
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
                var summary = await _reportService.GetWeeklySummaryAsync(userId, weekStartDate);
                
                return Ok(new ApiResponse<WeeklySummaryDto>
                {
                    Success = true,
                    Data = summary,
                    Message = "Weekly report retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<WeeklySummaryDto>
                {
                    Success = false,
                    Message = "An error occurred while retrieving weekly report"
                });
            }
        }

        [HttpGet("weekly/rolling")]
        public async Task<ActionResult<ApiResponse<RollingWeeklySummaryDto>>> GetRollingWeeklyReport([FromQuery] string? endDate)
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
                DateOnly? parsedEndDate = null;
                
                if (!string.IsNullOrEmpty(endDate) && DateOnly.TryParse(endDate, out var d))
                {
                    parsedEndDate = d;
                }
                
                var summary = await _reportService.GetRollingWeeklySummaryAsync(userId, parsedEndDate);
                
                return Ok(new ApiResponse<RollingWeeklySummaryDto>
                {
                    Success = true,
                    Data = summary,
                    Message = "Rolling weekly report retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<RollingWeeklySummaryDto>
                {
                    Success = false,
                    Message = "An error occurred while retrieving rolling weekly report"
                });
            }
        }
        
        [HttpGet("monthly")]
        public async Task<ActionResult<ApiResponse<MonthlySummaryDto>>> GetMonthlyReport([FromQuery] int year, [FromQuery] int month)
        {
            try
            {
                if (year < 1900 || year > DateTime.Now.Year + 1 || month < 1 || month > 12)
                {
                    return BadRequest(new ApiResponse<MonthlySummaryDto>
                    {
                        Success = false,
                        Message = "Invalid year or month"
                    });
                }
                
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
                var summary = await _reportService.GetMonthlySummaryAsync(userId, year, month);
                
                return Ok(new ApiResponse<MonthlySummaryDto>
                {
                    Success = true,
                    Data = summary,
                    Message = "Monthly report retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<MonthlySummaryDto>
                {
                    Success = false,
                    Message = "An error occurred while retrieving monthly report"
                });
            }
        }
        
        [HttpGet("trend")]
        public async Task<ActionResult<ApiResponse<TrendDataDto>>> GetTrendData([FromQuery] int days = 30)
        {
            try
            {
                if (days < 1 || days > 365)
                {
                    return BadRequest(new ApiResponse<TrendDataDto>
                    {
                        Success = false,
                        Message = "Days must be between 1 and 365"
                    });
                }
                
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
                var trendData = await _reportService.GetTrendDataAsync(userId, days);
                
                return Ok(new ApiResponse<TrendDataDto>
                {
                    Success = true,
                    Data = trendData,
                    Message = "Trend data retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<TrendDataDto>
                {
                    Success = false,
                    Message = "An error occurred while retrieving trend data"
                });
            }
        }
        
        [HttpGet("goal-adherence")]
        public async Task<ActionResult<ApiResponse<GoalAdherenceDto>>> GetGoalAdherence([FromQuery] int days = 14)
        {
            try
            {
                if (days < 1 || days > 90)
                {
                    return BadRequest(new ApiResponse<GoalAdherenceDto>
                    {
                        Success = false,
                        Message = "Days must be between 1 and 90"
                    });
                }
                
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
                var adherenceData = await _reportService.GetGoalAdherenceAsync(userId, days);
                
                return Ok(new ApiResponse<GoalAdherenceDto>
                {
                    Success = true,
                    Data = adherenceData,
                    Message = "Goal adherence data retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<GoalAdherenceDto>
                {
                    Success = false,
                    Message = "An error occurred while retrieving goal adherence data"
                });
            }
        }
        
        [HttpGet("macros")]
        public async Task<ActionResult<ApiResponse<MacrosDto>>> GetMacroBreakdown([FromQuery] string? date)
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
                DateOnly parsedDate;
                
                if (string.IsNullOrEmpty(date))
                {
                    parsedDate = DateOnly.FromDateTime(DateTime.Today);
                }
                else if (!DateOnly.TryParse(date, out parsedDate))
                {
                    return BadRequest(new ApiResponse<MacrosDto>
                    {
                        Success = false,
                        Message = "Invalid date format. Use YYYY-MM-DD"
                    });
                }
                
                var macros = await _reportService.GetMacroBreakdownAsync(userId, parsedDate);
                
                return Ok(new ApiResponse<MacrosDto>
                {
                    Success = true,
                    Data = macros,
                    Message = "Macro breakdown retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<MacrosDto>
                {
                    Success = false,
                    Message = "An error occurred while retrieving macro breakdown"
                });
            }
        }
    }
}