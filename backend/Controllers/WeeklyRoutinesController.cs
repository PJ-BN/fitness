using Fitness.Models.DTOs;
using Fitness.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Fitness.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WeeklyRoutinesController : ControllerBase
    {
        private readonly IWeeklyRoutineService _weeklyRoutineService;
        private readonly IDayRoutineService _dayRoutineService;

        public WeeklyRoutinesController(IWeeklyRoutineService weeklyRoutineService, IDayRoutineService dayRoutineService)
        {
            _weeklyRoutineService = weeklyRoutineService;
            _dayRoutineService = dayRoutineService;
        }

        [HttpGet("my-routines")]
        [Authorize]
        public async Task<IActionResult> GetMyRoutines()
        {
            // Try custom claim first
            var userId = User.FindFirst("user_id")?.Value;
            
            // Fallback to NameIdentifier if custom claim not found
            if (string.IsNullOrEmpty(userId))
            {
                userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            }
            
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            var response = await _weeklyRoutineService.GetRoutinesForUserAsync(userId);
            if (!response.Success)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var response = await _weeklyRoutineService.GetAllAsync();
            if (!response.Success)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var response = await _weeklyRoutineService.GetByIdAsync(id);
            if (!response.Success)
            {
                return NotFound(response);
            }
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] WeeklyRoutineDto weeklyRoutineDto)
        {
            var response = await _weeklyRoutineService.CreateAsync(weeklyRoutineDto);
            if (!response.Success)
            {
                return BadRequest(response);
            }
            return CreatedAtAction(nameof(GetById), new { id = response.Data.Id }, response);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] WeeklyRoutineDto weeklyRoutineDto)
        {
            var response = await _weeklyRoutineService.UpdateAsync(id, weeklyRoutineDto);
            if (!response.Success)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var response = await _weeklyRoutineService.DeleteAsync(id);
            if (!response.Success)
            {
                return BadRequest(response);
            }
            return NoContent();
        }

        [HttpGet("{routineId}/days")]
        public async Task<IActionResult> GetDaysForRoutine(int routineId)
        {
            var response = await _dayRoutineService.GetByWeeklyRoutineIdAsync(routineId);
            if (!response.Success)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }

        [HttpPut("{routineId}/days/{dayOfWeek}")]
        public async Task<IActionResult> UpdateDay(int routineId, int dayOfWeek, [FromBody] DayRoutineDto dayRoutineDto)
        {
            var response = await _dayRoutineService.UpdateByDayOfWeekAsync(routineId, dayOfWeek, dayRoutineDto);
            if (!response.Success)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }

        [HttpGet("{routineId}/days/{dayOfWeek}")]
        public async Task<IActionResult> GetDay(int routineId, int dayOfWeek)
        {
            var response = await _dayRoutineService.GetByDayOfWeekAsync(routineId, dayOfWeek);
            if (!response.Success)
            {
                return NotFound(response);
            }
            return Ok(response);
        }
    }
}
