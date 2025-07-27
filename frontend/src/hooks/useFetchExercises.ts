
import { useState, useEffect } from 'react';
import apiClient from '../apiclient/apiClient';


interface Exercise {
  id: number;
  name: string;
  description: string;
  category: string;
  muscleGroups: string;
  equipment: string;
  createdAt: string;
}

interface FetchExercisesResult {
  exercises: Exercise[];
  loading: boolean;
  error: string | null;
}

const useFetchExercises = (): FetchExercisesResult => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExercises = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.get<Exercise[]>('api/exercises');
        if (response.success && 'data' in response && response.data) {
          setExercises(response.data);
        } else {
          setError(response.message || 'Failed to fetch exercises');
        }
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, []);

  return { exercises, loading, error };
};

export default useFetchExercises;
