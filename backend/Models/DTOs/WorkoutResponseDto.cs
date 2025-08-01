using Fitness.Models.DTOs;

public class WorkoutResponseDto
{
    public int Id { get; set; }
    public string UserId { get; set; }
    public DateTime Date { get; set; }
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public ICollection<WorkoutExerciseResponseDto> WorkoutExercises { get; set; }
}

public class WorkoutExerciseResponseDto
{
    public int Id { get; set; }
    public int WorkoutId { get; set; }
    public int ExerciseId { get; set; }
    public string? Notes { get; set; }
    public string ExerciseName { get; set; } // Instead of full Exercise object
    public ICollection<WorkoutSetDto> Sets { get; set; }
    // Notice: No Workout property to break the cycle
}