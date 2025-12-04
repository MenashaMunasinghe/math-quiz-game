'use client';

import { useState, useEffect } from 'react';
import { BananaQuestion, fetchBananaQuestion } from '@/lib/api';
import Timer from './Timer';
import { Loader2 } from 'lucide-react';

interface BananaModalProps {
    isOpen: boolean;
    onCorrect: () => void;
    onIncorrect: () => void;
}

export default function BananaModal({ isOpen, onCorrect, onIncorrect }: BananaModalProps) {
    const [question, setQuestion] = useState<BananaQuestion | null>(null);
    const [loading, setLoading] = useState(true);
    const [answer, setAnswer] = useState('');
    const [error, setError] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setLoading(true);
            setAnswer('');
            setError(false);
            fetchBananaQuestion()
                .then((data) => {
                    setQuestion(data);
                    setLoading(false);
                })
                .catch(() => {
                    // Fallback or error handling
                    onIncorrect();
                });
        }
    }, [isOpen, onIncorrect]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!question) return;

        if (parseInt(answer) === question.solution) {
            onCorrect();
        } else {
            setError(true);
            // Maybe give a small delay before failing? Or fail immediately.
            // Requirements say: "if player is enabled to provide the correct answer... then user can continue... else game over"
            // So incorrect answer = game over immediately?
            // "If user gives a incorrect answers, it will open a pop-up modal... if he gave the correct answer then user can continue... if player is enabled to provide the correct answer... then the game will be over"
            // I'll assume incorrect answer here also ends the game.
            setTimeout(onIncorrect, 1000);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-slate-900 border border-yellow-500/50 rounded-2xl p-6 max-w-md w-full shadow-2xl shadow-yellow-500/20 animate-in fade-in zoom-in duration-300">
                <h2 className="text-2xl font-bold text-yellow-500 mb-4 text-center">Second Chance!</h2>
                <p className="text-slate-300 text-center mb-4">
                    Solve this puzzle to continue! You won't get a point, but you'll stay in the game.
                </p>

                {loading ? (
                    <div className="flex justify-center py-8">
                        <Loader2 className="w-8 h-8 text-yellow-500 animate-spin" />
                    </div>
                ) : (
                    <>
                        <div className="bg-white rounded-lg p-2 mb-4 flex justify-center">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={question?.question} alt="Math Puzzle" className="max-h-48 object-contain" />
                        </div>

                        <Timer
                            duration={15}
                            onTimeUp={onIncorrect}
                            isRunning={!loading}
                            className="mb-4"
                        />

                        <form onSubmit={handleSubmit} className="flex gap-2">
                            <input
                                type="number"
                                value={answer}
                                onChange={(e) => setAnswer(e.target.value)}
                                className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                placeholder="Answer"
                                autoFocus
                            />
                            <button
                                type="submit"
                                className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded-lg transition-colors"
                            >
                                Submit
                            </button>
                        </form>
                        {error && <p className="text-red-500 text-center mt-2">Incorrect!</p>}
                    </>
                )}
            </div>
        </div>
    );
}
