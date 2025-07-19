// frontend/src/components/dashboards/AdminDashboard.jsx
import React, { useState, useEffect, useContext } from 'react';
import api from '@/services/api'; // api instance is already configured to use '/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { Users, BookOpen, GraduationCap } from 'lucide-react';
import { ThemeContext } from '@/providers/ThemeProvider';
import LoadingSpinner from '../ui/LoadingSpinner';

const colors = {
    light: { text: "hsl(215 20.2% 65.1%)", fill: "hsl(222.2 47.4% 11.2%)" },
    dark: { text: "hsl(215 20.2% 65.1%)", fill: "hsl(210 40% 96.1%)" }
};

const AdminDashboard = () => {
    const { theme } = useContext(ThemeContext);
    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // *** THIS IS THE FIX ***
                // The URL must be '/admin/stats', not '/api/admin/stats'.
                // The '/api' prefix is automatically added by our central 'api.js' service.
                const { data } = await api.get('/admin/stats');
                setStats(data);
            } catch (err) {
                setError('Failed to load dashboard statistics.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (isLoading) return <div className="h-[400px] flex items-center justify-center"><LoadingSpinner /></div>;
    if (error) return <div className="text-center text-red-500 font-semibold">{error}</div>;
    if (!stats) return null;

    const statCards = [
        { name: 'Total Students', value: stats.counts.students, icon: Users },
        { name: 'Total Courses', value: stats.counts.courses, icon: BookOpen },
        { name: 'Total Enrollments', value: stats.counts.enrollments, icon: GraduationCap },
    ];
    
    const themeColors = colors[theme] || colors.light;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <motion.div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3" variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } }}} initial="hidden" animate="show">
                {statCards.map((stat) => (
                    <motion.div key={stat.name} variants={{ hidden: { y: 20, opacity: 0 }, show: { y: 0, opacity: 1 } }}>
                        <Card>
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
            <motion.div className="mt-6" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
                <Card>
                    <CardHeader><CardTitle>Course Enrollments Overview</CardTitle></CardHeader>
                    <CardContent className="pl-2">
                        <ResponsiveContainer width="100%" height={350}>
                            <BarChart data={stats.enrollmentByCourse}>
                                <XAxis dataKey="name" stroke={themeColors.text} fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke={themeColors.text} fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip cursor={{fill: 'hsl(var(--muted))' }} contentStyle={{ background: 'hsl(var(--background))', borderRadius: '0.5rem', border: '1px solid hsl(var(--border))' }}/>
                                <Bar dataKey="enrollments" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </motion.div>
        </motion.div>
    );
};
export default AdminDashboard;