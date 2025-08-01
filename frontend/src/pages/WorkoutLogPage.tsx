import React, { useState, useEffect } from 'react';
import styles from './WorkoutLogPage.module.css';
import useRoutine from '../hooks/useRoutine';
import apiClient from '../apiclient/apiClient';
import type { LegacyWeeklyRoutine, LegacyDayRoutine, RoutineExercise } from '../types/routine';

interface CompletedSet {
  setNumber: number;
  reps: number;
  weight: number;
  duration: number;
  notes: string;
}

interface CompletedExercise {
  exerciseId: number;
  notes: string;
  sets: CompletedSet[];
}

interface WorkoutLogData {
  dayRoutineId: number;
  date: string;
  notes: string;
  completedExercises: CompletedExercise[];
}

const WorkoutLogPage: React.FC = () => {
  const { userRoutines, loading, error, selectRoutine, routine } = useRoutine();
  const [selectedRoutineId, setSelectedRoutineId] = useState<number | null>(null);
  const [todayRoutine, setTodayRoutine] = useState<LegacyDayRoutine | null>(null);
  const [workoutNotes, setWorkoutNotes] = useState<string>('');
  const [completedExercises, setCompletedExercises] = useState<{
    [exerciseId: number]: { notes: string; sets: CompletedSet[] }
  }>({});

  useEffect(() => {
    console.log('WorkoutLogPage: selectedRoutineId changed:', selectedRoutineId);
    if (
      selectedRoutineId &&
      (!routine || Number(routine.id) !== selectedRoutineId)
    ) {
      console.log('WorkoutLogPage: Calling selectRoutine for ID:', selectedRoutineId);
      selectRoutine(selectedRoutineId);
    }
  }, [selectedRoutineId, selectRoutine, routine]);

  useEffect(() => {
    if (routine && routine.routines) {
      const today = new Date();
      const dayOfWeek = today.getDay(); // Sunday - 0, Monday - 1, etc.
      const foundDayRoutine = routine.routines.find(dr => dr.dayOfWeek === dayOfWeek);
      setTodayRoutine(prev => {
        if (
          (foundDayRoutine && (!prev || foundDayRoutine.id !== prev.id)) ||
          (!foundDayRoutine && prev)
        ) {
          return foundDayRoutine || null;
        }
        return prev;
      });
    }
    }, [routine]);

  useEffect(() => {
    // Initialize completed exercises state only when todayRoutine changes
    if (todayRoutine && todayRoutine.exercises) {
      const initialCompletedExercises: { [exerciseId: number]: { notes: string; sets: CompletedSet[] } } = {};
      todayRoutine.exercises.forEach(ex => {
        initialCompletedExercises[ex.exerciseId] = {
          notes: '',
          sets: Array.from({ length: ex.sets || 3 }, (_, i) => ({
            setNumber: i + 1,
            reps: ex.reps || 0,
            weight: ex.weight || 0,
            duration: ex.duration || 0,
            notes: '',
          })),
        };
      });
      setCompletedExercises(initialCompletedExercises);
    } else if (!todayRoutine && Object.keys(completedExercises).length > 0) {
      // If no routine found for today, clear completed exercises
      setCompletedExercises({});
    }
  }, [todayRoutine]);

  const handleRoutineSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRoutineId(Number(e.target.value));
  };

  const handleSetChange = (
    exerciseId: number,
    setIndex: number,
    field: keyof CompletedSet,
    value: string | number
  ) => {
    setCompletedExercises(prev => {
      const currentExerciseData = prev[exerciseId];
      if (!currentExerciseData) {
        console.warn(`Exercise data not found for exerciseId: ${exerciseId}`);
        return prev; // Return previous state if exercise data is not found
      }

      const updatedSets = currentExerciseData.sets.map((set, idx) => {
        const updatedValue = (field === 'reps' || field === 'weight' || field === 'duration') ? Number(value) : String(value);
        return idx === setIndex ? { ...set, [field]: updatedValue } : set;
      });

      return {
        ...prev,
        [exerciseId]: {
          ...currentExerciseData,
          sets: updatedSets,
        },
      };
    });
  };

  const handleAddSet = (exerciseId: number) => {
    setCompletedExercises(prev => {
      const currentExerciseData = prev[exerciseId];
      if (!currentExerciseData) {
        console.warn(`Exercise data not found for exerciseId: ${exerciseId}`);
        return prev;
      }
      const newSetNumber = currentExerciseData.sets.length > 0 ? Math.max(...currentExerciseData.sets.map(s => s.setNumber)) + 1 : 1;
      const newSet: CompletedSet = {
        setNumber: newSetNumber,
        reps: 0,
        weight: 0,
        duration: 0,
        notes: '',
      };
      return {
        ...prev,
        [exerciseId]: {
          ...currentExerciseData,
          sets: [...currentExerciseData.sets, newSet],
        },
      };
    });
  };

  const handleRemoveSet = (exerciseId: number, setIndex: number) => {
    setCompletedExercises(prev => {
      const currentExerciseData = prev[exerciseId];
      if (!currentExerciseData) {
        console.warn(`Exercise data not found for exerciseId: ${exerciseId}`);
        return prev;
      }
      const updatedSets = currentExerciseData.sets.filter((_, idx) => idx !== setIndex);
      // Re-number sets after removal
      const renumberedSets = updatedSets.map((set, idx) => ({ ...set, setNumber: idx + 1 }));
      return {
        ...prev,
        [exerciseId]: {
          ...currentExerciseData,
          sets: renumberedSets,
        },
      };
    });
  };

  const handleExerciseNotesChange = (exerciseId: number, notes: string) => {
    setCompletedExercises(prev => {
      const currentExerciseData = prev[exerciseId];
      if (!currentExerciseData) {
        console.warn(`Exercise data not found for exerciseId: ${exerciseId}`);
        return prev; // Return previous state if exercise data is not found
      }
      return {
        ...prev,
        [exerciseId]: { ...currentExerciseData, notes },
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('DEBUG:', { todayRoutine, selectedRoutineId, todayRoutineId: todayRoutine?.id });

    if (!todayRoutine || !selectedRoutineId ) {
      alert('Please select a routine and ensure todays routine is loaded with a valid ID.');
      return;
    }

    const completedExercisesArray: CompletedExercise[] = Object.entries(completedExercises).map(([exerciseId, data]) => ({
      exerciseId: Number(exerciseId),
      notes: data.notes,
      sets: data.sets,
    }));

    console.log("today routineid :", todayRoutine.exercises[0].dayRoutineId);
    console.log("completed exercises array :", completedExercisesArray);

    const workoutLog: WorkoutLogData = {
      dayRoutineId: todayRoutine.exercises[0].dayRoutineId ?? todayRoutine.id, // Use nullish coalescing to provide a fallback
      date: new Date().toISOString(),
      notes: workoutNotes,
      completedExercises: completedExercisesArray,
    };

    try {
      const response = await apiClient.workoutLogs.create(workoutLog);
      if (response.success) {
        alert('Workout log submitted successfully!');
        // Optionally reset form or navigate
        setWorkoutNotes('');
        setCompletedExercises({});
        setTodayRoutine(null);
        setSelectedRoutineId(null);
      } else {
        alert(`Failed to submit workout log: ${response.message}`);
      }
    } catch (err: any) {
      alert(`An error occurred: ${err.message}`);
    }
  };

  if (loading) {
    return <div className={styles.container}>Loading routines...</div>;
  }

  if (error) {
    return <div className={styles.container}>Error: {error}</div>;
  }

  return (
    <div className={styles.container}>
      <h1>Log Your Workout</h1>

      <section className={styles.routineSelectSection}>
        <div className={styles.routineSelectCard}>
          <div className={styles.routineSelectHeader}>
            <span className={styles.routineSelectIcon} role="img" aria-label="dumbbell">🏋️‍♂️</span>
            <div>
              <h2 className={styles.routineSelectTitle}>Choose Your Routine</h2>
              <p className={styles.routineSelectSubtitle}>Select a routine to log today's workout</p>
            </div>
          </div>
          <label htmlFor="routine-select" className={styles.routineSelectLabel}>
            Routine
          </label>
          <select
            id="routine-select"
            onChange={handleRoutineSelect}
            value={selectedRoutineId ?? ''}
            className={styles.routineSelectDropdown}
            aria-label="Select your workout routine"
          >
            <option value="">-- Choose a Routine --</option>
            {userRoutines?.map(r => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
        </div>
      </section>

      {selectedRoutineId && !todayRoutine && (
        <div className={styles.message}>No workout planned for today in the selected routine.</div>
      )}

      {todayRoutine && (
        <form onSubmit={handleSubmit} className={styles.form}>
          <h2>Today's Routine: {todayRoutine.dayName}</h2>
          {todayRoutine.isRestDay ? (
            <p>It's a rest day! Enjoy your recovery.</p>
          ) : (
            <div className={styles.exercisesList}>
              {(todayRoutine.exercises?.length || 0) === 0 ? (
                <p>No exercises planned for today.</p>
              ) : (
                todayRoutine.exercises?.map(ex => (
                  <div key={ex.exerciseId} className={styles.exerciseCard}>
                    <h3>{ex.exercise?.name || 'Unknown Exercise'}</h3>
                    <p>Sets: {ex.sets} | Reps: {ex.reps}</p>
                    
                    <div className={styles.setsContainer}>
                      {completedExercises[ex.exerciseId]?.sets.map((set, setIndex) => (
                        <div key={setIndex} className={styles.setRow}>
                          <span>Set {set.setNumber}:</span>
                          <div className={styles.inputGroup}>
                            <label htmlFor={`reps-${ex.exerciseId}-${setIndex}`}>Reps:</label>
                            <input
                              id={`reps-${ex.exerciseId}-${setIndex}`}
                              type="number"
                              value={set.reps}
                              onChange={e => handleSetChange(ex.exerciseId, setIndex, 'reps', Number(e.target.value))}
                              className={styles.smallInput}
                            />
                          </div>
                          <div className={styles.inputGroup}>
                            <label htmlFor={`weight-${ex.exerciseId}-${setIndex}`}>Weight (kg):</label>
                            <input
                              id={`weight-${ex.exerciseId}-${setIndex}`}
                              type="number"
                              value={set.weight}
                              onChange={e => handleSetChange(ex.exerciseId, setIndex, 'weight', Number(e.target.value))}
                              className={styles.smallInput}
                            />
                          </div>
                          <div className={styles.inputGroup}>
                            <label htmlFor={`duration-${ex.exerciseId}-${setIndex}`}>Duration (min):</label>
                            <input
                              id={`duration-${ex.exerciseId}-${setIndex}`}
                              type="number"
                              value={set.duration}
                              onChange={e => handleSetChange(ex.exerciseId, setIndex, 'duration', Number(e.target.value))}
                              className={styles.smallInput}
                            />
                          </div>
                          <div className={styles.inputGroup}>
                            <label htmlFor={`notes-${ex.exerciseId}-${setIndex}`}>Notes:</label>
                            <input
                              id={`notes-${ex.exerciseId}-${setIndex}`}
                              type="text"
                              value={set.notes}
                              onChange={e => handleSetChange(ex.exerciseId, setIndex, 'notes', e.target.value)}
                              className={styles.wideInput}
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveSet(ex.exerciseId, setIndex)}
                            className={styles.removeSetButton}
                          >
                            Remove Set
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => handleAddSet(ex.exerciseId)}
                        className={styles.addSetButton}
                      >
                        Add Set
                      </button>
                    </div>
                    <textarea
                      placeholder="Notes for this exercise..."
                      value={completedExercises[ex.exerciseId]?.notes || ''}
                      onChange={e => handleExerciseNotesChange(ex.exerciseId, e.target.value)}
                      className={styles.notesTextarea}
                    />
                  </div>
                ))
              )}
            </div>
          )}

          <div className={styles.section}>
            <label htmlFor="workout-notes">Overall Workout Notes:</label>
            <textarea
              id="workout-notes"
              value={workoutNotes}
              onChange={e => setWorkoutNotes(e.target.value)}
              className={styles.notesTextarea}
            />
          </div>

          <button type="submit" className={styles.submitButton}>Log Workout</button>
        </form>
      )}
    </div>
  );
};

export default WorkoutLogPage;