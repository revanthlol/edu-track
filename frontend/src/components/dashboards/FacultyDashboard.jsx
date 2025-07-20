import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '@/services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { BookUser } from 'lucide-react';
import LoadingSpinner from '../ui/LoadingSpinner';

export default function FacultyDashboard() {
    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        api.get('/faculty/my-courses')
            .then(res => setCourses(res.data))
            .catch(err => console.error("Failed to fetch faculty courses", err))
            .finally(() => setIsLoading(false));
    }, []);

    if (isLoading) return <LoadingSpinner />;

    return (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Card>
            <CardHeader>
                <CardTitle>My Teaching Assignments</CardTitle>
                <CardDescription>Select a course to manage grades and attendance.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
                {courses.length > 0 ? courses.map(course => (
                    <Link to={`/dashboard/courses/${course.id}`} key={course.id}>
                        <motion.div whileHover={{ scale: 1.03, boxShadow: "0px 10px 20px rgba(0,0,0,0.1)" }} className="p-6 border rounded-lg hover:bg-muted cursor-pointer transition-colors">
                            <div className="flex items-center gap-4"><BookUser className="h-8 w-8 text-primary" /><div>
                                <h3 className="font-semibold">{course.courseName}</h3>
                                <p className="text-sm text-muted-foreground">{course.credits} Credits</p>
                            </div></div>
                        </motion.div>
                    </Link>
                )) : (<p className="text-muted-foreground col-span-2">You are not currently assigned to any courses.</p>)}
            </CardContent>
        </Card>
    </motion.div>);
}