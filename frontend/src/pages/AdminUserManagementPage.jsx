// frontend/src/pages/AdminUserManagementPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import api from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { motion } from 'framer-motion';

const UserForm = ({ user, departments, onSave, onCancel }) => {
    const isEditing = !!user;
    const [formData, setFormData] = useState({
        name: user?.name || '', email: user?.email || '', password: '',
        role: user?.role || 'student',
        departmentId: user?.departmentId?.toString() || 'none'
    });
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...formData, departmentId: formData.departmentId === 'none' ? null : formData.departmentId };
            if (isEditing) {
                await api.put(`/admin/users/${user.id}`, payload);
            } else {
                await api.post('/admin/users', payload);
            }
            onSave();
        } catch (err) {
            alert('Operation failed. Ensure email is unique and all required fields are filled.');
        }
    };

    return (<form onSubmit={handleSubmit}><div className="grid gap-4 py-4">{!isEditing && (<><div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="name" className="text-right">Name</Label><Input id="name" required value={formData.name} onChange={e => setFormData({...formData,name: e.target.value})} className="col-span-3"/></div><div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="email" className="text-right">Email</Label><Input id="email" required type="email" value={formData.email} onChange={e=>setFormData({...formData,email: e.target.value})} className="col-span-3"/></div><div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="password" className="text-right">Password</Label><Input id="password" required type="password" value={formData.password} onChange={e=>setFormData({...formData,password: e.target.value})} className="col-span-3"/></div></>)}<div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="role" className="text-right">Role</Label><Select onValueChange={val=>setFormData({...formData,role:val})} defaultValue={formData.role}><SelectTrigger className="col-span-3"><SelectValue/></SelectTrigger><SelectContent><SelectItem value="student">Student</SelectItem><SelectItem value="faculty">Faculty</SelectItem><SelectItem value="admin">Admin</SelectItem></SelectContent></Select></div><div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="department" className="text-right">Department</Label><Select onValueChange={val=>setFormData({...formData,departmentId:val})} defaultValue={formData.departmentId}><SelectTrigger className="col-span-3"><SelectValue/></SelectTrigger><SelectContent><SelectItem value="none">None</SelectItem>{departments.map(d=><SelectItem key={d.id} value={String(d.id)}>{d.name}</SelectItem>)}</SelectContent></Select></div></div><div className="flex justify-end gap-2 mt-4"><Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button><Button type="submit">Save Changes</Button></div></form>);
};

export default function AdminUserManagementPage() {
    const [data, setData] = useState({ users: [], departments: [] });
    const [isLoading, setIsLoading] = useState(true);
    const [dialogContent, setDialogContent] = useState(null);
    const fetchData = useCallback(async () => { try { const res = await api.get('/admin/users'); setData(res.data); } finally { setIsLoading(false); } }, []);
    useEffect(() => { fetchData(); }, [fetchData]);

    const handleSave = () => { setDialogContent(null); fetchData(); };

    if (isLoading) return <LoadingSpinner />;

    return (<motion.div initial={{opacity:0}} animate={{opacity:1}}><Card><CardHeader><div className="flex justify-between items-center"><div><CardTitle>User Management</CardTitle><CardDescription>Manage all user accounts and roles in the system.</CardDescription></div><Button onClick={() => setDialogContent('create')}>Create New User</Button></div></CardHeader><CardContent><Table><TableHeader><TableRow><TableHead>User</TableHead><TableHead>Role</TableHead><TableHead>Department</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader><TableBody>
        {data.users.map(user => (<TableRow key={user.id}><TableCell>{user.name}<div className="text-xs text-muted-foreground">{user.email}</div></TableCell><TableCell className="capitalize">{user.role}</TableCell><TableCell>{user.Department?.name||'N/A'}</TableCell><TableCell className="text-right"><Button variant="outline" size="sm" onClick={() => setDialogContent(user)}>Edit</Button></TableCell></TableRow>))}
    </TableBody></Table></CardContent></Card><Dialog open={!!dialogContent} onOpenChange={(isOpen) => !isOpen && setDialogContent(null)}><DialogContent><DialogHeader><DialogTitle>{dialogContent === 'create' ? 'Create New User' : `Edit: ${dialogContent?.name}`}</DialogTitle><DialogDescription>Make changes to the user profile here. Click save when you're done.</DialogDescription></DialogHeader>{dialogContent && <UserForm user={dialogContent==='create' ? null : dialogContent} departments={data.departments} onSave={handleSave} onCancel={()=>setDialogContent(null)} />}</DialogContent></Dialog></motion.div>);
}