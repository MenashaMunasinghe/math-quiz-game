'use client';

import { Question } from '@/lib/api';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface QuizCardProps {
    question: Question;
    onAnswer: (answer: string) => void;
    disabled: boolean;
}

export default function QuizCard({ question, onAnswer, disabled }: QuizCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-2xl bg-slate-900/80 backdrop-blur-md border border-slate-700 rounded-2xl p-8 shadow-2xl"
        >
            <div className="mb-6">
                <span className="inline-block px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-bold mb-2 uppercase tracking-wider">
                    {question.category}
                </span>
                <h2
                    className="text-2xl font-bold text-white leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: question.question }}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {question.all_answers?.map((answer, index) => (
                    <button
                        key={index}
                        onClick={() => onAnswer(answer)}
                        disabled={disabled}
                        className={cn(
                            "p-4 rounded-xl text-left transition-all duration-200 border-2",
                            "bg-slate-800 border-slate-700 text-slate-200",
                            "hover:bg-indigo-600/20 hover:border-indigo-500 hover:text-white",
                            "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900",
                            disabled && "opacity-50 cursor-not-allowed hover:bg-slate-800 hover:border-slate-700"
                        )}
                    >
                        <span
                            className="text-lg"
                            dangerouslySetInnerHTML={{ __html: answer }}
                        />
                    </button>
                ))}
            </div>
        </motion.div>
    );
}
