// frontend/src/components/dashboards/StudentDashboard.jsx
import React, { useState, useEffect } from 'react';
import api from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import LoadingSpinner from '../ui/LoadingSpinner';

export default function StudentDashboard() {
    const [courses, setCourses] = useState([]);
    const [enrolledCourseIds, setEnrolledCourseIds] = useState(new Set());
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        // Fetch both the full course list and the user's personal enrollments in parallel
        Promise.all([
            api.get('/courses'),
            api.get('/enrollments/my-enrollments')
        ]).then(([coursesRes, enrollmentsRes]) => {
            setCourses(coursesRes.data);
            setEnrolledCourseIds(new Set(enrollmentsRes.data.map(e => e.courseId)));
        }).catch(() => {
            setError('Failed to load your course data. Please try refreshing the page.');
        }).finally(() => {
            setIsLoading(false);
        });
    }, []);
    
    const handleEnroll = async (courseId) => {
        try {
            // Optimistic UI update for a snappy user experience
            setEnrolledCourseIds(prevIds => new Set(prevIds).add(courseId));
            await api.post(`/enrollments/enroll/${courseId}`);
        } catch (err) {
            // Revert on error
            setEnrolledCourseIds(prevIds => {
                const newIds = new Set(prevIds);
                newIds.delete(courseId);
                return newIds;
            });
            alert(err.response?.data?.message || 'Enrollment failed.');
        }
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-[60vh]"><LoadingSpinner /></div>;
    }

    if (error) {
        return <div className="text-center py-10 text-red-500 font-semibold">{error}</div>;
    }

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <Card>
                <CardHeader>
                    <CardTitle>Course Catalog</CardTitle>
                    <CardDescription>Browse and enroll in available courses.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {courses.length > 0 ? courses.map((course, index) => {
                        const isEnrolled = enrolledCourseIds.has(course.id);
                        return (
                            <motion.div
                                key={course.id}
                                variants={{ hidden: { y: 20, opacity: 0 }, show: { y: 0, opacity: 1 } }}
                                initial="hidden"
                                animate="show"
                                transition={{ delay: index * 0.05 }}
                            >
                                <Card className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4">
                                    <div className="flex-grow">
                                        <h3 className="font-semibold">{course.courseName}</h3>
                                        <p className="text-sm text-muted-foreground">{course.description}</p>
                                    </div>
                                    <Button
                                        onClick={() => handleEnroll(course.id)}
                                        disabled={isEnrolled}
                                        variant={isEnrolled ? "secondary" : "default"}
                                        className="w-full md:w-auto flex-shrink-0"
                                    >
                                        {isEnrolled ? 'Enrolled' : 'Enroll Now'}
                                    </Button>
                                </Card>
                            </motion.div>
                        )
                    }) : (
                        <p className="text-center py-10 text-muted-foreground">No courses are available for enrollment at this time.</p>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
}