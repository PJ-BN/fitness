import React, { useEffect, useState, useContext } from 'react';
import apiClient from '../apiclient/apiClient';
import { useUser } from '../contexts/UserContext';
import type { WorkoutLog } from '../types/api';
import styles from './WorkoutLogList.module.css';

const WorkoutLogList: React.FC = () => {
  const { user, loading: userLoading } = useUser();
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<WorkoutLog[]>([]);
  const [workoutLogsLoading, setWorkoutLogsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const fetchWorkoutLogs = async () => {
      // If user data is still loading, wait for it.
      if (userLoading) {
        setWorkoutLogsLoading(true); // Keep loading state true while user data is being fetched
        return;
      }

      // If user data has finished loading and no user is found, show error.
      if (!user || !user.id) {
        setError('User not logged in or user ID not available.');
        setWorkoutLogsLoading(false); // User data is not loading, and no user is found, so stop loading.
        return;
      }

      // User data is available, proceed to fetch workout logs.
      try {
        setWorkoutLogsLoading(true); // Start loading for workout logs
        const response = await apiClient.get<WorkoutLog[]>(`api/Workouts/ByUser/${user.id}`);
        setWorkoutLogs(response.data);
        setFilteredLogs(response.data);
      } catch (err) {
        setError('Failed to fetch workout logs.');
        console.error('Error fetching workout logs:', err);
      } finally {
        setWorkoutLogsLoading(false); // Stop loading regardless of success or failure
      }
    };

    fetchWorkoutLogs();
  }, [user, userLoading]);

  useEffect(() => {
    let tempLogs = workoutLogs;

    // Filter by date range
    if (startDate) {
      const start = new Date(startDate);
      tempLogs = tempLogs.filter(log => new Date(log.date) >= start);
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setDate(end.getDate() + 1); // Add one day to include the entire end date
      tempLogs = tempLogs.filter(log => new Date(log.date) < end);
    }

    // Filter by exercise name
    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      tempLogs = tempLogs.filter(log =>
        log.workoutExercises.some(we =>
          we.exercise?.name?.toLowerCase().includes(lowerCaseSearchTerm)
        )
      );
    }

    // Sort by date (latest first)
    tempLogs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    setFilteredLogs(tempLogs);
  }, [workoutLogs, startDate, endDate, searchTerm]);

  if (userLoading || workoutLogsLoading) {
    return <div className={styles.message}>Loading workout logs...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <label htmlFor="startDate">Start Date:</label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className={styles.dateInput}
          />
        </div>
        <div className={styles.filterGroup}>
          <label htmlFor="endDate">End Date:</label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className={styles.dateInput}
          />
        </div>
        </div>
      <div className={styles.searchFilterGroup}>
        <div className={styles.filterGroup}>
          <label htmlFor="searchExercise">Search by Exercise:</label>
          <input
            type="text"
            id="searchExercise"
            placeholder="Exercise name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>

      {filteredLogs.length === 0 ? (
        <div className={styles.message}>No workout logs found matching your criteria.</div>
      ) : (
        <div className={styles.listContainer}>
          {filteredLogs.map((log) => (
            <div key={log.id} className={styles.logItem}>
              <p><strong>Date:</strong> {new Date(log.date).toLocaleDateString()}</p>
              <p><strong>Notes:</strong> {log.notes || 'N/A'}</p>
              <div className={styles.exercises}>
                <h4>Exercises:</h4>
                {log.workoutExercises && log.workoutExercises.length > 0 ? (
                  <ul>
                    {log.workoutExercises.map((workoutExercise, index) => (
                      <li key={index}>
                        <strong>Exercise :</strong> {workoutExercise.exercise?.name || workoutExercise.exerciseId || "N/A"}<br />
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
      )}
    </div>
  );
};

export default WorkoutLogList;
