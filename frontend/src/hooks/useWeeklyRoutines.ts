import { useState } from 'react';
import apiClient from '../apiclient/apiClient';
import type { 
  WeeklyRoutine, 
  WeeklyRoutineDto, 
  DayRoutine, 
  DayRoutineDto 
} from '../types/routine';

interface WeeklyRoutineAPI {
  id: number; // Changed from string to number to match backend
  userId: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface UseWeeklyRoutinesResult {
  loading: boolean;
  error: string | null;
  
  // Weekly routine operations
  getAllRoutines: () => Promise<WeeklyRoutineAPI[]>;
  createRoutine: (routineData: Partial<WeeklyRoutine>) => Promise<WeeklyRoutineAPI | null>;
  getRoutineById: (id: number) => Promise<WeeklyRoutineAPI | null>;
  updateRoutine: (id: number, routineData: Partial<WeeklyRoutine>) => Promise<WeeklyRoutineAPI | null>;
  deleteRoutine: (id: number) => Promise<boolean>;
  
  // Day routine operations for weekly routines
  getDayRoutines: (routineId: number) => Promise<DayRoutine[]>;
  getDayRoutine: (routineId: number, dayOfWeek: number) => Promise<DayRoutine | null>;
  updateDayRoutine: (routineId: number, dayOfWeek: number, dayRoutineData: Partial<DayRoutine>) => Promise<DayRoutine | null>;
}

const useWeeklyRoutines = (): UseWeeklyRoutinesResult => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAllRoutines = async (): Promise<WeeklyRoutineAPI[]> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.weeklyRoutines.getAll();
      if (response.success && 'data' in response && response.data) {
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to fetch weekly routines');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch weekly routines');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const createRoutine = async (routineData: Partial<WeeklyRoutine>): Promise<WeeklyRoutine | null> => {
    setLoading(true);
    setError(null);
    
    try {
      // Convert to DTO format expected by backend
      const createData: WeeklyRoutineDto = {
        name: routineData.name || 'New Routine',
        description: routineData.description || '',
        isActive: routineData.isActive ?? true,
        userId: routineData.userId || ''
      };
      
      const response = await apiClient.weeklyRoutines.create(createData);
      if (response.success && 'data' in response && response.data) {
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to create weekly routine');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create weekly routine');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getRoutineById = async (id: number): Promise<WeeklyRoutineAPI | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.weeklyRoutines.getById(id.toString());
      if (response.success && 'data' in response && response.data) {
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to fetch weekly routine');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch weekly routine');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateRoutine = async (id: number, routineData: Partial<WeeklyRoutine>): Promise<WeeklyRoutineAPI | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const updateData = {
        ...(routineData.name && { name: routineData.name }),
        ...(routineData.description && { description: routineData.description }),
        ...(typeof routineData.isActive === 'boolean' && { isActive: routineData.isActive }),
        updatedAt: new Date().toISOString()
      };
      
      const response = await apiClient.weeklyRoutines.update(id.toString(), updateData);
      if (response.success && 'data' in response && response.data) {
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to update weekly routine');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update weekly routine');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteRoutine = async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.weeklyRoutines.delete(id.toString());
      return response.success;
    } catch (err: any) {
      setError(err.message || 'Failed to delete weekly routine');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getDayRoutines = async (routineId: number): Promise<DayRoutine[]> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.weeklyRoutines.getDayRoutines(routineId.toString());
      if (response.success && 'data' in response && response.data) {
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to fetch day routines');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch day routines');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getDayRoutine = async (routineId: number, dayOfWeek: number): Promise<DayRoutine | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.weeklyRoutines.getDayRoutine(routineId.toString(), dayOfWeek);
      if (response.success && 'data' in response && response.data) {
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to fetch day routine');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch day routine');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateDayRoutine = async (routineId: number, dayOfWeek: number, dayRoutineData: Partial<DayRoutine>): Promise<DayRoutine | null> => {
    setLoading(true);
    setError(null);
    
    try {
      // Convert to DTO format expected by backend
      const updateData: Partial<DayRoutineDto> = {
        dayOfWeek,
        ...(dayRoutineData.dayName && { dayName: dayRoutineData.dayName }),
        ...(typeof dayRoutineData.isRestDay === 'boolean' && { isRestDay: dayRoutineData.isRestDay }),
        weeklyRoutineId: routineId
      };
      
      const response = await apiClient.weeklyRoutines.updateDayRoutine(routineId.toString(), dayOfWeek, updateData);
      if (response.success && 'data' in response && response.data) {
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to update day routine');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update day routine');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    getAllRoutines,
    createRoutine,
    getRoutineById,
    updateRoutine,
    deleteRoutine,
    getDayRoutines,
    getDayRoutine,
    updateDayRoutine
  };
};

export default useWeeklyRoutines;
