// frontend/src/pages/StudentReportPage.jsx
import React, { useState, useEffect } from 'react';
import api from '@/services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const StudentReportPage = () => {
    const [grades, setGrades] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        api.get('/api/students/my-grades').then(res => setGrades(res.data)).finally(() => setIsLoading(false));
    }, []);

    const calculateGPA = () => {
        const gradePoints = { 'A+': 4.0, 'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7, 'C+': 2.3, 'C': 2.0, 'C-': 1.7, 'D+': 1.3, 'D': 1.0, 'F': 0.0 };
        let totalPoints = 0;
        let totalCredits = 0;
        grades.forEach(g => {
            if (gradePoints[g.grade] !== undefined) {
                totalPoints += gradePoints[g.grade] * g.Course.credits;
                totalCredits += g.Course.credits;
            }
        });
        return totalCredits === 0 ? 'N/A' : (totalPoints / totalCredits).toFixed(2);
    };

    const exportToCSV = () => {
        const headers = ['Course', 'Credits', 'Grade', 'Comments'];
        const rows = grades.map(g => [g.Course.courseName, g.Course.credits, g.grade, `"${g.comments || ''}"`]);
        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "my_grade_report.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (isLoading) return <LoadingSpinner />;

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                    <CardTitle>My Academic Report</CardTitle>
                    <CardDescription>A summary of your academic performance to date.</CardDescription>
                    </div>
                    <Button onClick={exportToCSV}><Download className="mr-2 h-4 w-4"/>Export as CSV</Button>
                </CardHeader>
                <CardContent>
                    <Table><TableHeader><TableRow><TableHead>Course</TableHead><TableHead>Grade</TableHead><TableHead>Comments</TableHead></TableRow></TableHeader>
                        <TableBody>{grades.length > 0 ? grades.map(g => (
                            <TableRow key={g.id}><TableCell className="font-medium">{g.Course.courseName}</TableCell><TableCell className="font-bold text-lg">{g.grade}</TableCell><TableCell>{g.comments || 'N/A'}</TableCell></TableRow>
                        )) : <TableRow><TableCell colSpan="3" className="text-center h-24">No official grades have been posted.</TableCell></TableRow>}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
             <Card className="w-full md:w-1/3 ml-auto">
                <CardHeader><CardTitle>Cumulative GPA</CardTitle></CardHeader>
                <CardContent><p className="text-4xl font-bold">{calculateGPA()}</p></CardContent>
            </Card>
        </div>
    );
};
export default StudentReportPage;