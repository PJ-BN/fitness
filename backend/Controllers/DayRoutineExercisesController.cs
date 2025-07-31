using Fitness.Models.DTOs;
using Fitness.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Fitness.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DayRoutineExercisesController : ControllerBase
    {
        private readonly IDayRoutineExerciseService _dayRoutineExerciseService;

        public DayRoutineExercisesController(IDayRoutineExerciseService dayRoutineExerciseService)
        {
            _dayRoutineExerciseService = dayRoutineExerciseService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var response = await _dayRoutineExerciseService.GetAllAsync();
            if (!response.Success)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var response = await _dayRoutineExerciseService.GetByIdAsync(id);
            if (!response.Success)
            {
                return NotFound(response);
            }
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] DayRoutineExerciseDto dayRoutineExerciseDto)
        {
            var response = await _dayRoutineExerciseService.CreateAsync(dayRoutineExerciseDto);
            if (!response.Success)
            {
                return BadRequest(response);
            }
            return CreatedAtAction(nameof(GetById), new { id = response.Data.Id }, response);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] DayRoutineExerciseDto dayRoutineExerciseDto)
        {
            var response = await _dayRoutineExerciseService.UpdateAsync(id, dayRoutineExerciseDto);
            if (!response.Success)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var response = await _dayRoutineExerciseService.DeleteAsync(id);
            if (!response.Success)
            {
                return BadRequest(response);
            }
            return NoContent();
        }
    }
}
