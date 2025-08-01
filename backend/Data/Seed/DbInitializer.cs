
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
