using Microsoft.AspNetCore.Mvc;

namespace Fitness.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MetadataController : ControllerBase
    {
        [HttpGet("units")]
        public ActionResult<object> GetSupportedUnits()
        {
            var units = new
            {
                Weight = new
                {
                    Metric = new[] { new { Unit = "grams", Symbol = "g" }, new { Unit = "kilograms", Symbol = "kg" } },
                    Imperial = new[] { new { Unit = "ounces", Symbol = "oz" }, new { Unit = "pounds", Symbol = "lb" } }
                },
                Height = new
                {
                    Metric = new[] { new { Unit = "centimeters", Symbol = "cm" }, new { Unit = "meters", Symbol = "m" } },
                    Imperial = new[] { new { Unit = "inches", Symbol = "in" }, new { Unit = "feet", Symbol = "ft" } }
                },
                Volume = new
                {
                    Metric = new[] { new { Unit = "milliliters", Symbol = "ml" }, new { Unit = "liters", Symbol = "L" } },
                    Imperial = new[] { new { Unit = "fluid_ounces", Symbol = "fl oz" }, new { Unit = "cups", Symbol = "cup" } }
                }
            };
            
            return Ok(units);
        }
        
        [HttpGet("timezones")]
        public ActionResult<object> GetSupportedTimezones()
        {
            var commonTimezones = new[]
            {
                new { Id = "UTC", DisplayName = "Coordinated Universal Time (UTC)", Offset = "+00:00" },
                new { Id = "America/New_York", DisplayName = "Eastern Time (US & Canada)", Offset = "-05:00" },
                new { Id = "America/Chicago", DisplayName = "Central Time (US & Canada)", Offset = "-06:00" },
                new { Id = "America/Denver", DisplayName = "Mountain Time (US & Canada)", Offset = "-07:00" },
                new { Id = "America/Los_Angeles", DisplayName = "Pacific Time (US & Canada)", Offset = "-08:00" },
                new { Id = "Europe/London", DisplayName = "Greenwich Mean Time (London)", Offset = "+00:00" },
                new { Id = "Europe/Paris", DisplayName = "Central European Time (Paris)", Offset = "+01:00" },
                new { Id = "Europe/Berlin", DisplayName = "Central European Time (Berlin)", Offset = "+01:00" },
                new { Id = "Asia/Tokyo", DisplayName = "Japan Standard Time (Tokyo)", Offset = "+09:00" },
                new { Id = "Asia/Shanghai", DisplayName = "China Standard Time (Shanghai)", Offset = "+08:00" },
                new { Id = "Asia/Kolkata", DisplayName = "India Standard Time (Kolkata)", Offset = "+05:30" },
                new { Id = "Australia/Sydney", DisplayName = "Australian Eastern Time (Sydney)", Offset = "+10:00" },
                new { Id = "Pacific/Auckland", DisplayName = "New Zealand Standard Time (Auckland)", Offset = "+12:00" }
            };
            
            return Ok(new { Timezones = commonTimezones });
        }
    }
}