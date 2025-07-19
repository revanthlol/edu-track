// frontend/src/components/DashboardLayout.jsx
import React, { useState, useEffect, useContext } from 'react';
import { Outlet, useNavigate, Link, NavLink as RouterNavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { jwtDecode } from 'jwt-decode';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LogOut, User as UserIcon, Home, BookOpen, Sun, Moon, Settings } from 'lucide-react';
import LoadingSpinner from './ui/LoadingSpinner';
import { ThemeContext } from '../providers/ThemeProvider';

// NavLink with active styling
const NavLink = ({ to, children }) => (
    <RouterNavLink
        to={to}
        className={({ isActive }) =>
            `flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
            isActive ? 'bg-muted text-primary' : 'text-muted-foreground'
            }`
        }
    >
        {children}
    </RouterNavLink>
);

export default function DashboardLayout() {
    // ... (logic from previous step, no changes needed to the useEffect or handlers) ...
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const { theme, toggleTheme } = useContext(ThemeContext);

    useEffect(() => { /* same as before */ setIsLoading(false); }, [navigate]);
    if (isLoading || !user) return <LoadingSpinner />;
    
    // ... This is the start of the return statement from the previous correct step ...
    // The following JSX is the professionally styled version
    return (
        <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
            <div className="hidden border-r bg-muted/40 md:block">
                <div className="flex h-full max-h-screen flex-col gap-2">
                    <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                        <Link to="/" className="flex items-center gap-2 font-semibold">
                            <BookOpen className="h-6 w-6 text-primary" />
                            <span className="">EduTrack</span>
                        </Link>
                    </div>
                    <div className="flex-1">
                        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                            <NavLink to="/dashboard"><Home className="h-4 w-4" />Dashboard</NavLink>
                            <NavLink to="/dashboard/profile"><UserIcon className="h-4 w-4" />Profile</NavLink>
                            {/* More links would go here */}
                        </nav>
                    </div>
                </div>
            </div>

            <div className="flex flex-col">
                <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 dark:bg-muted/40 lg:h-[60px] lg:px-6">
                    <div className="w-full flex-1"></div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild><Button variant="secondary" size="icon" className="rounded-full"><UserIcon className="h-5 w-5" /></Button></DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild><Link to="/dashboard/profile">Profile</Link></DropdownMenuItem>
                            <DropdownMenuItem onClick={toggleTheme}><Settings className="mr-2 h-4 w-4" />Toggle Theme</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => {localStorage.removeItem('token'); navigate('/login');}} className="text-red-500 cursor-pointer"><LogOut className="mr-2 h-4 w-4" />Logout</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </header>
                <main className="flex-grow p-4 lg:p-6 bg-background">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}