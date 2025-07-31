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
const loadDayRoutineDetails = async (dayRoutine: any, dayInfo: { id: number; name: string }) => {
  try {
    const [bodyPartsResponse, exercisesResponse] = await Promise.all([
      apiClient.dayRoutines.getBodyParts(String(dayRoutine.id)),
      apiClient.dayRoutines.getExercises(String(dayRoutine.id))
    ]);

    const bodyParts = (bodyPartsResponse.success && 'data' in bodyPartsResponse && bodyPartsResponse.data) 
      ? bodyPartsResponse.data.map((bp: any) => typeof bp === 'string' ? bp : bp.bodyPart)
      : [];
    
    const exercises = (exercisesResponse.success && 'data' in exercisesResponse && exercisesResponse.data)
      ? exercisesResponse.data.map((ex: any) => ({
          exerciseId: ex.exerciseId,
          exercise: ex.exercise,
          sets: ex.sets,
          reps: ex.reps,
          duration: ex.duration,
          weight: ex.weight,
          notes: ex.notes
        }))
      : [];

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

// Helper function to update day routine via API
const updateDayRoutineViaAPI = async (
  routineId: string, 
  dayOfWeek: number, 
  dayToUpdate: LegacyDayRoutine,
  dayRoutineUpdate: Partial<LegacyDayRoutine>
) => {
  console.log('updateDayRoutineViaAPI called with:', { routineId, dayOfWeek, dayToUpdate, dayRoutineUpdate });
  
  // First, get the day routine ID by fetching day routines for this weekly routine
  const dayRoutinesResponse = await apiClient.weeklyRoutines.getDayRoutines(routineId);
  
  if (!dayRoutinesResponse.success || !('data' in dayRoutinesResponse) || !dayRoutinesResponse.data) {
    throw new Error('Failed to get day routines');
  }

  // Find the specific day routine
  const dayRoutine = dayRoutinesResponse.data.find((dr: any) => dr.dayOfWeek === dayOfWeek);
  if (!dayRoutine) {
    throw new Error(`Day routine not found for day ${dayOfWeek}`);
  }

  const dayRoutineId = dayRoutine.id;
  console.log('Found day routine ID:', dayRoutineId);

  // Update the basic day routine info first (if needed)
  const dayResponse = await apiClient.weeklyRoutines.updateDayRoutine(
    routineId,
    dayOfWeek,
    {
      weeklyRoutineId: Number(routineId),
      dayOfWeek: dayToUpdate.dayOfWeek,
      dayName: dayToUpdate.dayName,
      isRestDay: dayToUpdate.isRestDay
    }
  );

  if (!dayResponse.success) {
    throw new Error('Failed to update day routine basic info');
  }

  console.log('✓ Updated basic day routine info');

  // Clear existing body parts and exercises before adding new ones
  if (dayRoutineUpdate.bodyParts || dayRoutineUpdate.exercises) {
    console.log('Clearing existing body parts and exercises...');
    try {
      if (dayRoutineUpdate.bodyParts) {
        await apiClient.dayRoutineBodyParts.deleteByDayRoutine(String(dayRoutineId));
        console.log('✓ Cleared existing body parts');
      }
      if (dayRoutineUpdate.exercises) {
        await apiClient.dayRoutineExercises.deleteByDayRoutine(String(dayRoutineId));
        console.log('✓ Cleared existing exercises');
      }
    } catch (clearErr) {
      console.warn('Failed to clear existing data (might not exist):', clearErr);
    }
  }

  // Add new body parts
  if (dayRoutineUpdate.bodyParts && dayToUpdate.bodyParts.length > 0) {
    console.log('Adding new body parts:', dayToUpdate.bodyParts);
    for (const bodyPart of dayToUpdate.bodyParts) {
      try {
        await apiClient.dayRoutineBodyParts.create({
          dayRoutineId: dayRoutineId,
          bodyPart: bodyPart
        });
        console.log(`✓ Added body part: ${bodyPart}`);
      } catch (bpErr) {
        console.warn(`Failed to add body part ${bodyPart}:`, bpErr);
      }
    }
  }

  // Add new exercises
  if (dayRoutineUpdate.exercises && dayToUpdate.exercises.length > 0) {
    console.log('Adding new exercises:', dayToUpdate.exercises);
    for (const exercise of dayToUpdate.exercises) {
      try {
        await apiClient.dayRoutineExercises.create({
          dayRoutineId: dayRoutineId,
          exerciseId: exercise.exerciseId,
          sets: exercise.sets || 3,
          reps: exercise.reps || 10,
          duration: exercise.duration || 0,
          weight: exercise.weight || 0,
          notes: exercise.notes || ""
        });
        console.log(`✓ Added exercise: ${exercise.exercise?.name}`);
      } catch (exErr) {
        console.warn(`Failed to add exercise ${exercise.exercise?.name}:`, exErr);
      }
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
      console.log('Attempting to select routine with ID:', routineId);
      console.log('Available routines:', userRoutines?.map(r => ({ id: r.id, name: r.name })));
      
      // Find the routine in userRoutines to get its details
      let selectedRoutine = userRoutines?.find(r => r.id === routineId);
      
      // If not found, try reloading once more
      if (!selectedRoutine) {
        console.log('Routine not found, attempting one more reload...');
        await loadUserRoutines();
        await new Promise(resolve => setTimeout(resolve, 100));
        selectedRoutine = userRoutines?.find(r => r.id === routineId);
      }
      
      if (!selectedRoutine) {
        console.error('Routine not found in userRoutines. Available routines:', userRoutines);
        throw new Error(`Routine with ID ${routineId} not found`);
      }

      console.log('Found routine:', selectedRoutine.name);

      // First, call the DayRoutines/by-weekly-routine endpoint to get day routine data
      const dayRoutinesResponse = await apiClient.dayRoutines.getByWeeklyRoutine(String(routineId));
      
      if (dayRoutinesResponse.success && 'data' in dayRoutinesResponse && dayRoutinesResponse.data && dayRoutinesResponse.data.length > 0) {
        const dayRoutines = dayRoutinesResponse.data;
        
        // Transform API data to match our LegacyWeeklyRoutine interface
        const routineWithDays: LegacyWeeklyRoutine = {
          ...selectedRoutine,
          id: String(selectedRoutine.id),
          routines: await Promise.all(DAYS_OF_WEEK.map(async day => {
            const dayRoutine = dayRoutines.find((dr: any) => dr.dayOfWeek === day.id);
            if (dayRoutine) {
              return await loadDayRoutineDetails(dayRoutine, day);
            } else {
              return {
                dayOfWeek: day.id,
                dayName: day.name,
                bodyParts: [],
                exercises: [],
                isRestDay: day.id === 6 // Saturday default rest day
              };
            }
          }))
        };
        
        setRoutine(routineWithDays);
        setError(null);
      } else {
        // No day routines found, create default structure
        const routineWithDefaultDays: LegacyWeeklyRoutine = {
          ...selectedRoutine,
          id: String(selectedRoutine.id),
          routines: DAYS_OF_WEEK.map(day => ({
            dayOfWeek: day.id,
            dayName: day.name,
            bodyParts: [],
            exercises: [],
            isRestDay: day.id === 6 // Saturday default rest day
          }))
        };
        setRoutine(routineWithDefaultDays);
        setError(null);
      }
    } catch (err: any) {
      console.error('Failed to load routine:', err.message);
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
    console.log('--- DEBUG: updateDayRoutine in useRoutine.ts ---');
    console.log('Data received:', { dayOfWeek, dayRoutineUpdate });
    if (!routine) return;

    const originalRoutine = routine;

    // If user sets isRestDay true, ensure only one rest day in the week
    let updatedRoutines = routine.routines.map((dayRoutine: LegacyDayRoutine) => {
      if (dayRoutine.dayOfWeek === dayOfWeek) {
        return {
          ...dayRoutine,
          ...dayRoutineUpdate
        };
      }
      return dayRoutine;
    });

    if (dayRoutineUpdate.isRestDay) {
      // Set all other days to isRestDay: false
      updatedRoutines = updatedRoutines.map((dr: LegacyDayRoutine) =>
        dr.dayOfWeek !== dayOfWeek ? { ...dr, isRestDay: false } : dr
      );
    }

    const updatedRoutine: LegacyWeeklyRoutine = {
      ...routine,
      routines: updatedRoutines
    };

    setRoutine(updatedRoutine);
    
    // Auto-save the routine after updating
    try {
      if (routine.id && userId && isAuthenticated) {
        const dayToUpdate = updatedRoutines.find((dr: LegacyDayRoutine) => dr.dayOfWeek === dayOfWeek);
        if (dayToUpdate) {
          if (dayRoutineUpdate.isRestDay !== undefined) {
            // For rest day updates, call the DayRoutines API directly
            console.log('--- DEBUG: Preparing to call API for rest day update ---');
            const dayRoutinesResponse = await apiClient.dayRoutines.getByWeeklyRoutine(routine.id);
            
            console.log('--- DEBUG: Response from getByWeeklyRoutine:', dayRoutinesResponse);

            if (dayRoutinesResponse.success && 'data' in dayRoutinesResponse && dayRoutinesResponse.data) {
              const dayRoutineData = dayRoutinesResponse.data.find((dr: any) => dr.dayOfWeek === dayOfWeek);
              
              if (dayRoutineData) {
                const updateData = {
                  weeklyRoutineId: Number(routine.id),
                  dayOfWeek: dayToUpdate.dayOfWeek,
                  dayName: dayToUpdate.dayName,
                  isRestDay: dayToUpdate.isRestDay
                };
                console.log('--- DEBUG: Calling apiClient.dayRoutines.update with:', { id: dayRoutineData.id, data: updateData });
                await apiClient.dayRoutines.update(String(dayRoutineData.id), updateData);
                console.log(`✓ Updated rest day status for ${dayToUpdate.dayName} to ${dayToUpdate.isRestDay}`);
              } else {
                console.error('--- DEBUG: Did not find matching dayRoutineData for dayOfWeek:', dayOfWeek);
              }
            } else {
              console.error('--- DEBUG: Failed to get day routines or response data is empty. Response:', dayRoutinesResponse);
            }
          } else {
            // For body parts and exercises updates, use the existing API
            console.log('Updating day routine via API for bodyParts/exercises...');
            await updateDayRoutineViaAPI(routine.id, dayOfWeek, dayToUpdate, dayRoutineUpdate);
            console.log('✓ Day routine updated successfully via API');
          }
        }
      } else {
        // If no routine ID, save the entire routine
        await saveRoutine(updatedRoutine);
      }
    } catch (err) {
      console.error('Failed to auto-save routine:', err);
      // Revert the local state if API call fails
      setRoutine(originalRoutine);
      throw err;
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
