using Fitness.Models.DTOs;
using Fitness.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Fitness.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DayRoutineBodyPartsController : ControllerBase
    {
        private readonly IDayRoutineBodyPartService _dayRoutineBodyPartService;

        public DayRoutineBodyPartsController(IDayRoutineBodyPartService dayRoutineBodyPartService)
        {
            _dayRoutineBodyPartService = dayRoutineBodyPartService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var response = await _dayRoutineBodyPartService.GetAllAsync();
            if (!response.Success)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var response = await _dayRoutineBodyPartService.GetByIdAsync(id);
            if (!response.Success)
            {
                return NotFound(response);
            }
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] DayRoutineBodyPartDto dayRoutineBodyPartDto)
        {
            var response = await _dayRoutineBodyPartService.CreateAsync(dayRoutineBodyPartDto);
            if (!response.Success)
            {
                return BadRequest(response);
            }
            return CreatedAtAction(nameof(GetById), new { id = response.Data.Id }, response);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] DayRoutineBodyPartDto dayRoutineBodyPartDto)
        {
            var response = await _dayRoutineBodyPartService.UpdateAsync(id, dayRoutineBodyPartDto);
            if (!response.Success)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var response = await _dayRoutineBodyPartService.DeleteAsync(id);
            if (!response.Success)
            {
                return BadRequest(response);
            }
            return NoContent();
        }
    }
}
