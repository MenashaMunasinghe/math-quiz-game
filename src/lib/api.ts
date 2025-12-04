export interface Question {
    type: string;
    difficulty: string;
    category: string;
    question: string;
    correct_answer: string;
    incorrect_answers: string[];
    all_answers?: string[]; // Helper for UI
}

export interface BananaQuestion {
    question: string; // Image URL
    solution: number;
}

export const fetchQuizQuestions = async (amount = 10): Promise<Question[]> => {
    try {
        const res = await fetch(
            `https://opentdb.com/api.php?amount=${amount}&category=19&difficulty=easy&type=multiple`
        );
        const data = await res.json();

        if (data.response_code !== 0) {
            throw new Error('Failed to fetch questions');
        }

        // Shuffle answers
        return data.results.map((q: Question) => ({
            ...q,
            all_answers: [...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5),
        }));
    } catch (error) {
        console.error('Error fetching quiz questions:', error);
        throw error;
    }
};

export const fetchBananaQuestion = async (): Promise<BananaQuestion> => {
    try {
        const res = await fetch('https://marcconrad.com/uob/banana/api.php');
        const data = await res.json();
        return data;
    } catch (error) {
        console.error('Error fetching banana question:', error);
        throw error;
    }
};
