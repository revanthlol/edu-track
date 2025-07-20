// frontend/src/pages/StudentGradesPage.jsx
import React, { useState, useEffect } from 'react';
import api from '@/services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const StudentGradesPage = () => {
    const [grades, setGrades] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        api.get('/api/students/my-grades').then(res => setGrades(res.data)).finally(() => setIsLoading(false));
    }, []);

    if (isLoading) return <LoadingSpinner />;

    return (
        <Card>
            <CardHeader>
                <CardTitle>My Grades</CardTitle>
                <CardDescription>A summary of your academic performance.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader><TableRow><TableHead>Course</TableHead><TableHead>Grade</TableHead><TableHead>Comments</TableHead></TableRow></TableHeader>
                    <TableBody>
                        {grades.length > 0 ? grades.map(g => (
                            <TableRow key={g.id}>
                                <TableCell className="font-medium">{g.Course.courseName}</TableCell>
                                <TableCell className="font-bold text-lg">{g.grade}</TableCell>
                                <TableCell>{g.comments || 'N/A'}</TableCell>
                            </TableRow>
                        )) : <TableRow><TableCell colSpan="3" className="text-center h-24">No grades have been assigned yet.</TableCell></TableRow>}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};
export default StudentGradesPage;