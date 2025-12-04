import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Game from '@/models/Game';
import { verifyToken } from '@/lib/auth';

export async function GET(req: Request) {
    try {
        await dbConnect();

        const authHeader = req.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];
        const decoded = verifyToken(token);

        if (!decoded || typeof decoded === 'string') {
            return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
        }

        const games = await Game.find({ userId: decoded.id })
            .sort({ completedAt: -1 })
            .limit(20);

        return NextResponse.json(games);
    } catch (error: any) {
        return NextResponse.json(
            { message: error.message || 'Something went wrong' },
            { status: 500 }
        );
    }
}
