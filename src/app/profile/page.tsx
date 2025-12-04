'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import { Loader2, User, History, Star, Trophy } from 'lucide-react';

interface GameHistory {
    _id: string;
    score: number;
    totalQuestions: number;
    completedAt: string;
}

export default function ProfilePage() {
    const { user, isLoading: authLoading } = useAuth();
    const [history, setHistory] = useState<GameHistory[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            const token = localStorage.getItem('token');
            fetch('/api/game/history', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
                .then((res) => res.json())
                .then((data) => {
                    setHistory(data);
                    setLoading(false);
                })
                .catch((err) => {
                    console.error(err);
                    setLoading(false);
                });
        } else if (!authLoading) {
            // Redirect handled by AuthContext or middleware usually, but here we just wait
            setLoading(false);
        }
    }, [user, authLoading]);

    if (authLoading || loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
            </div>
        );
    }

    if (!user) return null;

    // Calculate stats
    const totalGames = history.length;
    const totalScore = history.reduce((acc, curr) => acc + curr.score, 0);
    const avgScore = totalGames > 0 ? (totalScore / totalGames).toFixed(1) : '0';
    const highScore = history.reduce((max, curr) => Math.max(max, curr.score), 0);

    return (
        <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden">
            <Navbar />

            {/* Background */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black -z-10"></div>

            <main className="pt-24 px-4 pb-12">
                <div className="max-w-4xl mx-auto">
                    {/* Profile Header */}
                    <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl p-8 mb-8 flex flex-col md:flex-row items-center gap-6">
                        <div className="w-24 h-24 bg-indigo-600 rounded-full flex items-center justify-center text-4xl font-bold">
                            {user.username.charAt(0).toUpperCase()}
                        </div>
                        <div className="text-center md:text-left">
                            <h1 className="text-3xl font-bold mb-1">{user.username}</h1>
                            <p className="text-slate-400">{user.email}</p>
                            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-500 text-sm font-medium border border-yellow-500/20">
                                <Trophy className="w-4 h-4" />
                                <span>Space Cadet</span>
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-xl">
                            <div className="flex items-center gap-3 mb-2 text-slate-400">
                                <History className="w-5 h-5" />
                                <span className="uppercase text-sm font-bold tracking-wider">Total Games</span>
                            </div>
                            <div className="text-3xl font-bold">{totalGames}</div>
                        </div>

                        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-xl">
                            <div className="flex items-center gap-3 mb-2 text-slate-400">
                                <Star className="w-5 h-5" />
                                <span className="uppercase text-sm font-bold tracking-wider">Avg Score</span>
                            </div>
                            <div className="text-3xl font-bold">{avgScore}</div>
                        </div>

                        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-xl">
                            <div className="flex items-center gap-3 mb-2 text-slate-400">
                                <Trophy className="w-5 h-5" />
                                <span className="uppercase text-sm font-bold tracking-wider">High Score</span>
                            </div>
                            <div className="text-3xl font-bold text-yellow-500">{highScore}</div>
                        </div>
                    </div>

                    {/* Edit Profile Section */}
                    <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl p-6 mb-8">
                        <h2 className="text-xl font-bold mb-4">Update Profile</h2>
                        <EditProfileForm user={user} />
                    </div>

                    {/* Recent Games */}
                    <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl overflow-hidden">
                        <div className="p-6 border-b border-slate-800">
                            <h2 className="text-xl font-bold">Recent Missions</h2>
                        </div>
                        <div className="divide-y divide-slate-800">
                            {history.map((game) => (
                                <div key={game._id} className="p-4 flex items-center justify-between hover:bg-slate-800/30 transition-colors">
                                    <div>
                                        <div className="font-bold text-white">Math Quiz</div>
                                        <div className="text-sm text-slate-400">
                                            {new Date(game.completedAt).toLocaleDateString()} at {new Date(game.completedAt).toLocaleTimeString()}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <div className="text-2xl font-bold text-indigo-400">{game.score}</div>
                                            <div className="text-xs text-slate-500 uppercase">Score</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {history.length === 0 && (
                                <div className="p-8 text-center text-slate-500">
                                    No missions completed yet.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

function EditProfileForm({ user }: { user: any }) {
    const [username, setUsername] = useState(user.username);
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/auth/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ username, password: password || undefined }),
            });

            const data = await res.json();
            if (res.ok) {
                setMessage('Profile updated successfully!');
                setPassword('');
                // Ideally update context user here too, but for now just show message
            } else {
                setMessage(data.message || 'Update failed');
            }
        } catch (err) {
            setMessage('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
            <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Username</label>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">New Password (leave blank to keep current)</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="••••••••"
                />
            </div>
            <button
                type="submit"
                disabled={loading}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
            >
                {loading ? 'Updating...' : 'Update Profile'}
            </button>
            {message && <p className="text-sm text-indigo-400 mt-2">{message}</p>}
        </form>
    );
}
