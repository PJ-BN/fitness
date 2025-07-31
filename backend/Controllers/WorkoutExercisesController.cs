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
    public class WorkoutExercisesController : ControllerBase
    {
        private readonly IWorkoutExerciseService _workoutExerciseService;

        public WorkoutExercisesController(IWorkoutExerciseService workoutExerciseService)
        {
            _workoutExerciseService = workoutExerciseService;
        }

        // GET: api/WorkoutExercises/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<WorkoutExercise>>> GetWorkoutExercise(int id)
        {
            var workoutExercise = await _workoutExerciseService.GetWorkoutExerciseByIdAsync(id);

            if (workoutExercise == null)
            {
                return NotFound(ApiResponse<WorkoutExercise>.ErrorResponse("Workout exercise not found."));
            }

            return Ok(ApiResponse<WorkoutExercise>.SuccessResponse(workoutExercise));
        }

        // GET: api/WorkoutExercises/ByWorkout/5
        [HttpGet("ByWorkout/{workoutId}")]
        public async Task<ActionResult<ApiResponse<IEnumerable<WorkoutExercise>>>> GetWorkoutExercisesByWorkoutId(int workoutId)
        {
            var workoutExercises = await _workoutExerciseService.GetWorkoutExercisesByWorkoutIdAsync(workoutId);
            return Ok(ApiResponse<IEnumerable<WorkoutExercise>>.SuccessResponse(workoutExercises));
        }

        // DELETE: api/WorkoutExercises/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteWorkoutExercise(int id)
        {
            var result = await _workoutExerciseService.DeleteWorkoutExerciseAsync(id);
            if (!result)
            {
                return NotFound(ApiResponse.ErrorResponse("Workout exercise not found."));
            }

            return NoContent();
        }
    }
}
