'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import { Rocket, Trophy, Star } from 'lucide-react';

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden">
      <Navbar />

      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-black -z-10"></div>
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] -z-10"></div>

      <main className="pt-32 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block p-4 rounded-full bg-indigo-500/10 mb-6 animate-bounce">
            <Rocket className="w-12 h-12 text-indigo-400" />
          </div>

          <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 mb-6">
            Math Quiz Adventure
          </h1>

          <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto">
            Embark on an intergalactic journey to test your mathematical prowess.
            Solve puzzles, climb the leaderboard, and become the ultimate Space Commander.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href={user ? "/quiz" : "/auth/login"}
              className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25"
            >
              <Rocket className="w-5 h-5" />
              {user ? 'Start Mission' : 'Join the Fleet'}
            </Link>

            <Link
              href="/leaderboard"
              className="w-full sm:w-auto px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2"
            >
              <Trophy className="w-5 h-5 text-yellow-500" />
              View Leaderboard
            </Link>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 text-left">
            <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                <Star className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Dynamic Questions</h3>
              <p className="text-slate-400">Challenge yourself with randomly generated math problems from across the universe.</p>
            </div>

            <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center mb-4">
                <Trophy className="w-6 h-6 text-yellow-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Global Rankings</h3>
              <p className="text-slate-400">Compete with other pilots and etch your name in the stars on our real-time leaderboard.</p>
            </div>

            <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
                <Rocket className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Second Chance</h3>
              <p className="text-slate-400">Made a mistake? Solve a special visual puzzle to stay in the game!</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
