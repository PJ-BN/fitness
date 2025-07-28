using Fitness.Models;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;

namespace Fitness.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")] // Only Admins can manage users
    public class UsersController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;

        public UsersController(UserManager<User> userManager, RoleManager<IdentityRole> roleManager)
        {
            _userManager = userManager;
            _roleManager = roleManager;
        }

        // GET: api/Users
        [HttpGet]
        public async Task<ActionResult<ApiResponse<IEnumerable<User>>>> GetUsers()
        {
            var users = _userManager.Users.ToList();
            return Ok(ApiResponse<IEnumerable<User>>.SuccessResponse(users));
        }

        // GET: api/Users/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<User>>> GetUser(string id)
        {
            var user = await _userManager.FindByIdAsync(id);

            if (user == null)
            {
                return NotFound(ApiResponse<User>.ErrorResponse("User not found."));
            }

            return Ok(ApiResponse<User>.SuccessResponse(user));
        }

        // PUT: api/Users/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUser(string id, User user)
        {
            if (id != user.Id)
            {
                return BadRequest(ApiResponse.ErrorResponse("User ID mismatch."));
            }

            var existingUser = await _userManager.FindByIdAsync(id);
            if (existingUser == null)
            {
                return NotFound(ApiResponse.ErrorResponse("User not found."));
            }

            existingUser.Email = user.Email;
            existingUser.UserName = user.Email; // UserName is usually the same as Email for Identity
            existingUser.Name = user.Name;

            var result = await _userManager.UpdateAsync(existingUser);

            if (result.Succeeded)
            {
                return NoContent();
            }

            var errors = result.Errors.Select(e => e.Description).ToList();
            return BadRequest(ApiResponse.ErrorResponse("Failed to update user.", errors));
        }

        // DELETE: api/Users/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
            {
                return NotFound(ApiResponse.ErrorResponse("User not found."));
            }

            var result = await _userManager.DeleteAsync(user);

            if (result.Succeeded)
            {
                return NoContent();
            }

            var errors = result.Errors.Select(e => e.Description).ToList();
            return BadRequest(ApiResponse.ErrorResponse("Failed to delete user.", errors));
        }

        // POST: api/Users/{id}/roles
        [HttpPost("{id}/roles")]
        public async Task<IActionResult> AssignRole(string id, [FromBody] string roleName)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            if (!await _roleManager.RoleExistsAsync(roleName))
            {
                return NotFound("Role not found.");
            }

            var result = await _userManager.AddToRoleAsync(user, roleName);
            if (result.Succeeded)
            {
                return Ok("Role assigned successfully.");
            }

            return BadRequest(result.Errors);
        }

        // DELETE: api/Users/{id}/roles
        [HttpDelete("{id}/roles")]
        public async Task<IActionResult> RemoveRole(string id, [FromBody] string roleName)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            if (!await _roleManager.RoleExistsAsync(roleName))
            {
                return NotFound("Role not found.");
            }

            var result = await _userManager.RemoveFromRoleAsync(user, roleName);
            if (result.Succeeded)
            {
                return Ok("Role removed successfully.");
            }

            return BadRequest(result.Errors);
        }
    }
}
