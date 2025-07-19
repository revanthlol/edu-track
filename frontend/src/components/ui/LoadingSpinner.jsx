// frontend/src/components/ui/LoadingSpinner.jsx
import React from 'react';
import './LoadingSpinner.css'; // We'll create this file next

const LoadingSpinner = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-slate-950">
            <div aria-label="Orange and tan hamster running in a metal wheel" role="img" className="wheel-and-hamster">
                <div className="wheel"></div>
                <div className="hamster">
                    <div className="hamster__body">
                        <div className="hamster__head">
                            <div className="hamster__ear"></div>
                            <div className="hamster__eye"></div>
                            <div className="hamster__nose"></div>
                        </div>
                        <div className="hamster__limb hamster__limb--fr"></div>
                        <div className="hamster__limb hamster__limb--fl"></div>
                        <div className="hamster__limb hamster__limb--br"></div>
                        <div className="hamster__limb hamster__limb--bl"></div>
                        <div className="hamster__tail"></div>
                    </div>
                </div>
                <div className="spoke"></div>
            </div>
            <p className="mt-4 text-lg font-semibold text-slate-700 dark:text-slate-300">Loading Dashboard...</p>
        </div>
    );
};

export default LoadingSpinner;