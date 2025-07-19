// frontend/src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoutes from './components/ProtectedRoutes';

function App() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || 'light');

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthPage theme={theme} toggleTheme={toggleTheme} />} />
        
        {/* Protected Routes */}
        <Route element={<ProtectedRoutes />}>
            <Route path="/dashboard" element={<DashboardPage theme={theme} toggleTheme={toggleTheme} />} />
            {/* Add more protected routes here later */}
        </Route>
        
        {/* Redirect any other path to home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;