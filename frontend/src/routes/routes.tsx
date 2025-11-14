
import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import SignUpPage from '../pages/SignUpPage.tsx';
import DashboardPage from '../pages/DashboardPage';
import RoutinePage from '../pages/RoutinePage';
import ExercisePage from '../pages/ExercisePage';
import GoalPage from '../pages/GoalPage';
import ReportPage from '../pages/ReportPage';
import NutritionPage from '../pages/NutritionPage';
import CalorieTrackerPage from '../pages/CalorieTrackerPage';
import ProfilePage from '../pages/ProfilePage';
import LoggedInLayout from '../layout/LoggedInLayout';
import WorkoutLogPage from '../pages/WorkoutLogPage';
import WorkoutLogViewPage from '../pages/WorkoutLogViewPage';
import SuccessPage from '../pages/SuccessPage';
import CancelPage from '../pages/CancelPage';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = Cookies.get('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/signup',
    element: <SignUpPage />,
  },
  {
    path: '/success',
    element: <SuccessPage />,
  },
  {
    path: '/cancel',
    element: <CancelPage />,
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <LoggedInLayout>
          <DashboardPage />
        </LoggedInLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/routine',
    element: (
      <ProtectedRoute>
        <LoggedInLayout>
          <RoutinePage />
        </LoggedInLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/exercise',
    element: (
      <ProtectedRoute>
        <LoggedInLayout>
          <ExercisePage />
        </LoggedInLayout>
      </ProtectedRoute>
    ),
  },
  
  {
    path: '/report',
    element: (
      <ProtectedRoute>
        <LoggedInLayout>
          <ReportPage />
        </LoggedInLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/nutrition',
    element: (
      <ProtectedRoute>
        <LoggedInLayout>
          <NutritionPage />
        </LoggedInLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/calories',
    element: (
      <ProtectedRoute>
        <LoggedInLayout>
          <CalorieTrackerPage />
        </LoggedInLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/profile',
    element: (
      <ProtectedRoute>
        <LoggedInLayout>
          <ProfilePage />
        </LoggedInLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/workout-log',
    element: (
      <ProtectedRoute>
        <LoggedInLayout>
          <WorkoutLogPage />
        </LoggedInLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/workout-logs-view',
    element: (
      <ProtectedRoute>
        <LoggedInLayout>
          <WorkoutLogViewPage />
        </LoggedInLayout>
      </ProtectedRoute>
    ),
  },
]);

const AppRouter: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;

