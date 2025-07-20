import React from 'react';
import { jwtDecode } from 'jwt-decode';
import AdminDashboard from '../components/dashboards/AdminDashboard';
import StudentDashboard from '../components/dashboards/StudentDashboard';
import FacultyDashboard from '../components/dashboards/FacultyDashboard';
export default function DashboardPage() {
    const user = jwtDecode(localStorage.getItem('token'));
    if (user.role === 'admin') return <AdminDashboard />;
    if (user.role === 'student') return <StudentDashboard />;
    if (user.role === 'faculty') return <FacultyDashboard />;
    return <div>Dashboard not configured for your role.</div>;
}