import React, { useState, useMemo, useEffect } from 'react';
import { useWorkoutData } from '../hooks/useWorkoutData';
import ExerciseSelector from '../components/ExerciseSelector';
import ProgressChart from '../components/ProgressChart';
import ExercisePieChart from '../components/ExercisePieChart';
import type { WorkoutLog, WorkoutExercise, Set } from '../types/api';
import styles from './ReportPage.module.css';

interface ExerciseProgressData {
  name: string;
  maxWeight: number;
  avgWeight: number;
  totalSets: number;
  totalReps: number;
}

const ReportPage: React.FC = () => {
  const { workoutLogs, loading, error } = useWorkoutData();
  const [selectedExercise, setSelectedExercise] = useState<string>('');

  const allExercises = useMemo(() => {
    const exercises = new Set<string>();
    (workoutLogs || []).forEach(log => {
      (log?.workoutExercises || []).forEach(we => {
        if (we?.exercise?.name) {
          exercises.add(we.exercise.name);
        }
      });
    });
    return Array.from(exercises).sort();
  }, [workoutLogs]);

  const chartData = useMemo(() => {
    if (!selectedExercise) {
      return [];
    }

    const progressMap = new Map<string, ExerciseProgressData>();

    (workoutLogs || []).forEach(log => {
      (log?.workoutExercises || []).forEach(we => {
        if (we?.exercise?.name === selectedExercise) {
          const date = new Date(log.date).toLocaleDateString();
          let maxWeight = 0;
          let totalWeight = 0;
          let totalReps = 0;
          let totalSets = 0;
          let weightSum = 0;

          (we?.sets || []).forEach(set => {
            if (set?.weight && set.weight > maxWeight) {
              maxWeight = set.weight;
            }
            if (set?.weight) {
              weightSum += set.weight;
            }
            totalReps += set?.reps || 0;
            totalSets += 1;
          });

          const avgWeight = totalSets > 0 ? weightSum / totalSets : 0;

          if (progressMap.has(date)) {
            const existingData = progressMap.get(date)!;
            existingData.maxWeight = Math.max(existingData.maxWeight, maxWeight);
            existingData.avgWeight = (existingData.avgWeight * existingData.totalSets + weightSum) / (existingData.totalSets + totalSets);
            existingData.totalSets += totalSets;
            existingData.totalReps += totalReps;
          } else {
            progressMap.set(date, {
              name: date,
              maxWeight,
              avgWeight,
              totalSets,
              totalReps,
            });
          }
        }
      });
    });

    return Array.from(progressMap.values()).sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime());
  }, [workoutLogs, selectedExercise]);

  const pieChartData = useMemo(() => {
    if (!workoutLogs) return [];
    const now = new Date();
    const THIRTY_DAYS = 1000 * 60 * 60 * 24 * 30;
    const exerciseReps: Record<string, number> = {};
    let totalReps = 0;

    (workoutLogs || []).forEach(log => {
      const logDate = new Date(log.date);
      if (now.getTime() - logDate.getTime() > THIRTY_DAYS) return;
      (log?.workoutExercises || []).forEach(we => {
        const name = we?.exercise?.name;
        if (!name) return;
        let reps = 0;
        (we?.sets || []).forEach(set => {
          reps += set?.reps || 0;
        });
        if (!exerciseReps[name]) exerciseReps[name] = 0;
        exerciseReps[name] += reps;
        totalReps += reps;
      });
    });

    if (totalReps === 0) return [];
    return Object.entries(exerciseReps).map(([name, value]) => ({
      name,
      value: Math.round((value / totalReps) * 1000) / 10, // percent with 1 decimal
      reps: value,
    }));
  }, [workoutLogs]);

  useEffect(() => {
    if (allExercises.length > 0 && !selectedExercise) {
      setSelectedExercise(allExercises[0]);
    }
  }, [allExercises, selectedExercise]);

  if (loading) {
    return (
      <div className={styles.loaderContainer}>
        <div className={styles.loader}></div>
      </div>
    );
  }

  if (error) {
    return <div className={styles.message}>Error: {error}</div>;
  }

  if (!workoutLogs || workoutLogs.length === 0) {
    return <div className={styles.message}>No workout logs available to generate reports.</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Workout Progress Report</h1>
      <div className={styles.pieChartCard}>
        <ExercisePieChart data={pieChartData.map(({name, value}) => ({name, value}))} />
      </div>
      <div className={styles.selectorCard}>
        <ExerciseSelector 
          exercises={allExercises}
          selectedExercise={selectedExercise}
          onExerciseChange={setSelectedExercise}
        />
      </div>
      <ProgressChart 
        selectedExercise={selectedExercise}
        chartData={chartData}
      />
    </div>
  );
};

export default ReportPage;
