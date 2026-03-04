"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Phrase = {
  id: number;
  ru: string;
  cz: string;
  en?: string;
};

function shuffleArray<T>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5);
}

export default function TrainPage() {
  const router = useRouter();
  const [phrases, setPhrases] = useState<Phrase[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [options, setOptions] = useState<string[]>([]);
  const [mistakes, setMistakes] = useState<Phrase[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("myPhrases");

    if (stored) {
        const parsed = JSON.parse(stored);
        setPhrases(shuffleArray(parsed));
    }
    }, []);

    const phrase = phrases[current];

  useEffect(() => {
    if (!phrase) return;

    const wrongAnswers = shuffleArray(
        phrases.filter((p) => p.id !== phrase.id)
    )
        .slice(0, 3)
        .map((p) => p.cz);

    const generated = shuffleArray([
        phrase.cz,
        ...wrongAnswers,
    ]);

    setOptions(generated);
    }, [current, phrases]);

    if (current >= phrases.length && mistakes.length === 0) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-10 rounded-3xl shadow-xl text-center">
        <h2 className="text-2xl font-bold mb-4">
          🎉 Тренировка завершена
        </h2>
        <p className="mb-2">
            Correct answers: {correctCount}
        </p>

        <p className="mb-2">
            Mistakes: {phrases.length - correctCount}
        </p>

        <p className="mb-6 font-medium">
            Accuracy: {Math.round((correctCount / phrases.length) * 100)}%
        </p>

        <button
          onClick={() => router.push("/phrases")}
          className="px-4 py-2 bg-blue-500 text-white rounded-xl"
        >
          Назад к фразам
        </button>
      </div>
    </div>
  );
}

if (current >= phrases.length && mistakes.length > 0) {
  setPhrases(shuffleArray(mistakes));
  setMistakes([]);
  setCurrent(0);
}

  if (phrases.length === 0) {
    return (
      <div className="p-10">
        Нет фраз для тренировки
      </div>
    );
  }

  const correctIndex = options.indexOf(phrase.cz);
  const handleAnswer = (index: number) => {
    if (selected !== null) return;

    setSelected(index);

    if (index === correctIndex) {
        setCorrectCount((prev) => prev + 1);
        } else {
        setMistakes((prev) => [...prev, phrase]);
    }

    setTimeout(() => {
        setSelected(null);
        setCurrent((prev) => prev + 1);
    }, 900);
};

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 p-8">
      <div className="max-w-xl mx-auto bg-white p-8 rounded-3xl shadow-xl">
        <div className="mb-6">
            <p className="text-sm text-gray-500 mb-2">
                {current + 1} / {phrases.length}
            </p>

            <h2 className="text-xl font-semibold">
                {phrase.ru}
            </h2>
        </div>

        <div className="space-y-3">
          {options.map((option, index) => {
            const isCorrect = index === correctIndex;
            const isSelected = index === selected;

            return (
              <div
                key={index}
                onClick={() => handleAnswer(index)}
                className={`p-4 rounded-xl cursor-pointer transition ${
                    selected !== null
                        ? index === correctIndex
                        ? "bg-green-300"
                        : index === selected
                        ? "bg-red-300"
                        : "bg-gray-100"
                        : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {option}
              </div>
            );
          })}
        </div>

        <button
          onClick={() => router.push("/phrases")}
          className="mt-6 px-4 py-2 bg-gray-400 text-white rounded-xl"
        >
          Назад
        </button>
      </div>
    </main>
  );
}