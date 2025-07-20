// frontend/src/pages/AdminCourseManagementPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import api from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const CourseForm = ({ course, departments, faculty, onSave, onCancel }) => {
    const isEditing = !!course;
    const [formData, setFormData] = useState({ courseName: course?.courseName || '', description: course?.description || '', credits: course?.credits || '', facultyId: course?.facultyId?.toString() || 'none', departmentId: course?.departmentId?.toString() || 'none' });
    const handleSubmit = async (e) => { e.preventDefault(); try { const payload = {...formData, credits: Number(formData.credits)}; if (isEditing) { await api.put(`/admin/courses/${course.id}`, payload); } else { await api.post('/admin/courses', payload); } onSave(); } catch (err) { alert('Operation failed.'); }};
    return (<form onSubmit={handleSubmit}><div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4"><Label className="text-right">Name</Label><Input required value={formData.courseName} onChange={e=>setFormData({...formData, courseName: e.target.value})} className="col-span-3"/></div>
        <div className="grid grid-cols-4 items-center gap-4"><Label className="text-right">Description</Label><Input value={formData.description} onChange={e=>setFormData({...formData, description: e.target.value})} className="col-span-3"/></div>
        <div className="grid grid-cols-4 items-center gap-4"><Label className="text-right">Credits</Label><Input required type="number" value={formData.credits} onChange={e=>setFormData({...formData, credits: e.target.value})} className="col-span-3"/></div>
        <div className="grid grid-cols-4 items-center gap-4"><Label className="text-right">Faculty</Label><Select onValueChange={v=>setFormData({...formData, facultyId:v})} defaultValue={formData.facultyId}><SelectTrigger className="col-span-3"><SelectValue/></SelectTrigger><SelectContent><SelectItem value="none">Unassigned</SelectItem>{faculty.map(f=><SelectItem key={f.id} value={String(f.id)}>{f.name}</SelectItem>)}</SelectContent></Select></div>
        <div className="grid grid-cols-4 items-center gap-4"><Label className="text-right">Dept.</Label><Select onValueChange={v=>setFormData({...formData, departmentId:v})} defaultValue={formData.departmentId}><SelectTrigger className="col-span-3"><SelectValue/></SelectTrigger><SelectContent><SelectItem value="none">None</SelectItem>{departments.map(d=><SelectItem key={d.id} value={String(d.id)}>{d.name}</SelectItem>)}</SelectContent></Select></div>
    </div><div className="flex justify-end gap-2 mt-4"><Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button><Button type="submit">Save Course</Button></div></form>);
};

export default function AdminCourseManagementPage() {
    const [data, setData] = useState({ courses: [], faculty: [], departments: [] });
    const [isLoading, setIsLoading] = useState(true);
    const [dialogContent, setDialogContent] = useState(null);
    
    const fetchData = useCallback(async () => {
        try {
            // Fetch all data in parallel
            const [coursesRes, usersRes] = await Promise.all([ api.get('/admin/courses'), api.get('/admin/users') ]);
            setData({ courses: coursesRes.data, faculty: usersRes.data.users.filter(u => u.role === 'faculty'), departments: usersRes.data.departments });
        } finally { setIsLoading(false); }
    }, []);
    useEffect(() => { fetchData(); }, [fetchData]);
    
    const handleSave = () => { setDialogContent(null); fetchData(); };
    if (isLoading) return <LoadingSpinner />;

    return (<Card><CardHeader><div className="flex justify-between items-center"><div><CardTitle>Course Management</CardTitle><CardDescription>Manage all courses in the system.</CardDescription></div><Button onClick={()=>setDialogContent('create')}>Create New Course</Button></div></CardHeader><CardContent><Table><TableHeader><TableRow><TableHead>Course</TableHead><TableHead>Faculty</TableHead><TableHead>Department</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader><TableBody>
        {data.courses.map(course => (<TableRow key={course.id}>
            <TableCell>{course.courseName}<div className="text-xs text-muted-foreground">{course.credits} credits</div></TableCell>
            <TableCell>{course.faculty?.name || 'Unassigned'}</TableCell><TableCell>{course.Department?.name || 'N/A'}</TableCell>
            <TableCell className="text-right"><Button variant="outline" size="sm" onClick={() => setDialogContent(course)}>Edit</Button></TableCell>
        </TableRow>))}
    </TableBody></Table></CardContent><Dialog open={!!dialogContent} onOpenChange={(isOpen)=>!isOpen&&setDialogContent(null)}><DialogContent><DialogHeader><DialogTitle>{dialogContent==='create'?'Create New Course':`Edit: ${dialogContent?.courseName}`}</DialogTitle></DialogHeader>{dialogContent && <CourseForm course={dialogContent==='create'?null:dialogContent} departments={data.departments} faculty={data.faculty} onSave={handleSave} onCancel={()=>setDialogContent(null)}/>}</DialogContent></Dialog>
    </Card>);
}