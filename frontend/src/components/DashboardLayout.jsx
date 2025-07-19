import React from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LogOut, LayoutDashboard, User as UserIcon } from 'lucide-react';

const DashboardLayout = () => {
    const navigate = useNavigate();
    
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <div className="min-h-screen w-full bg-gray-100 dark:bg-slate-900 text-slate-900 dark:text-slate-50">
            <header className="bg-white dark:bg-slate-950 border-b dark:border-slate-800 sticky top-0 z-30">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
                    <Link to="/dashboard" className="text-xl font-bold flex items-center gap-2">
                        EduTrack
                    </Link>
                    <div className="flex items-center gap-4">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                    <UserIcon className="h-5 w-5" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end" forceMount>
                                <DropdownMenuLabel className="font-normal">
                                    <p className="text-sm font-medium leading-none">My Account</p>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link to="/dashboard/profile">Profile</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link to="/dashboard">Dashboard</Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleLogout} className="text-red-500">
                                    Log out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </header>
            <main className="container mx-auto p-4 sm:px-6 lg:px-8 mt-6">
                <Outlet />
            </main>
        </div>
    );
};
export default DashboardLayout;