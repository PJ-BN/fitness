using Fitness.Models;
using Fitness.Models.DTOs;
using Fitness.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Fitness.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class WorkoutsController : ControllerBase
    {
        private readonly IWorkoutService _workoutService;
        private readonly UserManager<User> _userManager;

        public WorkoutsController(IWorkoutService workoutService,
            UserManager<User> userManager)
        {
            _workoutService = workoutService;
            _userManager = userManager;

        }

        // GET: api/Workouts
        [HttpGet]
        public async Task<ActionResult<ApiResponse<IEnumerable<Workout>>>> GetWorkouts()
        {
            var workouts = await _workoutService.GetAllWorkoutsAsync();
            return Ok(ApiResponse<IEnumerable<Workout>>.SuccessResponse(workouts));
        }

        // GET: api/Workouts/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<Workout>>> GetWorkout(int id)
        {
            var workout = await _workoutService.GetWorkoutByIdAsync(id);

            if (workout == null)
            {
                return NotFound(ApiResponse<Workout>.ErrorResponse("Workout not found."));
            }

            return Ok(ApiResponse<Workout>.SuccessResponse(workout));
        }

        // GET: api/Workouts/ByUser/5
        [HttpGet("ByUser/{userId}")]
        public async Task<ActionResult<ApiResponse<IEnumerable<Workout>>>> GetWorkoutsByUserId(string userId)
        {
            var workouts = await _workoutService.GetWorkoutsByUserIdAsync(userId);
            return Ok(ApiResponse<IEnumerable<Workout>>.SuccessResponse(workouts));
        }

        // POST: api/Workouts
        [HttpPost]
        public async Task<ActionResult<ApiResponse<Workout>>> PostWorkout(WorkoutDto workoutDto)
        {
            var workout = new Workout
            {
                UserId = workoutDto.UserId,
                Date = workoutDto.Date,
                Notes = workoutDto.Notes,
                CreatedAt = workoutDto.CreatedAt,
                UpdatedAt = workoutDto.UpdatedAt
            };

            var createdWorkout = await _workoutService.CreateWorkoutAsync(workout);
            return CreatedAtAction(nameof(GetWorkout), new { id = createdWorkout.Id }, ApiResponse<Workout>.SuccessResponse(createdWorkout, "Workout created successfully."));
        }

        // PUT: api/Workouts/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutWorkout(string id, Workout workout)
        {
            if (id != workout.Id.ToString())
            {
                return BadRequest(ApiResponse.ErrorResponse("Workout ID mismatch."));
            }

            var existingWorkout = await _workoutService.GetWorkoutByIdAsync(int.Parse(id));
            if (existingWorkout == null)
            {
                return NotFound(ApiResponse.ErrorResponse("Workout not found."));
            }

            existingWorkout.UserId = workout.UserId;
            existingWorkout.Date = workout.Date;
            existingWorkout.Notes = workout.Notes;
            existingWorkout.CreatedAt = workout.CreatedAt;
            existingWorkout.UpdatedAt = System.DateTime.UtcNow;

            await _workoutService.UpdateWorkoutAsync(existingWorkout);

            return NoContent();
        }

        // DELETE: api/Workouts/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteWorkout(int id)
        {
            var result = await _workoutService.DeleteWorkoutAsync(id);
            if (!result)
            {
                return NotFound();
            }

            return NoContent();
        }

        [HttpPost("log-from-routine")]
        [Authorize]
        public async Task<IActionResult> LogWorkoutFromRoutine([FromBody] LogWorkoutFromRoutineDto logWorkoutFromRoutineDto)
        {
            // Simplified user ID extraction
            var userId = User.FindFirst("user_id")?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            }
            
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(ApiResponse<object>.ErrorResponse("User ID not found in token."));
            }

            var response = await _workoutService.LogWorkoutFromRoutineAsync(userId, logWorkoutFromRoutineDto);
            if (!response.Success)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }
    }
}
