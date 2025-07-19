// frontend/src/components/DashboardLayout.jsx
import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { jwtDecode } from 'jwt-decode';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LogOut, User as UserIcon, ChevronsLeft, Menu } from 'lucide-react';

// This is a new, better sub-component for nav links.
const NavLink = ({ to, icon: Icon, children }) => (
    <Link to={to} className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-500 transition-all hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50">
        <Icon className="h-4 w-4" />
        {children}
    </Link>
);

export default function DashboardLayout() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setUser(jwtDecode(token));
        } else {
            navigate('/login');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    if (!user) return null; // Or a loading spinner

    return (
        <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
            {/* --- SIDEBAR (Desktop) --- */}
            <div className="hidden border-r bg-slate-100/40 dark:bg-slate-800/40 md:block">
                <div className="flex h-full max-h-screen flex-col gap-2">
                    <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                        <Link to="/" className="flex items-center gap-2 font-semibold">
                            <span>EduTrack</span>
                        </Link>
                    </div>
                    <div className="flex-1">
                        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                            <NavLink to="/dashboard">
                                <UserIcon className="h-4 w-4" />
                                Student Dashboard
                            </NavLink>
                            {/* Add other links like Grades, etc. here */}
                        </nav>
                    </div>
                </div>
            </div>
            {/* --- MAIN CONTENT & MOBILE HEADER --- */}
            <div className="flex flex-col">
                <header className="flex h-14 items-center gap-4 border-b bg-slate-100/40 px-4 dark:bg-slate-800/40 lg:h-[60px] lg:px-6">
                    {/* You can add a Mobile Nav Sheet here later */}
                    <div className="w-full flex-1">
                        {/* Add a search bar or breadcrumbs here if needed */}
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="secondary" size="icon" className="rounded-full">
                                <UserIcon className="h-5 w-5" />
                                <span className="sr-only">Toggle user menu</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild><Link to="/dashboard/profile">Profile</Link></DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleLogout} className="text-red-500">Logout</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </header>
                <main className="flex-grow p-4 lg:p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}