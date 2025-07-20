// frontend/src/components/dashboards/AdminDashboard.jsx
import React, { useState, useEffect, useContext } from 'react';
import api from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { Users, BookOpen, GraduationCap } from 'lucide-react';
import { ThemeContext } from '@/providers/ThemeProvider';
import LoadingSpinner from '../ui/LoadingSpinner';

const AdminDashboard = () => {
    const { theme } = useContext(ThemeContext);
    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await api.get('/admin/stats');
                setStats(data); // The entire data object is stored
            } catch (err) {
                setError('Failed to load dashboard statistics. The backend server may be down.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchStats();
    }, []);
    
    // --- THIS IS THE CRITICAL FIX FOR THE UI ---
    // We defensively check for every piece of data before trying to render it.
    // This makes the component resilient and prevents crashes.
    const counts = stats?.counts;
    const chartData = stats?.enrollmentByCourse;

    const statCards = [
        { name: 'Total Students', value: counts?.students ?? 0, icon: Users },
        { name: 'Total Courses', value: counts?.courses ?? 0, icon: BookOpen },
        { name: 'Total Enrollments', value: counts?.enrollments ?? 0, icon: GraduationCap },
    ];

    if (isLoading) {
        return <div className="flex justify-center items-center h-[50vh]"><LoadingSpinner /></div>;
    }

    if (error) {
        return <div className="text-center py-10 text-red-500 font-semibold">{error}</div>;
    }

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {statCards.map((stat, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                    <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">{stat.name}</CardTitle><stat.icon className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{stat.value}</div></CardContent></Card>
                    </motion.div>
                ))}
            </div>
            <motion.div className="mt-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <Card><CardHeader><CardTitle>Course Enrollments Overview</CardTitle></CardHeader><CardContent className="pl-2">
                    <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={chartData || []}>
                            <XAxis dataKey="name" stroke={"hsl(var(--muted-foreground))"} fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke={"hsl(var(--muted-foreground))"} fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip cursor={{ fill: 'hsl(var(--muted))' }} contentStyle={{ background: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)' }} />
                            <Bar dataKey="enrollments" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent></Card>
            </motion.div>
        </motion.div>
    );
};
export default AdminDashboard;