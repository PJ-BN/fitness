import React, { useEffect, useState, useContext } from 'react';
import apiClient from '../apiclient/apiClient';
import { useUser } from '../contexts/UserContext';
import type { WorkoutLog } from '../types/api';
import styles from './WorkoutLogList.module.css';

const WorkoutLogList: React.FC = () => {
  const { user } = useUser();
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
        const response = await apiClient.get<WorkoutLog[]>(`api/Workouts/ByUser/${user.id}`);
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
          <p><strong>Date:</strong> {new Date(log.date).toLocaleDateString()}</p>
          <p><strong>Notes:</strong> {log.notes || 'N/A'}</p>
          <div className={styles.exercises}>
            <h4>Exercises:</h4>
            {log.workoutExercises && log.workoutExercises.length > 0 ? (
              <ul>
                {log.workoutExercises.map((workoutExercise, index) => (
                  <li key={index}>
                    <strong>Exercise ID:</strong> {workoutExercise.exerciseId}
                    <p>Notes: {workoutExercise.notes || 'N/A'}</p>
                    <h5>Sets:</h5>
                    <ul>
                      {workoutExercise.sets.map((set, setIndex) => (
                        <li key={setIndex}>
                          Set {set.setNumber}: {set.reps} reps at {set.weight} kg, Duration: {set.duration} mins, Notes: {set.notes || 'N/A'}
                        </li>
                      ))}
                    </ul>
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
