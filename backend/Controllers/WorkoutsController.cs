using Fitness.Models;
using Fitness.Models.DTOs;
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
    public class WorkoutsController : ControllerBase
    {
        private readonly IWorkoutService _workoutService;

        public WorkoutsController(IWorkoutService workoutService)
        {
            _workoutService = workoutService;
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
    }
}
