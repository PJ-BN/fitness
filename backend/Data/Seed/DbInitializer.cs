using Fitness.Models;
using Microsoft.AspNetCore.Identity;
using System.Threading.Tasks;

namespace Fitness.Data.Seed
{
    public static class DbInitializer
    {
        public static async Task Initialize(UserManager<User> userManager, RoleManager<IdentityRole> roleManager)
        {
            // Create roles if they don't exist
            string[] roleNames = { "Admin", "User" };
            foreach (var roleName in roleNames)
            {
                if (!await roleManager.RoleExistsAsync(roleName))
                {
                    await roleManager.CreateAsync(new IdentityRole(roleName));
                }
            }

            // Create a default admin user if one doesn't exist
            if (userManager.FindByEmailAsync("admin@fitness.com").Result == null)
            {
                User adminUser = new User
                {
                    UserName = "admin@fitness.com",
                    Email = "admin@fitness.com",
                    Name = "Admin User"
                };

                IdentityResult result = userManager.CreateAsync(adminUser, "Admin@123").Result;

                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(adminUser, "Admin");
                }
            }
        }
    }
}