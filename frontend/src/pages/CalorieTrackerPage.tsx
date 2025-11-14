import React from 'react';
import CalorieTracker from '../components/Nutrition/CalorieTracker';

const CalorieTrackerPage: React.FC = () => {
  return (
    <div style={{
      padding: '3rem 2rem', 
      maxWidth: 1400, 
      margin: '0 auto',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%)',
      minHeight: '100vh'
    }}>
      <header style={{
        textAlign: 'center', 
        marginBottom: '3rem',
        padding: '2.5rem 2rem',
        background: 'linear-gradient(135deg, #059669 0%, #047857 50%, #065f46 100%)',
        borderRadius: '20px',
        boxShadow: '0 10px 40px rgba(5, 150, 105, 0.3)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1), transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.08), transparent 50%)',
          zIndex: 1
        }} />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <h1 style={{
            fontSize: '3rem', 
            margin: '0 0 1rem', 
            fontWeight: 800,
            letterSpacing: '-0.5px',
            color: '#ffffff',
            textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)'
          }}>
            Calorie & Macro Tracker
          </h1>
          <p style={{
            margin: 0, 
            fontSize: '1.25rem',
            maxWidth: '700px',
            marginLeft: 'auto',
            marginRight: 'auto',
            lineHeight: '1.6',
            color: '#ffffff',
            opacity: 0.98,
            textShadow: '0 1px 3px rgba(0, 0, 0, 0.15)'
          }}>
            Log your meals, monitor daily calories, and stay on top of your nutrition goals.
          </p>
        </div>
      </header>
      <CalorieTracker />
    </div>
  );
};

export default CalorieTrackerPage;
