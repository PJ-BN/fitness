import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import Cookies from 'js-cookie';
import apiClient from '../apiclient/apiClient';
import type { User } from '../types/user';

interface UserContextType {
  user: User | null;
  userId: string | null;
  loading: boolean;
  error: string | null;
  fetchUserData: () => Promise<void>;
  clearUser: () => void;
  isAuthenticated: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: React.ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserData = async (): Promise<void> => {
    const token = Cookies.get('token');
    if (!token) {
      setUser(null);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.get<User>('api/Auth/me');
      if (response.success && 'data' in response && response.data) {
        setUser(response.data);
        // Save userId in cookie for easy access
        Cookies.set('userId', response.data.id, { expires: 7 });
      } else {
        setError(response.message || 'Failed to fetch user data');
        // Clear invalid token
        Cookies.remove('token');
        Cookies.remove('userId');
        setUser(null);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch user data');
      // Clear invalid token
      Cookies.remove('token');
      Cookies.remove('userId');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const clearUser = (): void => {
    setUser(null);
    setError(null);
    Cookies.remove('token');
    Cookies.remove('userId');
  };

  // Auto-fetch user data when component mounts if token exists
  useEffect(() => {
    const token = Cookies.get('token');
    if (token && !user) {
      fetchUserData();
    }
  }, [user]);

  const value: UserContextType = useMemo(() => ({
    user,
    userId: user?.id || Cookies.get('userId') || null,
    loading,
    error,
    fetchUserData,
    clearUser,
    isAuthenticated: !!user && !!Cookies.get('token')
  }), [user, loading, error]);

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
