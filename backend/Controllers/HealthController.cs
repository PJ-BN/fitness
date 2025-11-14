using Fitness.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Fitness.Controllers
{
    [ApiController]
    public class HealthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        
        public HealthController(ApplicationDbContext context)
        {
            _context = context;
        }
        
        [HttpGet("/health/live")]
        public ActionResult GetLiveness()
        {
            return Ok(new { status = "healthy", timestamp = DateTime.UtcNow });
        }
        
        [HttpGet("/health/ready")]
        public async Task<ActionResult> GetReadiness()
        {
            try
            {
                // Check database connectivity
                await _context.Database.CanConnectAsync();
                
                return Ok(new 
                { 
                    status = "ready", 
                    timestamp = DateTime.UtcNow,
                    checks = new
                    {
                        database = "healthy"
                    }
                });
            }
            catch (Exception ex)
            {
                return ServiceUnavailable(new 
                { 
                    status = "not_ready", 
                    timestamp = DateTime.UtcNow,
                    checks = new
                    {
                        database = "unhealthy"
                    },
                    error = ex.Message
                });
            }
        }
        
        private ActionResult ServiceUnavailable(object value)
        {
            return StatusCode(503, value);
        }
    }
}