// frontend/src/components/DashboardLayout.jsx
import React from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut, LayoutDashboard } from 'lucide-react';

const DashboardLayout = () => {
    const navigate = useNavigate();
    
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-slate-900 text-slate-900 dark:text-slate-50">
            <header className="bg-white dark:bg-slate-950 border-b dark:border-slate-800 sticky top-0 z-10 shadow-sm">
                <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                    <Link to="/dashboard" className="text-xl font-bold">
                        EduTrack
                    </Link>
                    <nav className="flex items-center space-x-2 sm:space-x-4">
                        <Button variant="ghost" size="sm" asChild>
                           <Link to="/dashboard">
                             <LayoutDashboard className="h-4 w-4 mr-2"/>
                             Dashboard
                           </Link>
                        </Button>
                        {/* Future links for 'My Grades' or 'Profile' would go here */}
                    </nav>
                    <Button onClick={handleLogout} variant="destructive" size="sm">
                        <LogOut className="h-4 w-4 sm:mr-2"/>
                        <span className="hidden sm:inline">Logout</span>
                    </Button>
                </div>
            </header>
            <main className="container mx-auto p-4 md:p-6 lg:p-8">
                <Outlet /> {/* Renders the active page (e.g., DashboardPage) */}
            </main>
        </div>
    );
};

export default DashboardLayout;