import { useState, useEffect } from 'react';
import apiClient from '../apiclient/apiClient';
import type { User, UserProfileUpdate, ChangePasswordRequest } from '../types/user';
import type { ApiResponse, ApiResponseWithData } from '../types/api';

interface UseUserProfileResult {
  user: User | null;
  loading: boolean;
  error: string | null;
  updateUserProfile: (data: UserProfileUpdate) => Promise<boolean>;
  changePassword: (data: ChangePasswordRequest) => Promise<boolean>;
  refreshUserProfile: () => Promise<void>;
}

const useUserProfile = (): UseUserProfileResult => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get<User>('api/Auth/me');
      
      if (response.success && 'data' in response) {
        setUser(response.data);
        return true;
      } else {
        setError(response.message || 'Failed to fetch user profile');
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const updateUserProfile = async (data: UserProfileUpdate): Promise<boolean> => {
    try {
      const response = await apiClient.put<never>('api/Auth/profile', data);
      
      if (response.success) {
        // Refresh user data after successful update
        await fetchUserProfile();
        return true;
      } else {
        setError(response.message || 'Failed to update profile');
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      return false;
    }
  };

  const changePassword = async (data: ChangePasswordRequest): Promise<boolean> => {
    try {
      const response = await apiClient.put<never>('api/Auth/change-password', data);
      
      if (response.success) {
        return true;
      } else {
        setError(response.message || 'Failed to change password');
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      return false;
    }
  };

  const refreshUserProfile = async () => {
    await fetchUserProfile();
  };

  return { user, loading, error, updateUserProfile, changePassword, refreshUserProfile };
};

export default useUserProfile;