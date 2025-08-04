import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../apiclient/apiClient';
import type { User } from '../types/user';
import Cookies from 'js-cookie';

interface LoginData {
  email: string;
  password: string;
}

interface LoginResult {
  loading: boolean;
  error: string | null;
  success: boolean;
  login: (data: LoginData) => Promise<void>;
}

const useLogin = (): LoginResult => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const login = async (data: LoginData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      // Step 1: Login and get token
      const loginResponse = await apiClient.auth.login(data);
      if (loginResponse.success && 'data' in loginResponse && loginResponse.data?.token) {
        const token = loginResponse.data.token;
        Cookies.set('token', token, { expires: 7 }); // Store token for 7 days
        
        // Step 2: Get user data using the token
        try {
          const userResponse = await apiClient.get<User>('api/Auth/me');
          if (userResponse.success && 'data' in userResponse && userResponse.data) {
            // Save user ID in cookie for easy access
            Cookies.set('userId', userResponse.data.id, { expires: 7 });
            setSuccess(true);
            navigate('/dashboard'); // Redirect to dashboard on successful login
            window.location.reload(); // Force full browser refresh
          } else {
            setError('Failed to fetch user data after login');
            // Clear the token since we couldn't get user data
            Cookies.remove('token');
          }
        } catch (userErr) {
          setError('Failed to fetch user data after login');
          // Clear the token since we couldn't get user data
          Cookies.remove('token');
        }
      } else {
        setError(loginResponse.message || 'Login failed: No token received');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, success, login };
};

export default useLogin;