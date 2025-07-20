// frontend/src/pages/AdminUserManagementPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import api from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // A new UI component we need
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { motion } from 'framer-motion';

const UserForm = ({ user, departments, onSave, closeDialog }) => {
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        password: '',
        role: user?.role || 'student',
        departmentId: user?.departmentId || ''
    });

    const handleChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        // Logic to either create a new user or update an existing one
        try {
            if (user) { // Update
                await api.put(`/api/admin/users/${user.id}`, { role: formData.role, departmentId: formData.departmentId });
            } else { // Create
                await api.post('/api/admin/users', formData);
            }
            onSave();
            closeDialog();
        } catch (err) {
            alert('Operation failed. Please check your data.');
        }
    };

    return (
        <div className="grid gap-4 py-4">
            {!user && ( // Only show these fields for new users
                <>
                    <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="name" className="text-right">Name</Label><Input id="name" value={formData.name} onChange={e => handleChange('name', e.target.value)} className="col-span-3" /></div>
                    <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="email" className="text-right">Email</Label><Input id="email" type="email" value={formData.email} onChange={e => handleChange('email', e.target.value)} className="col-span-3" /></div>
                    <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="password" className="text-right">Password</Label><Input id="password" type="password" value={formData.password} onChange={e => handleChange('password', e.target.value)} className="col-span-3" /></div>
                </>
            )}
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">Role</Label>
                <Select onValueChange={value => handleChange('role', value)} defaultValue={formData.role}><SelectTrigger className="col-span-3"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="student">Student</SelectItem><SelectItem value="faculty">Faculty</SelectItem><SelectItem value="admin">Admin</SelectItem></SelectContent></Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="department" className="text-right">Department</Label>
                <Select onValueChange={value => handleChange('departmentId', value)} defaultValue={formData.departmentId}><SelectTrigger className="col-span-3"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="">None</SelectItem>{departments.map(d => <SelectItem key={d.id} value={String(d.id)}>{d.name}</SelectItem>)}</SelectContent></Select>
            </div>
            <Button onClick={handleSubmit}>Save Changes</Button>
        </div>
    );
};


const AdminUserManagementPage = () => {
    const [data, setData] = useState({ users: [], departments: [] });
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setDialogOpen] = useState(false);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await api.get('/api/admin/users');
            setData(res.data);
        } catch (err) {
            console.error("Failed to fetch user data");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    if (isLoading) return <LoadingSpinner />;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>User Management</CardTitle>
                            <CardDescription>Create, update, and manage all users in the system.</CardDescription>
                        </div>
                         <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
                            <DialogTrigger asChild><Button>Create New User</Button></DialogTrigger>
                            <DialogContent><DialogHeader><DialogTitle>Create New User</DialogTitle></DialogHeader><UserForm departments={data.departments} onSave={fetchData} closeDialog={() => setDialogOpen(false)} /></DialogContent>
                        </Dialog>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table><TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Role</TableHead><TableHead>Department</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                        <TableBody>
                            {data.users.map(user => (
                                <TableRow key={user.id}>
                                    <TableCell>{user.name}<div className="text-xs text-muted-foreground">{user.email}</div></TableCell>
                                    <TableCell className="capitalize">{user.role}</TableCell>
                                    <TableCell>{user.Department?.name || 'N/A'}</TableCell>
                                    <TableCell className="text-right">
                                         <Dialog>
                                            <DialogTrigger asChild><Button variant="outline" size="sm">Edit</Button></DialogTrigger>
                                            <DialogContent><DialogHeader><DialogTitle>Edit User: {user.name}</DialogTitle></DialogHeader><UserForm user={user} departments={data.departments} onSave={fetchData} /></DialogContent>
                                        </Dialog>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default AdminUserManagementPage;