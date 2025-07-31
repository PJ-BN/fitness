using Fitness.Models.DTOs;
using Fitness.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Fitness.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DayRoutinesController : ControllerBase
    {
        private readonly IDayRoutineService _dayRoutineService;
        private readonly IDayRoutineBodyPartService _dayRoutineBodyPartService;
        private readonly IDayRoutineExerciseService _dayRoutineExerciseService;

        public DayRoutinesController(IDayRoutineService dayRoutineService, IDayRoutineBodyPartService dayRoutineBodyPartService, IDayRoutineExerciseService dayRoutineExerciseService)
        {
            _dayRoutineService = dayRoutineService;
            _dayRoutineBodyPartService = dayRoutineBodyPartService;
            _dayRoutineExerciseService = dayRoutineExerciseService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var response = await _dayRoutineService.GetAllAsync();
            if (!response.Success)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var response = await _dayRoutineService.GetByIdAsync(id);
            if (!response.Success)
            {
                return NotFound(response);
            }
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] DayRoutineDto dayRoutineDto)
        {
            var response = await _dayRoutineService.CreateAsync(dayRoutineDto);
            if (!response.Success)
            {
                return BadRequest(response);
            }
            return CreatedAtAction(nameof(GetById), new { id = response.Data.Id }, response);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] DayRoutineDto dayRoutineDto)
        {
            var response = await _dayRoutineService.UpdateAsync(id, dayRoutineDto);
            if (!response.Success)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var response = await _dayRoutineService.DeleteAsync(id);
            if (!response.Success)
            {
                return BadRequest(response);
            }
            return NoContent();
        }

        [HttpGet("{dayId}/bodyparts")]
        public async Task<IActionResult> GetBodyPartsForDay(int dayId)
        {
            var response = await _dayRoutineBodyPartService.GetByDayRoutineIdAsync(dayId);
            if (!response.Success)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }

        [HttpPost("{dayId}/bodyparts")]
        public async Task<IActionResult> AddBodyPartToDay(int dayId, [FromBody] DayRoutineBodyPartDto dayRoutineBodyPartDto)
        {
            dayRoutineBodyPartDto.DayRoutineId = dayId;
            var response = await _dayRoutineBodyPartService.CreateAsync(dayRoutineBodyPartDto);
            if (!response.Success)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }

        [HttpDelete("{dayId}/bodyparts")]
        public async Task<IActionResult> RemoveBodyPartFromDay(int dayId, [FromBody] DayRoutineBodyPartDto dayRoutineBodyPartDto)
        {
            var response = await _dayRoutineBodyPartService.DeleteByDayRoutineIdAndBodyPartAsync(dayId, dayRoutineBodyPartDto.BodyPart);
            if (!response.Success)
            {
                return BadRequest(response);
            }
            return NoContent();
        }

        [HttpGet("{dayId}/exercises")]
        public async Task<IActionResult> GetExercisesForDay(int dayId)
        {
            var response = await _dayRoutineExerciseService.GetByDayRoutineIdAsync(dayId);
            if (!response.Success)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }

        [HttpPost("{dayId}/exercises")]
        public async Task<IActionResult> AddExerciseToDay(int dayId, [FromBody] DayRoutineExerciseDto dayRoutineExerciseDto)
        {
            dayRoutineExerciseDto.DayRoutineId = dayId;
            var response = await _dayRoutineExerciseService.CreateAsync(dayRoutineExerciseDto);
            if (!response.Success)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }

        [HttpPut("{dayId}/exercises/{id}")]
        public async Task<IActionResult> UpdateExerciseInDay(int dayId, int id, [FromBody] DayRoutineExerciseDto dayRoutineExerciseDto)
        {
            dayRoutineExerciseDto.DayRoutineId = dayId;
            var response = await _dayRoutineExerciseService.UpdateAsync(id, dayRoutineExerciseDto);
            if (!response.Success)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }

        [HttpDelete("{dayId}/exercises/{id}")]
        public async Task<IActionResult> RemoveExerciseFromDay(int dayId, int id)
        {
            var response = await _dayRoutineExerciseService.DeleteAsync(id);
            if (!response.Success)
            {
                return BadRequest(response);
            }
            return NoContent();
        }

        [HttpGet("by-weekly-routine/{weeklyRoutineId}")]
        public async Task<IActionResult> GetByWeeklyRoutineId(int weeklyRoutineId)
        {
            var response = await _dayRoutineService.GetByWeeklyRoutineIdAsync(weeklyRoutineId);
            if (!response.Success)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }
    }
}
