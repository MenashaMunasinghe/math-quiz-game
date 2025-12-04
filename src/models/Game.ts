import mongoose from 'mongoose';

const GameSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    score: {
        type: Number,
        required: true,
    },
    totalQuestions: {
        type: Number,
        required: true,
        default: 10,
    },
    completedAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.models.Game || mongoose.model('Game', GameSchema);
