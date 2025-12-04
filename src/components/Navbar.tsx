'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Rocket, Trophy, User, LogOut } from 'lucide-react';

export default function Navbar() {
    const { user, logout } = useAuth();

    return (
        <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <Link href="/" className="flex items-center gap-2 text-indigo-400 font-bold text-xl">
                        <Rocket className="w-6 h-6" />
                        <span>MathQuest</span>
                    </Link>

                    <div className="flex items-center gap-6">
                        <Link href="/leaderboard" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2">
                            <Trophy className="w-4 h-4" />
                            <span className="hidden sm:inline">Leaderboard</span>
                        </Link>

                        {user ? (
                            <>
                                <Link href="/profile" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2">
                                    <User className="w-4 h-4" />
                                    <span className="hidden sm:inline">{user.username}</span>
                                </Link>
                                <button
                                    onClick={logout}
                                    className="text-slate-400 hover:text-red-400 transition-colors"
                                    title="Logout"
                                >
                                    <LogOut className="w-5 h-5" />
                                </button>
                            </>
                        ) : (
                            <Link
                                href="/auth/login"
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors"
                            >
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
