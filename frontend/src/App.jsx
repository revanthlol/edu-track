// frontend/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

// --- Page Components ---
// These are the primary "screens" of the application.
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import CourseManagementPage from './pages/CourseManagementPage';

// --- Layout & Route Protection ---
// These are wrapper components that provide structure and security.
import DashboardLayout from './components/DashboardLayout';
import ProtectedRoutes from './components/ProtectedRoutes';

/**
 * App is the root component that defines the entire application's routing structure.
 * It uses React Router to conditionally render pages based on the URL.
 */
function App() {
  return (
    <Router>
      <Routes>

        {/* --- Public Routes --- */}
        {/* These routes are accessible to any user, logged in or not. */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<AuthPage />} />

        
        {/* --- Protected Routes --- */}
        {/* 1. <ProtectedRoutes> checks if a user is logged in via a token. */}
        {/*    If not, it redirects them to the "/login" page. */}
        {/* 2. <DashboardLayout> provides the consistent sidebar, header, and overall structure for all authenticated pages. */}
        <Route element={<ProtectedRoutes />}>
          <Route element={<DashboardLayout />}>

            {/* The main dashboard page, which itself acts as a router based on user role. */}
            <Route path="/dashboard" element={<DashboardPage />} />
            
            {/* The user's profile page. */}
            <Route path="/dashboard/profile" element={<ProfilePage />} />
            
            {/* The faculty-specific page for managing students in a course. */}
            {/* The ":courseId" is a dynamic parameter that will be the ID of the course. */}
            <Route path="/dashboard/courses/:courseId" element={<CourseManagementPage />} />
            
          </Route>
        </Route>


        {/* --- Catch-all Fallback --- */}
        {/* If a user navigates to any URL not defined above, they will be redirected to the homepage. */}
        {/* This prevents "404 Not Found" errors within the app's routing. */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </Router>
  );
}

export default App;