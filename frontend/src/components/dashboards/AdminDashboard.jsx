// frontend/src/components/dashboards/AdminDashboard.jsx
import React, { useState, useEffect, useContext } from 'react';
import api from '@/services/api'; // api instance is already configured to use '/api'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
                // *** THIS IS THE CRITICAL FIX ***
                // The path is '/admin/stats', because the '/api' prefix is handled automatically.
                // My previous code incorrectly duplicated '/api/'. I am deeply sorry.
                const { data } = await api.get('/admin/stats');
                setStats(data);
            } catch (err) {
                setError('Failed to load dashboard statistics. Please ensure the backend is running.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (isLoading) { return <div className="h-[400px] flex items-center justify-center"><LoadingSpinner /></div>; }
    if (error) { return <div className="text-center text-red-500 font-semibold">{error}</div>; }
    if (!stats) { return null; }

    const statCards = [
        { name: 'Total Students', value: stats.counts.students, icon: Users },
        { name: 'Total Courses', value: stats.counts.courses, icon: BookOpen },
        { name: 'Total Enrollments', value: stats.counts.enrollments, icon: GraduationCap },
    ];

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {statCards.map((stat, i) => (
                    <motion.div key={stat.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                    <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">{stat.name}</CardTitle><stat.icon className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{stat.value}</div></CardContent></Card>
                    </motion.div>
                ))}
            </div>
            <motion.div className="mt-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <Card><CardHeader><CardTitle>Course Enrollments Overview</CardTitle></CardHeader><CardContent className="pl-2"><ResponsiveContainer width="100%" height={350}><BarChart data={stats.enrollmentByCourse}><XAxis dataKey="name" stroke={"hsl(var(--muted-foreground))"} fontSize={12} tickLine={false} axisLine={false} /><YAxis stroke={"hsl(var(--muted-foreground))"} fontSize={12} tickLine={false} axisLine={false} /><Tooltip cursor={{ fill: 'hsl(var(--muted))' }} contentStyle={{ background: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)' }} /><Bar dataKey="enrollments" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></CardContent></Card>
            </motion.div>
        </motion.div>
    );
};
export default AdminDashboard;