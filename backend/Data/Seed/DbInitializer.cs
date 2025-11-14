using Fitness.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Fitness.Data.Seed
{
    public static class DbInitializer
    {
        public static async Task Initialize(UserManager<User> userManager, RoleManager<IdentityRole> roleManager, ApplicationDbContext context)
        {
            context.Database.EnsureCreated();
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
            if (await userManager.FindByEmailAsync("admin@fitness.com") == null)
            {
                User adminUser = new User
                {
                    UserName = "admin@fitness.com",
                    Email = "admin@fitness.com",
                    Name = "Admin User"
                };

                IdentityResult result = await userManager.CreateAsync(adminUser, "Admin@123");

                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(adminUser, "Admin");
                }
            }

            // Create a test user if one doesn't exist
            var testUser = await userManager.FindByEmailAsync("test@fitness.com");
            if (testUser == null)
            {
                testUser = new User
                {
                    UserName = "test@fitness.com",
                    Email = "test@fitness.com",
                    Name = "Test User"
                };

                IdentityResult result = await userManager.CreateAsync(testUser, "Test@123");

                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(testUser, "User");
                }
            }

            // Seed system foods if they don't exist
            if (!context.Foods.Any())
            {
                var systemFoods = new[]
                {
                    // Nepalese Staples
                    new Food
                    {
                        Name = "Dal Bhat (Rice and Lentils)",
                        IsSystem = true,
                        CaloriesPer100g = 130,
                        ProteinGramsPer100g = 4.5m,
                        CarbsGramsPer100g = 23.0m,
                        FatGramsPer100g = 1.2m,
                        FiberGramsPer100g = 2.8m,
                        SodiumMg = 350,
                        Tags = new[] { "nepalese", "staple", "rice", "lentils", "traditional" }
                    },
                    new Food
                    {
                        Name = "Momo (Nepalese Dumpling)",
                        IsSystem = true,
                        CaloriesPer100g = 185,
                        ProteinGramsPer100g = 8.5m,
                        CarbsGramsPer100g = 22.0m,
                        FatGramsPer100g = 6.8m,
                        FiberGramsPer100g = 1.5m,
                        SodiumMg = 450,
                        Tags = new[] { "nepalese", "dumpling", "meat", "traditional", "steamed" }
                    },
                    new Food
                    {
                        Name = "Gundruk (Fermented Leafy Greens)",
                        IsSystem = true,
                        CaloriesPer100g = 45,
                        ProteinGramsPer100g = 4.2m,
                        CarbsGramsPer100g = 6.8m,
                        FatGramsPer100g = 0.8m,
                        FiberGramsPer100g = 3.5m,
                        SodiumMg = 280,
                        Tags = new[] { "nepalese", "fermented", "vegetables", "leafy", "traditional" }
                    },
                    new Food
                    {
                        Name = "Dhido (Traditional Porridge)",
                        IsSystem = true,
                        CaloriesPer100g = 95,
                        ProteinGramsPer100g = 2.8m,
                        CarbsGramsPer100g = 19.5m,
                        FatGramsPer100g = 0.5m,
                        FiberGramsPer100g = 2.2m,
                        SodiumMg = 120,
                        Tags = new[] { "nepalese", "porridge", "millet", "traditional", "staple" }
                    },
                    new Food
                    {
                        Name = "Sel Roti (Ring-shaped Rice Bread)",
                        IsSystem = true,
                        CaloriesPer100g = 320,
                        ProteinGramsPer100g = 6.2m,
                        CarbsGramsPer100g = 58.0m,
                        FatGramsPer100g = 8.5m,
                        FiberGramsPer100g = 1.8m,
                        SodiumMg = 280,
                        Tags = new[] { "nepalese", "bread", "rice", "festive", "traditional" }
                    },
                    new Food
                    {
                        Name = "Yak Cheese (Churpi)",
                        IsSystem = true,
                        CaloriesPer100g = 380,
                        ProteinGramsPer100g = 25.5m,
                        CarbsGramsPer100g = 2.8m,
                        FatGramsPer100g = 30.2m,
                        FiberGramsPer100g = 0.0m,
                        SodiumMg = 850,
                        Tags = new[] { "nepalese", "cheese", "yak", "protein", "dairy" }
                    },

                    // Indian Staples & Dishes
                    new Food
                    {
                        Name = "Basmati Rice (Cooked)",
                        IsSystem = true,
                        CaloriesPer100g = 121,
                        ProteinGramsPer100g = 2.7m,
                        CarbsGramsPer100g = 25.0m,
                        FatGramsPer100g = 0.4m,
                        FiberGramsPer100g = 0.4m,
                        SodiumMg = 1,
                        Tags = new[] { "indian", "rice", "staple", "carbs" }
                    },
                    new Food
                    {
                        Name = "Chapati (Whole Wheat Flatbread)",
                        IsSystem = true,
                        CaloriesPer100g = 297,
                        ProteinGramsPer100g = 11.2m,
                        CarbsGramsPer100g = 58.0m,
                        FatGramsPer100g = 3.7m,
                        FiberGramsPer100g = 9.2m,
                        SodiumMg = 468,
                        Tags = new[] { "indian", "bread", "wheat", "flatbread", "traditional" }
                    },
                    new Food
                    {
                        Name = "Rajma (Kidney Bean Curry)",
                        IsSystem = true,
                        CaloriesPer100g = 95,
                        ProteinGramsPer100g = 6.8m,
                        CarbsGramsPer100g = 12.5m,
                        FatGramsPer100g = 1.8m,
                        FiberGramsPer100g = 5.2m,
                        SodiumMg = 320,
                        Tags = new[] { "indian", "curry", "beans", "protein", "vegetarian" }
                    },
                    new Food
                    {
                        Name = "Chicken Curry (Indian Style)",
                        IsSystem = true,
                        CaloriesPer100g = 165,
                        ProteinGramsPer100g = 20.5m,
                        CarbsGramsPer100g = 4.2m,
                        FatGramsPer100g = 7.8m,
                        FiberGramsPer100g = 1.2m,
                        SodiumMg = 480,
                        Tags = new[] { "indian", "curry", "chicken", "protein", "spicy" }
                    },
                    new Food
                    {
                        Name = "Paneer (Indian Cottage Cheese)",
                        IsSystem = true,
                        CaloriesPer100g = 265,
                        ProteinGramsPer100g = 18.3m,
                        CarbsGramsPer100g = 1.2m,
                        FatGramsPer100g = 20.8m,
                        FiberGramsPer100g = 0.0m,
                        SodiumMg = 18,
                        Tags = new[] { "indian", "cheese", "protein", "dairy", "vegetarian" }
                    },
                    new Food
                    {
                        Name = "Masoor Dal (Red Lentil Curry)",
                        IsSystem = true,
                        CaloriesPer100g = 115,
                        ProteinGramsPer100g = 9.0m,
                        CarbsGramsPer100g = 18.2m,
                        FatGramsPer100g = 0.8m,
                        FiberGramsPer100g = 7.9m,
                        SodiumMg = 280,
                        Tags = new[] { "indian", "dal", "lentils", "protein", "vegetarian" }
                    },
                    new Food
                    {
                        Name = "Palak Paneer (Spinach with Cottage Cheese)",
                        IsSystem = true,
                        CaloriesPer100g = 118,
                        ProteinGramsPer100g = 7.5m,
                        CarbsGramsPer100g = 5.8m,
                        FatGramsPer100g = 8.2m,
                        FiberGramsPer100g = 2.8m,
                        SodiumMg = 380,
                        Tags = new[] { "indian", "curry", "spinach", "paneer", "vegetarian" }
                    },
                    new Food
                    {
                        Name = "Samosa (Fried Pastry)",
                        IsSystem = true,
                        CaloriesPer100g = 308,
                        ProteinGramsPer100g = 6.2m,
                        CarbsGramsPer100g = 32.0m,
                        FatGramsPer100g = 17.5m,
                        FiberGramsPer100g = 3.2m,
                        SodiumMg = 420,
                        Tags = new[] { "indian", "snack", "fried", "pastry", "street_food" }
                    },
                    new Food
                    {
                        Name = "Biryani (Spiced Rice)",
                        IsSystem = true,
                        CaloriesPer100g = 195,
                        ProteinGramsPer100g = 8.5m,
                        CarbsGramsPer100g = 28.5m,
                        FatGramsPer100g = 6.2m,
                        FiberGramsPer100g = 1.8m,
                        SodiumMg = 450,
                        Tags = new[] { "indian", "rice", "spiced", "meat", "festive" }
                    },
                    new Food
                    {
                        Name = "Lassi (Yogurt Drink)",
                        IsSystem = true,
                        CaloriesPer100g = 58,
                        ProteinGramsPer100g = 3.2m,
                        CarbsGramsPer100g = 7.8m,
                        FatGramsPer100g = 1.5m,
                        FiberGramsPer100g = 0.0m,
                        SodiumMg = 45,
                        Tags = new[] { "indian", "drink", "yogurt", "dairy", "refreshing" }
                    },

                    // Common South Asian Ingredients
                    new Food
                    {
                        Name = "Mustard Oil",
                        IsSystem = true,
                        CaloriesPer100g = 884,
                        ProteinGramsPer100g = 0.0m,
                        CarbsGramsPer100g = 0.0m,
                        FatGramsPer100g = 100.0m,
                        FiberGramsPer100g = 0.0m,
                        SodiumMg = 0,
                        Tags = new[] { "oil", "cooking", "mustard", "traditional" }
                    },
                    new Food
                    {
                        Name = "Ghee (Clarified Butter)",
                        IsSystem = true,
                        CaloriesPer100g = 876,
                        ProteinGramsPer100g = 0.3m,
                        CarbsGramsPer100g = 0.1m,
                        FatGramsPer100g = 99.5m,
                        FiberGramsPer100g = 0.0m,
                        SodiumMg = 2,
                        Tags = new[] { "ghee", "butter", "cooking", "traditional", "dairy" }
                    },
                    new Food
                    {
                        Name = "Turmeric Powder",
                        IsSystem = true,
                        CaloriesPer100g = 312,
                        ProteinGramsPer100g = 9.7m,
                        CarbsGramsPer100g = 67.1m,
                        FatGramsPer100g = 3.2m,
                        FiberGramsPer100g = 22.7m,
                        SodiumMg = 27,
                        Tags = new[] { "spice", "turmeric", "antioxidant", "medicinal" }
                    },

                    // Common Global Foods
                    new Food
                    {
                        Name = "Chicken Breast (Grilled)",
                        IsSystem = true,
                        CaloriesPer100g = 165,
                        ProteinGramsPer100g = 31.0m,
                        CarbsGramsPer100g = 0.0m,
                        FatGramsPer100g = 3.6m,
                        FiberGramsPer100g = 0.0m,
                        SodiumMg = 74,
                        Tags = new[] { "protein", "chicken", "lean", "meat" }
                    },
                    new Food
                    {
                        Name = "Brown Rice (Cooked)",
                        IsSystem = true,
                        CaloriesPer100g = 111,
                        ProteinGramsPer100g = 2.6m,
                        CarbsGramsPer100g = 23.0m,
                        FatGramsPer100g = 0.9m,
                        FiberGramsPer100g = 1.8m,
                        SodiumMg = 5,
                        Tags = new[] { "rice", "whole_grain", "carbs", "fiber" }
                    },
                    new Food
                    {
                        Name = "Eggs (Boiled)",
                        IsSystem = true,
                        CaloriesPer100g = 155,
                        ProteinGramsPer100g = 13.0m,
                        CarbsGramsPer100g = 1.1m,
                        FatGramsPer100g = 10.6m,
                        FiberGramsPer100g = 0.0m,
                        SodiumMg = 124,
                        Tags = new[] { "protein", "eggs", "breakfast", "complete_protein" }
                    },
                    new Food
                    {
                        Name = "Greek Yogurt (Plain)",
                        IsSystem = true,
                        CaloriesPer100g = 73,
                        ProteinGramsPer100g = 10.0m,
                        CarbsGramsPer100g = 3.6m,
                        FatGramsPer100g = 2.0m,
                        FiberGramsPer100g = 0.0m,
                        SodiumMg = 36,
                        Tags = new[] { "dairy", "protein", "yogurt", "probiotics" }
                    },
                    new Food
                    {
                        Name = "Almonds",
                        IsSystem = true,
                        CaloriesPer100g = 579,
                        ProteinGramsPer100g = 21.2m,
                        CarbsGramsPer100g = 21.6m,
                        FatGramsPer100g = 49.9m,
                        FiberGramsPer100g = 12.5m,
                        SodiumMg = 1,
                        Tags = new[] { "nuts", "protein", "healthy_fats", "snack" }
                    },
                    new Food
                    {
                        Name = "Banana",
                        IsSystem = true,
                        CaloriesPer100g = 89,
                        ProteinGramsPer100g = 1.1m,
                        CarbsGramsPer100g = 22.8m,
                        FatGramsPer100g = 0.3m,
                        FiberGramsPer100g = 2.6m,
                        SugarGramsPer100g = 12.2m,
                        SodiumMg = 1,
                        Tags = new[] { "fruit", "potassium", "natural_sugar", "snack" }
                    },
                    new Food
                    {
                        Name = "Spinach (Raw)",
                        IsSystem = true,
                        CaloriesPer100g = 23,
                        ProteinGramsPer100g = 2.9m,
                        CarbsGramsPer100g = 3.6m,
                        FatGramsPer100g = 0.4m,
                        FiberGramsPer100g = 2.2m,
                        SodiumMg = 79,
                        Tags = new[] { "vegetables", "leafy", "iron", "low_calorie" }
                    },
                    new Food
                    {
                        Name = "Sweet Potato (Baked)",
                        IsSystem = true,
                        CaloriesPer100g = 90,
                        ProteinGramsPer100g = 2.0m,
                        CarbsGramsPer100g = 20.7m,
                        FatGramsPer100g = 0.2m,
                        FiberGramsPer100g = 3.3m,
                        SugarGramsPer100g = 6.8m,
                        SodiumMg = 6,
                        Tags = new[] { "vegetables", "root", "complex_carbs", "beta_carotene" }
                    },
                    new Food
                    {
                        Name = "Salmon (Grilled)",
                        IsSystem = true,
                        CaloriesPer100g = 231,
                        ProteinGramsPer100g = 25.4m,
                        CarbsGramsPer100g = 0.0m,
                        FatGramsPer100g = 13.4m,
                        FiberGramsPer100g = 0.0m,
                        SodiumMg = 59,
                        Tags = new[] { "fish", "protein", "omega3", "healthy_fats" }
                    },
                    new Food
                    {
                        Name = "Oatmeal (Cooked)",
                        IsSystem = true,
                        CaloriesPer100g = 68,
                        ProteinGramsPer100g = 2.4m,
                        CarbsGramsPer100g = 12.0m,
                        FatGramsPer100g = 1.4m,
                        FiberGramsPer100g = 1.7m,
                        SodiumMg = 49,
                        Tags = new[] { "oats", "breakfast", "fiber", "whole_grain" }
                    },
                    new Food
                    {
                        Name = "Quinoa (Cooked)",
                        IsSystem = true,
                        CaloriesPer100g = 120,
                        ProteinGramsPer100g = 4.4m,
                        CarbsGramsPer100g = 21.3m,
                        FatGramsPer100g = 1.9m,
                        FiberGramsPer100g = 2.8m,
                        SodiumMg = 7,
                        Tags = new[] { "quinoa", "complete_protein", "gluten_free", "superfood" }
                    }
                };

                await context.Foods.AddRangeAsync(systemFoods);
                await context.SaveChangesAsync();
            }

            // Seed exercises if they don't exist
            if (!context.Exercises.Any())
            {
                var exercises = new[]
                {
                    new Exercise { Name = "Bench Press", Category = "Strength", MuscleGroups = "Chest, Shoulders, Triceps" },
                    new Exercise { Name = "Squat", Category = "Strength", MuscleGroups = "Quads, Hamstrings, Glutes" },
                    new Exercise { Name = "Deadlift", Category = "Strength", MuscleGroups = "Back, Hamstrings, Glutes" },
                    new Exercise { Name = "Overhead Press", Category = "Strength", MuscleGroups = "Shoulders, Triceps" },
                    new Exercise { Name = "Pull-up", Category = "Strength", MuscleGroups = "Back, Biceps" },
                    new Exercise { Name = "Bent-over Row", Category = "Strength", MuscleGroups = "Back, Biceps" },
                    new Exercise { Name = "Bicep Curl", Category = "Strength", MuscleGroups = "Biceps" },
                    new Exercise { Name = "Tricep Extension", Category = "Strength", MuscleGroups = "Triceps" },
                    new Exercise { Name = "Leg Press", Category = "Strength", MuscleGroups = "Quads, Hamstrings, Glutes" },
                    new Exercise { Name = "Leg Curl", Category = "Strength", MuscleGroups = "Hamstrings" },
                    new Exercise { Name = "Leg Extension", Category = "Strength", MuscleGroups = "Quads" },
                    new Exercise { Name = "Calf Raise", Category = "Strength", MuscleGroups = "Calves" },
                    new Exercise { Name = "Lat Pulldown", Category = "Strength", MuscleGroups = "Back, Biceps" },
                    new Exercise { Name = "Seated Cable Row", Category = "Strength", MuscleGroups = "Back, Biceps" },
                    new Exercise { Name = "Dumbbell Fly", Category = "Strength", MuscleGroups = "Chest" },
                    new Exercise { Name = "Lateral Raise", Category = "Strength", MuscleGroups = "Shoulders" },
                    new Exercise { Name = "Plank", Category = "Core", MuscleGroups = "Abs" },
                    new Exercise { Name = "Crunches", Category = "Core", MuscleGroups = "Abs" },
                    new Exercise { Name = "Running", Category = "Cardio", MuscleGroups = "Full Body" },
                    new Exercise { Name = "Cycling", Category = "Cardio", MuscleGroups = "Full Body" }
                };
                await context.Exercises.AddRangeAsync(exercises);
                await context.SaveChangesAsync();
            }

            // Seed weekly routine for the test user if it doesn't exist
            if (!await context.WeeklyRoutines.AnyAsync(w => w.UserId == testUser.Id))
            {
                var weeklyRoutine = new WeeklyRoutine
                {
                    UserId = testUser.Id,
                    Name = "Test User's Weekly Routine",
                    Description = "A sample weekly routine for the test user.",
                    IsActive = true
                };
                await context.WeeklyRoutines.AddAsync(weeklyRoutine);
                await context.SaveChangesAsync();

                // Seed day routines
                var dayRoutinesData = new[]
                {
                    new DayRoutine { WeeklyRoutineId = weeklyRoutine.Id, DayOfWeek = 1, DayName = "Monday", IsRestDay = false },
                    new DayRoutine { WeeklyRoutineId = weeklyRoutine.Id, DayOfWeek = 2, DayName = "Tuesday", IsRestDay = false },
                    new DayRoutine { WeeklyRoutineId = weeklyRoutine.Id, DayOfWeek = 3, DayName = "Wednesday", IsRestDay = true },
                    new DayRoutine { WeeklyRoutineId = weeklyRoutine.Id, DayOfWeek = 4, DayName = "Thursday", IsRestDay = false },
                    new DayRoutine { WeeklyRoutineId = weeklyRoutine.Id, DayOfWeek = 5, DayName = "Friday", IsRestDay = false },
                    new DayRoutine { WeeklyRoutineId = weeklyRoutine.Id, DayOfWeek = 6, DayName = "Saturday", IsRestDay = true },
                    new DayRoutine { WeeklyRoutineId = weeklyRoutine.Id, DayOfWeek = 0, DayName = "Sunday", IsRestDay = true }
                };
                await context.DayRoutines.AddRangeAsync(dayRoutinesData);
                await context.SaveChangesAsync();
                
                var savedDayRoutines = await context.DayRoutines
                    .Where(dr => dr.WeeklyRoutineId == weeklyRoutine.Id)
                    .ToListAsync();

                // Seed day routine body parts
                var mondayRoutine = savedDayRoutines.First(d => d.DayName == "Monday");
                var tuesdayRoutine = savedDayRoutines.First(d => d.DayName == "Tuesday");
                var thursdayRoutine = savedDayRoutines.First(d => d.DayName == "Thursday");
                var fridayRoutine = savedDayRoutines.First(d => d.DayName == "Friday");

                var bodyParts = new[]
                {
                    new DayRoutineBodyPart { DayRoutineId = mondayRoutine.Id, BodyPart = "Chest" },
                    new DayRoutineBodyPart { DayRoutineId = mondayRoutine.Id, BodyPart = "Triceps" },
                    new DayRoutineBodyPart { DayRoutineId = tuesdayRoutine.Id, BodyPart = "Back" },
                    new DayRoutineBodyPart { DayRoutineId = tuesdayRoutine.Id, BodyPart = "Biceps" },
                    new DayRoutineBodyPart { DayRoutineId = thursdayRoutine.Id, BodyPart = "Quads" },
                    new DayRoutineBodyPart { DayRoutineId = thursdayRoutine.Id, BodyPart = "Hamstrings" },
                    new DayRoutineBodyPart { DayRoutineId = thursdayRoutine.Id, BodyPart = "Glutes" },
                    new DayRoutineBodyPart { DayRoutineId = fridayRoutine.Id, BodyPart = "Shoulders" },
                    new DayRoutineBodyPart { DayRoutineId = fridayRoutine.Id, BodyPart = "Abs" }
                };
                await context.DayRoutineBodyParts.AddRangeAsync(bodyParts);
                await context.SaveChangesAsync();

                // Seed DayRoutineExercises
                var allExercises = await context.Exercises.ToListAsync();
                foreach (var dayRoutine in savedDayRoutines)
                {
                    if (!dayRoutine.IsRestDay)
                    {
                        var bodyPartsForDay = await context.DayRoutineBodyParts
                            .Where(bp => bp.DayRoutineId == dayRoutine.Id)
                            .Select(bp => bp.BodyPart)
                            .ToListAsync();

                        var exercisesForDay = allExercises
                            .Where(e => bodyPartsForDay.Any(bp => e.MuscleGroups.Contains(bp)))
                            .ToList();

                        foreach (var exercise in exercisesForDay)
                        {
                            var dayRoutineExercise = new DayRoutineExercise
                            {
                                DayRoutineId = dayRoutine.Id,
                                ExerciseId = exercise.Id,
                                Sets = 3,
                                Reps = 10,
                                Weight = 50
                            };
                            await context.DayRoutineExercises.AddAsync(dayRoutineExercise);
                        }
                    }
                }
                await context.SaveChangesAsync();

                // Seed workout logs for the last 30 days
                var exercises = await context.Exercises.ToListAsync();
                var startDate = DateTime.UtcNow.AddDays(-30);
                for (int i = 0; i < 30; i++)
                {
                    var currentDate = startDate.AddDays(i);
                    var dayOfWeek = (int)currentDate.DayOfWeek;

                    var dayRoutine = savedDayRoutines.FirstOrDefault(d => d.DayOfWeek == dayOfWeek && !d.IsRestDay);
                    if (dayRoutine != null)
                    {
                        var workout = new Workout
                        {
                            UserId = testUser.Id,
                            Date = currentDate,
                            Notes = $"Workout for {currentDate:yyyy-MM-dd}"
                        };
                        await context.Workouts.AddAsync(workout);
                        await context.SaveChangesAsync(); 

                        var bodyPartsForDay = await context.DayRoutineBodyParts
                            .Where(bp => bp.DayRoutineId == dayRoutine.Id)
                            .Select(bp => bp.BodyPart)
                            .ToListAsync();

                        var exercisesForDay = exercises
                            .Where(e => bodyPartsForDay.Any(bp => e.MuscleGroups.Contains(bp)))
                            .ToList();

                        var workoutExercises = new List<WorkoutExercise>();
                        foreach (var exercise in exercisesForDay)
                        {
                            workoutExercises.Add(new WorkoutExercise
                            {
                                WorkoutId = workout.Id,
                                ExerciseId = exercise.Id,
                                Notes = "Gradual progression"
                            });
                        }
                        await context.WorkoutExercises.AddRangeAsync(workoutExercises);
                        await context.SaveChangesAsync(); 

                        var allSets = new List<WorkoutSet>();
                        foreach (var we in workoutExercises)
                        {
                            for (int j = 1; j <= 3; j++)
                            {
                                allSets.Add(new WorkoutSet
                                {
                                    WorkoutExerciseId = we.Id,
                                    SetNumber = j,
                                    Reps = 8 + (i / 10), 
                                    Weight = 50 + (i * 0.5f) 
                                });
                            }
                        }
                        await context.WorkoutSets.AddRangeAsync(allSets);
                        await context.SaveChangesAsync();
                    }
                }
            }
        }
    }
}
