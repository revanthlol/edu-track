// frontend/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

// Import Page Components
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';

// Import Layout and Route-Protection Components
import ProtectedRoutes from './components/ProtectedRoutes';
import DashboardLayout from './components/DashboardLayout';

function App() {
  return (
    <Router>
      <Routes>

        {/* --- Public Routes --- */}
        {/* The AuthPage is accessible to everyone. */}
        <Route path="/" element={<AuthPage />} />

        
        {/* --- Protected Routes --- */}
        {/* All routes within this group first pass through <ProtectedRoutes>. */}
        {/* If the user is not logged in, they are redirected to "/". */}
        <Route element={<ProtectedRoutes />}>
        
          {/* All pages rendered inside this group will share the <DashboardLayout>. */}
          {/* This provides the consistent header, sidebar, and overall page structure. */}
          <Route element={<DashboardLayout />}>

            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/dashboard/profile" element={<ProfilePage />} />
            
            {/* 
              This is where you would add more pages to your dashboard in the future.
              For example:
              <Route path="/dashboard/grades" element={<GradesPage />} />
              <Route path="/dashboard/attendance" element={<AttendancePage />} />
            */}
            
          </Route>
        </Route>


        {/* --- Catch-all Route --- */}
        {/* If no other route matches, redirect to the home page. */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </Router>
  );
}

export default App;