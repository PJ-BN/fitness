import React from 'react';
import './RoutineList.module.css';

interface Routine {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface RoutineListProps {
  routines: Routine[];
  onSelectRoutine: (routineId: number) => Promise<void>;
  onCreateNew: () => void;
  loading: boolean;
  selectedRoutineId?: number;
}

const RoutineList: React.FC<RoutineListProps> = ({ 
  routines, 
  onSelectRoutine, 
  onCreateNew, 
  loading,
  selectedRoutineId 
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="routine-list-container">
      <div className="routine-list-header">
        <h2>My Workout Routines</h2>
        <button 
          onClick={onCreateNew}
          className="create-new-btn"
          disabled={loading}
        >
          + Create New Routine
        </button>
      </div>

      {routines.length === 0 ? (
        <div className="no-routines">
          <div className="no-routines-icon">💪</div>
          <h3>No routines yet</h3>
          <p>Create your first workout routine to get started</p>
          <button 
            onClick={onCreateNew}
            className="create-first-btn"
            disabled={loading}
          >
            Create My First Routine
          </button>
        </div>
      ) : (
        <div className="routines-grid">
          {routines.map((routine) => (
            <button 
              key={routine.id}
              className={`routine-card ${selectedRoutineId === routine.id ? 'selected' : ''}`}
              onClick={() => onSelectRoutine(routine.id)}
              disabled={loading}
            >
              <div className="routine-card-header">
                <h3>{routine.name}</h3>
                {routine.isActive && (
                  <span className="active-badge">Active</span>
                )}
              </div>
              
              <p className="routine-description">
                {routine.description || 'No description provided'}
              </p>
              
              <div className="routine-card-footer">
                <span className="routine-date">
                  Created: {formatDate(routine.createdAt)}
                </span>
                {routine.updatedAt !== routine.createdAt && (
                  <span className="routine-date">
                    Updated: {formatDate(routine.updatedAt)}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default RoutineList;
