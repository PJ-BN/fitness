import type { ApiResponse, ApiResponseWithData } from '../types/api.ts';
import Cookies from 'js-cookie';

const API_BASE_URL = 'http://localhost:5017'; // Replace with your backend API base URL

async function request<T>(method: string, endpoint: string, body?: unknown): Promise<ApiResponseWithData<T> | ApiResponse> {
  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    const token = Cookies.get('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config: RequestInit = {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    };

    const response = await fetch(`${API_BASE_URL}/${endpoint}`, config);
    const responseData: ApiResponseWithData<T> | ApiResponse = await response.json();

    // Always return the response data - let the calling code handle success/failure
    return responseData;
  } catch (error: unknown) {
    // Network errors or issues before receiving a response
    return { success: false, message: error instanceof Error ? error.message : 'Network error', errors: [error instanceof Error ? error.message : 'Network error'] };
  }
}

const apiClient = {
  get: <T>(endpoint: string) => request<T>('GET', endpoint),
  post: <T>(endpoint: string, body: unknown) => request<T>('POST', endpoint, body),
  put: <T>(endpoint: string, body: unknown) => request<T>('PUT', endpoint, body),
  delete: <T>(endpoint: string) => request<T>('DELETE', endpoint),

  // Authentication endpoints
  auth: {
    register: (userData: unknown) => apiClient.post<unknown>('api/auth/register', userData),
    login: (loginData: unknown) => apiClient.post<unknown>('api/auth/login', loginData),
    changePassword: (passwordData: unknown) => apiClient.post<unknown>('api/auth/change-password', passwordData),
    updateProfile: (profileData: unknown) => apiClient.put<unknown>('api/auth/profile', profileData),
  },

  // Users endpoints
  users: {
    getAll: () => apiClient.get<unknown[]>('api/users'),
    getById: (id: string) => apiClient.get<unknown>(`api/users/${id}`),
  },

  // Exercises endpoints
  exercises: {
    getAll: () => apiClient.get<unknown[]>('api/exercises'),
    create: (exerciseData: unknown) => apiClient.post<unknown>('api/exercises', exerciseData),
    getById: (id: string) => apiClient.get<unknown>(`api/exercises/${id}`),
    update: (id: string, exerciseData: unknown) => apiClient.put<unknown>(`api/exercises/${id}`, exerciseData),
    delete: (id: string) => apiClient.delete<unknown>(`api/exercises/${id}`),
  },

  // Workouts endpoints
  workouts: {
    getAll: () => apiClient.get<unknown[]>('api/workouts'),
    create: (workoutData: unknown) => apiClient.post<unknown>('api/workouts', workoutData),
    getById: (id: string) => apiClient.get<unknown>(`api/workouts/${id}`),
    update: (id: string, workoutData: unknown) => apiClient.put<unknown>(`api/workouts/${id}`, workoutData),
    delete: (id: string) => apiClient.delete<unknown>(`api/workouts/${id}`),
  },

  // Workout Exercises endpoints
  workoutExercises: {
    getAll: () => apiClient.get<unknown[]>('api/workoutexercises'),
    create: (workoutExerciseData: unknown) => apiClient.post<unknown>('api/workoutexercises', workoutExerciseData),
    getById: (id: string) => apiClient.get<unknown>(`api/workoutexercises/${id}`),
    update: (id: string, workoutExerciseData: unknown) => apiClient.put<unknown>(`api/workoutexercises/${id}`, workoutExerciseData),
    delete: (id: string) => apiClient.delete<unknown>(`api/workoutexercises/${id}`),
  },

  // Goals endpoints
  goals: {
    getAll: () => apiClient.get<unknown[]>('api/goals'),
    create: (goalData: unknown) => apiClient.post<unknown>('api/goals', goalData),
    getById: (id: string) => apiClient.get<unknown>(`api/goals/${id}`),
    update: (id: string, goalData: unknown) => apiClient.put<unknown>(`api/goals/${id}`, goalData),
    delete: (id: string) => apiClient.delete<unknown>(`api/goals/${id}`),
  },

  // User Metrics endpoints
  userMetrics: {
    getAll: () => apiClient.get<unknown[]>('api/usermetrics'),
    create: (metricData: unknown) => apiClient.post<unknown>('api/usermetrics', metricData),
    getById: (id: string) => apiClient.get<unknown>(`api/usermetrics/${id}`),
    update: (id: string, metricData: unknown) => apiClient.put<unknown>(`api/usermetrics/${id}`, metricData),
    delete: (id: string) => apiClient.delete<unknown>(`api/usermetrics/${id}`),
  },

  // Weekly Routines endpoints
  weeklyRoutines: {
    getAll: () => apiClient.get<unknown[]>('api/WeeklyRoutines'),
    getMyRoutines: () => apiClient.get<unknown[]>('api/WeeklyRoutines/my-routines'),
    create: (routineData: unknown) => apiClient.post<unknown>('api/WeeklyRoutines', routineData),
    getById: (id: string) => apiClient.get<unknown>(`api/WeeklyRoutines/${id}`),
    update: (id: string, routineData: unknown) => apiClient.put<unknown>(`api/WeeklyRoutines/${id}`, routineData),
    delete: (id: string) => apiClient.delete<unknown>(`api/WeeklyRoutines/${id}`),
    
    // Day routines for weekly routines
    getDayRoutines: (routineId: string) => apiClient.get<unknown[]>(`api/WeeklyRoutines/${routineId}/days`),
    getDayRoutine: (routineId: string, dayOfWeek: number) => apiClient.get<unknown>(`api/WeeklyRoutines/${routineId}/days/${dayOfWeek}`),
    updateDayRoutine: (routineId: string, dayOfWeek: number, dayRoutineData: unknown) => apiClient.put<unknown>(`api/WeeklyRoutines/${routineId}/days/${dayOfWeek}`, dayRoutineData),
  },

  // Day Routines endpoints
  dayRoutines: {
    getByWeeklyRoutine: (weeklyRoutineId: string) => apiClient.get<unknown>(`api/DayRoutines/by-weekly-routine/${weeklyRoutineId}`),
    // Basic CRUD operations
    getAll: () => apiClient.get<unknown[]>('api/DayRoutines'),
    getById: (id: string) => apiClient.get<unknown>(`api/DayRoutines/${id}`),
    create: (dayRoutineData: unknown) => apiClient.post<unknown>('api/DayRoutines', dayRoutineData),
    update: (id: string, dayRoutineData: unknown) => apiClient.put<unknown>(`api/DayRoutines/${id}`, dayRoutineData),
    delete: (id: string) => apiClient.delete<unknown>(`api/DayRoutines/${id}`),
    
    // Update day routine with rest day status
    updateDayRoutine: (dayRoutineId: string, data: {
      weeklyRoutineId: number;
      dayOfWeek: number;
      dayName: string;
      isRestDay: boolean;
    }) => apiClient.put<unknown>(`api/DayRoutines/${dayRoutineId}`, data),
    
    // Body parts operations
    getBodyParts: (dayId: string) => apiClient.get<unknown[]>(`api/DayRoutines/${dayId}/bodyparts`),
    addBodyPart: (dayId: string, bodyPartData: unknown) => apiClient.post<unknown>(`api/DayRoutines/${dayId}/bodyparts`, bodyPartData),
    removeBodyPart: (dayId: string, bodyPartData: unknown) => apiClient.delete<unknown>(`api/DayRoutines/${dayId}/bodyparts`, bodyPartData),
    
    // Exercises operations
    getExercises: (dayId: string) => apiClient.get<unknown[]>(`api/DayRoutines/${dayId}/exercises`),
    addExercise: (dayId: string, exerciseData: unknown) => apiClient.post<unknown>(`api/DayRoutines/${dayId}/exercises`, exerciseData),
    updateExercise: (dayId: string, exerciseId: string, exerciseData: unknown) => apiClient.put<unknown>(`api/DayRoutines/${dayId}/exercises/${exerciseId}`, exerciseData),
    removeExercise: (dayId: string, exerciseId: string) => apiClient.delete<unknown>(`api/DayRoutines/${dayId}/exercises/${exerciseId}`),
  },

  // Direct API endpoints for body parts and exercises
  dayRoutineBodyParts: {
    create: (bodyPartData: unknown) => apiClient.post<unknown>('api/DayRoutineBodyParts', bodyPartData),
    deleteByDayRoutine: (dayRoutineId: string) => apiClient.delete<unknown>(`api/DayRoutineBodyParts/by-day-routine/${dayRoutineId}`),
  },

  dayRoutineExercises: {
    create: (exerciseData: unknown) => apiClient.post<unknown>('api/DayRoutineExercises', exerciseData),
    deleteByDayRoutine: (dayRoutineId: string) => apiClient.delete<unknown>(`api/DayRoutineExercises/by-day-routine/${dayRoutineId}`),
  },

  // Workout Logs endpoints
  workoutLogs: {
    create: (workoutLogData: unknown) => apiClient.post<unknown>('api/Workouts/log-from-routine', workoutLogData),
  },

  // Legacy routines for backward compatibility
  routines: {
    getByUserId: (userId: string) => apiClient.get<unknown>(`api/Routines/ByUser/${userId}`),
    create: (routineData: unknown) => apiClient.post<unknown>('api/Routines', routineData),
    update: (id: string, routineData: unknown) => apiClient.put<unknown>(`api/Routines/${id}`, routineData),
    delete: (id: string) => apiClient.delete<unknown>(`api/Routines/${id}`),
    
    // Day routine operations
    updateDayRoutine: (routineId: string, dayOfWeek: number, dayRoutineData: unknown) => 
      apiClient.put<unknown>(`api/Routines/${routineId}/days/${dayOfWeek}`, dayRoutineData),
    
    // Get specific day routine
    getDayRoutine: (routineId: string, dayOfWeek: number) => 
      apiClient.get<unknown>(`api/Routines/${routineId}/days/${dayOfWeek}`),
  },
};

export default apiClient;