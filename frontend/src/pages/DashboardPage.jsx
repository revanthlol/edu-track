// src/pages/DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const DashboardPage = ({ theme, toggleTheme }) => {
    const [courses, setCourses] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const { data } = await api.get('/courses');
                setCourses(data);
            } catch (err) {
                setError('Failed to fetch courses. You may be unauthorized.');
                if (err.response && err.response.status === 401) {
                    localStorage.removeItem('token'); // Clean up invalid token
                    navigate('/'); // Redirect to login
                }
            }
        };
        fetchCourses();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-slate-900 p-8">
            <header className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
                <Button onClick={handleLogout} variant="destructive">Logout</Button>
            </header>
            
            <Card>
                <CardHeader>
                    <CardTitle>Available Courses</CardTitle>
                </CardHeader>
                <CardContent>
                    {error && <p className="text-red-500">{error}</p>}
                    {courses.length > 0 ? (
                        <ul className="space-y-2">
                            {courses.map(course => (
                                <li key={course.id} className="p-2 border rounded-md dark:border-slate-700">
                                    <p className="font-semibold text-slate-900 dark:text-white">{course.courseName}</p>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">Credits: {course.credits}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No courses available. (Check if backend has data)</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default DashboardPage;