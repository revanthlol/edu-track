// frontend/src/pages/AdminUserManagementPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import api from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { motion } from 'framer-motion';

// This is a cleaner, more robust form component
const UserForm = ({ user, departments, onSave, onCancel }) => {
    const isEditing = !!user;
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        password: '',
        role: user?.role || 'student',
        departmentId: user?.departmentId?.toString() || ''
    });

    const handleChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await api.put(`/admin/users/${user.id}`, { role: formData.role, departmentId: formData.departmentId });
            } else {
                await api.post('/admin/users', formData);
            }
            onSave(); // This tells the parent to refetch data and close the dialog
        } catch (err) {
            alert('Operation failed. Please ensure the email is unique and the password is set for new users.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
                {!isEditing && (
                    <>
                        <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="name" className="text-right">Name</Label><Input id="name" required value={formData.name} onChange={e => handleChange('name', e.target.value)} className="col-span-3" /></div>
                        <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="email" className="text-right">Email</Label><Input id="email" required type="email" value={formData.email} onChange={e => handleChange('email', e.target.value)} className="col-span-3" /></div>
                        <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="password" className="text-right">Password</Label><Input id="password" required type="password" value={formData.password} onChange={e => handleChange('password', e.target.value)} className="col-span-3" /></div>
                    </>
                )}
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="role" className="text-right">Role</Label>
                    <Select onValueChange={value => handleChange('role', value)} defaultValue={formData.role}><SelectTrigger className="col-span-3"><SelectValue placeholder="Select a role" /></SelectTrigger><SelectContent><SelectItem value="student">Student</SelectItem><SelectItem value="faculty">Faculty</SelectItem><SelectItem value="admin">Admin</SelectItem></SelectContent></Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="department" className="text-right">Department</Label>
                    <Select onValueChange={value => handleChange('departmentId', value)} defaultValue={formData.departmentId}><SelectTrigger className="col-span-3"><SelectValue placeholder="Assign a department" /></SelectTrigger><SelectContent><SelectItem value="">None</SelectItem>{departments.map(d => <SelectItem key={d.id} value={String(d.id)}>{d.name}</SelectItem>)}</SelectContent></Select>
                </div>
                 <div className="flex justify-end gap-2 mt-4">
                    <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
                    <Button type="submit">Save Changes</Button>
                </div>
            </div>
        </form>
    );
};


const AdminUserManagementPage = () => {
    const [data, setData] = useState({ users: [], departments: [] });
    const [isLoading, setIsLoading] = useState(true);
    // *** FIX #2: Control all dialog states from the parent for perfect control ***
    const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null); // This will hold the user object for editing, or be null

    const fetchData = useCallback(async () => {
        try {
            // *** FIX #1: The URL must NOT start with '/api/' here ***
            const res = await api.get('/admin/users');
            setData(res.data);
        } catch (err) {
            console.error("Failed to fetch user data", err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleSave = () => {
        setCreateDialogOpen(false);
        setEditingUser(null);
        fetchData();
    };

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
                        <Dialog open={isCreateDialogOpen} onOpenChange={setCreateDialogOpen}>
                            <DialogTrigger asChild><Button onClick={() => setCreateDialogOpen(true)}>Create New User</Button></DialogTrigger>
                            <DialogContent>
                                <DialogHeader><DialogTitle>Create New User</DialogTitle></DialogHeader>
                                <UserForm departments={data.departments} onSave={handleSave} onCancel={() => setCreateDialogOpen(false)} />
                            </DialogContent>
                        </Dialog>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Role</TableHead><TableHead>Department</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                        <TableBody>
                            {data.users.map(user => (
                                <TableRow key={user.id}>
                                    <TableCell>{user.name}<div className="text-xs text-muted-foreground">{user.email}</div></TableCell>
                                    <TableCell className="capitalize">{user.role}</TableCell>
                                    <TableCell>{user.Department?.name || 'N/A'}</TableCell>
                                    <TableCell className="text-right">
                                        <Dialog open={editingUser?.id === user.id} onOpenChange={(isOpen) => !isOpen && setEditingUser(null)}>
                                            <DialogTrigger asChild><Button variant="outline" size="sm" onClick={() => setEditingUser(user)}>Edit</Button></DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader><DialogTitle>Edit User: {user.name}</DialogTitle></DialogHeader>
                                                <UserForm user={user} departments={data.departments} onSave={handleSave} onCancel={() => setEditingUser(null)} />
                                            </DialogContent>
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