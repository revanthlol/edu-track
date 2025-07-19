// frontend/src/components/dashboards/StudentDashboard.jsx
import React, { useState, useEffect } from 'react';
import api from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { motion } from 'framer-motion';

const StudentDashboard = () => {
    const [courses, setCourses] = useState([]);
    const [enrolledCourseIds, setEnrolledCourseIds] = useState(new Set());
    const [error, setError] = useState('');

    useEffect(() => {
        Promise.all([
            api.get('/courses'),
            api.get('/enrollments/my-enrollments')
        ]).then(([coursesRes, enrollmentsRes]) => {
            setCourses(coursesRes.data);
            setEnrolledCourseIds(new Set(enrollmentsRes.data.map(e => e.courseId)));
        }).catch(() => {
            setError('Failed to load dashboard data.');
        });
    }, []);
    
    const handleEnroll = async (courseId) => {
        try {
            await api.post(`/enrollments/enroll/${courseId}`);
            setEnrolledCourseIds(prevIds => new Set(prevIds).add(courseId));
        } catch (err) {
            alert(err.response?.data?.message || 'Enrollment failed.');
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
        >
            <Card>
                <CardHeader>
                    <CardTitle>Course Catalog</CardTitle>
                    <CardDescription>Enroll in available courses below.</CardDescription>
                </CardHeader>
                <CardContent>
                    {error && <p className="text-red-500">{error}</p>}
                    <div className="space-y-4">
                        {courses.map(course => {
                            const isEnrolled = enrolledCourseIds.has(course.id);
                            return (
                                <Card key={course.id} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4">
                                    <div className="flex-grow">
                                        <h3 className="font-semibold">{course.courseName}</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">{course.description}</p>
                                    </div>
                                    <Button onClick={() => handleEnroll(course.id)} disabled={isEnrolled} variant={isEnrolled ? "secondary" : "default"} className="w-full md:w-auto">
                                        {isEnrolled ? 'Enrolled' : 'Enroll'}
                                    </Button>
                                </Card>
                            )
                        })}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default StudentDashboard;