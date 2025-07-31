import { useState, useEffect } from 'react';
import type { LegacyWeeklyRoutine, LegacyDayRoutine } from '../types/routine';
import { DAYS_OF_WEEK } from '../types/routine';
import apiClient from '../apiclient/apiClient';
import { useUser } from '../contexts/UserContext';

interface UseRoutineResult {
  routine: LegacyWeeklyRoutine | null;
  userRoutines: any[] | null;
  loading: boolean;
  error: string | null;
  hasRoutines: boolean;
  saveRoutine: (routine: LegacyWeeklyRoutine) => Promise<void>;
  createNewRoutine: (name: string, description: string) => Promise<boolean>;
  loadRoutine: () => Promise<void>;
  loadUserRoutines: () => Promise<void>;
  selectRoutine: (routineId: number) => Promise<void>;
  updateDayRoutine: (dayOfWeek: number, dayRoutine: Partial<LegacyDayRoutine>) => Promise<void>;
}

// Helper function to load day routine details (body parts and exercises)
const loadDayRoutineDetails = async (dayRoutine: any, dayInfo: { id: number; name: string }, allExercises: any[]) => {
  try {
    const [bodyPartsResponse, exercisesResponse] = await Promise.all([
      apiClient.dayRoutines.getBodyParts(String(dayRoutine.id)),
      apiClient.dayRoutines.getExercises(String(dayRoutine.id))
    ]);

    const bodyParts = (bodyPartsResponse.success && 'data' in bodyPartsResponse && bodyPartsResponse.data) 
      ? bodyPartsResponse.data.map((bp: any) => typeof bp === 'string' ? bp : bp.bodyPart)
      : [];
    
    const dayExercises = (exercisesResponse.success && 'data' in exercisesResponse && exercisesResponse.data) ? exercisesResponse.data : [];
    
    const exercises = dayExercises.map((ex: any) => {
      const fullExercise = allExercises.find(e => e.id === ex.exerciseId);
      return {
        ...ex,
        exercise: fullExercise || null,
      };
    });

    return {
      dayOfWeek: dayInfo.id,
      dayName: dayInfo.name,
      bodyParts,
      exercises,
      isRestDay: dayRoutine.isRestDay || false
    };
  } catch (error) {
    console.warn(`Failed to load details for ${dayInfo.name}:`, error);
    return {
      dayOfWeek: dayInfo.id,
      dayName: dayInfo.name,
      bodyParts: [],
      exercises: [],
      isRestDay: dayInfo.id === 6 // Saturday default rest day
    };
  }
};

// Helper function to save body parts and exercises for a day routine
const saveDayRoutineDetails = async (dayRoutineId: string, dayRoutine: LegacyDayRoutine) => {
  // Add body parts using the direct API endpoint
  for (const bodyPart of dayRoutine.bodyParts) {
    try {
      await apiClient.dayRoutineBodyParts.create({
        dayRoutineId: Number(dayRoutineId),
        bodyPart: bodyPart
      });
    } catch (bpErr) {
      console.warn(`Failed to add body part ${bodyPart} to day ${dayRoutine.dayName}:`, bpErr);
    }
  }

  // Add exercises using the direct API endpoint
  for (const exercise of dayRoutine.exercises) {
    try {
      await apiClient.dayRoutineExercises.create({
        dayRoutineId: Number(dayRoutineId),
        exerciseId: exercise.exerciseId,
        sets: exercise.sets || 3,
        reps: exercise.reps || 10,
        duration: exercise.duration || 0,
        weight: exercise.weight || 0,
        notes: exercise.notes || ""
      });
    } catch (exErr) {
      console.warn(`Failed to add exercise ${exercise.exercise?.name} to day ${dayRoutine.dayName}:`, exErr);
    }
  }
};

const updateDayRoutineViaAPI = async (
  routineId: string, 
  dayOfWeek: number, 
  dayToUpdate: LegacyDayRoutine,
  dayRoutineUpdate: Partial<LegacyDayRoutine>
) => {
  
  // Get the day routine ID
  const dayRoutinesResponse = await apiClient.dayRoutines.getByWeeklyRoutine(routineId);
  if (!dayRoutinesResponse.success || !('data' in dayRoutinesResponse) || !dayRoutinesResponse.data) {
    throw new Error('Failed to get day routines');
  }
  const dayRoutine = dayRoutinesResponse.data.find((dr: any) => dr.dayOfWeek === dayOfWeek);
  if (!dayRoutine) {
    throw new Error(`Day routine not found for day ${dayOfWeek}`);
  }
  const dayRoutineId = dayRoutine.id;

  // Handle Body Part Updates
  if (dayRoutineUpdate.bodyParts) {
    
    // 1. Fetch existing body parts
    const existingBodyPartsResponse = await apiClient.dayRoutines.getBodyParts(String(dayRoutineId));
    if (!existingBodyPartsResponse.success || !('data' in existingBodyPartsResponse)) {
      throw new Error('Failed to fetch existing body parts.');
    }
    const existingBodyParts = existingBodyPartsResponse.data.map((bp: any) => bp.bodyPart);

    // 2. Determine which body parts to add and remove
    const newBodyParts = dayToUpdate.bodyParts;
    const partsToAdd = newBodyParts.filter(part => !existingBodyParts.includes(part));
    const partsToRemove = existingBodyParts.filter(part => !newBodyParts.includes(part));

    // 3. Add new body parts
    for (const bodyPart of partsToAdd) {
      const payload = { dayRoutineId: dayRoutineId, bodyPart: bodyPart };
      await apiClient.dayRoutines.addBodyPart(String(dayRoutineId), payload);
    }

    // 4. Remove old body parts
    for (const bodyPart of partsToRemove) {
      const payload = { dayRoutineId: dayRoutineId, bodyPart: bodyPart };
      // Note: The API seems to expect the body part in the body of the DELETE request
      await apiClient.dayRoutines.removeBodyPart(String(dayRoutineId), payload);
    }
  }

  // Handle Exercise Updates (if any)
  if (dayRoutineUpdate.exercises) {
    // 1. Fetch existing exercises
    const existingExercisesResponse = await apiClient.dayRoutines.getExercises(String(dayRoutineId));
    if (!existingExercisesResponse.success || !('data' in existingExercisesResponse)) {
      throw new Error('Failed to fetch existing exercises.');
    }
    const existingExercises = existingExercisesResponse.data.map((ex: any) => ex.exerciseId);

    // 2. Determine which exercises to add and remove
    const newExercises = dayToUpdate.exercises.map(ex => ex.exerciseId);
    const exercisesToAdd = dayToUpdate.exercises.filter(ex => !existingExercises.includes(ex.exerciseId));
    const exercisesToRemove = existingExercisesResponse.data.filter((ex: any) => !newExercises.includes(ex.exerciseId));

    // 3. Add new exercises
    for (const exercise of exercisesToAdd) {
      const payload = {
        dayRoutineId: dayRoutineId,
        exerciseId: exercise.exerciseId,
        sets: exercise.sets || 3,
        reps: exercise.reps || 10,
        duration: exercise.duration || 0,
        weight: exercise.weight || 0,
        notes: exercise.notes || ""
      };
      await apiClient.dayRoutines.addExercise(String(dayRoutineId), payload);
    }

    // 4. Remove old exercises
    for (const exercise of exercisesToRemove) {
      await apiClient.dayRoutines.removeExercise(String(dayRoutineId), String(exercise.id));
    }
  }
};

// Helper function to save or update weekly routine
const saveWeeklyRoutine = async (routineToSave: LegacyWeeklyRoutine, userId: string) => {
  const routineWithTimestamp = {
    ...routineToSave,
    userId: userId,
    updatedAt: new Date().toISOString()
  };
  
  const routineId = routineToSave.id ? Number(routineToSave.id) : undefined;
  
  if (routineId) {
    // Update existing weekly routine
    return await apiClient.weeklyRoutines.update(String(routineId), {
      name: routineWithTimestamp.name,
      description: routineWithTimestamp.description,
      isActive: routineWithTimestamp.isActive,
      userId: routineWithTimestamp.userId
    });
  } else {
    // Create new weekly routine
    return await apiClient.weeklyRoutines.create({
      name: routineWithTimestamp.name,
      description: routineWithTimestamp.description,
      isActive: routineWithTimestamp.isActive,
      userId: routineWithTimestamp.userId
    });
  }
};

const useRoutine = (): UseRoutineResult => {
  const [routine, setRoutine] = useState<LegacyWeeklyRoutine | null>(null);
  const [userRoutines, setUserRoutines] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { userId, isAuthenticated } = useUser();

  // Check if user has any routines
  const hasRoutines = userRoutines !== null && userRoutines.length > 0;

  // Load user's routines from API
  const loadUserRoutines = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      if (!userId || !isAuthenticated) {
        setUserRoutines([]);
        setLoading(false);
        return;
      }

      const response = await apiClient.weeklyRoutines.getMyRoutines();
      if (response.success && 'data' in response && response.data) {
        setUserRoutines(response.data);
      } else {
        setUserRoutines([]);
      }
    } catch (err: any) {
      console.error('Failed to load user routines:', err.message);
      setError(err.message || 'Failed to load routines');
      setUserRoutines([]);
    } finally {
      setLoading(false);
    }
  };

  // Create a new routine
  const createNewRoutine = async (name: string, description: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      if (!userId || !isAuthenticated) {
        throw new Error('User must be authenticated to create routine');
      }

      const routineData = {
        userId: userId,
        name: name,
        description: description,
        isActive: true
      };

      console.log('Creating weekly routine...');
      const response = await apiClient.weeklyRoutines.create(routineData);
      if (response.success && 'data' in response && response.data) {
        const createdWeeklyRoutine = response.data;
        const weeklyRoutineId = createdWeeklyRoutine.id;
        console.log('Weekly routine created successfully with ID:', weeklyRoutineId);

        // Create 7 day routines for each day of the week
        console.log('Creating day routines...');
        const dayRoutinePromises = DAYS_OF_WEEK.map(async (day) => {
          const dayRoutineData = {
            weeklyRoutineId: weeklyRoutineId,
            dayOfWeek: day.id,
            dayName: day.name,
            isRestDay: day.id === 6 // Saturday (6) is the default rest day
          };

          const dayResponse = await apiClient.dayRoutines.create(dayRoutineData);
          if (dayResponse.success) {
            console.log(`✓ Created day routine for ${day.name}`);
            return { success: true, day: day.name };
          } else {
            console.error(`✗ Failed to create day routine for ${day.name}:`, dayResponse.message);
            throw new Error(`Failed to create day routine for ${day.name}: ${dayResponse.message}`);
          }
        });

        // Wait for ALL day routines to be created and check if all succeeded
        const dayResults = await Promise.all(dayRoutinePromises);
        const successfulDays = dayResults.filter(result => result.success).length;
        
        console.log(`Day routines created: ${successfulDays}/7`);
        
        if (successfulDays !== 7) {
          throw new Error(`Only ${successfulDays} out of 7 day routines were created successfully`);
        }

        console.log('✓ All 8 requests completed successfully (1 weekly + 7 daily routines)');

        // Reload user routines to include the new one
        await loadUserRoutines();
        
        // Return success - let parent component handle redirect
        return true;
      } else {
        throw new Error(response.message || 'Failed to create routine');
      }
    } catch (err: any) {
      console.error('Routine creation failed:', err);
      setError(err.message || 'Failed to create routine');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Select and load a specific routine
  const selectRoutine = async (routineId: number): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch all exercises to cross-reference names and details
      const allExercisesResponse = await apiClient.exercises.getAll();
      if (!allExercisesResponse.success || !('data' in allExercisesResponse)) {
        throw new Error('Failed to fetch the master list of exercises.');
      }
      const allExercises = allExercisesResponse.data;

      let selectedRoutine = userRoutines?.find(r => r.id === routineId);
      
      if (!selectedRoutine) {
        await loadUserRoutines();
        await new Promise(resolve => setTimeout(resolve, 100));
        selectedRoutine = userRoutines?.find(r => r.id === routineId);
      }
      
      if (!selectedRoutine) {
        throw new Error(`Routine with ID ${routineId} not found`);
      }

      const dayRoutinesResponse = await apiClient.dayRoutines.getByWeeklyRoutine(String(routineId));
      
      if (dayRoutinesResponse.success && 'data' in dayRoutinesResponse && dayRoutinesResponse.data && dayRoutinesResponse.data.length > 0) {
        const dayRoutines = dayRoutinesResponse.data;
        
        const routineWithDays: LegacyWeeklyRoutine = {
          ...selectedRoutine,
          id: String(selectedRoutine.id),
          routines: await Promise.all(DAYS_OF_WEEK.map(async day => {
            const dayRoutine = dayRoutines.find((dr: any) => dr.dayOfWeek === day.id);
            if (dayRoutine) {
              return await loadDayRoutineDetails(dayRoutine, day, allExercises);
            } else {
              return {
                dayOfWeek: day.id,
                dayName: day.name,
                bodyParts: [],
                exercises: [],
                isRestDay: day.id === 6
              };
            }
          }))
        };
        
        setRoutine(routineWithDays);
      } else {
        const routineWithDefaultDays: LegacyWeeklyRoutine = {
          ...selectedRoutine,
          id: String(selectedRoutine.id),
          routines: DAYS_OF_WEEK.map(day => ({
            dayOfWeek: day.id,
            dayName: day.name,
            bodyParts: [],
            exercises: [],
            isRestDay: day.id === 6
          }))
        };
        setRoutine(routineWithDefaultDays);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load routine');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Save routine to API
  const saveRoutine = async (routineToSave: LegacyWeeklyRoutine): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      if (!userId || !isAuthenticated) {
        throw new Error('User must be authenticated to save routine');
      }

      const response = await saveWeeklyRoutine(routineToSave, userId);

      if (response.success && 'data' in response && response.data) {
        const savedWeeklyRoutine = response.data;
        
        // Convert legacy routine to API format and save each day routine
        const updatedDayRoutines = [];
        for (const dayRoutine of routineToSave.routines) {
          try {
            // First, update the basic day routine info
            const dayResponse = await apiClient.weeklyRoutines.updateDayRoutine(
              String(savedWeeklyRoutine.id),
              dayRoutine.dayOfWeek,
              {
                weeklyRoutineId: savedWeeklyRoutine.id,
                dayOfWeek: dayRoutine.dayOfWeek,
                dayName: dayRoutine.dayName,
                isRestDay: dayRoutine.isRestDay
              }
            );

            if (dayResponse.success && 'data' in dayResponse && dayResponse.data) {
              const savedDayRoutine = dayResponse.data;
              const dayRoutineId = String(savedDayRoutine.id);

              // Save body parts and exercises using helper function
              await saveDayRoutineDetails(dayRoutineId, dayRoutine);
            }
            
            updatedDayRoutines.push(dayRoutine);
          } catch (dayErr) {
            console.warn(`Failed to save day routine for ${dayRoutine.dayName}:`, dayErr);
            updatedDayRoutines.push(dayRoutine);
          }
        }

        // Update the routine with saved data
        const finalRoutine: LegacyWeeklyRoutine = {
          ...savedWeeklyRoutine,
          id: String(savedWeeklyRoutine.id),
          routines: updatedDayRoutines
        };
        
        setRoutine(finalRoutine);
      } else {
        throw new Error(response.message || 'Failed to save routine');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save routine');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateDayRoutine = async (dayOfWeek: number, dayRoutineUpdate: Partial<LegacyDayRoutine>): Promise<void> => {
    if (!routine?.id) return;

    const originalRoutine = routine;

    // Optimistically update the UI
    const updatedRoutines = originalRoutine.routines.map(day => {
      if (day.dayOfWeek === dayOfWeek) {
        return { ...day, ...dayRoutineUpdate };
      }
      // If setting a rest day, unset other rest days
      if (dayRoutineUpdate.isRestDay === true) {
        return { ...day, isRestDay: false };
      }
      return day;
    });

    setRoutine({ ...originalRoutine, routines: updatedRoutines });

    try {
      const dayToUpdate = updatedRoutines.find(dr => dr.dayOfWeek === dayOfWeek);
      if (!dayToUpdate) {
        throw new Error('Could not find the day to update locally.');
      }

      // Independently handle rest day updates
      if (dayRoutineUpdate.isRestDay !== undefined) {
        const payload = {
          weeklyRoutineId: Number(originalRoutine.id),
          dayOfWeek: dayToUpdate.dayOfWeek,
          dayName: dayToUpdate.dayName,
          isRestDay: dayToUpdate.isRestDay,
        };
        await apiClient.weeklyRoutines.updateDayRoutine(originalRoutine.id, dayOfWeek, payload);
      }

      // Independently handle body part and exercise updates
      if (dayRoutineUpdate.bodyParts || dayRoutineUpdate.exercises) {
        await updateDayRoutineViaAPI(originalRoutine.id, dayOfWeek, dayToUpdate, dayRoutineUpdate);
      }

      // After all updates, refresh the entire routine from the server
      await selectRoutine(Number(originalRoutine.id));

    } catch (err) {
      console.error('Failed to save and refresh routine:', err);
      // Revert to the original state if the API call fails
      setRoutine(originalRoutine);
      // Notify the user
      alert('Failed to save routine. Please try again.');
    }
  };

  // Simple wrapper for backward compatibility
  const loadRoutine = async (): Promise<void> => {
    await loadUserRoutines();
  };

  // Load routines when userId and isAuthenticated are available
  useEffect(() => {
    if (userId && isAuthenticated) {
      loadUserRoutines();
    }
  }, [userId, isAuthenticated]);

  return {
    routine,
    userRoutines,
    loading,
    error,
    hasRoutines,
    saveRoutine,
    createNewRoutine,
    loadRoutine,
    loadUserRoutines,
    selectRoutine,
    updateDayRoutine
  };
};

export default useRoutine;