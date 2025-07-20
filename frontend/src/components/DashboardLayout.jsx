// frontend/src/components/DashboardLayout.jsx
import React, { useState, useContext } from 'react';
import { Outlet, useNavigate, Link, NavLink as RouterNavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { jwtDecode } from 'jwt-decode';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LogOut, User as UserIcon, Home, BookOpen, Settings, Award, Users } from 'lucide-react';
import { ThemeContext } from '../providers/ThemeProvider';

const NavLink = ({ to, children }) => ( <RouterNavLink to={to} className={({ isActive }) =>`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${isActive ? 'bg-muted text-primary' : 'text-muted-foreground'}`}>{children}</RouterNavLink>);

export default function DashboardLayout() {
    const navigate = useNavigate();
    const { theme, toggleTheme } = useContext(ThemeContext);
    const [user] = useState(() => jwtDecode(localStorage.getItem('token')));

    const handleLogout = () => { localStorage.removeItem('token'); navigate('/login'); };

    return (
        <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
            <div className="hidden border-r bg-muted/40 md:block"><div className="flex h-full max-h-screen flex-col gap-2"><div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6"><Link to="/" className="flex items-center gap-2 font-semibold"><BookOpen className="h-6 w-6 text-primary" /><span>EduTrack</span></Link></div><div className="flex-1"><nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                <NavLink to="/dashboard"><Home className="h-4 w-4" />Dashboard</NavLink>
                {user.role === 'admin' && <NavLink to="/dashboard/manage-users"><Users className="h-4 w-4" />Manage Users</NavLink>}
                {user.role === 'student' && <NavLink to="/dashboard/my-grades"><Award className="h-4 w-4" />My Grades</NavLink>}
                <NavLink to="/dashboard/profile"><UserIcon className="h-4 w-4" />Profile</NavLink>
            </nav></div></div></div>
            <div className="flex flex-col"><header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 z-10 lg:h-[60px] lg:px-6"><div className="w-full flex-1" /><DropdownMenu><DropdownMenuTrigger asChild><Button variant="secondary" size="icon" className="rounded-full"><UserIcon className="h-5 w-5" /></Button></DropdownMenuTrigger><DropdownMenuContent align="end" className="w-56"><DropdownMenuLabel>{user.email}</DropdownMenuLabel><DropdownMenuSeparator /><DropdownMenuItem onClick={toggleTheme}><Settings className="mr-2 h-4 w-4" />Toggle Theme</DropdownMenuItem><DropdownMenuSeparator /><DropdownMenuItem onClick={handleLogout} className="text-red-500 cursor-pointer focus:text-red-500 focus:bg-red-500/10"><LogOut className="mr-2 h-4 w-4" />Logout</DropdownMenuItem></DropdownMenuContent></DropdownMenu></header>
            <main className="flex-grow p-4 lg:p-6 bg-background"><Outlet /></main>
            </div></div>
    );
}