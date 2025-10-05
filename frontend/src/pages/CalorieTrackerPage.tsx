import React from 'react';
import CalorieTracker from '../components/Nutrition/CalorieTracker';

const CalorieTrackerPage: React.FC = () => {
  return (
    <div style={{padding:'40px 20px', maxWidth:1200, margin:'0 auto'}}>
      <header style={{textAlign:'center', marginBottom:32}}>
        <h1 style={{fontSize:'2.4rem', margin:'0 0 12px', fontWeight:700}}>Calorie & Macro Tracker</h1>
        <p style={{margin:0, opacity:.75}}>Log your meals, monitor daily calories, and stay on top of your nutrition goals.</p>
      </header>
      <CalorieTracker />
    </div>
  );
};

export default CalorieTrackerPage;
