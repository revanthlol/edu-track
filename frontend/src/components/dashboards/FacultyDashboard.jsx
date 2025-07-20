// frontend/src/components/dashboards/FacultyDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '@/services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { BookUser } from 'lucide-react';
import LoadingSpinner from '../ui/LoadingSpinner';

const FacultyDashboard = () => {
    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        api.get('/api/faculty/my-courses')
            .then(res => setCourses(res.data))
            .finally(() => setIsLoading(false));
    }, []);

    if (isLoading) return <LoadingSpinner />;

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card>
                <CardHeader>
                    <CardTitle>My Teaching Schedule</CardTitle>
                    <CardDescription>Select a course to manage student grades and attendance.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                    {courses.length > 0 ? courses.map(course => (
                        <Link to={`/dashboard/courses/${course.id}`} key={course.id}>
                            <motion.div whileHover={{ scale: 1.03 }} className="p-6 border rounded-lg hover:bg-muted cursor-pointer transition-colors">
                                <div className="flex items-center gap-4">
                                    <BookUser className="h-8 w-8 text-primary" />
                                    <div>
                                        <h3 className="font-semibold">{course.courseName}</h3>
                                        <p className="text-sm text-muted-foreground">{course.credits} Credits</p>
                                    </div>
                                </div>
                            </motion.div>
                        </Link>
                    )) : ( <p className="text-muted-foreground">You are not currently assigned to teach any courses.</p> )}
                </CardContent>
            </Card>
        </motion.div>
    );
};
export default FacultyDashboard;