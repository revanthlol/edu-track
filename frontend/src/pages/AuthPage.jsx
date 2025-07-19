import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import api from '../services/api';
import { Sun, Moon } from 'lucide-react';

const AuthPage = ({ theme, toggleTheme }) => {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        // If user is already logged in, redirect to dashboard
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/dashboard');
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const endpoint = isLogin ? '/auth/login' : '/auth/register';
        const payload = isLogin ? { email, password } : { name, email, password, role: 'student' };
        try {
            const response = await api.post(endpoint, payload);
            localStorage.setItem('token', response.data.token);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred.');
        }
    };

    const toggleAuthMode = () => {
      setIsLogin(!isLogin);
      setError('');
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-slate-900 p-4 relative">
            <div className="absolute top-4 right-4">
                <Button onClick={toggleTheme} variant="ghost" size="icon">
                   {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5 text-white"/>}
                </Button>
            </div>
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>{isLogin ? 'Welcome Back!' : 'Create an Account'}</CardTitle>
                    <CardDescription>{isLogin ? 'Sign in to your dashboard.' : 'Enter your details to get started.'}</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="grid w-full items-center gap-4">
                            {!isLogin && (
                                <div className="flex flex-col space-y-1.5">
                                    <label htmlFor="name" className="text-sm font-medium">Name</label>
                                    <Input id="name" placeholder="Your full name" value={name} onChange={(e) => setName(e.target.value)} />
                                </div>
                            )}
                            <div className="flex flex-col space-y-1.5">
                                <label htmlFor="email" className="text-sm font-medium">Email</label>
                                <Input id="email" type="email" placeholder="m@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <label htmlFor="password" className="text-sm font-medium">Password</label>
                                <Input id="password" type="password" placeholder="Your password" value={password} onChange={(e) => setPassword(e.target.value)} />
                            </div>
                            {error && <p className="text-sm text-red-600">{error}</p>}
                            <Button type="submit" className="w-full">{isLogin ? 'Sign In' : 'Sign Up'}</Button>
                        </div>
                    </form>
                    <div className="mt-4 text-center text-sm">
                       {isLogin ? "Don't have an account? " : "Already have an account? "}
                       <button onClick={toggleAuthMode} className="underline font-medium">
                         {isLogin ? "Sign Up" : "Sign In"}
                       </button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
export default AuthPage;