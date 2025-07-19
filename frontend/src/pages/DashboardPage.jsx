// frontend/src/pages/DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import AdminDashboard from '../components/dashboards/AdminDashboard';
import StudentDashboard from '../components/dashboards/StudentDashboard';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const DashboardPage = () => {
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                setUserRole(decodedToken.role);
            } catch (error) {
                // Handle invalid token case, maybe redirect
                setUserRole(null);
            }
        }
    }, []);

    if (userRole === null) {
        return <LoadingSpinner />;
    }

    // Render the specific dashboard based on the user's role
    switch (userRole) {
        case 'admin':
            return <AdminDashboard />;
        case 'student':
            return <StudentDashboard />;
        default:
            // Fallback for other roles (e.g., 'faculty') or errors
            return <div>Your dashboard is not yet available.</div>;
    }
};

export default DashboardPage;