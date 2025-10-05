import apiClient from './apiClient';
import type { Food, CreateFoodRequest, UpdateFoodRequest, IntakeEntry, CreateIntakeRequest, UpdateIntakeRequest, DailySummary } from '../types/nutrition';
import type { ApiResponseWithData } from '../types/api';

// Helper to unwrap ApiResponseWithData
async function unwrap<T>(promise: Promise<ApiResponseWithData<T> | any>): Promise<T> {
  const res = await promise;
  if (res && res.success !== undefined) {
    if (res.success) return res.data as T;
    throw new Error(res.message || 'Request failed');
  }
  return res as T; // fallback if direct data
}

// Backend wraps list response: { success, message, data: { foods: Food[] } }

export const FoodsApi = {
  list: async (): Promise<Food[]> => {
    const res: any = await apiClient.get<any>('api/foods');
    // Expected: { success: true, data: { foods: [...] } }
    if (res?.success && res?.data) {
      if (Array.isArray(res.data.foods)) return res.data.foods as Food[];
      // Sometimes backend might send directly data as array
      if (Array.isArray(res.data)) return res.data as Food[];
    }
    // Raw array fallback
    if (Array.isArray(res)) return res as Food[];
    console.warn('Unexpected foods response shape', res);
    return [];
  },
  get: async (id: string): Promise<Food> => {
    const res: any = await apiClient.get<any>(`api/foods/${id}`);
    if (res.success && res.data) return res.data as Food;
    if (res.id) return res as Food;
    throw new Error(res.message || 'Failed to load food');
  },
  create: async (payload: CreateFoodRequest): Promise<Food> => {
    const res: any = await apiClient.post<any>('api/foods', payload);
    if (res.success && res.data) return res.data as Food;
    return res as Food;
  },
  update: async (id: string, payload: UpdateFoodRequest): Promise<Food> => {
    const res: any = await apiClient.put<any>(`api/foods/${id}`, payload);
    if (res.success && res.data) return res.data as Food;
    return res as Food;
  },
  delete: async (id: string): Promise<void> => {
    const res: any = await apiClient.delete<any>(`api/foods/${id}`);
    if (res.success === false) throw new Error(res.message || 'Delete failed');
  },
};

export const IntakeApi = {
  list: (date?: string): Promise<IntakeEntry[]> => {
    const endpoint = date ? 'api/intake?date=' + encodeURIComponent(date) : 'api/intake';
    return unwrap(apiClient.get<IntakeEntry[]>(endpoint));
  },
  summary: (date: string): Promise<DailySummary> => unwrap(apiClient.get<DailySummary>('api/intake/summary?date=' + encodeURIComponent(date))),
  create: (payload: CreateIntakeRequest): Promise<IntakeEntry> => unwrap(apiClient.post<IntakeEntry>('api/intake', payload)),
  update: (id: number, payload: UpdateIntakeRequest): Promise<IntakeEntry> => unwrap(apiClient.put<IntakeEntry>(`api/intake/${id}`, payload)),
  delete: (id: number): Promise<void> => unwrap(apiClient.delete<void>(`api/intake/${id}`)),
};
