'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { fetchQuizQuestions, Question } from '@/lib/api';
import QuizCard from '@/components/QuizCard';
import BananaModal from '@/components/BananaModal';
import Timer from '@/components/Timer';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function QuizPage() {
    const router = useRouter();
    const { user } = useAuth();
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [loading, setLoading] = useState(true);
    const [showBanana, setShowBanana] = useState(false);
    const [timerRunning, setTimerRunning] = useState(false);
    const [gameId, setGameId] = useState<string | null>(null); // To track session if needed

    useEffect(() => {
        // Protect route
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/auth/login');
            return;
        }

        fetchQuizQuestions()
            .then((data) => {
                setQuestions(data);
                setLoading(false);
                setTimerRunning(true);
            })
            .catch((err) => {
                console.error(err);
                // Handle error (maybe redirect home)
            });
    }, [router]);

    const handleAnswer = (answer: string) => {
        setTimerRunning(false);
        const currentQuestion = questions[currentIndex];

        if (answer === currentQuestion.correct_answer) {
            // Correct
            setScore((prev) => prev + 1);
            nextQuestion();
        } else {
            // Incorrect -> Banana Time
            setShowBanana(true);
        }
    };

    const handleBananaCorrect = () => {
        setShowBanana(false);
        nextQuestion();
    };

    const handleBananaIncorrect = () => {
        setShowBanana(false);
        endGame();
    };

    const handleTimeout = () => {
        setTimerRunning(false);
        setShowBanana(true); // Timeout counts as incorrect -> Banana chance
    };

    const nextQuestion = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex((prev) => prev + 1);
            setTimerRunning(true);
        } else {
            endGame();
        }
    };

    const endGame = async () => {
        // Save score
        try {
            const token = localStorage.getItem('token');
            await fetch('/api/game/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    score,
                    totalQuestions: questions.length,
                }),
            });
        } catch (error) {
            console.error('Failed to submit score', error);
        }

        // Redirect to results
        // We can pass score via query params or just let the results page fetch the latest game
        router.push(`/results?score=${score}&total=${questions.length}`);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white p-4 flex flex-col items-center relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black -z-10"></div>

            {/* Header */}
            <div className="w-full max-w-4xl flex justify-between items-center mb-8 pt-4">
                <div className="flex items-center gap-4">
                    <div className="bg-slate-800 px-4 py-2 rounded-lg border border-slate-700">
                        <span className="text-slate-400 text-sm uppercase tracking-wider">Question</span>
                        <div className="text-xl font-bold">{currentIndex + 1} / {questions.length}</div>
                    </div>
                    <div className="bg-slate-800 px-4 py-2 rounded-lg border border-slate-700">
                        <span className="text-slate-400 text-sm uppercase tracking-wider">Score</span>
                        <div className="text-xl font-bold text-indigo-400">{score}</div>
                    </div>
                </div>
                <div className="w-32">
                    {/* Timer for the main question */}
                    <Timer
                        key={currentIndex} // Reset timer on new question
                        duration={30}
                        onTimeUp={handleTimeout}
                        isRunning={timerRunning && !showBanana}
                    />
                </div>
            </div>

            {/* Quiz Card */}
            <div className="flex-1 flex items-center justify-center w-full">
                <QuizCard
                    question={questions[currentIndex]}
                    onAnswer={handleAnswer}
                    disabled={!timerRunning || showBanana}
                />
            </div>

            {/* Banana Modal */}
            <BananaModal
                isOpen={showBanana}
                onCorrect={handleBananaCorrect}
                onIncorrect={handleBananaIncorrect}
            />
        </div>
    );
}
