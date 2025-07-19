// frontend/src/pages/CourseManagementPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Checkbox } from "@/components/ui/checkbox"
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { format } from 'date-fns';

// GRADING COMPONENT
const GradeManager = ({ students, courseId }) => {
    const [grade, setGrade] = useState('');
    const [comments, setComments] = useState('');

    const handleSubmitGrade = async (studentId) => {
        try {
            await api.post('/api/faculty/grades', { studentId, courseId, grade, comments });
            // Ideally, close dialog and refresh grades list
        } catch (err) { alert('Failed to submit grade.'); }
    };

    return (
        <Table>
            <TableHeader><TableRow><TableHead>Student</TableHead><TableHead>Email</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
            <TableBody>
                {students.map(student => (
                    <TableRow key={student.id}>
                        <TableCell className="font-medium">{student.name}</TableCell>
                        <TableCell>{student.email}</TableCell>
                        <TableCell className="text-right">
                            <Dialog>
                                <DialogTrigger asChild><Button>Enter Grade</Button></DialogTrigger>
                                <DialogContent>
                                    <DialogHeader><DialogTitle>Enter Grade for {student.name}</DialogTitle></DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <Input placeholder="Grade (A-F)" value={grade} onChange={e => setGrade(e.target.value.toUpperCase())} />
                                        <Input placeholder="Comments" value={comments} onChange={e => setComments(e.target.value)} />
                                    </div>
                                    <Button onClick={() => handleSubmitGrade(student.id)}>Submit</Button>
                                </DialogContent>
                            </Dialog>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

// ATTENDANCE COMPONENT
const AttendanceManager = ({ students, courseId }) => {
    const [attendance, setAttendance] = useState({});
    const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));

    const handleStatusChange = (studentId, status) => {
        setAttendance(prev => ({ ...prev, [studentId]: status }));
    };
    
    const handleSaveAttendance = async () => {
        const payload = Object.entries(attendance).map(([studentId, status]) => ({ studentId, status }));
        try {
            await api.post(`/api/faculty/courses/${courseId}/attendance`, { date, attendances: payload });
            alert('Attendance saved!');
        } catch (err) { alert('Failed to save attendance.'); }
    };
    
    return (
        <div className="space-y-4">
             <div className="flex items-center gap-4">
                <Input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-auto" />
                <Button onClick={handleSaveAttendance}>Save Attendance for {date}</Button>
            </div>
            <Table>
                 <TableHeader><TableRow><TableHead>Student</TableHead><TableHead>Present</TableHead><TableHead>Absent</TableHead><TableHead>Late</TableHead></TableRow></TableHeader>
                <TableBody>
                     {students.map(student => (
                         <TableRow key={student.id}>
                            <TableCell>{student.name}</TableCell>
                            <TableCell><Checkbox checked={attendance[student.id] === 'Present'} onCheckedChange={() => handleStatusChange(student.id, 'Present')} /></TableCell>
                            <TableCell><Checkbox checked={attendance[student.id] === 'Absent'} onCheckedChange={() => handleStatusChange(student.id, 'Absent')} /></TableCell>
                            <TableCell><Checkbox checked={attendance[student.id] === 'Late'} onCheckedChange={() => handleStatusChange(student.id, 'Late')} /></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
};


const CourseManagementPage = () => {
    const { courseId } = useParams();
    const [students, setStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        api.get(`/api/faculty/courses/${courseId}/students`)
            .then(res => setStudents(res.data))
            .catch(err => console.error(err))
            .finally(() => setIsLoading(false));
    }, [courseId]);

    if (isLoading) return <LoadingSpinner />;
    if (students.length === 0) return <Card><CardHeader><CardTitle>No Students Enrolled</CardTitle><CardContent><p>There are currently no students enrolled in this course.</p></CardContent></CardHeader></Card>;

    return (
        <Tabs defaultValue="grades">
            <TabsList>
                <TabsTrigger value="grades">Manage Grades</TabsTrigger>
                <TabsTrigger value="attendance">Track Attendance</TabsTrigger>
            </TabsList>
            <TabsContent value="grades"><GradeManager students={students} courseId={courseId} /></TabsContent>
            <TabsContent value="attendance"><AttendanceManager students={students} courseId={courseId} /></TabsContent>
        </Tabs>
    );
};
export default CourseManagementPage;