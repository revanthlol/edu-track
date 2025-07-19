// src/pages/DashboardPage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { jwtDecode } from 'jwt-decode'; // <-- IMPORT JWT DECODER
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

// Component for the course creation form
const CreateCourseForm = ({ onCourseCreated }) => {
    const [courseName, setCourseName] = useState('');
    const [description, setDescription] = useState('');
    const [credits, setCredits] = useState('');
    const [formError, setFormError] = useState('');

    const handleCreateCourse = async (e) => {
        e.preventDefault();
        setFormError('');
        try {
            const { data } = await api.post('/courses', { courseName, description, credits: Number(credits) });
            onCourseCreated(data); // Pass new course to parent
            // Clear form
            setCourseName('');
            setDescription('');
            setCredits('');
        } catch (err) {
            setFormError(err.response?.data?.message || 'Failed to create course');
        }
    };
    
    return (
        <Card className="mt-6">
            <CardHeader>
                <CardTitle>Create New Course</CardTitle>
                <CardDescription>Add a new course to the catalog.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleCreateCourse} className="space-y-4">
                    <Input placeholder="Course Name (e.g., Computer Science 101)" value={courseName} onChange={(e) => setCourseName(e.target.value)} required />
                    <Input placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
                    <Input type="number" placeholder="Credits" value={credits} onChange={(e) => setCredits(e.target.value)} required />
                    {formError && <p className="text-sm text-red-600">{formError}</p>}
                    <Button type="submit">Create Course</Button>
                </form>
            </CardContent>
        </Card>
    );
};


const DashboardPage = () => {
    const [courses, setCourses] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Decode token to get user role
    const token = localStorage.getItem('token');
    const user = useMemo(() => {
        try {
            return jwtDecode(token);
        } catch (e) {
            handleLogout(); // Invalid token
            return null;
        }
    }, [token]);

    useEffect(() => {
        api.get('/courses')
            .then(res => setCourses(res.data))
            .catch(err => {
                setError('Failed to fetch courses.');
                if (err.response?.status === 401) handleLogout();
            });
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };
    
    // Callback to add new course to the top of the list
    const handleCourseCreated = (newCourse) => {
        setCourses(prev => [newCourse, ...prev]);
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-slate-900 p-8">
            <header className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Student Dashboard</h1>
                <Button onClick={handleLogout} variant="destructive">Logout</Button>
            </header>

            {user?.role === 'admin' && <CreateCourseForm onCourseCreated={handleCourseCreated} />}

            <Card className="mt-6">
                <CardHeader>
                    <CardTitle>Available Courses</CardTitle>
                </CardHeader>
                <CardContent>
                    {error && <p className="text-red-500">{error}</p>}
                    <div className="space-y-4">
                        {courses.length > 0 ? (
                            courses.map(course => (
                                <div key={course.id} className="p-4 border rounded-md dark:border-slate-700 bg-white dark:bg-slate-950 flex justify-between items-center">
                                    <div>
                                        <p className="font-semibold text-slate-900 dark:text-white">{course.courseName}</p>
                                        <p className="text-sm text-slate-600 dark:text-slate-400">Credits: {course.credits}</p>
                                    </div>
                                    <Button variant="outline">Enroll</Button>
                                </div>
                            ))
                        ) : (
                            <p className="text-slate-600 dark:text-slate-400">No courses available. An admin needs to add some!</p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default DashboardPage;