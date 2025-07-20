// frontend/src/pages/CourseManagementPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from "@/components/ui/checkbox";
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { format } from 'date-fns';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Download, ArrowLeft } from 'lucide-react';

// --- Sub-component for Grade Management ---
const GradeManager = ({ students, courseId }) => {
    const [dialogStudent, setDialogStudent] = useState(null);
    const [grade, setGrade] = useState('');
    const [comments, setComments] = useState('');

    const handleSubmit = async () => {
        try {
            await api.post('/faculty/grades', { studentId: dialogStudent.id, courseId, grade, comments });
            setDialogStudent(null);
        } catch (err) { alert('Failed to submit grade.'); }
    };

    return (<Table><TableHeader><TableRow><TableHead>Student</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader><TableBody>
        {students.map(student => (
            <TableRow key={student.id}>
                <TableCell className="font-medium">{student.name}</TableCell>
                <TableCell className="text-right">
                    <Dialog open={dialogStudent?.id === student.id} onOpenChange={(isOpen) => !isOpen && setDialogStudent(null)}>
                        <DialogTrigger asChild><Button onClick={() => setDialogStudent(student)}>Assign/Update Grade</Button></DialogTrigger>
                        <DialogContent>
                            <DialogHeader><DialogTitle>Enter Grade for {student.name}</DialogTitle></DialogHeader>
                            <div className="grid gap-4 py-4">
                                <Input placeholder="Grade (A-F)" value={grade} onChange={e => setGrade(e.target.value.toUpperCase())} maxLength="2" />
                                <Input placeholder="Comments" value={comments} onChange={e => setComments(e.target.value)} />
                            </div>
                            <Button onClick={handleSubmit}>Submit Grade</Button>
                        </DialogContent>
                    </Dialog>
                </TableCell>
            </TableRow>
        ))}
    </TableBody></Table>);
};

// --- Sub-component for Attendance Management ---
const AttendanceManager = ({ students, courseId }) => {
    const [attendance, setAttendance] = useState({});
    const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));

    const handleStatusChange = (studentId, status) => { setAttendance(prev => ({ ...prev, [studentId]: prev[studentId] === status ? null : status })); };
    const handleSaveAttendance = async () => {
        const payload = students.map(s => ({ studentId: s.id, status: attendance[s.id] || 'Absent' }));
        try { await api.post(`/faculty/courses/${courseId}/attendance`, { date, attendances: payload }); alert('Attendance saved!'); } catch { alert('Failed to save.'); }
    };

    return (<div className="space-y-4"><div className="flex items-center gap-4"><Label htmlFor="att-date">Date:</Label><Input id="att-date" type="date" value={date} onChange={e => setDate(e.target.value)} className="w-auto" /><Button onClick={handleSaveAttendance}>Save Attendance</Button></div><Table><TableHeader><TableRow><TableHead>Student</TableHead><TableHead className="text-center">Present</TableHead><TableHead className="text-center">Absent</TableHead><TableHead className="text-center">Late</TableHead></TableRow></TableHeader><TableBody>
        {students.map(s => (<TableRow key={s.id}><TableCell>{s.name}</TableCell><TableCell className="text-center"><Checkbox checked={attendance[s.id]==='Present'} onCheckedChange={()=>handleStatusChange(s.id,'Present')} /></TableCell><TableCell className="text-center"><Checkbox checked={attendance[s.id]==='Absent'} onCheckedChange={()=>handleStatusChange(s.id,'Absent')} /></TableCell><TableCell className="text-center"><Checkbox checked={attendance[s.id]==='Late'} onCheckedChange={()=>handleStatusChange(s.id,'Late')} /></TableCell></TableRow>))}
    </TableBody></Table></div>);
};

// --- Sub-component for Reports ---
const ReportManager = ({ courseId }) => {
    const [report, setReport] = useState([]);
    useEffect(() => { api.get(`/faculty/courses/${courseId}/report`).then(res => setReport(res.data)); }, [courseId]);

    // *** THIS IS THE CRITICAL FIX ***
    const exportToCSV = useCallback(() => {
        if (report.length === 0) return;
        const headers = ['StudentName', 'Present', 'Absent', 'Late'];
        // The API returns nested attendance objects, so we need to flatten them
        const rows = report.map(row => [
            `"${row.name}"`,
            row.attendances[0]?.presentCount || 0,
            row.attendances[0]?.absentCount || 0,
            row.attendances[0]?.lateCount || 0
        ]);
        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `attendance_report_${courseId}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }, [report, courseId]);

    return (<div className="space-y-4"><Button onClick={exportToCSV} disabled={report.length === 0}><Download className="mr-2 h-4 w-4" />Export as CSV</Button><div className="h-[400px]"><ResponsiveContainer width="100%" height="100%"><BarChart data={report.map(r => ({ ...r.attendances[0], name: r.name }))} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}><XAxis type="number" hide/><YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} /><Tooltip cursor={{ fill: 'hsl(var(--muted))' }} /><Legend /><Bar dataKey="presentCount" stackId="a" fill="hsl(var(--primary))" name="Present"/><Bar dataKey="absentCount" stackId="a" fill="hsl(var(--destructive))" name="Absent"/><Bar dataKey="lateCount" stackId="a" fill="hsl(var(--secondary))" name="Late"/></BarChart></ResponsiveContainer></div></div>);
};

// --- Main Page Component ---
export default function CourseManagementPage() {
    const { courseId } = useParams();
    const [students, setStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        api.get(`/faculty/courses/${courseId}/students`).then(res => {
            setStudents(res.data);
        }).finally(() => setIsLoading(false));
    }, [courseId]);
    
    if (isLoading) return <LoadingSpinner />;

    return (
        <Card>
            <CardHeader>
                <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-primary inline-flex items-center gap-1 mb-2">
                    <ArrowLeft size={14}/>Back to Dashboard
                </Link>
                <CardTitle>Manage Course</CardTitle>
                <CardDescription>Manage grades, attendance, and reports for your enrolled students.</CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="grades" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="grades">Grades</TabsTrigger>
                        <TabsTrigger value="attendance">Attendance</TabsTrigger>
                        <TabsTrigger value="reports">Reports</TabsTrigger>
                    </TabsList>
                    <TabsContent value="grades" className="mt-4">
                        {students.length > 0 ? <GradeManager students={students} courseId={courseId} /> : <p>No students enrolled in this course.</p>}
                    </TabsContent>
                    <TabsContent value="attendance" className="mt-4">
                        {students.length > 0 ? <AttendanceManager students={students} courseId={courseId} /> : <p>No students enrolled in this course.</p>}
                    </TabsContent>
                    <TabsContent value="reports" className="mt-4">
                        <ReportManager courseId={courseId} />
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}