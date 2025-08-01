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
      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height={460}>
          <PieChart margin={{ top: 20, right: 10, bottom: 20, left: 10 }}>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="48%"
            outerRadius={155}
            innerRadius={45}
            label={({ percent }) => {
              const percentValue = (percent ? percent * 100 : 0);
              return percentValue > 4 ? `${percentValue.toFixed(0)}%` : '';
            }}
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => `${value}%`} />
          <Legend 
            layout="horizontal" 
            verticalAlign="bottom" 
            align="center" 
            iconType="circle" 
            wrapperStyle={{ 
              fontSize: '1rem', 
              marginTop: 20, 
              paddingTop: 10,
              paddingBottom: 10,
              lineHeight: '1.8',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '15px'
            }}
            formatter={(value) => {
              // Limit legend text length
              return value.length > 15 ? value.substring(0, 15) + '...' : value;
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ExercisePieChart;
