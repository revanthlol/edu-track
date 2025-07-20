// frontend/src/components/PrivateRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
    const token = localStorage.getItem('token');

    // If there is a token, render the child components (the entire dashboard).
    // If not, immediately and definitively redirect to the login page.
    // There is no state, no effect, no loading. It is instant and cannot fail.
    return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;