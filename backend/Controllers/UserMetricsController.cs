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
    public class UserMetricsController : ControllerBase
    {
        private readonly IUserMetricService _userMetricService;

        public UserMetricsController(IUserMetricService userMetricService)
        {
            _userMetricService = userMetricService;
        }

        // GET: api/UserMetrics
        [HttpGet]
        public async Task<ActionResult<ApiResponse<IEnumerable<UserMetric>>>> GetUserMetrics()
        {
            var userMetrics = await _userMetricService.GetAllUserMetricsAsync();
            return Ok(ApiResponse<IEnumerable<UserMetric>>.SuccessResponse(userMetrics));
        }

        // GET: api/UserMetrics/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<UserMetric>>> GetUserMetric(int id)
        {
            var userMetric = await _userMetricService.GetUserMetricByIdAsync(id);

            if (userMetric == null)
            {
                return NotFound(ApiResponse<UserMetric>.ErrorResponse("User metric not found."));
            }

            return Ok(ApiResponse<UserMetric>.SuccessResponse(userMetric));
        }

        // GET: api/UserMetrics/ByUser/5
        [HttpGet("ByUser/{userId}")]
        public async Task<ActionResult<ApiResponse<IEnumerable<UserMetric>>>> GetUserMetricsByUserId(string userId)
        {
            var userMetrics = await _userMetricService.GetUserMetricsByUserIdAsync(userId);
            return Ok(ApiResponse<IEnumerable<UserMetric>>.SuccessResponse(userMetrics));
        }

        // POST: api/UserMetrics
        [HttpPost]
        public async Task<ActionResult<ApiResponse<UserMetric>>> PostUserMetric(UserMetric userMetric)
        {
            var createdUserMetric = await _userMetricService.CreateUserMetricAsync(userMetric);
            return CreatedAtAction(nameof(GetUserMetric), new { id = createdUserMetric.Id }, ApiResponse<UserMetric>.SuccessResponse(createdUserMetric, "User metric created successfully."));
        }

        // PUT: api/UserMetrics/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUserMetric(int id, UserMetric userMetric)
        {
            if (id != userMetric.Id)
            {
                return BadRequest(ApiResponse.ErrorResponse("User metric ID mismatch."));
            }

            var existingUserMetric = await _userMetricService.GetUserMetricByIdAsync(id);
            if (existingUserMetric == null)
            {
                return NotFound(ApiResponse.ErrorResponse("User metric not found."));
            }

            existingUserMetric.UserId = userMetric.UserId;
            existingUserMetric.Date = userMetric.Date;
            existingUserMetric.Weight = userMetric.Weight;
            existingUserMetric.BodyFatPercentage = userMetric.BodyFatPercentage;

            await _userMetricService.UpdateUserMetricAsync(existingUserMetric);

            return NoContent();
        }

        // DELETE: api/UserMetrics/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUserMetric(int id)
        {
            var result = await _userMetricService.DeleteUserMetricAsync(id);
            if (!result)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}
