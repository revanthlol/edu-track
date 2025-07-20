// frontend/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Page Components
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import CourseManagementPage from './pages/CourseManagementPage';
import StudentGradesPage from './pages/StudentGradesPage';
import AdminUserManagementPage from './pages/AdminUserManagementPage';

// Layout and NEW Route Protection
import DashboardLayout from './components/DashboardLayout';
import PrivateRoute from './components/PrivateRoute'; // <-- THE NEW, WORKING COMPONENT

function App() {
  return (
    <Router>
      <Routes>
        {/* --- Public Routes --- */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<AuthPage />} />
        
        {/* --- Protected Route Group --- */}
        {/* This single line provides perfect protection for the entire dashboard */}
        <Route element={<PrivateRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/dashboard/profile" element={<ProfilePage />} />
            <Route path="/dashboard/my-grades" element={<StudentGradesPage />} />
            <Route path="/dashboard/manage-users" element={<AdminUserManagementPage />} />
            <Route path="/dashboard/courses/:courseId" element={<CourseManagementPage />} />
          </Route>
        </Route>

      </Routes>
    </Router>
  );
}

export default App;