import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import styles from './ExercisePieChart.module.css';

interface PieData {
  name: string;
  value: number;
}

interface ExercisePieChartProps {
  data: PieData[];
}

const COLORS = [
  '#6366f1', '#60a5fa', '#f59e42', '#10b981', '#f43f5e', '#a78bfa', '#fbbf24', '#34d399', '#f87171', '#818cf8',
];

const ExercisePieChart: React.FC<ExercisePieChartProps> = ({ data }) => {
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Exercise Distribution (Last 30 Days)</h3>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={90}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => `${value} reps`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExercisePieChart;
