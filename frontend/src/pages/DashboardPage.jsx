// frontend/src/pages/DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { jwtDecode } from 'jwt-decode';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

const CreateCourseForm = ({ onCourseCreated }) => {
    const [courseName, setCourseName] = useState('');
    const [description, setDescription] = useState('');
    const [credits, setCredits] = useState('');
    const [formError, setFormError] = useState('');

    const handleCreateCourse = async (e) => {
        e.preventDefault();
        setFormError('');
        if (!courseName || !credits) {
            setFormError('Course Name and Credits are required.');
            return;
        }
        try {
            const { data } = await api.post('/courses', { courseName, description, credits: Number(credits) });
            onCourseCreated(data);
            setCourseName('');
            setDescription('');
            setCredits('');
        } catch (err) {
            setFormError(err.response?.data?.message || 'Failed to create course');
        }
    };
    
    return (
        <Card className="mb-6">
            <CardHeader>
                <CardTitle>Create New Course</CardTitle>
                <CardDescription>Add a new course to the catalog.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleCreateCourse} className="space-y-4">
                    <Input placeholder="Course Name (e.g., Computer Science 101)" value={courseName} onChange={(e) => setCourseName(e.target.value)} />
                    <Input placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
                    <Input type="number" placeholder="Credits" value={credits} onChange={(e) => setCredits(e.target.value)} />
                    {formError && <p className="text-sm text-red-600">{formError}</p>}
                    <Button type="submit">Create Course</Button>
                </form>
            </CardContent>
        </Card>
    );
};

const DashboardPage = () => {
    const [courses, setCourses] = useState([]);
    const [enrolledCourseIds, setEnrolledCourseIds] = useState(new Set());
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try { setUser(jwtDecode(token)); } catch { navigate('/'); }
        } else { navigate('/'); }
    }, [navigate]);

    useEffect(() => {
        if (!user) return;
        
        const fetchAllData = async () => {
            try {
                const coursePromise = api.get('/courses');
                const promises = [coursePromise];

                if (user.role === 'student') {
                    promises.push(api.get('/enrollments/my-enrollments'));
                }

                const responses = await Promise.all(promises);
                setCourses(responses[0].data);

                if (responses.length > 1) {
                    setEnrolledCourseIds(new Set(responses[1].data.map(e => e.courseId)));
                }
            } catch (err) {
                setError('Failed to load dashboard data. Please try again.');
            }
        };

        fetchAllData();
    }, [user]);

    const handleEnroll = async (courseId) => {
        try {
            await api.post(`/enrollments/enroll/${courseId}`);
            setEnrolledCourseIds(prevIds => new Set(prevIds).add(courseId));
        } catch (err) {
            alert(err.response?.data?.message || 'Enrollment failed.');
        }
    };
    
    const handleCourseCreated = (newCourse) => {
        setCourses(prev => [newCourse, ...prev]);
    };

    if (!user) return null; // Or render a loading spinner

    return (
        <div className="space-y-6">
            <div className="pb-4 border-b dark:border-slate-800">
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                <p className="text-slate-500 dark:text-slate-400">Welcome back! Your role is: <span className="font-semibold capitalize text-primary">{user.role}</span></p>
            </div>

            {user.role === 'admin' && <CreateCourseForm onCourseCreated={handleCourseCreated} />}

            <Card>
                <CardHeader>
                    <CardTitle>Course Catalog</CardTitle>
                    <CardDescription>Available courses for enrollment.</CardDescription>
                </CardHeader>
                <CardContent>
                    {error && <p className="text-red-500">{error}</p>}
                    <div className="space-y-4">
                        {courses.length > 0 ? courses.map(course => {
                            const isEnrolled = enrolledCourseIds.has(course.id);
                            return (
                                <div key={course.id} className="p-4 border rounded-lg dark:border-slate-800 flex justify-between items-center gap-4">
                                    <div className="flex-grow">
                                        <h3 className="font-semibold">{course.courseName}</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">{course.description}</p>
                                        <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 mt-1">Credits: {course.credits}</p>
                                    </div>
                                    {user.role === 'student' && (
                                        <Button onClick={() => handleEnroll(course.id)} disabled={isEnrolled} variant={isEnrolled ? "secondary" : "default"}>
                                            {isEnrolled ? 'Enrolled' : 'Enroll'}
                                        </Button>
                                    )}
                                </div>
                            )
                        }) : <p className="text-center text-slate-500 py-4">No courses available. Please check back later.</p>}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default DashboardPage;