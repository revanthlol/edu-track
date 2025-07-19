// frontend/src/pages/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        api.get('/users/me')
            .then(res => {
                setUser(res.data);
                setName(res.data.name);
                setEmail(res.data.email);
            })
            .catch(err => setMessage('Failed to load profile.'));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('Updating...');
        try {
            const { data } = await api.put('/users/me', { name, email });
            setName(data.name);
            setEmail(data.email);
            setMessage('Profile updated successfully!');
        } catch (error) {
            setMessage('Failed to update profile.');
        }
    };
    
    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <Card className="max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>My Profile</CardTitle>
                <CardDescription>Update your personal information.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <label htmlFor="name">Full Name</label>
                        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                     <div className="space-y-1">
                        <label htmlFor="email">Email Address</label>
                        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                     <div className="space-y-1">
                        <label htmlFor="role">Role</label>
                        <Input id="role" type="text" value={user.role} disabled className="capitalize bg-gray-100 dark:bg-slate-800" />
                    </div>
                    {message && <p className="text-sm text-center">{message}</p>}
                    <Button type="submit">Save Changes</Button>
                </form>
            </CardContent>
        </Card>
    );
};

export default ProfilePage;