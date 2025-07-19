// frontend/src/pages/StudentGradesPage.jsx
import React, { useState, useEffect } from 'react';
import api from '@/services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const StudentGradesPage = () => {
    const [grades, setGrades] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        api.get('/api/students/my-grades')
            .then(res => setGrades(res.data))
            .catch(() => setError('Failed to load grades.'))
            .finally(() => setIsLoading(false));
    }, []);

    if (isLoading) return <LoadingSpinner />;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <Card>
            <CardHeader>
                <CardTitle>My Grades</CardTitle>
                <CardDescription>A summary of your academic performance.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader><TableRow><TableHead>Course</TableHead><TableHead>Credits</TableHead><TableHead>Grade</TableHead><TableHead>Comments</TableHead></TableRow></TableHeader>
                    <TableBody>
                        {grades.length > 0 ? grades.map(grade => (
                            <TableRow key={grade.id}>
                                <TableCell className="font-medium">{grade.Course.courseName}</TableCell>
                                <TableCell>{grade.Course.credits}</TableCell>
                                <TableCell className="font-bold">{grade.grade}</TableCell>
                                <TableCell>{grade.comments || 'N/A'}</TableCell>
                            </TableRow>
                        )) : <TableRow><TableCell colSpan="4" className="text-center">No grades have been assigned yet.</TableCell></TableRow>}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};
export default StudentGradesPage;