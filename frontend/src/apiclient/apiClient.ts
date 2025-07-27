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

    if (responseData.success) {
      return responseData;
    } else {
      // Backend indicates failure, even if HTTP status is 200
      return responseData;
    }
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

  // Example of how you might structure specific API calls
  // You will need to define these based on your backend routes
  users: {
    getAll: () => apiClient.get<any[]>('users'),
    getById: (id: string) => apiClient.get<any>(`users/${id}`),
    create: (userData: any) => apiClient.post<any>('users', userData),
    update: (id: string, userData: any) => apiClient.put<any>(`users/${id}`, userData),
    delete: (id: string) => apiClient.delete<any>(`users/${id}`),
  },

  workouts: {
    getAll: () => apiClient.get<any[]>('workouts'),
    create: (workoutData: any) => apiClient.post<any>('workouts', workoutData),
    // ... more workout related calls
  },

  // Add more categories for your API endpoints here (e.g., auth, products, etc.)
};

export default apiClient;