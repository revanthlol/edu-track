import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const HomePage = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-slate-900 text-center p-4">
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-slate-50">
                Welcome to EduTrack
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
                The modern, robust solution for digitizing student management. Handle records, courses, and grades with ease and precision.
            </p>
            <div className="mt-8">
                <Button asChild size="lg">
                    <Link to="/login">Get Started</Link>
                </Button>
            </div>
        </div>
    );
};

export default HomePage;