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
    public class IntakeController : ControllerBase
    {
        private readonly IIntakeService _intakeService;
        
        public IntakeController(IIntakeService intakeService)
        {
            _intakeService = intakeService;
        }
        
        [HttpGet]
        public async Task<ActionResult<ApiResponse<IEnumerable<IntakeEntryResponseDto>>>> GetIntakeEntries([FromQuery] DateOnly? date)
        {
            try
            {
                var userId = User.FindFirstValue("user_id") ?? User.FindFirstValue(ClaimTypes.NameIdentifier)!;


                var entries = await _intakeService.GetIntakeEntriesAsync(userId, date);
                
                return Ok(new ApiResponse<IEnumerable<IntakeEntryResponseDto>>
                {
                    Success = true,
                    Data = entries,
                    Message = "Intake entries retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<IEnumerable<IntakeEntryResponseDto>>
                {
                    Success = false,
                    Message = $"An error occurred while retrieving intake entries {ex.Message}"
                });
            }
        }
        
        [HttpGet("range")]
        public async Task<ActionResult<ApiResponse<IEnumerable<IntakeEntryResponseDto>>>> GetIntakeEntriesRange(
            [FromQuery] string start, 
            [FromQuery] string end)
        {
            try
            {
                if (!DateOnly.TryParse(start, out var startDate) || !DateOnly.TryParse(end, out var endDate))
                {
                    return BadRequest(new ApiResponse<IEnumerable<IntakeEntryResponseDto>>
                    {
                        Success = false,
                        Message = "Invalid date format. Use YYYY-MM-DD"
                    });
                }
                
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
                var entries = await _intakeService.GetIntakeEntriesRangeAsync(userId, startDate, endDate);
                
                return Ok(new ApiResponse<IEnumerable<IntakeEntryResponseDto>>
                {
                    Success = true,
                    Data = entries,
                    Message = "Intake entries retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<IEnumerable<IntakeEntryResponseDto>>
                {
                    Success = false,
                    Message = "An error occurred while retrieving intake entries"
                });
            }
        }
        
        [HttpPost]
        public async Task<ActionResult<ApiResponse<IntakeEntryResponseDto>>> CreateIntakeEntry([FromBody] IntakeEntryDto entryDto)
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
                var entry = await _intakeService.CreateIntakeEntryAsync(entryDto, userId);
                
                return CreatedAtAction("GetIntakeEntries", null, 
                    new ApiResponse<IntakeEntryResponseDto>
                    {
                        Success = true,
                        Data = entry,
                        Message = "Intake entry created successfully"
                    });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new ApiResponse<IntakeEntryResponseDto>
                {
                    Success = false,
                    Message = ex.Message
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<IntakeEntryResponseDto>
                {
                    Success = false,
                    Message = "An error occurred while creating intake entry"
                });
            }
        }
        
       
        [HttpPatch("{id}")]
        public async Task<ActionResult<ApiResponse<IntakeEntryResponseDto>>> UpdateIntakeEntry(Guid id, [FromBody] IntakeEntryDto entryDto)
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
                var entry = await _intakeService.UpdateIntakeEntryAsync(id, entryDto, userId);
                
                if (entry == null)
                {
                    return NotFound(new ApiResponse<IntakeEntryResponseDto>
                    {
                        Success = false,
                        Message = "Intake entry not found"
                    });
                }
                
                return Ok(new ApiResponse<IntakeEntryResponseDto>
                {
                    Success = true,
                    Data = entry,
                    Message = "Intake entry updated successfully"
                });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new ApiResponse<IntakeEntryResponseDto>
                {
                    Success = false,
                    Message = ex.Message
                });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new ApiResponse<IntakeEntryResponseDto>
                {
                    Success = false,
                    Message = ex.Message
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<IntakeEntryResponseDto>
                {
                    Success = false,
                    Message = "An error occurred while updating intake entry"
                });
            }
        }
        
        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponse<object>>> DeleteIntakeEntry(Guid id)
        {
            try
            {
                var userId = User.FindFirstValue("user_id") ?? User.FindFirstValue(ClaimTypes.NameIdentifier)!;

                var success = await _intakeService.DeleteIntakeEntryAsync(id, userId);
                
                if (!success)
                {
                    return NotFound(new ApiResponse<object>
                    {
                        Success = false,
                        Message = "Intake entry not found"
                    });
                }
                
                return Ok(new ApiResponse<object>
                {
                    Success = true,
                    Message = "Intake entry deleted successfully"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<object>
                {
                    Success = false,
                    Message = "An error occurred while deleting intake entry"
                });
            }
        }
    }
}