// frontend/src/pages/CourseManagementPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import api from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { format } from 'date-fns';

const GradeManager = ({ students, courseId }) => {
    const [currentStudent, setCurrentStudent] = useState(null);
    const [grade, setGrade] = useState('');
    const [comments, setComments] = useState('');

    const handleSubmit = async () => {
        if (!currentStudent) return;
        try {
            await api.post('/api/faculty/grades', { studentId: currentStudent.id, courseId, grade, comments });
            // Add success feedback, close dialog
        } catch (err) { alert('Failed to submit grade.'); }
    };

    return (<Table><TableHeader><TableRow><TableHead>Student</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader><TableBody>
        {students.map(student => (
            <TableRow key={student.id}>
                <TableCell className="font-medium">{student.name}</TableCell>
                <TableCell className="text-right">
                    <Dialog>
                        <DialogTrigger asChild><Button onClick={() => setCurrentStudent(student)}>Assign Grade</Button></DialogTrigger>
                        <DialogContent><DialogHeader><DialogTitle>Enter Grade for {student.name}</DialogTitle></DialogHeader><div className="grid gap-4 py-4"><Input placeholder="Grade (A-F)" value={grade} onChange={e => setGrade(e.target.value.toUpperCase())} /><Input placeholder="Comments" value={comments} onChange={e => setComments(e.target.value)} /></div><Button onClick={handleSubmit}>Submit Grade</Button></DialogContent>
                    </Dialog>
                </TableCell>
            </TableRow>
        ))}
    </TableBody></Table>);
};

const AttendanceManager = ({ students, courseId }) => {
    const [attendance, setAttendance] = useState({});
    const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));

    const handleStatusChange = (studentId, status) => { setAttendance(prev => ({ ...prev, [studentId]: status })); };
    const handleSaveAttendance = async () => {
        const payload = students.map(s => ({ studentId: s.id, status: attendance[s.id] || 'Absent' }));
        try { await api.post(`/api/faculty/courses/${courseId}/attendance`, { date, attendances: payload }); alert('Attendance saved!'); } catch (err) { alert('Failed to save attendance.'); }
    };
    
    return (<div className="space-y-4"><div className="flex items-center gap-4"><Label>Date:</Label><Input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-auto" /><Button onClick={handleSaveAttendance}>Save Attendance</Button></div><Table><TableHeader><TableRow><TableHead>Student</TableHead><TableHead>Status</TableHead></TableRow></TableHeader><TableBody>
        {students.map(student => ( <TableRow key={student.id}><TableCell>{student.name}</TableCell><TableCell><div className="flex gap-4"><label className="flex items-center gap-2"><Checkbox checked={attendance[student.id] === 'Present'} onCheckedChange={() => handleStatusChange(student.id, 'Present')} /> Present</label><label className="flex items-center gap-2"><Checkbox checked={attendance[student.id] === 'Absent'} onCheckedChange={() => handleStatusChange(student.id, 'Absent')} /> Absent</label><label className="flex items-center gap-2"><Checkbox checked={attendance[student.id] === 'Late'} onCheckedChange={() => handleStatusChange(student.id, 'Late')} /> Late</label></div></TableCell></TableRow>))}
    </TableBody></Table></div>);
};

const CourseManagementPage = () => {
    const { courseId } = useParams();
    const [students, setStudents] = useState([]);
    const [course, setCourse] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => { api.get(`/api/faculty/courses/${courseId}/students`).then(res => setStudents(res.data)).finally(() => setIsLoading(false)); }, [courseId]);

    if (isLoading) return <LoadingSpinner />;
    
    return (<Card><CardHeader><CardTitle>Manage Course</CardTitle><CardDescription>Manage grades and track attendance for your students.</CardDescription></CardHeader><CardContent>
        <Tabs defaultValue="grades"><TabsList className="grid w-full grid-cols-2"><TabsTrigger value="grades">Grades</TabsTrigger><TabsTrigger value="attendance">Attendance</TabsTrigger></TabsList>
        <TabsContent value="grades" className="mt-4"><GradeManager students={students} courseId={courseId} /></TabsContent>
        <TabsContent value="attendance" className="mt-4"><AttendanceManager students={students} courseId={courseId} /></TabsContent>
        </Tabs>
    </CardContent></Card>);
};
export default CourseManagementPage;