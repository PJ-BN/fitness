import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import styles from './ProgressChart.module.css';

interface ExerciseProgressData {
  name: string;
  maxWeight: number;
  avgWeight: number;
  totalSets: number;
  totalReps: number;
}

interface ProgressChartProps {
  selectedExercise: string;
  chartData: ExerciseProgressData[];
}

const ProgressChart: React.FC<ProgressChartProps> = ({ selectedExercise, chartData }) => {
  return (
    <div className={styles.container}>
      {selectedExercise && chartData.length > 0 ? (
        <div className={styles.chartContainer}>
          <h2>Progress for {selectedExercise}</h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={chartData}
              margin={{
                top: 20, right: 30, left: 20, bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="maxWeight" name="Max Weight (kg)" fill="#6366f1" />
              <Bar yAxisId="left" dataKey="avgWeight" name="Avg Weight (kg)" fill="#60a5fa" />
              <Bar yAxisId="left" dataKey="totalSets" name="Sets" fill="#f59e42" />
              <Bar yAxisId="left" dataKey="totalReps" name="Reps" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className={styles.message}>
          {selectedExercise ? `No data available for ${selectedExercise}.` : 'Please select an exercise to view its progress.'}
        </div>
      )}
    </div>
  );
};

export default ProgressChart;
