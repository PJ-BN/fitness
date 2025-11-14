import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useWorkoutData } from '../hooks/useWorkoutData';
import useWeeklyRoutines from '../hooks/useWeeklyRoutines';
import useUserProfile from '../hooks/useUserProfile';
import styles from './DashboardPage.module.css';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF1919'];

const fitnessTips = [
  "Stay hydrated! Drink at least 8 glasses of water a day.",
  "Don't skip your warm-up before a workout.",
  "Consistency is key. Stick to your routine for the best results.",
  "A balanced diet is just as important as exercise.",
  "Get enough sleep to allow your muscles to recover."
];

const DashboardPage: React.FC = () => {
  const { workoutLogs } = useWorkoutData();
  const { getAllRoutines } = useWeeklyRoutines();
  const [routines, setRoutines] = React.useState<any[]>([]);
  React.useEffect(() => {
    getAllRoutines().then((data) => setRoutines(Array.isArray(data) ? data : []));
  }, [getAllRoutines]);
  const { user } = useUserProfile();

  const totalWorkouts = workoutLogs ? workoutLogs.length : 0;
  const totalRoutines = routines ? routines.length : 0;

  const recentLogs = useMemo(() => (
    workoutLogs ? [...workoutLogs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 3) : []
  ), [workoutLogs]);

  const exerciseDistribution = useMemo(() => {
    const distribution: { [key: string]: number } = {};
    (workoutLogs || []).forEach(log => {
      (log.workoutExercises || []).forEach(we => {
        if (we.exercise?.name) {
          distribution[we.exercise.name] = (distribution[we.exercise.name] || 0) + 1;
        }
      });
    });
    return Object.entries(distribution).map(([name, value]) => ({ name, value }));
  }, [workoutLogs]);

  const randomTip = useMemo(() => fitnessTips[Math.floor(Math.random() * fitnessTips.length)], []);

  return (
    <div className={styles.dashboardContainer}>
      <header className={styles.header}>
        <h1 className={styles.title}>
          {user?.name ? `Welcome back, ${user.name}!` : 'Welcome Back!'}
        </h1>
      </header>

      <div className={styles.mainGrid}>
        <div className={`${styles.card} ${styles.statsCard}`}>
          <h2 className={styles.cardTitle}>Quick Stats</h2>
          <div className={styles.statsRow}>
            <div className={styles.statItem}>
              <div className={styles.statValue}>{totalWorkouts}</div>
              <div className={styles.statLabel}>Workouts</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statValue}>{totalRoutines}</div>
              <div className={styles.statLabel}>Routines</div>
            </div>
          </div>
        </div>

        <div className={`${styles.card} ${styles.tipCard}`}>
          <h2 className={styles.cardTitle}>Tip of the Day</h2>
          <p className={styles.tipText}>{randomTip}</p>
        </div>

        <div className={`${styles.card} ${styles.actionsCard}`}>
          <h2 className={styles.cardTitle}>Quick Actions</h2>
          <div className={styles.actionsContainer}>
            <a href="/workout-log" className={styles.actionButton}>Log a Workout</a>
            <a href="/routine" className={styles.actionButton}>Create Routine</a>
            <a href="/exercises" className={styles.actionButton}>View Exercises</a>
          </div>
        </div>

        <div className={`${styles.card} ${styles.fitnessContentCard}`}>
          <h2 className={styles.cardTitle}>Benefits of Exercise</h2>
          <ul className={styles.benefitsList}>
            <li>Improves cardiovascular health</li>
            <li>Boosts mood and reduces stress</li>
            <li>Increases energy levels</li>
            <li>Promotes better sleep</li>
          </ul>
        </div>

        <div className={`${styles.card} ${styles.routinesCard}`}>
          <h2 className={styles.cardTitle}>Your Routines</h2>
          {totalRoutines === 0 ? (
            <div className={styles.noData}>No routines found.</div>
          ) : (
            <ul className={styles.routinesList}>
              {routines.slice(0, 3).map((routine: any) => (
                <li key={routine.id} className={styles.routineItem}>
                  <div className={styles.routineName}>{routine.name}</div>
                  <div className={styles.routineDate}>Created: {new Date(routine.createdAt).toLocaleDateString()}</div>
                </li>
              ))}
            </ul>
          )}
          {totalRoutines > 3 && (
            <div className={styles.viewAllLinkContainer}>
              <a href="/routine" className={styles.viewAllLink}>View All Routines</a>
            </div>
          )}
        </div>

        <div className={`${styles.card} ${styles.activityCard}`}>
          <h2 className={styles.cardTitle}>Recent Activity</h2>
          {recentLogs.length === 0 ? (
            <div className={styles.noData}>No recent activity to show.</div>
          ) : (
            <ul className={styles.activityList}>
              {recentLogs.map((log) => (
                <li key={log.id} className={styles.activityItem}>
                  <div className={styles.activityDate}>{new Date(log.date).toLocaleDateString()}</div>
                  <div className={styles.activityDesc}>
                    {log.workoutExercises?.map(we => we.exercise?.name).filter(Boolean).join(', ') || 'No exercises'}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className={`${styles.card} ${styles.chartCard}`}>
          <h2 className={styles.cardTitle}>Exercise Distribution</h2>
          {exerciseDistribution.length > 0 ? (
            <ResponsiveContainer width="100%" height={500}>
              <PieChart>
                <Pie
                  data={exerciseDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={false}
                  outerRadius={150}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {exerciseDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className={styles.noData}>No data to display chart.</div>
          )}
        </div>

        <div className={`${styles.card} ${styles.barChartCard}`}>
          <h2 className={styles.cardTitle}>Most Frequent Exercises</h2>
          {exerciseDistribution.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={exerciseDistribution} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={120} />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" name="Times Performed" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className={styles.noData}>No data to display chart.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
