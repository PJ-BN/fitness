using Microsoft.AspNetCore.Identity;

namespace Fitness.Models
{
    public class User : IdentityUser
    {
        public string Name { get; set; }
    }
}