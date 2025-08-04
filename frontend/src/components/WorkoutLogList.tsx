import React, { useEffect, useState, useMemo } from 'react';
import apiClient from '../apiclient/apiClient';
import { useUser } from '../contexts/UserContext';
import type { WorkoutLog } from '../types/api';
import styles from './WorkoutLogList.module.css';
import useDebounce from '../hooks/useDebounce';
import Fuse from 'fuse.js';

const WorkoutLogList: React.FC = () => {
  const { user, loading: userLoading } = useUser();
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLog[]>([]);
  const [workoutLogsLoading, setWorkoutLogsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300); // Debounce search term by 300ms

  useEffect(() => {
    const fetchWorkoutLogs = async () => {
      if (!user || !user.id) {
        if (!userLoading) {
          setError('User not logged in or user ID not available.');
        }
        setWorkoutLogsLoading(false);
        return;
      }

      try {
        setWorkoutLogsLoading(true);
        const response = await apiClient.get<WorkoutLog[]>(`api/Workouts/ByUser/${user.id}`);
        setWorkoutLogs(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch workout logs.');
        console.error('Error fetching workout logs:', err);
      } finally {
        setWorkoutLogsLoading(false);
      }
    };

    if (!userLoading) {
      fetchWorkoutLogs();
    }
  }, [user, userLoading]);

  const filteredAndSortedLogs = useMemo(() => {
    let tempLogs = workoutLogs;

    // Date filtering
    if (startDate) {
      const start = new Date(startDate);
      tempLogs = tempLogs.filter(log => new Date(log.date) >= start);
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setDate(end.getDate() + 1);
      tempLogs = tempLogs.filter(log => new Date(log.date) < end);
    }

    // Fuzzy search by exercise name using Fuse.js
    if (debouncedSearchTerm) {
      const fuseOptions = {
        keys: [
          {
            name: 'workoutExercises.exercise.name',
            weight: 0.7 // Give more weight to exercise name matches
          },
          {
            name: 'notes',
            weight: 0.3 // Less weight to notes
          }
        ],
        threshold: 0.3, // Adjust this value for strictness
        includeScore: true // Include score for debugging if needed
      };
      const fuse = new Fuse(tempLogs, fuseOptions);
      tempLogs = fuse.search(debouncedSearchTerm).map(result => result.item);
    }

    // Sort by date (newest first)
    return tempLogs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [workoutLogs, startDate, endDate, debouncedSearchTerm]);

  // Use filteredAndSortedLogs instead of filteredLogs
  // setFilteredLogs(tempLogs); // This line is no longer needed as useMemo handles it

  if (userLoading || workoutLogsLoading) {
    return (
      <div className={styles.loaderContainer}>
        <div className={styles.loader}></div>
      </div>
    );
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
            placeholder="Exercise name or notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>

      {filteredAndSortedLogs.length === 0 ? (
        <div className={styles.message}>No workout logs found matching your criteria.</div>
      ) : (
        <div className={styles.listContainer}>
          {filteredAndSortedLogs.map((log) => (
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
