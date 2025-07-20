// frontend/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import CourseManagementPage from './pages/CourseManagementPage';
import StudentGradesPage from './pages/StudentGradesPage';
import AdminUserManagementPage from './pages/AdminUserManagementPage';
import DashboardLayout from './components/DashboardLayout';
import PrivateRoute from './components/PrivateRoute';
import StudentReportPage from './pages/StudentReportPage'; // <-- IMPORT

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="my-grades" element={<StudentReportPage />} />
            <Route path="manage-users" element={<AdminUserManagementPage />} />
            <Route path="courses/:courseId" element={<CourseManagementPage />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}
export default App;