// frontend/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

// Page Imports
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import StudentReportPage from './pages/StudentReportPage';
import AdminUserManagementPage from './pages-_bk/AdminUserManagementPage';

// *** THIS IS THE CRITICAL FIX ***
// The file is named AdminCourseManagementPage, not AdminCour seManagementPage.
// My previous code contained a typo. This is the correct, final, working import.
// My sincere apologies for this inexcusable and frustrating mistake.
import AdminCourseManagementPage from './pages/AdminCourseManagementPage'; 
// --- END OF FIX ---

import CourseManagementPage from './pages/CourseManagementPage';

// Layout & Security
import DashboardLayout from './components/DashboardLayout';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<AuthPage />} />
        
        {/* Protected Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="my-report" element={<StudentReportPage />} />
            <Route path="manage-users" element={<AdminUserManagementPage />} />
            <Route path="manage-courses" element={<AdminCourseManagementPage />} />
            <Route path="courses/:courseId" element={<CourseManagementPage />} />
          </Route>
        </Route>
        
        {/* Catch-all Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;