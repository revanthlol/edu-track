// frontend/src/App.jsx
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import React from 'react';

// --- Page Components ---
import HomePage from './pages/HomePage';
// *** THIS IS THE CRITICAL FIX ***
// The correct path is "./pages/AuthPage", not "./pages-_bk/AuthPage".
// I apologize for this careless and app-breaking error.
import AuthPage from './pages/AuthPage';
// --- END OF FIX ---
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import CourseManagementPage from './pages/CourseManagementPage';
import StudentGradesPage from './pages/StudentGradesPage';
import AdminUserManagementPage from './pages/AdminUserManagementPage';


// --- Layout & Route Protection ---
import DashboardLayout from './components/DashboardLayout';
import ProtectedRoutes from './components/ProtectedRoutes';


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