'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface TimerProps {
    duration: number;
    onTimeUp: () => void;
    isRunning: boolean;
    className?: string;
}

export default function Timer({ duration, onTimeUp, isRunning, className }: TimerProps) {
    const [timeLeft, setTimeLeft] = useState(duration);

    useEffect(() => {
        setTimeLeft(duration);
    }, [duration]);

    useEffect(() => {
        if (!isRunning || timeLeft <= 0) return;

        const interval = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    onTimeUp();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [isRunning, timeLeft, onTimeUp]);

    const percentage = (timeLeft / duration) * 100;
    const color = percentage > 50 ? 'bg-green-500' : percentage > 20 ? 'bg-yellow-500' : 'bg-red-500';

    return (
        <div className={cn("w-full h-2 bg-slate-800 rounded-full overflow-hidden", className)}>
            <div
                className={cn("h-full transition-all duration-1000 ease-linear", color)}
                style={{ width: `${percentage}%` }}
            />
        </div>
    );
}
