// frontend/src/App.jsx

// --- THIS IS THE CRITICAL FIX ---
// The following line was missing, which caused the entire application to crash.
// It imports the necessary components from the react-router-dom library and renames BrowserRouter to Router for convenience.
// My sincere apologies for this inexcusable mistake.
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
// --- END OF FIX ---

import React from 'react';

// --- Page Components ---
// These are the primary "screens" of the application.
import HomePage from './pages/HomePage';
import AuthPage from './pages-_bk/AuthPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import CourseManagementPage from './pages/CourseManagementPage';
import StudentGradesPage from './pages/StudentGradesPage';

// --- Layout & Route Protection ---
// These are wrapper components that provide structure and security.
import DashboardLayout from './components/DashboardLayout';
import ProtectedRoutes from './components/ProtectedRoutes';

/**
 * App is the root component that defines the entire application's routing structure.
 */
function App() {
  return (
    <Router>
      <Routes>
        {/* --- Public Routes --- */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<AuthPage />} />
        
        {/* --- Protected Routes --- */}
        <Route element={<ProtectedRoutes />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/dashboard/profile" element={<ProfilePage />} />
            <Route path="/dashboard/my-grades" element={<StudentGradesPage />} />
            <Route path="/dashboard/courses/:courseId" element={<CourseManagementPage />} />
            <Route path="/dashboard/manage-users" element={<AdminUserManagementPage />} />
          </Route>
        </Route>

        {/* --- Catch-all Fallback --- */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;