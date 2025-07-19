// frontend/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoutes from './components/ProtectedRoutes';
import DashboardLayout from './components/DashboardLayout';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<AuthPage />} />
        
        {/* Protected Routes Container */}
        <Route element={<ProtectedRoutes />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            {/* Add more protected pages here like: */}
            {/* <Route path="/profile" element={<ProfilePage />} /> */}
          </Route>
        </Route>

      </Routes>
    </Router>
  );
}

export default App;