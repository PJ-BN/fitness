using Fitness.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Fitness.Data
{
    public class ApplicationDbContext : IdentityDbContext<User>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<Exercise> Exercises { get; set; }
        public DbSet<Workout> Workouts { get; set; }
        public DbSet<WorkoutExercise> WorkoutExercises { get; set; }
        public DbSet<Goal> Goals { get; set; }
        public DbSet<UserMetric> UserMetrics { get; set; }
        public DbSet<WeeklyRoutine> WeeklyRoutines { get; set; }
        public DbSet<DayRoutine> DayRoutines { get; set; }
        public DbSet<DayRoutineBodyPart> DayRoutineBodyParts { get; set; }
        public DbSet<DayRoutineExercise> DayRoutineExercises { get; set; }
        public DbSet<WorkoutSet> WorkoutSets { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }
    }
}