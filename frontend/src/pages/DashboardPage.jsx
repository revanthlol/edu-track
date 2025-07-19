// frontend/src/pages/DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import AdminDashboard from '../components/dashboards/AdminDashboard';
import StudentDashboard from '../components/dashboards/StudentDashboard';
import FacultyDashboard from '../components/dashboards/FacultyDashboard'; // <-- IMPORT
import LoadingSpinner from '../components/ui/LoadingSpinner';

const DashboardPage = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try { setUser(jwtDecode(token)); } catch { setUser(null); }
        }
    }, []);

    if (!user) return <LoadingSpinner />;

    switch (user.role) {
        case 'admin': return <AdminDashboard />;
        case 'student': return <StudentDashboard />;
        case 'faculty': return <FacultyDashboard />; // <-- RENDER FACULTY DASH
        default: return <div>Your dashboard is not yet available.</div>;
    }
};
export default DashboardPage;