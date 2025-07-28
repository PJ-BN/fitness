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

        // POST: api/WorkoutExercises
        [HttpPost]
        public async Task<ActionResult<ApiResponse<WorkoutExercise>>> PostWorkoutExercise(WorkoutExerciseDto workoutExerciseDto)
        {
            var workoutExercise = new WorkoutExercise
            {
                WorkoutId = workoutExerciseDto.WorkoutId,
                ExerciseId = workoutExerciseDto.ExerciseId,
                Sets = workoutExerciseDto.Sets,
                Reps = workoutExerciseDto.Reps,
                Weight = workoutExerciseDto.Weight,
                Duration = workoutExerciseDto.Duration,
                Notes = workoutExerciseDto.Notes
            };

            var createdWorkoutExercise = await _workoutExerciseService.CreateWorkoutExerciseAsync(workoutExercise);
            return CreatedAtAction(nameof(GetWorkoutExercise), new { id = createdWorkoutExercise.Id }, ApiResponse<WorkoutExercise>.SuccessResponse(createdWorkoutExercise, "Workout exercise created successfully."));
        }

        // PUT: api/WorkoutExercises/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutWorkoutExercise(int id, WorkoutExercise workoutExercise)
        {
            if (id != workoutExercise.Id)
            {
                return BadRequest(ApiResponse.ErrorResponse("Workout exercise ID mismatch."));
            }

            var existingWorkoutExercise = await _workoutExerciseService.GetWorkoutExerciseByIdAsync(id);
            if (existingWorkoutExercise == null)
            {
                return NotFound(ApiResponse.ErrorResponse("Workout exercise not found."));
            }

            existingWorkoutExercise.WorkoutId = workoutExercise.WorkoutId;
            existingWorkoutExercise.ExerciseId = workoutExercise.ExerciseId;
            existingWorkoutExercise.Sets = workoutExercise.Sets;
            existingWorkoutExercise.Reps = workoutExercise.Reps;
            existingWorkoutExercise.Weight = workoutExercise.Weight;
            existingWorkoutExercise.Duration = workoutExercise.Duration;
            existingWorkoutExercise.Notes = workoutExercise.Notes;

            await _workoutExerciseService.UpdateWorkoutExerciseAsync(existingWorkoutExercise);

            return NoContent();
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
