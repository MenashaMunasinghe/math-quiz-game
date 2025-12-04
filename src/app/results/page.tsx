'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Trophy, RotateCcw, Home } from 'lucide-react';
import { Suspense } from 'react';

function ResultsContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const score = parseInt(searchParams.get('score') || '0');
    const total = parseInt(searchParams.get('total') || '10');
    const percentage = (score / total) * 100;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative z-10 w-full max-w-md bg-slate-900/80 backdrop-blur-md border border-slate-700 rounded-2xl p-8 text-center shadow-2xl"
        >
            <div className="mb-6 flex justify-center">
                <div className="p-4 bg-yellow-500/20 rounded-full">
                    <Trophy className="w-16 h-16 text-yellow-500" />
                </div>
            </div>

            <h1 className="text-3xl font-bold text-white mb-2">Mission Complete!</h1>
            <p className="text-slate-400 mb-8">Here is your performance report</p>

            <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-slate-800 p-4 rounded-xl">
                    <div className="text-sm text-slate-400 uppercase tracking-wider mb-1">Score</div>
                    <div className="text-3xl font-bold text-white">{score} / {total}</div>
                </div>
                <div className="bg-slate-800 p-4 rounded-xl">
                    <div className="text-sm text-slate-400 uppercase tracking-wider mb-1">Accuracy</div>
                    <div className={`text-3xl font-bold ${percentage >= 70 ? 'text-green-400' : percentage >= 40 ? 'text-yellow-400' : 'text-red-400'}`}>
                        {Math.round(percentage)}%
                    </div>
                </div>
            </div>

            <div className="space-y-3">
                <button
                    onClick={() => router.push('/quiz')}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                    <RotateCcw className="w-5 h-5" />
                    Play Again
                </button>

                <Link
                    href="/"
                    className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                    <Home className="w-5 h-5" />
                    Return to Base
                </Link>
            </div>
        </motion.div>
    );
}

export default function ResultsPage() {
    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black"></div>

            <Suspense fallback={<div className="text-white">Loading results...</div>}>
                <ResultsContent />
            </Suspense>
        </div>
    );
}
