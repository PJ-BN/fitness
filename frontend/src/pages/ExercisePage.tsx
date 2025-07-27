
import React from 'react';
import useFetchExercises from '../hooks/useFetchExercises';

const ExercisePage: React.FC = () => {
  const { exercises, loading, error } = useFetchExercises();

  if (loading) {
    return <div>Loading exercises...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Exercise Page</h1>
      <p>Browse and manage exercises here.</p>
      <h2>Available Exercises:</h2>
      {exercises.length === 0 ? (
        <p>No exercises found.</p>
      ) : (
        <ul>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {exercises.map((exercise) => (
              <div key={exercise.id} style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '15px', boxShadow: '2px 2px 8px rgba(0,0,0,0.1)' }}>
                <h3>{exercise.name}</h3>
                <p><strong>Description:</strong> {exercise.description}</p>
                <p><strong>Category:</strong> {exercise.category}</p>
                <p><strong>Muscle Groups:</strong> {exercise.muscleGroups}</p>
                <p><strong>Equipment:</strong> {exercise.equipment}</p>
              </div>
            ))}
          </div>
        </ul>
      )}
    </div>
  );
};

export default ExercisePage;
