"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { course } from "@/data/course";
import { Question } from "@/types/question";

function shuffleArray<T>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5);
}

function speak(text: string) {
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "cs-CZ";
  utter.rate = 0.9;
  window.speechSynthesis.speak(utter);
}

export default function PracticePage() {
    const router = useRouter();

    type PracticeQuestion = Question & {
        repeats?: number;
    };

    const [questions, setQuestions] = useState<PracticeQuestion[]>([]);
    const [current, setCurrent] = useState(0);
    const [selected, setSelected] = useState<number | null>(null);
    const [correctCount, setCorrectCount] = useState(0);
    const [finished, setFinished] = useState(false);
    const [lives, setLives] = useState(3);
    const [gameOver, setGameOver] = useState(false);
    const [streak, setStreak] = useState(0);

    useEffect(() => {
        const allQuestions = course.blocks
        .flatMap((block) => block.questions)
        .filter((q) => q.type === "choice" || q.type === "audio");

        const stats = JSON.parse(
            localStorage.getItem("learningStats") || "{}"
        );

        const weightedQuestions = allQuestions.map((q) => {
            const s = stats[q.id];

            if (!s) return { ...q, weight: 3 };

            const total = s.correct + s.wrong;
            const errorRate = total === 0 ? 0 : s.wrong / total;

            let weight = 1;

            if (errorRate > 0.6) {
                weight = 4; // сложный
            } else if (errorRate > 0.3) {
                weight = 3; // средний
            } else {
                weight = 1; // лёгкий
            }

            weight = Math.min(weight, 5);

            return { ...q, weight };
        });

        const expanded: Question[] = [];

        weightedQuestions.forEach((q: any) => {
            for (let i = 0; i < q.weight; i++) {
                expanded.push(q);
            }
        });

        const randomQuestions = shuffleArray(expanded).slice(0, 3);

        const stored = localStorage.getItem("reviewMistakes");
        
        let mistakeQuestions: Question[] = [];

        if (stored) {
            const parsed = JSON.parse(stored) as Question[];

            mistakeQuestions = shuffleArray(
                parsed.filter(
                    (q) => q.type === "choice" || q.type === "audio"
                )
            ).slice(0, 2);
        }

        let combined = [...randomQuestions, ...mistakeQuestions];

        if (combined.length < 5) {
            const extra = shuffleArray(allQuestions).slice(0, 5 - combined.length);
            combined = [...combined, ...extra];
        }

        combined = shuffleArray(combined);

        setQuestions(
            combined.map((q) => ({
            ...q,
            repeats: 0,
            }))
        );
    }, []);

    if (questions.length === 0) {
        return <div className="p-10">Загрузка...</div>;
    }

    const question = questions[current] ?? questions[0];

    if (!question?.options) return null;

    const handleAnswer = (index: number) => {
        if (selected !== null) return;

        setSelected(index);

        const isCorrect = index === question.correctIndex;

        const stats = JSON.parse(
            localStorage.getItem("learningStats") || "{}"
        );

        if (!stats[question.id]) {
            stats[question.id] = { correct: 0, wrong: 0 };
        }

        if (isCorrect) {
            stats[question.id].correct += 1;
            setCorrectCount((prev) => prev + 1);
            setStreak((prev) => prev + 1);
        } else {
            stats[question.id].wrong += 1;
            setStreak(0);

            let isDead = false;

            setLives((prev) => {
                const newLives = prev - 1;

                if (newLives <= 0) {
                    isDead = true;

                    setTimeout(() => {
                        setGameOver(true);
                    }, 800);
                }

            return newLives;
            });

            if (isDead) return;

            if ((question.repeats ?? 0) < 2) {
            const updated = [...questions];

            const failed = {
                ...question,
                repeats: (question.repeats ?? 0) + 1,
            };

            updated.splice(current, 1);

            const insertPosition = Math.min(current + 2, updated.length);

            updated.splice(insertPosition, 0, failed);

            setQuestions(updated);
            }
        }

        localStorage.setItem("learningStats", JSON.stringify(stats));

        setTimeout(() => {
            setSelected(null);

            setCurrent((prevCurrent) => {
                const nextIndex = prevCurrent + 1;

                if (nextIndex < questions.length) {
                    return nextIndex;
                }

                const hasRepeats = questions.some((q) => (q.repeats ?? 0) > 0);

                if (hasRepeats) {
                    return 0;
                } else {
                    setFinished(true);
                    return prevCurrent;
                }
            });
        }, 800);
    };

    if (gameOver) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
                <div className="bg-white p-10 rounded-3xl shadow-xl text-center">
                    <h2 className="text-2xl font-bold mb-4">
                        💔 Жизни закончились
                    </h2>

                    <p className="mb-6">
                        Попробуй ещё раз — получится лучше 💪
                    </p>

                    <button
                        onClick={() => router.refresh()}
                        className="px-4 py-2 bg-blue-500 text-white rounded-xl"
                    >
                        🔁 Попробовать снова
                    </button>
                </div>
            </main>
        );
    }

    if (finished) {
        const percentage =
            (correctCount / questions.length) * 100;

        return (
            <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
                <div className="bg-white p-10 rounded-3xl shadow-xl text-center">
                    <h2 className="text-2xl font-bold mb-4">
                        🎉 Быстрая тренировка завершена
                    </h2>

                    <p className="mb-2">
                        Правильных ответов: {correctCount}
                    </p>

                    <p className="mb-2">
                        Ошибок: {questions.length - correctCount}
                    </p>

                    <p className="mb-6 font-medium">
                        Точность: {Math.round(percentage)}%
                    </p>

                    <button
                        onClick={() => router.push("/course")}
                        className="px-4 py-2 bg-blue-500 text-white rounded-xl"
                    >
                        Назад к курсу
                    </button>
                </div>
            </main>
        );
    }

    const progress =
        ((current + 1) / questions.length) * 100;

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 p-8">
      <div className="max-w-xl mx-auto bg-white p-8 rounded-3xl shadow-xl">

        <button
          onClick={() => router.push("/course")}
          className="mb-6 text-sm text-blue-600"
        >
          ← Назад
        </button>

        <div className="flex items-center justify-between mb-4">
            <div className="flex gap-2">
                {[...Array(3)].map((_, i) => (
                <span key={i} className="text-2xl">
                    {i < lives ? "❤️" : "🖤"}
                </span>
                ))}
            </div>

            {streak > 0 && (
                <div className="text-orange-500 font-bold">
                    {streak >= 3 ? `🔥 ${streak}` : streak}
                </div>
            )}
        </div>
        <div className="w-full bg-gray-200 h-3 rounded-full mb-6">
          <div
            className="bg-blue-500 h-3 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="mb-6">
          <p className="text-sm text-gray-500 mb-2">
            {current + 1} / {questions.length}
          </p>

          <h2 className="text-xl font-semibold">
            {question.question}
          </h2>
        </div>

        <div className="space-y-3">
          {question.options?.map((option, index) => {
            return (
              <div
                key={index}
                className={`p-4 rounded-xl transition-all ${
                  selected !== null
                    ? index === question.correctIndex
                      ? "bg-green-300"
                      : index === selected
                      ? "bg-red-300"
                      : "bg-gray-100"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                <div
                  onClick={() => handleAnswer(index)}
                  className="cursor-pointer"
                >
                  {option}
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    speak(option);
                  }}
                  className="text-sm text-blue-600 mt-2"
                >
                  🔊 Повторить
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}