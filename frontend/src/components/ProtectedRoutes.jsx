// frontend/src/components/ProtectedRoutes.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoutes = () => {
    const token = localStorage.getItem('token');
    
    // If NO token, redirect to the new login page.
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // If there IS a token, allow access to the nested routes (DashboardLayout, etc.).
    return <Outlet />;
};

export default ProtectedRoutes;