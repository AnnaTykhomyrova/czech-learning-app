import { Question } from "@/types/question";
import { useState } from "react";

export function useCourseProgress(totalQuestions: number) {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [selected, setSelected] = useState<number | null>(null);
    const [showResult, setShowResult] = useState(false);

    const progress =
        ((currentQuestion + 1) / totalQuestions) * 100;

    const handleAnswer = (
        index: number,
        correctIndex: number,
        question: Question
    ) => {
    if (selected !== null) return;
        setSelected(index);

    if (index === correctIndex) {
        setCorrectAnswers((prev) => prev + 1);
    } else {
        const stored = localStorage.getItem("reviewMistakes");
        const mistakes = stored ? JSON.parse(stored) : [];

        const exists = mistakes.some(
            (m: Question) => m.id === question.id
        );

        if (!exists) {
            const updated = [...mistakes, { ...question }];

            localStorage.setItem(
            "reviewMistakes",
            JSON.stringify(updated)
            );
        }
    }

    setTimeout(() => {
        setSelected(null);

        if (currentQuestion + 1 < totalQuestions) {
            setCurrentQuestion((prev) => prev + 1);
        } else {
            setShowResult(true);
        }
    }, 800);
};
    return {
        currentQuestion,
        correctAnswers,
        selected,
        showResult,
        progress,
        setCorrectAnswers,
        setCurrentQuestion,
        handleAnswer,
    };
}
