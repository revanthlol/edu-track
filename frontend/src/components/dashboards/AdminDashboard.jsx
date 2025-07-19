// frontend/src/components/dashboards/AdminDashboard.jsx
import React, { useContext } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { Users, BookOpen, GraduationCap } from 'lucide-react';
import { ThemeContext } from '@/providers/ThemeProvider';

const stats = [ /* same static data as before */ ];
const chartData = [ /* same static data as before */ ];

// Using HSL values from Tailwind's default theme for perfect color matching
const colors = {
    light: { text: "hsl(222.2 47.4% 11.2%)", fill: "hsl(222.2 47.4% 11.2%)" },
    dark: { text: "hsl(210 40% 96.1%)", fill: "hsl(210 40% 96.1%)" }
};

const AdminDashboard = () => {
    const { theme } = useContext(ThemeContext);
    const themeColors = colors[theme] || colors.light;

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {stats.map((stat, index) => (
                    <Card key={index} className="hover:bg-muted/50 transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{stat.name}</CardTitle>
                            <stat.icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>
            <div className="mt-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Course Enrollments Overview</CardTitle>
                        <CardDescription>A summary of student enrollments per department.</CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <ResponsiveContainer width="100%" height={350}>
                            <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <XAxis dataKey="name" stroke={themeColors.text} fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke={themeColors.text} fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    cursor={{fill: 'hsla(222.2, 47.4%, 11.2%, 0.1)'}}
                                    contentStyle={{ 
                                        backgroundColor: 'hsl(0 0% 100%)', // Or use a dark mode color
                                        borderRadius: '0.5rem',
                                        border: '1px solid hsl(214.3 31.8% 91.4%)',
                                    }}/>
                                <Bar dataKey="enrollments" fill={themeColors.fill} radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </motion.div>
    );
};
export default AdminDashboard;