import React, { useState } from 'react';
import './CreateRoutineForm.module.css';

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
    <div className="create-routine-container">
      <div className="create-routine-header">
        <h2>Create Your First Routine</h2>
        <p>Start building your personalized workout routine</p>
      </div>

      <form onSubmit={handleSubmit} className="create-routine-form">
        <div className="form-group">
          <label htmlFor="routine-name">
            Routine Name <span className="required">*</span>
          </label>
          <input
            id="routine-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Push Pull Legs, Full Body Workout"
            disabled={loading}
            maxLength={100}
          />
        </div>

        <div className="form-group">
          <label htmlFor="routine-description">
            Description
          </label>
          <textarea
            id="routine-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your workout routine goals and approach"
            disabled={loading}
            rows={4}
            maxLength={500}
          />
        </div>

        {(formError || error) && (
          <div className="error-message">
            {formError || error}
          </div>
        )}

        <button 
          type="submit" 
          className="create-routine-btn"
          disabled={loading || !name.trim()}
        >
          {loading ? 'Creating...' : 'Create Routine'}
        </button>
      </form>
    </div>
  );
};

export default CreateRoutineForm;
