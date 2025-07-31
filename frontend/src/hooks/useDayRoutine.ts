import { useState } from 'react';
import apiClient from '../apiclient/apiClient';
import type { RoutineExercise } from '../types/routine';

interface DayRoutineBodyPart {
  id: number;
  dayRoutineId: number;
  bodyPart: string;
}

interface DayRoutineExercise {
  id: number;
  dayRoutineId: number;
  exerciseId: number;
  sets: number;
  reps: number;
  duration?: number;
  weight?: number;
  notes?: string;
  exercise?: any; // Exercise details
}

interface UseDayRoutineResult {
  loading: boolean;
  error: string | null;
  
  // Body Parts operations
  getBodyParts: (dayId: string) => Promise<DayRoutineBodyPart[]>;
  addBodyPart: (dayId: string, bodyPart: string) => Promise<DayRoutineBodyPart | null>;
  removeBodyPart: (dayId: string) => Promise<boolean>;
  
  // Exercises operations
  getExercises: (dayId: string) => Promise<DayRoutineExercise[]>;
  addExercise: (dayId: string, exercise: RoutineExercise) => Promise<DayRoutineExercise | null>;
  updateExercise: (dayId: string, exerciseId: string, exercise: Partial<RoutineExercise>) => Promise<DayRoutineExercise | null>;
  removeExercise: (dayId: string, exerciseId: string) => Promise<boolean>;
}

const useDayRoutine = (): UseDayRoutineResult => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getBodyParts = async (dayId: string): Promise<DayRoutineBodyPart[]> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.dayRoutines.getBodyParts(dayId);
      if (response.success && 'data' in response && response.data) {
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to fetch body parts');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch body parts');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const addBodyPart = async (dayId: string, bodyPart: string): Promise<DayRoutineBodyPart | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const bodyPartData = {
        dayRoutineId: parseInt(dayId),
        bodyPart: bodyPart
      };
      const response = await apiClient.dayRoutines.addBodyPart(dayId, bodyPartData);
      if (response.success && 'data' in response && response.data) {
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to add body part');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to add body part');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const removeBodyPart = async (dayId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.dayRoutines.removeBodyPart(dayId);
      return response.success;
    } catch (err: any) {
      setError(err.message || 'Failed to remove body part');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getExercises = async (dayId: string): Promise<DayRoutineExercise[]> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.dayRoutines.getExercises(dayId);
      if (response.success && 'data' in response && response.data) {
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to fetch exercises');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch exercises');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const addExercise = async (dayId: string, exercise: RoutineExercise): Promise<DayRoutineExercise | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const exerciseData = {
        dayRoutineId: parseInt(dayId),
        exerciseId: exercise.exerciseId,
        sets: exercise.sets || 3,
        reps: exercise.reps || 10,
        duration: exercise.duration,
        weight: exercise.weight,
        notes: exercise.notes
      };
      
      const response = await apiClient.dayRoutines.addExercise(dayId, exerciseData);
      if (response.success && 'data' in response && response.data) {
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to add exercise');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to add exercise');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateExercise = async (dayId: string, exerciseId: string, exercise: Partial<RoutineExercise>): Promise<DayRoutineExercise | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const exerciseData = {
        ...(exercise.sets && { sets: exercise.sets }),
        ...(exercise.reps && { reps: exercise.reps }),
        ...(exercise.duration && { duration: exercise.duration }),
        ...(exercise.weight && { weight: exercise.weight }),
        ...(exercise.notes && { notes: exercise.notes })
      };
      
      const response = await apiClient.dayRoutines.updateExercise(dayId, exerciseId, exerciseData);
      if (response.success && 'data' in response && response.data) {
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to update exercise');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update exercise');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const removeExercise = async (dayId: string, exerciseId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.dayRoutines.removeExercise(dayId, exerciseId);
      return response.success;
    } catch (err: any) {
      setError(err.message || 'Failed to remove exercise');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    getBodyParts,
    addBodyPart,
    removeBodyPart,
    getExercises,
    addExercise,
    updateExercise,
    removeExercise
  };
};

export default useDayRoutine;
