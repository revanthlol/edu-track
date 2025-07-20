// frontend/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import StudentReportPage from './pages/StudentReportPage';
import AdminUserManagementPage from './pages/AdminUserManagementPage';
import AdminCourseManagementPage from './pages/AdminCourseManagementPage'; // <-- THIS NOW WORKS
import CourseManagementPage from './pages/CourseManagementPage';

import DashboardLayout from './components/DashboardLayout';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* --- Public Routes --- */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<AuthPage />} />
        
        {/* --- Protected Route Group --- */}
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

        {/* --- Catch-all Fallback --- */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
export default App;