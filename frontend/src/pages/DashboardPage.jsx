// frontend/src/pages/DashboardPage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { jwtDecode } from 'jwt-decode';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

// Admin's course creation component - no changes needed
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
            onCourseCreated(data);
            setCourseName(''); setDescription(''); setCredits('');
        } catch (err) {
            setFormError(err.response?.data?.message || 'Failed to create course');
        }
    };
    return (
        <Card className="mt-6">
            <CardHeader><CardTitle>Create New Course</CardTitle></CardHeader>
            <CardContent>
                <form onSubmit={handleCreateCourse} className="space-y-4">
                    <Input placeholder="Course Name" value={courseName} onChange={e => setCourseName(e.target.value)} required />
                    <Input placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
                    <Input type="number" placeholder="Credits" value={credits} onChange={e => setCredits(e.target.value)} required />
                    {formError && <p className="text-sm text-red-600">{formError}</p>}
                    <Button type="submit">Create Course</Button>
                </form>
            </CardContent>
        </Card>
    );
};

// The main Dashboard Page - completely rebuilt for perfection
const DashboardPage = () => {
    const [courses, setCourses] = useState([]);
    const [enrolledCourseIds, setEnrolledCourseIds] = useState(new Set());
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // 1. Decode token on mount to get user info
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedUser = jwtDecode(token);
                setUser(decodedUser);
            } catch (e) {
                handleLogout(); // Invalid token
            }
        } else {
            handleLogout();
        }
    }, []);

    // 2. Fetch data once user is identified
    useEffect(() => {
        if (!user) return; // Don't fetch if no user

        const fetchAllCourses = api.get('/courses');
        const fetchPromises = [fetchAllCourses];

        // If the user is a student, also fetch their specific enrollments
        if (user.role === 'student') {
            fetchPromises.push(api.get('/enrollments/my-enrollments'));
        }

        Promise.all(fetchPromises)
            .then(responses => {
                setCourses(responses[0].data);
                if (responses.length > 1) {
                    const enrolledIds = new Set(responses[1].data.map(e => e.courseId));
                    setEnrolledCourseIds(enrolledIds);
                }
            })
            .catch(err => {
                setError('Failed to fetch required data.');
                if (err.response?.status === 401) handleLogout();
            });
    }, [user]); // Re-run if user changes

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    const handleEnroll = async (courseId) => {
        try {
            await api.post(`/enrollments/enroll/${courseId}`);
            // Instantly update the UI for perfect user experience
            setEnrolledCourseIds(prevIds => new Set(prevIds).add(courseId));
        } catch (err) {
            alert(err.response?.data?.message || 'Enrollment failed.');
        }
    };
    
    const handleCourseCreated = (newCourse) => {
        setCourses(prev => [newCourse, ...prev]);
    };

    if (!user) {
        return null; // or a loading spinner
    }

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-slate-900 p-8">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
                    <p className="text-slate-500 dark:text-slate-400">Welcome! Your role is: <span className="font-semibold capitalize">{user.role}</span></p>
                </div>
                <Button onClick={handleLogout} variant="destructive">Logout</Button>
            </header>

            {user.role === 'admin' && <CreateCourseForm onCourseCreated={handleCourseCreated} />}

            <Card className="mt-6">
                <CardHeader><CardTitle>Course Catalog</CardTitle></CardHeader>
                <CardContent>
                    {error && <p className="text-red-500">{error}</p>}
                    <div className="space-y-4">
                        {courses.length > 0 ? (
                            courses.map(course => {
                                const isEnrolled = enrolledCourseIds.has(course.id);
                                return (
                                <div key={course.id} className="p-4 border rounded-md dark:border-slate-700 bg-white dark:bg-slate-950 flex justify-between items-center">
                                    <div>
                                        <p className="font-semibold text-slate-900 dark:text-white">{course.courseName}</p>
                                        <p className="text-sm text-slate-600 dark:text-slate-400">Credits: {course.credits}</p>
                                        <p className="text-xs text-slate-500">{course.description}</p>
                                    </div>
                                    {user.role === 'student' && (
                                        <Button onClick={() => handleEnroll(course.id)} disabled={isEnrolled} variant={isEnrolled ? "secondary" : "default"}>
                                            {isEnrolled ? 'Enrolled' : 'Enroll'}
                                        </Button>
                                    )}
                                </div>
                            )})
                        ) : (
                            <p className="text-slate-600 dark:text-slate-400">No courses available. An admin must add courses.</p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default DashboardPage;