
import React, { useState, useEffect } from 'react';
import styles from './RoutinePage.module.css';
import useRoutine from '../hooks/useRoutine';
import useFetchExercises from '../hooks/useFetchExercises';
import CreateRoutineForm from '../components/CreateRoutineForm';
import RoutineList from '../components/RoutineList';
import type { LegacyDayRoutine, RoutineExercise } from '../types/routine';
import { BODY_PARTS } from '../types/routine';

interface RoutineModalProps {
  isOpen: boolean;
  onClose: () => void;
  dayRoutine: LegacyDayRoutine | null;
  onSave: (dayOfWeek: number, bodyParts: string[], exercises: RoutineExercise[], isRestDay: boolean) => void;
  exercises: any[];
}

const RoutineModal: React.FC<RoutineModalProps> = ({ 
  isOpen, 
  onClose, 
  dayRoutine, 
  onSave, 
  exercises 
}) => {
  const [selectedBodyParts, setSelectedBodyParts] = useState<string[]>([]);
  const [selectedExercises, setSelectedExercises] = useState<RoutineExercise[]>([]);
  const [isRestDay, setIsRestDay] = useState<boolean>(false);

  useEffect(() => {
    if (dayRoutine) {
      setSelectedBodyParts(dayRoutine.bodyParts || []);
      setSelectedExercises(dayRoutine.exercises || []);
      setIsRestDay(dayRoutine.isRestDay || false);
    }
  }, [dayRoutine]);

  const filteredExercises = exercises.filter(exercise => {
    if (selectedBodyParts.length === 0) return true;
    return selectedBodyParts.some(bodyPart => 
      exercise.muscleGroups.toLowerCase().includes(bodyPart.toLowerCase()) ||
      exercise.category.toLowerCase().includes(bodyPart.toLowerCase())
    );
  });

  const handleBodyPartToggle = (bodyPart: string) => {
    setSelectedBodyParts(prev => 
      prev.includes(bodyPart) 
        ? prev.filter(bp => bp !== bodyPart)
        : [...prev, bodyPart]
    );
  };

  const handleExerciseToggle = (exercise: any) => {
    const routineExercise: RoutineExercise = {
      exerciseId: exercise.id,
      exercise: exercise,
      sets: 3,
      reps: 10
    };

    setSelectedExercises(prev => {
      const exists = prev.find(ex => ex.exerciseId === exercise.id);
      if (exists) {
        return prev.filter(ex => ex.exerciseId !== exercise.id);
      } else {
        return [...prev, routineExercise];
      }
    });
  };

  const handleSave = () => {
    if (dayRoutine) {
      onSave(dayRoutine.dayOfWeek, selectedBodyParts, selectedExercises, isRestDay);
      onClose();
    }
  };

  const isExerciseSelected = (exerciseId: number) => {
    return selectedExercises.some(ex => ex.exerciseId === exerciseId);
  };

  if (!isOpen || !dayRoutine) return null;

  return (
    <div className={styles.routineModal}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            {dayRoutine.dayName} Routine
          </h2>
          <button className={styles.closeButton} onClick={onClose}>
            &times;
          </button>
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <input
              type="checkbox"
              checked={isRestDay}
              onChange={() => setIsRestDay(val => !val)}
            />
            <span>Set this day as Rest Day</span>
          </label>
        </div>

        {!isRestDay && (
          <>
            <div className={styles.bodyPartsSelector}>
              <h3 className={styles.selectorTitle}>Select Body Parts</h3>
              <div className={styles.bodyPartsCheckboxGrid}>
                {BODY_PARTS.map(bodyPart => (
                  <label 
                    key={bodyPart} 
                    className={`${styles.checkboxItem} ${
                      selectedBodyParts.includes(bodyPart) ? styles.checked : ''
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedBodyParts.includes(bodyPart)}
                      onChange={() => handleBodyPartToggle(bodyPart)}
                    />
                    <span>{bodyPart}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className={styles.exercisesSelector}>
              <h3 className={styles.selectorTitle}>
                Select Exercises ({selectedExercises.length} selected)
              </h3>
              <div className={styles.exercisesGrid}>
                {filteredExercises.map(exercise => (
                  <button
                    key={exercise.id}
                    className={`${styles.exerciseCard} ${
                      isExerciseSelected(exercise.id) ? styles.selected : ''
                    }`}
                    onClick={() => handleExerciseToggle(exercise)}
                    type="button"
                    aria-pressed={isExerciseSelected(exercise.id)}
                  >
                    <div className={styles.exerciseName}>{exercise.name}</div>
                    <div className={styles.exerciseCategory}>{exercise.category}</div>
                    <div className={styles.exerciseMuscles}>{exercise.muscleGroups}</div>
                    {isExerciseSelected(exercise.id) && (
                      <div className={styles.selectedExercisesBadge}>✓</div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        <div className={styles.modalActions}>
          <button 
            className={`${styles.actionButton} ${styles.secondaryButton}`}
            onClick={onClose}
          >
            Cancel
          </button>
          <button 
            className={`${styles.actionButton} ${styles.primaryButton}`}
            onClick={handleSave}
          >
            Save Routine
          </button>
        </div>
      </div>
    </div>
  );
};

const RoutinePage: React.FC = () => {
  const { 
    routine, 
    userRoutines, 
    loading, 
    error, 
    hasRoutines,
    createNewRoutine,
    selectRoutine,
    updateDayRoutine 
  } = useRoutine();
  const { exercises, loading: exercisesLoading, error: exercisesError } = useFetchExercises();
  const [selectedDay, setSelectedDay] = useState<LegacyDayRoutine | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedRoutineId, setSelectedRoutineId] = useState<number | undefined>(undefined);

  // Remove auto-show create form on reload. Only show when user clicks create.

  const handleCreateNew = () => {
    setShowCreateForm(true);
  };

  const handleCreateRoutine = async (name: string, description: string) => {
    try {
      console.log('Starting routine creation process...');
      const success = await createNewRoutine(name, description);
      
      if (success) {
        console.log('✓ All 8 API requests completed successfully');
        // Show success message and close form
        alert(`🎉 Routine "${name}" created successfully!`);
        setShowCreateForm(false);
        // The user will manually select a routine from the list
      }
      // If success is false, error is already set by the hook and form stays open
    } catch (error) {
      console.error('Routine creation failed:', error);
      // Error is handled by the hook, form stays open
    }
  };

  const handleSelectRoutine = async (routineId: number) => {
    setSelectedRoutineId(routineId);
    await selectRoutine(routineId);
  };

  const handleBackToRoutineList = () => {
    setSelectedRoutineId(undefined);
    setShowCreateForm(false);
  };

  const handleDayClick = (dayRoutine: LegacyDayRoutine) => {
    setSelectedDay(dayRoutine);
    setIsModalOpen(true);
  };

  const handleSaveRoutine = async (
    dayOfWeek: number,
    bodyParts: string[],
    exercises: RoutineExercise[],
    isRestDay: boolean
  ) => {
    try {
      await updateDayRoutine(dayOfWeek, {
        bodyParts,
        exercises,
        isRestDay
      });
      console.log('✓ Day routine updated successfully');
    } catch (error) {
      console.error('Failed to update day routine:', error);
      alert('Failed to save routine. Please try again.');
    }
  };

  const getCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const currentDay = new Date(startDate);
    
    while (currentDay <= lastDay || currentDay.getDay() !== 0) {
      days.push(new Date(currentDay));
      currentDay.setDate(currentDay.getDate() + 1);
      if (days.length > 42) break; // Prevent infinite loop
    }
    
    return days;
  };

  const getDayRoutine = (date: Date) => {
    if (!routine) return null;
    const dayOfWeek = date.getDay();
    return (routine as any)?.routines?.find((r: any) => r.dayOfWeek === dayOfWeek) || null;
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const getRoutineStats = () => {
    if (!routine) return { totalDays: 0, totalExercises: 0, totalBodyParts: 0 };
    
    const routines = (routine as any)?.routines || [];
    const activeDays = routines.filter((r: any) => !r.isRestDay && r.exercises.length > 0);
    const totalExercises = activeDays.reduce((sum: number, day: any) => sum + day.exercises.length, 0);
    const allBodyParts = new Set(activeDays.flatMap((day: any) => day.bodyParts));
    
    return {
      totalDays: activeDays.length,
      totalExercises,
      totalBodyParts: allBodyParts.size
    };
  };

  if (loading || exercisesLoading) {
    return (
      <div className={styles.routinePageContainer}>
        <div className={styles.emptyState}>
          <div className={styles.emptyStateIcon}>⏳</div>
          <div className={styles.emptyStateText}>Loading your routine...</div>
        </div>
      </div>
    );
  }

  if (error || exercisesError) {
    return (
      <div className={styles.routinePageContainer}>
        <div className={styles.emptyState}>
          <div className={styles.emptyStateIcon}>❌</div>
          <div className={styles.emptyStateText}>
            Error: {error || exercisesError}
          </div>
        </div>
      </div>
    );
  }

  // Show create routine form if requested or no routines exist
  if (showCreateForm) {
    return (
      <div className={styles.routinePageContainer}>
        <div className={styles.pageHeader}>
          {hasRoutines && (
            <button 
              onClick={handleBackToRoutineList}
              className={styles.backButton}
            >
              ← Back to Routines
            </button>
          )}
          <h1 className={styles.pageTitle}>Create New Routine</h1>
        </div>
        <CreateRoutineForm 
          onSubmit={handleCreateRoutine}
          loading={loading}
          error={error}
        />
      </div>
    );
  }

  // Show routine list if no routine is selected
  if (!routine || selectedRoutineId === undefined) {
    return (
      <div className={styles.routinePageContainer}>
        <RoutineList 
          routines={userRoutines || []}
          onSelectRoutine={handleSelectRoutine}
          onCreateNew={handleCreateNew}
          loading={loading}
          selectedRoutineId={selectedRoutineId}
        />
      </div>
    );
  }

  // Show the routine details and calendar (existing functionality)
  const stats = getRoutineStats();
  const calendarDays = getCalendarDays();

  return (
    <div className={styles.routinePageContainer}>
      <div className={styles.pageHeader}>
        <button 
          onClick={handleBackToRoutineList}
          className={styles.backButton}
        >
          ← Back to Routines
        </button>
        <div>
          <h1 className={styles.pageTitle}>{routine.name}</h1>
          <p className={styles.pageSubtitle}>
            {routine.description || 'Design your perfect weekly workout schedule with custom exercises for each day'}
          </p>
        </div>
      </div>

      <div className={styles.routineStats}>
        <div className={styles.statItem}>
          <div className={styles.statNumber}>{stats.totalDays}</div>
          <div className={styles.statLabel}>Active Days</div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statNumber}>{stats.totalExercises}</div>
          <div className={styles.statLabel}>Total Exercises</div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statNumber}>{stats.totalBodyParts}</div>
          <div className={styles.statLabel}>Body Parts</div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statNumber}>1</div>
          <div className={styles.statLabel}>Rest Day</div>
        </div>
      </div>

      <div className={styles.routineContent}>
        <div className={styles.routineBuilder}>
          <h2 className={styles.sectionTitle}>📅 Weekly Schedule</h2>
          <div className={styles.daysGrid}>
            {(routine as any)?.routines?.map((dayRoutine: any) => (
              <button
                key={dayRoutine.dayOfWeek}
                className={`${styles.dayCard} ${
                  dayRoutine.isRestDay ? styles.restDayCard : ''
                } ${dayRoutine.exercises.length > 0 ? styles.selected : ''}`}
                onClick={() => handleDayClick(dayRoutine)}
                type="button"
              >
                <div className={styles.dayHeader}>
                  <h3 className={styles.dayName}>{dayRoutine.dayName}</h3>
                  {dayRoutine.isRestDay && (
                    <span className={styles.restDayBadge}>Rest Day</span>
                  )}
                </div>
                
                {!dayRoutine.isRestDay && (
                  <>
                    <div className={styles.bodyPartsSection}>
                      <div className={styles.bodyPartsGrid}>
                        {dayRoutine.bodyParts.map((bodyPart: any) => (
                          <span key={bodyPart} className={styles.bodyPartChip}>
                            {bodyPart}
                            <span className={styles.exerciseCount}>
                              {dayRoutine.exercises.filter((ex: any) => 
                                ex.exercise && (ex.exercise.muscleGroups.toLowerCase().includes(bodyPart.toLowerCase()) ||
                                ex.exercise.category.toLowerCase().includes(bodyPart.toLowerCase()))
                              ).length}
                            </span>
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className={styles.exercisesList}>
                      {dayRoutine.exercises.map((routineEx: any) => (
                        <div key={routineEx.exerciseId} className={styles.exerciseItem}>
                          {routineEx.exercise ? `${routineEx.exercise.name} (${routineEx.sets}x${routineEx.reps})` : 'Loading exercise...'}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.routineCalendar}>
          <h2 className={styles.sectionTitle}>📅 Calendar View</h2>
          
          <div className={styles.calendarHeader}>
            <div className={styles.calendarNav}>
              <button 
                className={styles.navButton}
                onClick={() => navigateMonth('prev')}
              >
                ← Prev
              </button>
              <button 
                className={styles.navButton}
                onClick={() => navigateMonth('next')}
              >
                Next →
              </button>
            </div>
            <div className={styles.currentMonth}>
              {currentDate.toLocaleDateString('en-US', { 
                month: 'long', 
                year: 'numeric' 
              })}
            </div>
          </div>

          <div className={styles.calendarGrid}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className={styles.calendarDayHeader}>
                {day}
              </div>
            ))}
            
            {calendarDays.map((date) => {
              const dayRoutine = getDayRoutine(date);
              const hasRoutine = dayRoutine && dayRoutine.exercises.length > 0;
              const isRestDay = dayRoutine?.isRestDay;
              const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
              
              return (
                <div
                  key={dateKey}
                  className={`${styles.calendarDay} ${
                    isToday(date) ? styles.today : ''
                  } ${hasRoutine ? styles.hasRoutine : ''} ${
                    isRestDay ? styles.restDay : ''
                  }`}
                >
                  <div className={styles.dayNumber}>
                    {date.getDate()}
                  </div>
                  {hasRoutine && <div className={styles.routineIndicator} />}
                  {isRestDay && <div className={styles.restIndicator} />}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <RoutineModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        dayRoutine={selectedDay}
        onSave={handleSaveRoutine}
        exercises={exercises}
      />
    </div>
  );
};

export default RoutinePage;
