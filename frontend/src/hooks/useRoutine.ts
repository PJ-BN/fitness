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
  createNewRoutine: (name: string, description: string) => Promise<void>;
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
  // Add body parts to the day routine
  for (const bodyPart of dayRoutine.bodyParts) {
    try {
      await apiClient.dayRoutines.addBodyPart(dayRoutineId, { bodyPart });
    } catch (bpErr) {
      console.warn(`Failed to add body part ${bodyPart} to day ${dayRoutine.dayName}:`, bpErr);
    }
  }

  // Add exercises to the day routine
  for (const exercise of dayRoutine.exercises) {
    try {
      await apiClient.dayRoutines.addExercise(dayRoutineId, {
        exerciseId: exercise.exerciseId,
        sets: exercise.sets || 3,
        reps: exercise.reps || 10,
        duration: exercise.duration,
        weight: exercise.weight,
        notes: exercise.notes
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

  // If bodyParts were updated, add them using the direct API
  if (dayRoutineUpdate.bodyParts) {
    for (const bodyPart of dayToUpdate.bodyParts) {
      try {
        await apiClient.dayRoutineBodyParts.create({
          dayRoutineId: dayRoutineId,
          bodyPart: bodyPart
        });
      } catch (bpErr) {
        console.warn(`Failed to add body part ${bodyPart}:`, bpErr);
      }
    }
  }

  // If exercises were updated, add them using the direct API
  if (dayRoutineUpdate.exercises) {
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
  const createNewRoutine = async (name: string, description: string): Promise<void> => {
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

      const response = await apiClient.weeklyRoutines.create(routineData);
      if (response.success && 'data' in response && response.data) {
        const createdWeeklyRoutine = response.data;
        const weeklyRoutineId = createdWeeklyRoutine.id;

        // Create 7 day routines for each day of the week
        const dayRoutinePromises = DAYS_OF_WEEK.map(async (day) => {
          try {
            const dayRoutineData = {
              weeklyRoutineId: weeklyRoutineId,
              dayOfWeek: day.id,
              dayName: day.name,
              isRestDay: day.id === 6 // Saturday (6) is the default rest day
            };

            const dayResponse = await apiClient.dayRoutines.create(dayRoutineData);
            if (dayResponse.success) {
              console.log(`Created day routine for ${day.name}`);
            } else {
              console.warn(`Failed to create day routine for ${day.name}:`, dayResponse.message);
            }
            return dayResponse;
          } catch (dayErr) {
            console.error(`Error creating day routine for ${day.name}:`, dayErr);
            throw dayErr;
          }
        });

        // Wait for all day routines to be created
        await Promise.all(dayRoutinePromises);

        // Reload user routines to include the new one
        await loadUserRoutines();
        // Automatically select the new routine
        await selectRoutine(createdWeeklyRoutine.id);
      } else {
        throw new Error(response.message || 'Failed to create routine');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create routine');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Select and load a specific routine
  const selectRoutine = async (routineId: number): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      // Find the routine in userRoutines to get its details
      const selectedRoutine = userRoutines?.find(r => r.id === routineId);
      if (!selectedRoutine) {
        throw new Error('Routine not found');
      }

      // Try to load day routines using the WeeklyRoutines endpoint first
      const dayRoutinesResponse = await apiClient.weeklyRoutines.getDayRoutines(String(routineId));
      
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
      } else {
        // No day routines found via WeeklyRoutines endpoint, 
        // create default structure (day routines should exist from createNewRoutine)
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
      }
    } catch (err: any) {
      console.error('Failed to load routine:', err.message);
      setError(err.message || 'Failed to load routine');
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

  // Update a specific day's routine
  const updateDayRoutine = async (dayOfWeek: number, dayRoutineUpdate: Partial<LegacyDayRoutine>): Promise<void> => {
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
          await updateDayRoutineViaAPI(routine.id, dayOfWeek, dayToUpdate, dayRoutineUpdate);
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

  // Load routine on component mount
  useEffect(() => {
    loadUserRoutines();
  }, []);

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
