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

        // New nutrition-related entities
        public DbSet<Food> Foods { get; set; }
        public DbSet<IntakeEntry> IntakeEntries { get; set; }
        public DbSet<DailySummary> DailySummaries { get; set; }
        public DbSet<AuditLog> AuditLogs { get; set; }
        public DbSet<GoalHistory> GoalHistories { get; set; }

        public override int SaveChanges()
        {
            return base.SaveChanges();
        }

        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            return base.SaveChangesAsync(cancellationToken);
        }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure composite key for DailySummary
            modelBuilder.Entity<DailySummary>()
                .HasKey(ds => new { ds.UserId, ds.LocalDate });

            // Configure Food indexes and constraints
            modelBuilder.Entity<Food>()
                .HasIndex(f => new { f.IsSystem, f.Name });


            // Configure Food name uniqueness per owner scope
            modelBuilder.Entity<Food>()
                .HasIndex(f => new { f.OwnerUserId, f.Name })
                .IsUnique()
                .HasFilter("\"OwnerUserId\" IS NOT NULL");

            // System foods should have unique names globally
            modelBuilder.Entity<Food>()
                .HasIndex(f => f.Name)
                .IsUnique()
                .HasFilter("\"IsSystem\" = true");


            // Configure relationships
            modelBuilder.Entity<Food>()
                .HasOne(f => f.OwnerUser)
                .WithMany()
                .HasForeignKey(f => f.OwnerUserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<IntakeEntry>()
                .HasOne(ie => ie.User)
                .WithMany()
                .HasForeignKey(ie => ie.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<IntakeEntry>()
                .HasOne(ie => ie.Food)
                .WithMany(f => f.IntakeEntries)
                .HasForeignKey(ie => ie.FoodId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<DailySummary>()
                .HasOne(ds => ds.User)
                .WithMany()
                .HasForeignKey(ds => ds.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<AuditLog>()
                .HasOne(al => al.User)
                .WithMany()
                .HasForeignKey(al => al.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<GoalHistory>()
                .HasOne(gh => gh.User)
                .WithMany()
                .HasForeignKey(gh => gh.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}