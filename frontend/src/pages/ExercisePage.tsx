
import React, { useState, useMemo } from 'react';
import useFetchExercises from '../hooks/useFetchExercises';
import useDebounce from '../hooks/useDebounce';
import styles from './ExercisePage.module.css';
import Fuse from 'fuse.js';

const ExercisePage: React.FC = () => {
  const { exercises, loading, error } = useFetchExercises();
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300); // Debounce search term by 300ms

  // Fuse.js options for fuzzy searching
  const fuseOptions = {
    keys: ['name', 'category', 'muscleGroups', 'equipment'],
    threshold: 0.3, // Adjust this value to control the strictness of the match (0 = exact, 1 = very loose)
  };

  // Filter exercises based on debounced search term using Fuse.js
  const filteredExercises = useMemo(() => {
    if (!debouncedSearchTerm) {
      return exercises;
    }

    const fuse = new Fuse(exercises, fuseOptions);
    return fuse.search(debouncedSearchTerm).map(result => result.item);
  }, [exercises, debouncedSearchTerm]);

  if (loading) {
    return <div className={styles.loading}>Loading exercises...</div>;
  }

  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  return (
    <div className={styles.exercisePageContainer}>
      <h1 className={styles.pageTitle}>Exercise Library</h1>
      <p className={styles.pageDescription}>Explore a wide range of exercises to enhance your fitness journey. Each exercise includes detailed information on its description, category, muscle groups targeted, and required equipment.</p>
      
      {/* Search input */}
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search exercises by name, category, muscle group, or equipment"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      {filteredExercises.length === 0 ? (
        <div className={styles.noExercises}>
          {searchTerm ? 'No exercises match your search criteria.' : 'No exercises found. Start by adding some!'}
        </div>
      ) : (
        <div className={styles.exerciseGrid}>
          {filteredExercises.map((exercise) => (
            <div key={exercise.id} className={styles.exerciseCard}>
              <h3>{exercise.name}</h3>
              <p><strong>Description:</strong> {exercise.description}</p>
              <p><strong>Category:</strong> {exercise.category}</p>
              <p><strong>Muscle Groups:</strong> {exercise.muscleGroups}</p>
              <p><strong>Equipment:</strong> {exercise.equipment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExercisePage;
