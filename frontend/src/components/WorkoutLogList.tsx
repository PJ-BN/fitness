import React, { useEffect, useState, useContext } from 'react';
import apiClient from '../apiclient/apiClient';
import { UserContext } from '../contexts/UserContext';
import { WorkoutLog } from '../types/api';
import styles from './WorkoutLogList.module.css';

const WorkoutLogList: React.FC = () => {
  const { user } = useContext(UserContext);
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWorkoutLogs = async () => {
      if (!user || !user.id) {
        setError('User not logged in or user ID not available.');
        setLoading(false);
        return;
      }

      try {
        const response = await apiClient.get<WorkoutLog[]>(`/api/Workouts/ByUser/${user.id}`);
        setWorkoutLogs(response.data);
      } catch (err) {
        setError('Failed to fetch workout logs.');
        console.error('Error fetching workout logs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkoutLogs();
  }, [user]);

  if (loading) {
    return <div className={styles.message}>Loading workout logs...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (workoutLogs.length === 0) {
    return <div className={styles.message}>No workout logs found.</div>;
  }

  return (
    <div className={styles.listContainer}>
      {workoutLogs.map((log) => (
        <div key={log.id} className={styles.logItem}>
          <h3>{log.workoutName}</h3>
          <p><strong>Date:</strong> {new Date(log.date).toLocaleDateString()}</p>
          <p><strong>Duration:</strong> {log.durationMinutes} minutes</p>
          <p><strong>Calories Burned:</strong> {log.caloriesBurned}</p>
          <p><strong>Notes:</strong> {log.notes || 'N/A'}</p>
          <div className={styles.exercises}>
            <h4>Exercises:</h4>
            {log.exercises && log.exercises.length > 0 ? (
              <ul>
                {log.exercises.map((exercise, index) => (
                  <li key={index}>
                    {exercise.name} - {exercise.sets} sets of {exercise.reps} reps at {exercise.weight} kg
                  </li>
                ))}
              </ul>
            ) : (
              <p>No exercises recorded for this workout.</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default WorkoutLogList;
