import React, { useMemo } from 'react';
import { useWorkoutData } from '../hooks/useWorkoutData';
import useWeeklyRoutines from '../hooks/useWeeklyRoutines';
import useUserProfile from '../hooks/useUserProfile';
import ProgressChart from '../components/ProgressChart';
import RoutineList from '../components/RoutineList';

const DashboardPage: React.FC = () => {
  // User, workouts, routines, goals
  const { workoutLogs } = useWorkoutData();
  const { getAllRoutines, loading: routinesLoading } = useWeeklyRoutines();
  const [routines, setRoutines] = React.useState<any[]>([]);
  React.useEffect(() => {
    getAllRoutines().then((data) => setRoutines(Array.isArray(data) ? data : []));
  }, []);
  const { user } = useUserProfile();

  // Quick stats
  const totalWorkouts = workoutLogs ? workoutLogs.length : 0;
  const totalRoutines = routines ? routines.length : 0;
  // No goals property on user, so we skip goals card

  // Recent activity (last 3 logs)
  const recentLogs = useMemo(() => (workoutLogs ? [...workoutLogs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 3) : []), [workoutLogs]);

  // Progress chart data (for the most recent exercise)
  const mostRecentExercise = useMemo(() => {
    if (!workoutLogs || workoutLogs.length === 0) return '';
    const lastLog = [...workoutLogs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
    const firstExercise = lastLog?.workoutExercises?.[0]?.exercise?.name;
    return firstExercise || '';
  }, [workoutLogs]);

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2.5rem 1rem' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.5rem', textAlign: 'center' }}>
        {user?.name ? `Welcome back, ${user.name}!` : 'Welcome Back!'}
      </h1>
      <div style={{ textAlign: 'center', color: '#6366f1', fontWeight: 500, marginBottom: '2.2rem', fontSize: '1.1rem' }}>
        Stay consistent and keep crushing your goals!
      </div>
      <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
        {/* Quick Stats Cards */}
        <div style={{ background: '#f8fafc', borderRadius: 16, boxShadow: '0 2px 8px rgba(99,102,241,0.08)', padding: '1.5rem 2rem', minWidth: 180, textAlign: 'center' }}>
          <div style={{ fontSize: '1.2rem', color: '#6366f1', fontWeight: 600 }}>Workouts</div>
          <div style={{ fontSize: '2rem', fontWeight: 700, marginTop: 8 }}>{totalWorkouts}</div>
        </div>
        <div style={{ background: '#f8fafc', borderRadius: 16, boxShadow: '0 2px 8px rgba(99,102,241,0.08)', padding: '1.5rem 2rem', minWidth: 180, textAlign: 'center' }}>
          <div style={{ fontSize: '1.2rem', color: '#f59e42', fontWeight: 600 }}>Routines</div>
          <div style={{ fontSize: '2rem', fontWeight: 700, marginTop: 8 }}>{totalRoutines}</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        {/* Recent Activity Section */}
        <div style={{ flex: 1, minWidth: 320, background: '#fff', borderRadius: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', padding: '2rem', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 600, marginBottom: '1rem' }}>Recent Activity</h2>
          {recentLogs.length === 0 ? (
            <div style={{ color: '#888', fontSize: '1rem' }}>No recent activity to show.</div>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {recentLogs.map((log) => (
                <li key={log.id} style={{ marginBottom: 12, paddingBottom: 10, borderBottom: '1px solid #f1f1f1' }}>
                  <div style={{ fontWeight: 600, color: '#6366f1' }}>{new Date(log.date).toLocaleDateString()}</div>
                  <div style={{ color: '#222', fontSize: '1.05rem', marginTop: 2 }}>
                    {log.workoutExercises?.map(we => we.exercise?.name).filter(Boolean).join(', ') || 'No exercises'}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        {/* Progress Chart Section */}
        <div style={{ flex: 1, minWidth: 320, background: '#fff', borderRadius: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', padding: '2rem', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 600, marginBottom: '1rem' }}>Progress Overview</h2>
          {mostRecentExercise ? (
            <ProgressChart selectedExercise={mostRecentExercise} chartData={[]} />
          ) : (
            <div style={{ color: '#888', fontSize: '1rem' }}>Your progress chart will appear here.</div>
          )}
        </div>
      </div>

      <div style={{ margin: '2rem auto 0 auto', maxWidth: 900 }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 600, marginBottom: '1rem', textAlign: 'center' }}>Your Routines</h2>
        {totalRoutines === 0 ? (
          <div style={{ color: '#888', fontSize: '1rem', textAlign: 'center' }}>No routines found.</div>
        ) : (
          <RoutineList 
            routines={routines}
            onSelectRoutine={async () => {}}
            onCreateNew={() => {}}
            loading={routinesLoading}
          />
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
