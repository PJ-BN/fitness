import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../apiclient/apiClient';
import type { ApiResponseWithData } from '../types/api';
import Cookies from 'js-cookie';

interface SignUpData {
  name: string;
  email: string;
  password: string;
}

interface SignUpResult {
  loading: boolean;
  error: string | null;
  success: boolean;
  signUp: (data: SignUpData) => Promise<void>;
}

const useSignUp = (): SignUpResult => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const signUp = async (data: SignUpData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const response = await apiClient.post<ApiResponseWithData<{ token: string }>>('api/Auth/register', data);
      if (response.success) {
        const dataResponse = response as ApiResponseWithData<{ token: string }>;
        if (dataResponse.data && dataResponse.data.token) {
          Cookies.set('token', dataResponse.data.token, { expires: 7 }); // Store token for 7 days
          setSuccess(true);
          navigate('/dashboard'); // Redirect to dashboard on successful signup
        } else {
          setError(response.message || 'Sign up failed: No token received');
        }
      } else {
        setError(response.message || 'Sign up failed');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, success, signUp };
};

export default useSignUp;
