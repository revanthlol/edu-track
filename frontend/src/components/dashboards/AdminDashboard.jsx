// frontend/src/components/dashboards/AdminDashboard.jsx
import React, { useState, useEffect, useContext } from 'react';
import api from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { Users, BookOpen, GraduationCap } from 'lucide-react';
import { ThemeContext } from '@/providers/ThemeProvider';
import LoadingSpinner from '../ui/LoadingSpinner';

export default function AdminDashboard() {
    const { theme } = useContext(ThemeContext);
    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // The correct, non-duplicated API path
                const { data } = await api.get('/admin/stats');
                setStats(data);
            } catch (err) {
                setError('Failed to load dashboard statistics. The backend server may be unavailable.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (isLoading) {
        // Show a spinner centered within the content area while loading
        return <div className="flex justify-center items-center h-[60vh]"><LoadingSpinner /></div>;
    }

    if (error) {
        // Show a clear error message if the API call fails
        return <div className="text-center py-10 text-red-500 font-semibold">{error}</div>;
    }

    // Defensive data handling: ensure data exists before trying to render it
    const counts = stats?.counts ?? {};
    const chartData = stats?.enrollmentByCourse ?? [];

    const statCards = [
        { name: 'Total Students', value: counts.students ?? 0, icon: Users },
        { name: 'Total Courses', value: counts.courses ?? 0, icon: BookOpen },
        { name: 'Total Enrollments', value: counts.enrollments ?? 0, icon: GraduationCap },
    ];
    
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <motion.div
                className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
                variants={{ show: { transition: { staggerChildren: 0.1 } } }}
                initial="hidden"
                animate="show"
            >
                {statCards.map((stat) => (
                    <motion.div key={stat.name} variants={{ hidden: { y: 20, opacity: 0 }, show: { y: 0, opacity: 1 } }}>
                        <Card className="hover:bg-muted/50 transition-colors">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">{stat.name}</CardTitle>
                                <stat.icon className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stat.value}</div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </motion.div>
            <motion.div className="mt-6" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
                <Card>
                    <CardHeader>
                        <CardTitle>Course Enrollments Overview</CardTitle>
                        <CardDescription>A summary of student enrollments per department.</CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <ResponsiveContainer width="100%" height={350}>
                            <BarChart data={chartData}>
                                <XAxis dataKey="name" stroke={"hsl(var(--muted-foreground))"} fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke={"hsl(var(--muted-foreground))"} fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    cursor={{fill: 'hsl(var(--muted))' }}
                                    contentStyle={{ background: 'hsl(var(--background))', borderRadius: 'var(--radius)', border: '1px solid hsl(var(--border))' }}
                                />
                                <Bar dataKey="enrollments" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </motion.div>
        </motion.div>
    );
}