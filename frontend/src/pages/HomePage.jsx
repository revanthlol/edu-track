// frontend/src/pages/HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ThemeToggle from '../components/ThemeToggle'; // <-- Correct import path

const HomePage = () => {
    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen bg-background p-4 text-center">
            <div className="absolute top-4 right-4">
                <ThemeToggle />
            </div>
            <div className="space-y-4">
                <h1 className="text-5xl md:text-7xl font-bold text-foreground tracking-tighter">
                    Welcome to EduTrack
                </h1>
                <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                    The modern, robust solution for digitizing student management. Handle records, courses, and grades with ease and precision.
                </p>
            </div>
            <div className="mt-8">
                <Button asChild size="lg">
                    <Link to="/login">Get Started</Link>
                </Button>
            </div>
        </div>
    );
};

export default HomePage;