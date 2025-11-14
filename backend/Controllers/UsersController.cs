using Fitness.Models;
using Fitness.Models.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace Fitness.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly UserManager<User> _userManager;

        public UsersController(UserManager<User> userManager)
        {
            _userManager = userManager;
        }

        [HttpGet("me")]
        [Authorize]
        public async Task<ActionResult<ApiResponse<UserProfileDto>>> GetCurrentUser()
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var user = await _userManager.FindByIdAsync(userId!);

                if (user == null)
                {
                    return NotFound(new ApiResponse<UserProfileDto>
                    {
                        Success = false,
                        Message = "User not found"
                    });
                }

                var profile = new UserProfileDto
                {
                    Id = user.Id,
                    Email = user.Email!,
                    Name = user.Name,
                    DisplayName = user.DisplayName,
                    TimeZone = user.TimeZone,
                    PreferredUnits = user.PreferredUnits,
                    Gender = user.Gender,
                    DateOfBirth = user.DateOfBirth,
                    WeightKg = user.WeightKg,
                    HeightCm = user.HeightCm,
                    DefaultPrivacy = user.DefaultPrivacy,
                    CreatedAtUtc = user.CreatedAtUtc
                };

                return Ok(new ApiResponse<UserProfileDto>
                {
                    Success = true,
                    Data = profile,
                    Message = "Profile retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<UserProfileDto>
                {
                    Success = false,
                    Message = "An error occurred while retrieving profile"
                });
            }
        }

        [HttpPatch("me")]
        [Authorize]
        public async Task<ActionResult<ApiResponse<UserProfileDto>>> UpdateCurrentUser([FromBody] UpdateUserProfileDto updateDto)
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var user = await _userManager.FindByIdAsync(userId!);

                if (user == null)
                {
                    return NotFound(new ApiResponse<UserProfileDto>
                    {
                        Success = false,
                        Message = "User not found"
                    });
                }

                if (updateDto.DisplayName != null) user.DisplayName = updateDto.DisplayName;
                if (updateDto.TimeZone != null) user.TimeZone = updateDto.TimeZone;
                if (updateDto.PreferredUnits.HasValue) user.PreferredUnits = updateDto.PreferredUnits.Value;
                if (updateDto.Gender != null) user.Gender = updateDto.Gender;
                if (updateDto.DateOfBirth.HasValue) user.DateOfBirth = updateDto.DateOfBirth;
                if (updateDto.WeightKg.HasValue) user.WeightKg = updateDto.WeightKg;
                if (updateDto.HeightCm.HasValue) user.HeightCm = updateDto.HeightCm;
                if (updateDto.DefaultPrivacy != null) user.DefaultPrivacy = updateDto.DefaultPrivacy;

                user.UpdatedAtUtc = DateTime.UtcNow;
                var result = await _userManager.UpdateAsync(user);

                if (!result.Succeeded)
                {
                    return BadRequest(new ApiResponse<UserProfileDto>
                    {
                        Success = false,
                        Message = "Failed to update profile"
                    });
                }

                var profile = new UserProfileDto
                {
                    Id = user.Id,
                    Email = user.Email!,
                    Name = user.Name,
                    DisplayName = user.DisplayName,
                    TimeZone = user.TimeZone,
                    PreferredUnits = user.PreferredUnits,
                    Gender = user.Gender,
                    DateOfBirth = user.DateOfBirth,
                    WeightKg = user.WeightKg,
                    HeightCm = user.HeightCm,
                    DefaultPrivacy = user.DefaultPrivacy,
                    CreatedAtUtc = user.CreatedAtUtc
                };

                return Ok(new ApiResponse<UserProfileDto>
                {
                    Success = true,
                    Data = profile,
                    Message = "Profile updated successfully"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<UserProfileDto>
                {
                    Success = false,
                    Message = "An error occurred while updating profile"
                });
            }
        }

        [HttpGet("me/goals")]
        [Authorize]
        public async Task<ActionResult<ApiResponse<UserGoalsDto>>> GetCurrentUserGoals()
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var user = await _userManager.FindByIdAsync(userId!);

                if (user == null)
                {
                    return NotFound(new ApiResponse<UserGoalsDto>
                    {
                        Success = false,
                        Message = "User not found"
                    });
                }

                var goals = new UserGoalsDto
                {
                    DailyCalorieGoal = user.DailyCalorieGoal,
                    MacroProteinPct = user.MacroProteinPct,
                    MacroCarbsPct = user.MacroCarbsPct,
                    MacroFatPct = user.MacroFatPct
                };

                if (user.DailyCalorieGoal.HasValue && user.MacroProteinPct.HasValue && 
                    user.MacroCarbsPct.HasValue && user.MacroFatPct.HasValue)
                {
                    goals.RecommendedMacroGrams = new MacroGoalsDto
                    {
                        ProteinGoalGrams = (user.MacroProteinPct.Value / 100 * user.DailyCalorieGoal.Value) / 4,
                        CarbsGoalGrams = (user.MacroCarbsPct.Value / 100 * user.DailyCalorieGoal.Value) / 4,
                        FatGoalGrams = (user.MacroFatPct.Value / 100 * user.DailyCalorieGoal.Value) / 9
                    };
                }

                return Ok(new ApiResponse<UserGoalsDto>
                {
                    Success = true,
                    Data = goals,
                    Message = "Goals retrieved successfully"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<UserGoalsDto>
                {
                    Success = false,
                    Message = "An error occurred while retrieving goals"
                });
            }
        }

        [HttpPut("me/goals")]
        [Authorize]
        public async Task<ActionResult<ApiResponse<UserGoalsDto>>> UpdateCurrentUserGoals([FromBody] UpdateUserGoalsDto updateDto)
        {
            try
            {
                if (updateDto.MacroProteinPct.HasValue && updateDto.MacroCarbsPct.HasValue && updateDto.MacroFatPct.HasValue)
                {
                    var total = updateDto.MacroProteinPct.Value + updateDto.MacroCarbsPct.Value + updateDto.MacroFatPct.Value;
                    if (Math.Abs(total - 100) > 0.1m)
                    {
                        return BadRequest(new ApiResponse<UserGoalsDto>
                        {
                            Success = false,
                            Message = "Macro percentages must sum to 100"
                        });
                    }
                }

                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var user = await _userManager.FindByIdAsync(userId!);

                if (user == null)
                {
                    return NotFound(new ApiResponse<UserGoalsDto>
                    {
                        Success = false,
                        Message = "User not found"
                    });
                }

                user.DailyCalorieGoal = updateDto.DailyCalorieGoal;
                user.MacroProteinPct = updateDto.MacroProteinPct;
                user.MacroCarbsPct = updateDto.MacroCarbsPct;
                user.MacroFatPct = updateDto.MacroFatPct;
                user.UpdatedAtUtc = DateTime.UtcNow;

                var result = await _userManager.UpdateAsync(user);

                if (!result.Succeeded)
                {
                    return BadRequest(new ApiResponse<UserGoalsDto>
                    {
                        Success = false,
                        Message = "Failed to update goals"
                    });
                }

                var goals = new UserGoalsDto
                {
                    DailyCalorieGoal = user.DailyCalorieGoal,
                    MacroProteinPct = user.MacroProteinPct,
                    MacroCarbsPct = user.MacroCarbsPct,
                    MacroFatPct = user.MacroFatPct
                };

                if (user.DailyCalorieGoal.HasValue && user.MacroProteinPct.HasValue && 
                    user.MacroCarbsPct.HasValue && user.MacroFatPct.HasValue)
                {
                    goals.RecommendedMacroGrams = new MacroGoalsDto
                    {
                        ProteinGoalGrams = (user.MacroProteinPct.Value / 100 * user.DailyCalorieGoal.Value) / 4,
                        CarbsGoalGrams = (user.MacroCarbsPct.Value / 100 * user.DailyCalorieGoal.Value) / 4,
                        FatGoalGrams = (user.MacroFatPct.Value / 100 * user.DailyCalorieGoal.Value) / 9
                    };
                }

                return Ok(new ApiResponse<UserGoalsDto>
                {
                    Success = true,
                    Data = goals,
                    Message = "Goals updated successfully"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<UserGoalsDto>
                {
                    Success = false,
                    Message = "An error occurred while updating goals"
                });
            }
        }
    }
}