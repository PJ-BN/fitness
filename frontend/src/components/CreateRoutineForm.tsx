import React, { useState } from 'react';
import styles from './CreateRoutineForm.module.css';

interface CreateRoutineFormProps {
  onSubmit: (name: string, description: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}

const CreateRoutineForm: React.FC<CreateRoutineFormProps> = ({ onSubmit, loading, error }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Basic validation
    if (!name.trim()) {
      setFormError('Routine name is required');
      return;
    }

    if (name.trim().length < 3) {
      setFormError('Routine name must be at least 3 characters long');
      return;
    }

    try {
      await onSubmit(name.trim(), description.trim());
      // Reset form on success
      setName('');
      setDescription('');
    } catch (err) {
      // Error is handled by parent component through error prop
      console.error('Failed to create routine:', err);
    }
  };

  return (
    <div className={styles.createRoutineContainer}>
      <div className={styles.createRoutineHeader}>
        <h2>Create Your First Routine</h2>
        <p>Start building your personalized workout routine</p>
      </div>

      <form onSubmit={handleSubmit} className={styles.createRoutineForm}>
        <div className={styles.formGroup}>
          <label htmlFor="routine-name">
            Routine Name <span className={styles.required}>*</span>
          </label>
          <input
            id="routine-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Push Pull Legs, Full Body Workout, Morning Strength"
            disabled={loading}
            maxLength={100}
            autoComplete="off"
          />
          <small className={styles.charCount}>
            {name.length}/100 characters
          </small>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="routine-description">
            Description <span className={styles.optional}>(Optional)</span>
          </label>
          <textarea
            id="routine-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your workout routine goals, target muscle groups, and approach..."
            disabled={loading}
            rows={4}
            maxLength={500}
          />
          <small className={styles.charCount}>
            {description.length}/500 characters
          </small>
        </div>

        {(formError || error) && (
          <div className={styles.errorMessage}>
            {formError || error}
          </div>
        )}

        <button 
          type="submit" 
          className={styles.createRoutineBtn}
          disabled={loading || !name.trim()}
        >
          {loading ? (
            <>
              <span className={styles.loadingSpinner}></span>
              {' Creating Your Routine...'}
            </>
          ) : (
            'Create My Routine'
          )}
        </button>
      </form>
    </div>
  );
};

export default CreateRoutineForm;
