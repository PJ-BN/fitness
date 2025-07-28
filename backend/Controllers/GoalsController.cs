using Fitness.Models;
using Fitness.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;

namespace Fitness.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class GoalsController : ControllerBase
    {
        private readonly IGoalService _goalService;

        public GoalsController(IGoalService goalService)
        {
            _goalService = goalService;
        }

        // GET: api/Goals
        [HttpGet]
        public async Task<ActionResult<ApiResponse<IEnumerable<Goal>>>> GetGoals()
        {
            var goals = await _goalService.GetAllGoalsAsync();
            return Ok(ApiResponse<IEnumerable<Goal>>.SuccessResponse(goals));
        }

        // GET: api/Goals/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<Goal>>> GetGoal(int id)
        {
            var goal = await _goalService.GetGoalByIdAsync(id);

            if (goal == null)
            {
                return NotFound(ApiResponse<Goal>.ErrorResponse("Goal not found."));
            }

            return Ok(ApiResponse<Goal>.SuccessResponse(goal));
        }

        // GET: api/Goals/ByUser/5
        [HttpGet("ByUser/{userId}")]
        public async Task<ActionResult<ApiResponse<IEnumerable<Goal>>>> GetGoalsByUserId(string userId)
        {
            var goals = await _goalService.GetGoalsByUserIdAsync(userId);
            return Ok(ApiResponse<IEnumerable<Goal>>.SuccessResponse(goals));
        }

        // POST: api/Goals
        [HttpPost]
        public async Task<ActionResult<ApiResponse<Goal>>> PostGoal(Goal goal)
        {
            var createdGoal = await _goalService.CreateGoalAsync(goal);
            return CreatedAtAction(nameof(GetGoal), new { id = createdGoal.Id }, ApiResponse<Goal>.SuccessResponse(createdGoal, "Goal created successfully."));
        }

        // PUT: api/Goals/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutGoal(int id, Goal goal)
        {
            if (id != goal.Id)
            {
                return BadRequest(ApiResponse.ErrorResponse("Goal ID mismatch."));
            }

            var existingGoal = await _goalService.GetGoalByIdAsync(id);
            if (existingGoal == null)
            {
                return NotFound(ApiResponse.ErrorResponse("Goal not found."));
            }

            existingGoal.UserId = goal.UserId;
            existingGoal.Description = goal.Description;
            existingGoal.TargetValue = goal.TargetValue;
            existingGoal.CurrentValue = goal.CurrentValue;
            existingGoal.Deadline = goal.Deadline;
            existingGoal.Status = goal.Status;

            await _goalService.UpdateGoalAsync(existingGoal);

            return NoContent();
        }

        // DELETE: api/Goals/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteGoal(int id)
        {
            var result = await _goalService.DeleteGoalAsync(id);
            if (!result)
            {
                return NotFound(ApiResponse.ErrorResponse("Goal not found."));
            }

            return NoContent();
        }
    }
}
