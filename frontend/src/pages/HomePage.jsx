// frontend/src/pages/HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/ThemeToggle'; // <-- IMPORT

const HomePage = () => {
    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen bg-background text-center p-4">
            <div className="absolute top-4 right-4">
                <ThemeToggle /> // - USE COMPONENT
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-foreground">Welcome to EduTrack</h1>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">The modern, robust solution for digitizing student management.</p>
            <div className="mt-8"><Button asChild size="lg"><Link to="/login">Get Started</Link></Button></div>
        </div>
    );
};
export default HomePage;