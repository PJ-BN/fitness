import type { ApiResponse, ApiResponseWithData } from '../types/api.ts';
import Cookies from 'js-cookie';

const API_BASE_URL = 'https://localhost:7071'; // Replace with your backend API base URL

async function request<T>(method: string, endpoint: string, body?: any): Promise<ApiResponseWithData<T> | ApiResponse> {
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
  } catch (error: any) {
    // Network errors or issues before receiving a response
    return { success: false, message: error.message || 'Network error', errors: [error.message || 'Network error'] };
  }
}

const apiClient = {
  get: <T>(endpoint: string) => request<T>('GET', endpoint),
  post: <T>(endpoint: string, body: any) => request<T>('POST', endpoint, body),
  put: <T>(endpoint: string, body: any) => request<T>('PUT', endpoint, body),
  delete: <T>(endpoint: string) => request<T>('DELETE', endpoint),

  // Authentication endpoints
  auth: {
    register: (userData: any) => apiClient.post<any>('api/auth/register', userData),
    login: (loginData: any) => apiClient.post<any>('api/auth/login', loginData),
    changePassword: (passwordData: any) => apiClient.post<any>('api/auth/change-password', passwordData),
    updateProfile: (profileData: any) => apiClient.put<any>('api/auth/profile', profileData),
  },

  // Users endpoints
  users: {
    getAll: () => apiClient.get<any[]>('api/users'),
    getById: (id: string) => apiClient.get<any>(`api/users/${id}`),
  },

  // Exercises endpoints
  exercises: {
    getAll: () => apiClient.get<any[]>('api/exercises'),
    create: (exerciseData: any) => apiClient.post<any>('api/exercises', exerciseData),
    getById: (id: string) => apiClient.get<any>(`api/exercises/${id}`),
    update: (id: string, exerciseData: any) => apiClient.put<any>(`api/exercises/${id}`, exerciseData),
    delete: (id: string) => apiClient.delete<any>(`api/exercises/${id}`),
  },

  // Workouts endpoints
  workouts: {
    getAll: () => apiClient.get<any[]>('api/workouts'),
    create: (workoutData: any) => apiClient.post<any>('api/workouts', workoutData),
    getById: (id: string) => apiClient.get<any>(`api/workouts/${id}`),
    update: (id: string, workoutData: any) => apiClient.put<any>(`api/workouts/${id}`, workoutData),
    delete: (id: string) => apiClient.delete<any>(`api/workouts/${id}`),
  },

  // Workout Exercises endpoints
  workoutExercises: {
    getAll: () => apiClient.get<any[]>('api/workoutexercises'),
    create: (workoutExerciseData: any) => apiClient.post<any>('api/workoutexercises', workoutExerciseData),
    getById: (id: string) => apiClient.get<any>(`api/workoutexercises/${id}`),
    update: (id: string, workoutExerciseData: any) => apiClient.put<any>(`api/workoutexercises/${id}`, workoutExerciseData),
    delete: (id: string) => apiClient.delete<any>(`api/workoutexercises/${id}`),
  },

  // Goals endpoints
  goals: {
    getAll: () => apiClient.get<any[]>('api/goals'),
    create: (goalData: any) => apiClient.post<any>('api/goals', goalData),
    getById: (id: string) => apiClient.get<any>(`api/goals/${id}`),
    update: (id: string, goalData: any) => apiClient.put<any>(`api/goals/${id}`, goalData),
    delete: (id: string) => apiClient.delete<any>(`api/goals/${id}`),
  },

  // User Metrics endpoints
  userMetrics: {
    getAll: () => apiClient.get<any[]>('api/usermetrics'),
    create: (metricData: any) => apiClient.post<any>('api/usermetrics', metricData),
    getById: (id: string) => apiClient.get<any>(`api/usermetrics/${id}`),
    update: (id: string, metricData: any) => apiClient.put<any>(`api/usermetrics/${id}`, metricData),
    delete: (id: string) => apiClient.delete<any>(`api/usermetrics/${id}`),
  },

  // Weekly Routines endpoints
  weeklyRoutines: {
    getAll: () => apiClient.get<any[]>('api/WeeklyRoutines'),
    getMyRoutines: () => apiClient.get<any[]>('api/WeeklyRoutines/my-routines'),
    create: (routineData: any) => apiClient.post<any>('api/WeeklyRoutines', routineData),
    getById: (id: string) => apiClient.get<any>(`api/WeeklyRoutines/${id}`),
    update: (id: string, routineData: any) => apiClient.put<any>(`api/WeeklyRoutines/${id}`, routineData),
    delete: (id: string) => apiClient.delete<any>(`api/WeeklyRoutines/${id}`),
    
    // Day routines for weekly routines
    getDayRoutines: (routineId: string) => apiClient.get<any[]>(`api/WeeklyRoutines/${routineId}/days`),
    getDayRoutine: (routineId: string, dayOfWeek: number) => apiClient.get<any>(`api/WeeklyRoutines/${routineId}/days/${dayOfWeek}`),
    updateDayRoutine: (routineId: string, dayOfWeek: number, dayRoutineData: any) => apiClient.put<any>(`api/WeeklyRoutines/${routineId}/days/${dayOfWeek}`, dayRoutineData),
  },

  // Day Routines endpoints
  dayRoutines: {
    getByWeeklyRoutine: (weeklyRoutineId: string) => apiClient.get<any>(`api/DayRoutines/by-weekly-routine/${weeklyRoutineId}`),
    // Basic CRUD operations
    getAll: () => apiClient.get<any[]>('api/DayRoutines'),
    getById: (id: string) => apiClient.get<any>(`api/DayRoutines/${id}`),
    create: (dayRoutineData: any) => apiClient.post<any>('api/DayRoutines', dayRoutineData),
    update: (id: string, dayRoutineData: any) => apiClient.put<any>(`api/DayRoutines/${id}`, dayRoutineData),
    delete: (id: string) => apiClient.delete<any>(`api/DayRoutines/${id}`),
    
    // Update day routine with rest day status
    updateDayRoutine: (dayRoutineId: string, data: {
      weeklyRoutineId: number;
      dayOfWeek: number;
      dayName: string;
      isRestDay: boolean;
    }) => apiClient.put<any>(`api/DayRoutines/${dayRoutineId}`, data),
    
    // Body parts operations
    getBodyParts: (dayId: string) => apiClient.get<any[]>(`api/DayRoutines/${dayId}/bodyparts`),
    addBodyPart: (dayId: string, bodyPartData: any) => apiClient.post<any>(`api/DayRoutines/${dayId}/bodyparts`, bodyPartData),
    removeBodyPart: (dayId: string, bodyPartData: any) => apiClient.delete<any>(`api/DayRoutines/${dayId}/bodyparts`, bodyPartData),
    
    // Exercises operations
    getExercises: (dayId: string) => apiClient.get<any[]>(`api/DayRoutines/${dayId}/exercises`),
    addExercise: (dayId: string, exerciseData: any) => apiClient.post<any>(`api/DayRoutines/${dayId}/exercises`, exerciseData),
    updateExercise: (dayId: string, exerciseId: string, exerciseData: any) => apiClient.put<any>(`api/DayRoutines/${dayId}/exercises/${exerciseId}`, exerciseData),
    removeExercise: (dayId: string, exerciseId: string) => apiClient.delete<any>(`api/DayRoutines/${dayId}/exercises/${exerciseId}`),
  },

  // Direct API endpoints for body parts and exercises
  dayRoutineBodyParts: {
    create: (bodyPartData: any) => apiClient.post<any>('api/DayRoutineBodyParts', bodyPartData),
    deleteByDayRoutine: (dayRoutineId: string) => apiClient.delete<any>(`api/DayRoutineBodyParts/by-day-routine/${dayRoutineId}`),
  },

  dayRoutineExercises: {
    create: (exerciseData: any) => apiClient.post<any>('api/DayRoutineExercises', exerciseData),
    deleteByDayRoutine: (dayRoutineId: string) => apiClient.delete<any>(`api/DayRoutineExercises/by-day-routine/${dayRoutineId}`),
  },

  // Workout Logs endpoints
  workoutLogs: {
    create: (workoutLogData: any) => apiClient.post<any>('api/Workouts/log-from-routine', workoutLogData),
  },

  // Legacy routines for backward compatibility
  routines: {
    getByUserId: (userId: string) => apiClient.get<any>(`api/Routines/ByUser/${userId}`),
    create: (routineData: any) => apiClient.post<any>('api/Routines', routineData),
    update: (id: string, routineData: any) => apiClient.put<any>(`api/Routines/${id}`, routineData),
    delete: (id: string) => apiClient.delete<any>(`api/Routines/${id}`),
    
    // Day routine operations
    updateDayRoutine: (routineId: string, dayOfWeek: number, dayRoutineData: any) => 
      apiClient.put<any>(`api/Routines/${routineId}/days/${dayOfWeek}`, dayRoutineData),
    
    // Get specific day routine
    getDayRoutine: (routineId: string, dayOfWeek: number) => 
      apiClient.get<any>(`api/Routines/${routineId}/days/${dayOfWeek}`),
  },
};

export default apiClient;