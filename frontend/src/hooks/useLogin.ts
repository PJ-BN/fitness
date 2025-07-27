import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../apiclient/apiClient';
import type { ApiResponseWithData } from '../types/api';
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
      const response = await apiClient.post<ApiResponseWithData<{ token: string }>>('api/Auth/login', data);
      if (response.success) {
        const dataResponse = response as ApiResponseWithData<{ token: string }>;
        if (dataResponse.data && dataResponse.data.token) {
          Cookies.set('token', dataResponse.data.token, { expires: 7 }); // Store token for 7 days
          setSuccess(true);
          navigate('/dashboard'); // Redirect to dashboard on successful login
        } else {
          setError(response.message || 'Login failed: No token received');
        }
      } else {
        setError(response.message || 'Login failed');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, success, login };
};

export default useLogin;
