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
    public class ExercisesController : ControllerBase
    {
        private readonly IExerciseService _exerciseService;

        public ExercisesController(IExerciseService exerciseService)
        {
            _exerciseService = exerciseService;
        }

        // GET: api/Exercises
        [HttpGet]
        public async Task<ActionResult<ApiResponse<IEnumerable<Exercise>>>> GetExercises()
        {
            var exercises = await _exerciseService.GetAllExercisesAsync();
            return Ok(ApiResponse<IEnumerable<Exercise>>.SuccessResponse(exercises));
        }

        // GET: api/Exercises/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<Exercise>>> GetExercise(int id)
        {
            var exercise = await _exerciseService.GetExerciseByIdAsync(id);

            if (exercise == null)
            {
                return NotFound(ApiResponse<Exercise>.ErrorResponse("Exercise not found."));
            }

            return Ok(ApiResponse<Exercise>.SuccessResponse(exercise));
        }

        // POST: api/Exercises
        [HttpPost]
        public async Task<ActionResult<ApiResponse<Exercise>>> PostExercise(ExerciseDto exerciseDto)
        {
            var exercise = new Exercise
            {
                Name = exerciseDto.Name,
                Description = exerciseDto.Description,
                Category = exerciseDto.Category,
                MuscleGroups = exerciseDto.MuscleGroups,
                Equipment = exerciseDto.Equipment,
                CreatedAt = exerciseDto.CreatedAt
            };

            var createdExercise = await _exerciseService.CreateExerciseAsync(exercise);
            return CreatedAtAction(nameof(GetExercise), new { id = createdExercise.Id }, ApiResponse<Exercise>.SuccessResponse(createdExercise, "Exercise created successfully."));
        }

        // PUT: api/Exercises/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutExercise(int id, Exercise exercise)
        {
            if (id != exercise.Id)
            {
                return BadRequest(ApiResponse.ErrorResponse("Exercise ID mismatch."));
            }

            var existingExercise = await _exerciseService.GetExerciseByIdAsync(id);
            if (existingExercise == null)
            {
                return NotFound(ApiResponse.ErrorResponse("Exercise not found."));
            }

            existingExercise.Name = exercise.Name;
            existingExercise.Description = exercise.Description;
            existingExercise.Category = exercise.Category;
            existingExercise.MuscleGroups = exercise.MuscleGroups;
            existingExercise.Equipment = exercise.Equipment;
            existingExercise.CreatedAt = exercise.CreatedAt; // Consider if this should be updated or remain original

            await _exerciseService.UpdateExerciseAsync(existingExercise);

            return NoContent(); // For successful update, NoContent is standard, but you could return a success ApiResponse if preferred.
        }

        // DELETE: api/Exercises/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteExercise(int id)
        {
            var result = await _exerciseService.DeleteExerciseAsync(id);
            if (!result)
            {
                return NotFound(ApiResponse.ErrorResponse("Exercise not found."));
            }

            return NoContent();
        }
    }
}
