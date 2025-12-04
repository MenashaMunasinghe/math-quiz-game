'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Trophy, Loader2 } from 'lucide-react';

interface LeaderboardEntry {
    _id: string;
    score: number;
    totalQuestions: number;
    completedAt: string;
    userId: {
        username: string;
    };
}

export default function LeaderboardPage() {
    const [leaders, setLeaders] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/leaderboard')
            .then((res) => res.json())
            .then((data) => {
                setLeaders(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    return (
        <div className="min-h-screen bg-slate-950 text-white p-4 relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black -z-10"></div>

            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/" className="p-2 hover:bg-slate-800 rounded-full transition-colors">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <Trophy className="text-yellow-500" />
                        Galactic Leaderboard
                    </h1>
                </div>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                    </div>
                ) : (
                    <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                        <table className="w-full text-left">
                            <thead className="bg-slate-800/50 text-slate-400 uppercase text-sm">
                                <tr>
                                    <th className="p-4 font-medium">Rank</th>
                                    <th className="p-4 font-medium">Pilot</th>
                                    <th className="p-4 font-medium">Score</th>
                                    <th className="p-4 font-medium">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {leaders.map((entry, index) => (
                                    <tr key={entry._id} className="hover:bg-slate-800/30 transition-colors">
                                        <td className="p-4 font-bold text-slate-500">#{index + 1}</td>
                                        <td className="p-4 font-medium text-white">
                                            {entry.userId?.username || 'Unknown Pilot'}
                                        </td>
                                        <td className="p-4 text-indigo-400 font-bold">
                                            {entry.score} / {entry.totalQuestions}
                                        </td>
                                        <td className="p-4 text-slate-400 text-sm">
                                            {new Date(entry.completedAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                                {leaders.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="p-8 text-center text-slate-500">
                                            No records found. Be the first to conquer the galaxy!
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
