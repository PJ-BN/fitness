import React, { useState, useEffect } from 'react';
import useWeeklyRoutines from '../hooks/useWeeklyRoutines';
import useDayRoutine from '../hooks/useDayRoutine';
import useFetchExercises from '../hooks/useFetchExercises';
import { useUser } from '../contexts/UserContext';
import type { WeeklyRoutine, DayRoutine } from '../types/routine';
import { DAYS_OF_WEEK } from '../types/routine';

interface RoutineManagerProps {
  className?: string;
}

const RoutineManager: React.FC<RoutineManagerProps> = ({ className }) => {
  const { userId, isAuthenticated } = useUser();
  const weeklyRoutines = useWeeklyRoutines();
  const dayRoutine = useDayRoutine();
  const { exercises, loading: exercisesLoading, error: exercisesError } = useFetchExercises();
  
  const [routines, setRoutines] = useState<any[]>([]);
  const [selectedRoutine, setSelectedRoutine] = useState<any>(null);
  const [selectedDay, setSelectedDay] = useState<DayRoutine | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newRoutineName, setNewRoutineName] = useState('');
  const [newRoutineDescription, setNewRoutineDescription] = useState('');

  // Helper functions for status display
  const getWeeklyRoutinesStatus = () => {
    if (weeklyRoutines.loading) return 'Loading...';
    if (weeklyRoutines.error) return `Error: ${weeklyRoutines.error}`;
    return 'Ready';
  };

  const getDayRoutinesStatus = () => {
    if (dayRoutine.loading) return 'Loading...';
    if (dayRoutine.error) return `Error: ${dayRoutine.error}`;
    return 'Ready';
  };

  const getExercisesStatus = () => {
    if (exercisesLoading) return 'Loading...';
    if (exercisesError) return `Error: ${exercisesError}`;
    return `Loaded ${exercises.length} exercises`;
  };

  // Load all weekly routines on component mount
  useEffect(() => {
    const loadRoutines = async () => {
      if (isAuthenticated && userId) {
        try {
          const allRoutines = await weeklyRoutines.getAllRoutines();
          // Filter routines for current user
          const userRoutines = allRoutines.filter(routine => routine.userId === userId);
          setRoutines(userRoutines);
          
          // Select the first active routine if available
          const activeRoutine = userRoutines.find(routine => routine.isActive);
          if (activeRoutine) {
            setSelectedRoutine(activeRoutine);
          }
        } catch (error) {
          console.error('Failed to load routines:', error);
        }
      }
    };

    loadRoutines();
  }, [isAuthenticated, userId]);

  const handleCreateRoutine = async () => {
    if (!newRoutineName.trim() || !userId) return;

    try {
      const newRoutine = await weeklyRoutines.createRoutine({
        name: newRoutineName,
        description: newRoutineDescription,
        userId: userId,
        isActive: true
      });

      if (newRoutine) {
        setRoutines(prev => [...prev, newRoutine]);
        setSelectedRoutine(newRoutine);
        setNewRoutineName('');
        setNewRoutineDescription('');
        setShowCreateModal(false);
      }
    } catch (error) {
      console.error('Failed to create routine:', error);
    }
  };

  const handleDeleteRoutine = async (routineId: number) => {
    if (!window.confirm('Are you sure you want to delete this routine?')) return;

    try {
      const success = await weeklyRoutines.deleteRoutine(routineId);
      if (success) {
        setRoutines(prev => prev.filter(routine => routine.id !== routineId));
        if (selectedRoutine?.id === routineId) {
          setSelectedRoutine(null);
        }
      }
    } catch (error) {
      console.error('Failed to delete routine:', error);
    }
  };

  const handleUpdateRoutine = async (routineId: number, updates: Partial<WeeklyRoutine>) => {
    try {
      const updatedRoutine = await weeklyRoutines.updateRoutine(routineId, updates);
      if (updatedRoutine) {
        setRoutines(prev => prev.map(routine => 
          routine.id === routineId ? updatedRoutine : routine
        ));
        if (selectedRoutine?.id === routineId) {
          setSelectedRoutine(updatedRoutine);
        }
      }
    } catch (error) {
      console.error('Failed to update routine:', error);
    }
  };

  const handleDayClick = async (dayOfWeek: number) => {
    if (!selectedRoutine) return;

    try {
      const dayRoutineData = await weeklyRoutines.getDayRoutine(selectedRoutine.id, dayOfWeek);
      if (dayRoutineData) {
        setSelectedDay(dayRoutineData);
      } else {
        // Create a new day routine if none exists
        const dayName = DAYS_OF_WEEK.find(d => d.id === dayOfWeek)?.name || 'Unknown';
        setSelectedDay({
          id: 0,
          weeklyRoutineId: selectedRoutine.id,
          dayOfWeek,
          dayName,
          bodyParts: [],
          exercises: [],
          isRestDay: false
        });
      }
      console.log('Selected day routine:', selectedDay);
    } catch (error) {
      console.error('Failed to load day routine:', error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className={className}>
        <p>Please log in to manage your workout routines.</p>
      </div>
    );
  }

  return (
    <div className={className}>
      <div style={{ marginBottom: '20px' }}>
        <h2>Weekly Routine Manager</h2>
        <p>Create and manage your weekly workout routines using the new API endpoints.</p>
      </div>

      {/* Routine Selection */}
      <div style={{ marginBottom: '20px' }}>
        <h3>Your Routines</h3>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          {routines.map(routine => (
            <button
              key={routine.id}
              style={{
                padding: '10px',
                border: selectedRoutine?.id === routine.id ? '2px solid #007bff' : '1px solid #ccc',
                borderRadius: '5px',
                cursor: 'pointer',
                backgroundColor: routine.isActive ? '#f8f9fa' : '#e9ecef',
                textAlign: 'left',
                minWidth: '120px'
              }}
              onClick={() => setSelectedRoutine(routine)}
              type="button"
            >
              <div style={{ fontWeight: 'bold' }}>{routine.name}</div>
              <div style={{ fontSize: '0.8em', color: '#666' }}>
                {routine.isActive ? 'Active' : 'Inactive'}
              </div>
              <div style={{ marginTop: '5px' }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUpdateRoutine(routine.id, { isActive: !routine.isActive });
                  }}
                  style={{ marginRight: '5px', padding: '2px 6px', fontSize: '0.8em' }}
                  type="button"
                >
                  {routine.isActive ? 'Deactivate' : 'Activate'}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteRoutine(routine.id);
                  }}
                  style={{ padding: '2px 6px', fontSize: '0.8em', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '3px' }}
                  type="button"
                >
                  Delete
                </button>
              </div>
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px' }}
        >
          Create New Routine
        </button>
      </div>

      {/* Day Routines */}
      {selectedRoutine && (
        <div>
          <h3>Days for: {selectedRoutine.name}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px' }}>
            {DAYS_OF_WEEK.map(day => (
              <button
                key={day.id}
                onClick={() => handleDayClick(day.id)}
                style={{
                  padding: '15px',
                  border: '1px solid #ccc',
                  borderRadius: '5px',
                  backgroundColor: '#f8f9fa',
                  cursor: 'pointer'
                }}
              >
                {day.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Create Routine Modal */}
      {showCreateModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '10px',
            width: '400px'
          }}>
            <h3>Create New Routine</h3>
            <div style={{ marginBottom: '15px' }}>
              <label>
                Routine Name:
                {' '}
                <input
                  type="text"
                  value={newRoutineName}
                  onChange={(e) => setNewRoutineName(e.target.value)}
                  style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                  placeholder="Enter routine name"
                />
              </label>
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label>
                Description:
                {' '}
                <textarea
                  value={newRoutineDescription}
                  onChange={(e) => setNewRoutineDescription(e.target.value)}
                  style={{ width: '100%', padding: '8px', marginTop: '5px', minHeight: '80px' }}
                  placeholder="Enter routine description (optional)"
                />
              </label>
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowCreateModal(false)}
                style={{ padding: '8px 16px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '5px' }}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateRoutine}
                disabled={!newRoutineName.trim() || weeklyRoutines.loading}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  opacity: !newRoutineName.trim() || weeklyRoutines.loading ? 0.6 : 1
                }}
              >
                {weeklyRoutines.loading ? 'Creating...' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* API Status */}
      <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
        <h4>API Status</h4>
        <p><strong>Weekly Routines:</strong> {getWeeklyRoutinesStatus()}</p>
        <p><strong>Day Routines:</strong> {getDayRoutinesStatus()}</p>
        <p><strong>Exercises:</strong> {getExercisesStatus()}</p>
      </div>
    </div>
  );
};

export default RoutineManager;
