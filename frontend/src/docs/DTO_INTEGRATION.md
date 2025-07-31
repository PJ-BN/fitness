# Backend DTO Integration Summary

## Overview

Your backend DTOs have been successfully integrated into the frontend. Here's how each DTO is used:

## DTO Mappings

### 1. WeeklyRoutineDto
**Backend:**
```csharp
public class WeeklyRoutineDto
{
    [Required] public string UserId { get; set; }
    [Required] public string Name { get; set; }
    public string? Description { get; set; }
    public bool IsActive { get; set; }
}
```

**Frontend TypeScript:**
```typescript
export interface WeeklyRoutineDto {
  userId: string;
  name: string;
  description?: string;
  isActive: boolean;
}

// Extended version with ID for API responses
export interface WeeklyRoutine extends WeeklyRoutineDto {
  id: number;
  createdAt: string;
  updatedAt: string;
  dayRoutines?: DayRoutine[];
}
```

**Usage Example:**
```typescript
const createRoutine = async () => {
  const routineDto: WeeklyRoutineDto = {
    userId: userId,
    name: 'My Workout Plan',
    description: 'Full body routine',
    isActive: true
  };
  
  const newRoutine = await weeklyRoutines.createRoutine(routineDto);
};
```

### 2. DayRoutineDto
**Backend:**
```csharp
public class DayRoutineDto
{
    [Required] public int WeeklyRoutineId { get; set; }
    [Required] public int DayOfWeek { get; set; }
    [Required] public string DayName { get; set; }
    public bool IsRestDay { get; set; }
}
```

**Frontend TypeScript:**
```typescript
export interface DayRoutineDto {
  weeklyRoutineId: number;
  dayOfWeek: number;
  dayName: string;
  isRestDay: boolean;
}

// Extended version
export interface DayRoutine extends DayRoutineDto {
  id: number;
  exercises?: DayRoutineExercise[];
  bodyParts?: DayRoutineBodyPartDto[];
}
```

**Usage Example:**
```typescript
const setupMondayWorkout = async (routineId: number) => {
  const mondayDto: DayRoutineDto = {
    weeklyRoutineId: routineId,
    dayOfWeek: 1, // Monday
    dayName: 'Monday',
    isRestDay: false
  };
  
  await weeklyRoutines.updateDayRoutine(routineId, 1, mondayDto);
};
```

### 3. DayRoutineExerciseDto
**Backend:**
```csharp
public class DayRoutineExerciseDto
{
    [Required] public int DayRoutineId { get; set; }
    [Required] public int ExerciseId { get; set; }
    public int Sets { get; set; }
    public int Reps { get; set; }
    public float? Duration { get; set; }
    public float? Weight { get; set; }
    public string? Notes { get; set; }
}
```

**Frontend TypeScript:**
```typescript
export interface DayRoutineExerciseDto {
  dayRoutineId: number;
  exerciseId: number;
  sets: number;
  reps: number;
  duration?: number;
  weight?: number;
  notes?: string;
}
```

**Usage Example:**
```typescript
const addExerciseToDay = async (dayId: string, exerciseId: number) => {
  const exerciseDto: DayRoutineExerciseDto = {
    dayRoutineId: parseInt(dayId),
    exerciseId: exerciseId,
    sets: 3,
    reps: 12,
    weight: 50.5,
    notes: 'Focus on form'
  };
  
  await dayRoutine.addExercise(dayId, exerciseDto);
};
```

### 4. DayRoutineBodyPartDto
**Backend:**
```csharp
public class DayRoutineBodyPartDto
{
    [Required] public int DayRoutineId { get; set; }
    [Required] public string BodyPart { get; set; }
}
```

**Frontend TypeScript:**
```typescript
export interface DayRoutineBodyPartDto {
  dayRoutineId: number;
  bodyPart: string;
}
```

**Usage Example:**
```typescript
const addBodyPartToDay = async (dayId: string, bodyPart: string) => {
  const bodyPartDto: DayRoutineBodyPartDto = {
    dayRoutineId: parseInt(dayId),
    bodyPart: bodyPart
  };
  
  await dayRoutine.addBodyPart(dayId, bodyPart);
};
```

### 5. WorkoutDto
**Backend:**
```csharp
public class WorkoutDto
{
    [Required] public string UserId { get; set; }
    public DateTime Date { get; set; }
    [Column(TypeName = "text")] public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
```

**Frontend TypeScript:**
```typescript
export interface WorkoutDto {
  userId: string;
  date: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
```

**Usage Example:**
```typescript
const createWorkout = async () => {
  const workoutDto: WorkoutDto = {
    userId: userId,
    date: new Date().toISOString(),
    notes: 'Great workout today!',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  await apiClient.workouts.create(workoutDto);
};
```

### 6. WorkoutExerciseDto
**Backend:**
```csharp
public class WorkoutExerciseDto
{
    [Required] public int WorkoutId { get; set; }
    [Required] public int ExerciseId { get; set; }
    public int Sets { get; set; }
    public int Reps { get; set; }
    public float? Weight { get; set; }
    public float? Duration { get; set; }
    [Column(TypeName = "text")] public string? Notes { get; set; }
}
```

**Frontend TypeScript:**
```typescript
export interface WorkoutExerciseDto {
  workoutId: number;
  exerciseId: number;
  sets: number;
  reps: number;
  weight?: number;
  duration?: number;
  notes?: string;
}
```

## API Response Structure

Your backend uses this response structure:

```csharp
public class ApiResponse<T>
{
    public bool Success { get; set; }
    public string Message { get; set; }
    public T Data { get; set; }
    public List<string> Errors { get; set; }
}
```

Which is handled in the frontend as:

```typescript
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors: string[];
}
```

## How to Use in Your Routine Page

### 1. Import the updated hooks:
```typescript
import useWeeklyRoutines from '../hooks/useWeeklyRoutines';
import useDayRoutine from '../hooks/useDayRoutine';
```

### 2. Create a new routine:
```typescript
const createNewRoutine = async () => {
  const routineDto: WeeklyRoutineDto = {
    userId: userId,
    name: 'My New Routine',
    description: 'Custom workout plan',
    isActive: true
  };
  
  const newRoutine = await weeklyRoutines.createRoutine(routineDto);
  if (newRoutine) {
    console.log('Created routine with ID:', newRoutine.id);
  }
};
```

### 3. Setup day routines:
```typescript
const setupWeeklySchedule = async (routineId: number) => {
  // Setup Monday
  const mondayDto: DayRoutineDto = {
    weeklyRoutineId: routineId,
    dayOfWeek: 1,
    dayName: 'Monday',
    isRestDay: false
  };
  
  const mondayRoutine = await weeklyRoutines.updateDayRoutine(routineId, 1, mondayDto);
  
  // Add exercises to Monday
  if (mondayRoutine) {
    const exerciseDto: DayRoutineExerciseDto = {
      dayRoutineId: mondayRoutine.id,
      exerciseId: 1, // Push-ups
      sets: 3,
      reps: 12,
      weight: 0, // Bodyweight
      notes: 'Focus on form'
    };
    
    await dayRoutine.addExercise(mondayRoutine.id.toString(), exerciseDto);
  }
};
```

### 4. Complete workflow:
```typescript
const createCompleteRoutine = async () => {
  // 1. Create weekly routine
  const routine = await createNewRoutine();
  
  if (routine) {
    // 2. Setup each day
    await setupWeeklySchedule(routine.id);
    
    // 3. Add body parts and exercises as needed
    // This will now properly use your DTO structure
  }
};
```

## Key Changes Made

1. **Updated Type Definitions**: All interfaces now match your DTO structure exactly
2. **ID Types**: Changed from string to number to match your backend
3. **Proper DTO Usage**: All API calls now send data in the exact format your backend expects
4. **Response Handling**: Properly handles your ApiResponse<T> structure
5. **Error Handling**: Integrated with your backend error response format

The integration is now complete and your routine page can use all the API endpoints with the proper DTO structure!
