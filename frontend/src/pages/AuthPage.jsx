// frontend/src/pages/AuthPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import api from '../services/api';

const AuthPage = () => {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    // ** THIS IS THE FIX **
    // If a token already exists, the user is logged in. Redirect them away from this page.
    useEffect(() => {
        if (localStorage.getItem('token')) {
            navigate('/dashboard');
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const endpoint = isLogin ? '/auth/login' : '/auth/register';
        const payload = isLogin ? { email, password } : { name, email, password, role: 'student' };
        try {
            const { data } = await api.post(endpoint, payload);
            localStorage.setItem('token', data.token);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred. Please try again.');
        }
    };
    
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-slate-900 p-4">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>{isLogin ? 'Sign In' : 'Create an Account'}</CardTitle>
                    <CardDescription>{isLogin ? 'Enter your credentials to access your dashboard.' : 'Enter your details to get started.'}</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="grid w-full items-center gap-4">
                            {!isLogin && (
                                <div className="flex flex-col space-y-1.5">
                                    <label htmlFor="name" className="text-sm font-medium">Name</label>
                                    <Input id="name" value={name} onChange={e => setName(e.target.value)} placeholder="Your Name" />
                                </div>
                            )}
                            <div className="flex flex-col space-y-1.5">
                                <label htmlFor="email" className="text-sm font-medium">Email</label>
                                <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="m@example.com" />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <label htmlFor="password" className="text-sm font-medium">Password</label>
                                <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Your Password" />
                            </div>
                            {error && <p className="text-sm text-red-600 text-center">{error}</p>}
                            <Button type="submit" className="w-full mt-2">{isLogin ? 'Sign In' : 'Sign Up'}</Button>
                        </div>
                    </form>
                    <div className="mt-4 text-center text-sm">
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <button onClick={() => setIsLogin(!isLogin)} className="underline font-medium">
                            {isLogin ? "Sign Up" : "Sign In"}
                        </button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default AuthPage;