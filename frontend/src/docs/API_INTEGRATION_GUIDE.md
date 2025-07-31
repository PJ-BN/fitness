# Fitness App API Integration Guide

This guide demonstrates how to use all the available API endpoints in your fitness application's frontend.

## Available API Endpoints

### 1. Authentication Endpoints

#### Login Example
```typescript
import apiClient from '../apiclient/apiClient';

// Login user
const loginData = { email: 'user@example.com', password: 'password123' };
const response = await apiClient.auth.login(loginData);

if (response.success && 'data' in response) {
  console.log('Login successful:', response.data);
  // Token is automatically stored in cookies by the useLogin hook
}
```

#### Register Example
```typescript
const registerData = {
  email: 'newuser@example.com',
  password: 'password123',
  firstName: 'John',
  lastName: 'Doe'
};
const response = await apiClient.auth.register(registerData);
```

#### Update Profile Example
```typescript
const profileData = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com'
};
const response = await apiClient.auth.updateProfile(profileData);
```

### 2. Exercises Endpoints

#### Get All Exercises
```typescript
const response = await apiClient.exercises.getAll();
if (response.success && 'data' in response) {
  const exercises = response.data;
  console.log(`Loaded ${exercises.length} exercises`);
}
```

#### Create New Exercise
```typescript
const exerciseData = {
  name: 'Push-ups',
  description: 'Standard push-up exercise',
  category: 'Bodyweight',
  muscleGroups: 'Chest, Triceps, Shoulders',
  equipment: 'None'
};
const response = await apiClient.exercises.create(exerciseData);
```

#### Update Exercise
```typescript
const updatedData = {
  name: 'Modified Push-ups',
  description: 'Updated description'
};
const response = await apiClient.exercises.update('exercise-id', updatedData);
```

### 3. Weekly Routines Endpoints

#### Create Weekly Routine
```typescript
import useWeeklyRoutines from '../hooks/useWeeklyRoutines';

const weeklyRoutines = useWeeklyRoutines();

const routineData = {
  name: 'My Weekly Routine',
  description: 'Full body workout routine',
  userId: 'user-id',
  isActive: true
};

const newRoutine = await weeklyRoutines.createRoutine(routineData);
```

#### Get All Weekly Routines
```typescript
const allRoutines = await weeklyRoutines.getAllRoutines();
const userRoutines = allRoutines.filter(routine => routine.userId === currentUserId);
```

#### Update Weekly Routine
```typescript
const updates = {
  name: 'Updated Routine Name',
  description: 'Updated description',
  isActive: false
};
const updatedRoutine = await weeklyRoutines.updateRoutine('routine-id', updates);
```

### 4. Day Routines Endpoints

#### Get Day Routines for a Weekly Routine
```typescript
const dayRoutines = await weeklyRoutines.getDayRoutines('routine-id');
// Returns all 7 days of the week with their routines
```

#### Get Specific Day Routine
```typescript
const mondayRoutine = await weeklyRoutines.getDayRoutine('routine-id', 1); // Monday = 1
```

#### Update Day Routine
```typescript
const dayRoutineData = {
  dayOfWeek: 1, // Monday
  bodyParts: ['Chest', 'Triceps'],
  exercises: [
    {
      exerciseId: 1,
      sets: 3,
      reps: 12,
      exercise: { /* exercise object */ }
    }
  ],
  isRestDay: false
};

const updatedDay = await weeklyRoutines.updateDayRoutine('routine-id', 1, dayRoutineData);
```

### 5. Day Routine Body Parts and Exercises

#### Manage Body Parts for a Day
```typescript
import useDayRoutine from '../hooks/useDayRoutine';

const dayRoutine = useDayRoutine();

// Add body part to a day
const bodyPart = await dayRoutine.addBodyPart('day-id', 'Chest');

// Get all body parts for a day
const bodyParts = await dayRoutine.getBodyParts('day-id');

// Remove body part from a day
const success = await dayRoutine.removeBodyPart('day-id');
```

#### Manage Exercises for a Day
```typescript
// Add exercise to a day
const exerciseData = {
  exerciseId: 1,
  sets: 3,
  reps: 12,
  weight: 50,
  notes: 'Focus on form'
};
const addedExercise = await dayRoutine.addExercise('day-id', exerciseData);

// Update exercise in a day
const updates = { sets: 4, reps: 10 };
const updatedExercise = await dayRoutine.updateExercise('day-id', 'exercise-id', updates);

// Remove exercise from a day
const success = await dayRoutine.removeExercise('day-id', 'exercise-id');

// Get all exercises for a day
const exercises = await dayRoutine.getExercises('day-id');
```

### 6. Goals Endpoints

#### Create and Manage Goals
```typescript
// Create goal
const goalData = {
  title: 'Lose 10 pounds',
  description: 'Weight loss goal for next 3 months',
  targetValue: 10,
  currentValue: 0,
  unit: 'pounds',
  deadline: '2024-12-31',
  userId: 'user-id'
};
const response = await apiClient.goals.create(goalData);

// Get all goals
const goalsResponse = await apiClient.goals.getAll();

// Update goal
const updates = { currentValue: 3 };
await apiClient.goals.update('goal-id', updates);
```

### 7. User Metrics Endpoints

#### Track User Metrics
```typescript
// Create metric entry
const metricData = {
  userId: 'user-id',
  metricType: 'weight',
  value: 180,
  unit: 'lbs',
  recordedAt: new Date().toISOString()
};
const response = await apiClient.userMetrics.create(metricData);

// Get all metrics
const metricsResponse = await apiClient.userMetrics.getAll();
```

### 8. Workouts Endpoints

#### Create and Manage Workouts
```typescript
// Create workout
const workoutData = {
  name: 'Morning Cardio',
  description: 'High intensity cardio session',
  duration: 30,
  userId: 'user-id',
  date: new Date().toISOString()
};
const response = await apiClient.workouts.create(workoutData);

// Get all workouts
const workoutsResponse = await apiClient.workouts.getAll();
```

## Complete Integration Example

Here's a complete example of how to integrate multiple endpoints in a React component:

```typescript
import React, { useState, useEffect } from 'react';
import useWeeklyRoutines from '../hooks/useWeeklyRoutines';
import useDayRoutine from '../hooks/useDayRoutine';
import useFetchExercises from '../hooks/useFetchExercises';
import { useUser } from '../contexts/UserContext';

const ComprehensiveRoutineManager: React.FC = () => {
  const { userId, isAuthenticated } = useUser();
  const weeklyRoutines = useWeeklyRoutines();
  const dayRoutine = useDayRoutine();
  const { exercises } = useFetchExercises();
  
  const [routines, setRoutines] = useState<any[]>([]);
  const [selectedRoutine, setSelectedRoutine] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      if (isAuthenticated && userId) {
        // Load all routines
        const allRoutines = await weeklyRoutines.getAllRoutines();
        const userRoutines = allRoutines.filter(r => r.userId === userId);
        setRoutines(userRoutines);

        // Load exercises, goals, metrics, etc.
        // This demonstrates how to integrate multiple API calls
      }
    };

    loadData();
  }, [isAuthenticated, userId]);

  const createNewRoutine = async () => {
    const routineData = {
      name: 'New Routine',
      description: 'Created from comprehensive manager',
      userId: userId,
      isActive: true
    };

    const newRoutine = await weeklyRoutines.createRoutine(routineData);
    if (newRoutine) {
      setRoutines(prev => [...prev, newRoutine]);
    }
  };

  const setupMondayWorkout = async (routineId: string) => {
    // Update Monday (day 1) with chest and triceps workout
    const mondayData = {
      dayOfWeek: 1,
      bodyParts: ['Chest', 'Triceps'],
      exercises: exercises.slice(0, 3).map(ex => ({
        exerciseId: ex.id,
        exercise: ex,
        sets: 3,
        reps: 12
      })),
      isRestDay: false
    };

    await weeklyRoutines.updateDayRoutine(routineId, 1, mondayData);
  };

  return (
    <div>
      <h2>Comprehensive Routine Manager</h2>
      
      <button onClick={createNewRoutine}>
        Create New Routine
      </button>

      <div>
        <h3>Your Routines</h3>
        {routines.map(routine => (
          <div key={routine.id}>
            <h4>{routine.name}</h4>
            <button onClick={() => setupMondayWorkout(routine.id)}>
              Setup Monday Workout
            </button>
          </div>
        ))}
      </div>

      <div>
        <h3>API Status</h3>
        <p>Exercises: {exercises.length} loaded</p>
        <p>Weekly Routines: {weeklyRoutines.loading ? 'Loading...' : 'Ready'}</p>
        <p>Day Routines: {dayRoutine.loading ? 'Loading...' : 'Ready'}</p>
      </div>
    </div>
  );
};

export default ComprehensiveRoutineManager;
```

## Error Handling

All API calls should be wrapped in try-catch blocks:

```typescript
try {
  const response = await apiClient.exercises.getAll();
  if (response.success && 'data' in response) {
    // Success case
    console.log('Data:', response.data);
  } else {
    // API returned error
    console.error('API Error:', response.message);
  }
} catch (error) {
  // Network or other errors
  console.error('Network Error:', error);
}
```

## Authentication

Most endpoints require authentication. The token is automatically included in requests when stored in cookies:

```typescript
import Cookies from 'js-cookie';

// Token is automatically added to requests by the apiClient
// You can check if user is authenticated:
const token = Cookies.get('token');
const isAuthenticated = !!token;
```

This comprehensive integration allows you to use all the available API endpoints effectively in your routine page and throughout your fitness application.
