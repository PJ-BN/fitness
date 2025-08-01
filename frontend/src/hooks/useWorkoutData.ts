import { useState, useEffect } from 'react';
import apiClient from '../apiclient/apiClient';
import { useUser } from '../contexts/UserContext';
import type { WorkoutLog } from '../types/api';

export const useWorkoutData = () => {
  const { user, loading: userLoading } = useUser();
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWorkoutData = async () => {
      if (userLoading) {
        setLoading(true);
        return;
      }

      if (!user || !user.id) {
        setError('User not logged in or user ID not available.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await apiClient.get<WorkoutLog[]>(`api/Workouts/ByUser/${user.id}`);
        setWorkoutLogs(response.data);
      } catch (err) {
        setError('Failed to fetch workout data.');
        console.error('Error fetching workout data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkoutData();
  }, [user, userLoading]);

  return { workoutLogs, loading, error };
};