import React, { useState, useEffect } from 'react';
import useWeeklyRoutines from '../hooks/useWeeklyRoutines';
import useDayRoutine from '../hooks/useDayRoutine';
import useFetchExercises from '../hooks/useFetchExercises';
import { useUser } from '../contexts/UserContext';
import type { 
  WeeklyRoutine, 
  DayRoutine, 
  WeeklyRoutineDto,
  DayRoutineDto,
  DayRoutineExerciseDto,
  DayRoutineBodyPartDto
} from '../types/routine';
import { DAYS_OF_WEEK } from '../types/routine';

interface DTOExampleProps {
  className?: string;
}

const DTOExample: React.FC<DTOExampleProps> = ({ className }) => {
  const { userId, isAuthenticated } = useUser();
  const weeklyRoutines = useWeeklyRoutines();
  const dayRoutine = useDayRoutine();
  const { exercises } = useFetchExercises();
  
  const [routines, setRoutines] = useState<WeeklyRoutine[]>([]);
  const [selectedRoutine, setSelectedRoutine] = useState<WeeklyRoutine | null>(null);
  const [apiLogs, setApiLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setApiLogs(prev => [`${new Date().toLocaleTimeString()}: ${message}`, ...prev.slice(0, 9)]);
  };

  useEffect(() => {
    const loadRoutines = async () => {
      if (isAuthenticated && userId) {
        try {
          addLog('Loading weekly routines...');
          const allRoutines = await weeklyRoutines.getAllRoutines();
          const userRoutines = allRoutines.filter(routine => routine.userId === userId);
          setRoutines(userRoutines);
          addLog(`Loaded ${userRoutines.length} routines`);
        } catch (error) {
          addLog(`Error loading routines: ${error}`);
        }
      }
    };

    loadRoutines();
  }, [isAuthenticated, userId]);

  const createExampleRoutine = async () => {
    if (!userId) return;

    try {
      addLog('Creating new routine with DTO...');
      
      // Create using WeeklyRoutineDto structure
      const routineDto: Partial<WeeklyRoutineDto> = {
        name: 'DTO Example Routine',
        description: 'Created using proper DTO structure',
        userId: userId,
        isActive: true
      };

      const newRoutine = await weeklyRoutines.createRoutine(routineDto);
      if (newRoutine) {
        setRoutines(prev => [...prev, newRoutine]);
        setSelectedRoutine(newRoutine);
        addLog(`Created routine with ID: ${newRoutine.id}`);
      }
    } catch (error) {
      addLog(`Error creating routine: ${error}`);
    }
  };

  const setupMondayWorkout = async () => {
    if (!selectedRoutine) return;

    try {
      addLog('Setting up Monday workout...');
      
      // Create DayRoutineDto
      const mondayDto: Partial<DayRoutineDto> = {
        weeklyRoutineId: selectedRoutine.id,
        dayOfWeek: 1, // Monday
        dayName: 'Monday',
        isRestDay: false
      };

      const mondayRoutine = await weeklyRoutines.updateDayRoutine(
        selectedRoutine.id, 
        1, 
        mondayDto
      );

      if (mondayRoutine) {
        addLog(`Monday routine created with ID: ${mondayRoutine.id}`);
        
        // Add body parts
        await addBodyPartToDay(mondayRoutine.id.toString(), 'Chest');
        await addBodyPartToDay(mondayRoutine.id.toString(), 'Triceps');
        
        // Add exercises
        if (exercises.length > 0) {
          await addExerciseToDay(mondayRoutine.id.toString(), exercises[0]);
        }
      }
    } catch (error) {
      addLog(`Error setting up Monday: ${error}`);
    }
  };

  const addBodyPartToDay = async (dayRoutineId: string, bodyPartName: string) => {
    try {
      addLog(`Adding body part: ${bodyPartName}`);
      const bodyPart = await dayRoutine.addBodyPart(dayRoutineId, bodyPartName);
      if (bodyPart) {
        addLog(`Body part added with ID: ${bodyPart.id}`);
      }
    } catch (error) {
      addLog(`Error adding body part: ${error}`);
    }
  };

  const addExerciseToDay = async (dayRoutineId: string, exercise: any) => {
    try {
      addLog(`Adding exercise: ${exercise.name}`);
      
      const exerciseData = {
        exerciseId: exercise.id,
        exercise: exercise,
        sets: 3,
        reps: 12,
        weight: 50
      };

      const addedExercise = await dayRoutine.addExercise(dayRoutineId, exerciseData);
      if (addedExercise) {
        addLog(`Exercise added with ID: ${addedExercise.id}`);
      }
    } catch (error) {
      addLog(`Error adding exercise: ${error}`);
    }
  };

  const demonstrateWorkoutAPIs = async () => {
    if (!userId) return;

    try {
      addLog('Demonstrating Workout APIs...');
      
      // Create workout using WorkoutDto
      const workoutData = {
        userId: userId,
        date: new Date().toISOString(),
        notes: 'Example workout created via API',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const workoutResponse = await fetch(`https://localhost:7071/api/workouts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${document.cookie.split('token=')[1]?.split(';')[0]}`
        },
        body: JSON.stringify(workoutData)
      });

      const workoutResult = await workoutResponse.json();
      if (workoutResult.success) {
        addLog(`Workout created with ID: ${workoutResult.data.id}`);
        
        // Add exercise to workout using WorkoutExerciseDto
        if (exercises.length > 0) {
          const workoutExerciseData = {
            workoutId: workoutResult.data.id,
            exerciseId: exercises[0].id,
            sets: 3,
            reps: 10,
            weight: 60,
            notes: 'First set of the workout'
          };

          const exerciseResponse = await fetch(`https://localhost:7071/api/workoutexercises`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${document.cookie.split('token=')[1]?.split(';')[0]}`
            },
            body: JSON.stringify(workoutExerciseData)
          });

          const exerciseResult = await exerciseResponse.json();
          if (exerciseResult.success) {
            addLog(`Workout exercise added with ID: ${exerciseResult.data.id}`);
          }
        }
      }
    } catch (error) {
      addLog(`Error with workout APIs: ${error}`);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className={className}>
        <p>Please log in to see DTO examples.</p>
      </div>
    );
  }

  return (
    <div className={className} style={{ padding: '20px' }}>
      <h2>DTO Integration Example</h2>
      <p>This component demonstrates proper usage of all your backend DTOs.</p>

      <div style={{ marginBottom: '20px' }}>
        <h3>Weekly Routines</h3>
        <button 
          onClick={createExampleRoutine}
          style={{ marginRight: '10px', padding: '8px 16px' }}
        >
          Create Routine (WeeklyRoutineDto)
        </button>
        
        {selectedRoutine && (
          <>
            <button 
              onClick={setupMondayWorkout}
              style={{ marginRight: '10px', padding: '8px 16px' }}
            >
              Setup Monday (DayRoutineDto)
            </button>
            <button 
              onClick={demonstrateWorkoutAPIs}
              style={{ padding: '8px 16px' }}
            >
              Demo Workout APIs
            </button>
          </>
        )}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h4>Your Routines ({routines.length})</h4>
        {routines.map(routine => (
          <div 
            key={routine.id} 
            style={{ 
              padding: '10px', 
              border: selectedRoutine?.id === routine.id ? '2px solid blue' : '1px solid #ccc',
              marginBottom: '5px',
              cursor: 'pointer'
            }}
            onClick={() => setSelectedRoutine(routine)}
          >
            <strong>{routine.name}</strong> - ID: {routine.id}
            <br />
            <small>Active: {routine.isActive ? 'Yes' : 'No'}</small>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h4>DTO Structure Examples</h4>
        <details>
          <summary>WeeklyRoutineDto</summary>
          <pre style={{ backgroundColor: '#f5f5f5', padding: '10px' }}>
{`{
  "userId": "string",
  "name": "string", 
  "description": "string?",
  "isActive": boolean
}`}
          </pre>
        </details>
        
        <details>
          <summary>DayRoutineDto</summary>
          <pre style={{ backgroundColor: '#f5f5f5', padding: '10px' }}>
{`{
  "weeklyRoutineId": number,
  "dayOfWeek": number,
  "dayName": "string",
  "isRestDay": boolean
}`}
          </pre>
        </details>
        
        <details>
          <summary>DayRoutineExerciseDto</summary>
          <pre style={{ backgroundColor: '#f5f5f5', padding: '10px' }}>
{`{
  "dayRoutineId": number,
  "exerciseId": number,
  "sets": number,
  "reps": number,
  "duration": number?,
  "weight": number?,
  "notes": "string?"
}`}
          </pre>
        </details>

        <details>
          <summary>WorkoutDto</summary>
          <pre style={{ backgroundColor: '#f5f5f5', padding: '10px' }}>
{`{
  "userId": "string",
  "date": "DateTime",
  "notes": "string?",
  "createdAt": "DateTime",
  "updatedAt": "DateTime"
}`}
          </pre>
        </details>
      </div>

      <div>
        <h4>API Activity Log</h4>
        <div style={{ 
          backgroundColor: '#f8f9fa', 
          padding: '10px', 
          height: '200px', 
          overflowY: 'auto',
          fontFamily: 'monospace',
          fontSize: '12px'
        }}>
          {apiLogs.map((log, index) => (
            <div key={index}>{log}</div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h4>API Status</h4>
        <p>Weekly Routines: {weeklyRoutines.loading ? 'Loading...' : 'Ready'}</p>
        <p>Day Routines: {dayRoutine.loading ? 'Loading...' : 'Ready'}</p>
        <p>Exercises: {exercises.length} loaded</p>
        <p>User ID: {userId}</p>
      </div>
    </div>
  );
};

export default DTOExample;
