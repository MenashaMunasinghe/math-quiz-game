import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Game from '@/models/Game';
import User from '@/models/User';

export async function GET() {
    try {
        await dbConnect();

        // Aggregate to find max score per user or just list top games?
        // Requirements: "Display: username, score, date/time"
        // Usually leaderboard is top scores. Let's just get top 10 games for now.
        // Or better, top score per user.

        // Let's do top 10 games globally for simplicity as per "Leaderboard" usually implies.
        const games = await Game.find()
            .sort({ score: -1, completedAt: -1 })
            .limit(10)
            .populate('userId', 'username');

        return NextResponse.json(games);
    } catch (error: any) {
        return NextResponse.json(
            { message: error.message || 'Something went wrong' },
            { status: 500 }
        );
    }
}
