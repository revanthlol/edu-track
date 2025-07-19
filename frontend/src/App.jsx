// frontend/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import CourseManagementPage from './pages/CourseManagementPage';
import StudentGradesPage from './pages/StudentGradesPage'; // <-- IMPORT
import DashboardLayout from './components/DashboardLayout';
import ProtectedRoutes from './components/ProtectedRoutes';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<AuthPage />} />

        <Route element={<ProtectedRoutes />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/dashboard/profile" element={<ProfilePage />} />
            <Route path="/dashboard/my-grades" element={<StudentGradesPage />} /> {/* <-- NEW STUDENT ROUTE */}
            <Route path="/dashboard/courses/:courseId" element={<CourseManagementPage />} /> {/* Faculty Route */}
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}
export default App;