"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Phrase = {
  id: number;
  ru: string;
  cz: string;
  en?: string;
};

export default function TrainPage() {
  const router = useRouter();
  const [phrases, setPhrases] = useState<Phrase[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("myPhrases");
    if (stored) {
      setPhrases(JSON.parse(stored));
    }
  }, []);

  if (phrases.length === 0) {
    return (
      <div className="p-10">
        Нет фраз для тренировки
      </div>
    );
  }

  const phrase = phrases[current];

  const options = [
    phrase.cz,
    ...phrases
      .filter((p) => p.id !== phrase.id)
      .slice(0, 3)
      .map((p) => p.cz),
  ].sort(() => Math.random() - 0.5);

  const correctIndex = options.indexOf(phrase.cz);

  const handleAnswer = (index: number) => {
    if (selected !== null) return;

    setSelected(index);

    setTimeout(() => {
      setSelected(null);
      setCurrent((prev) =>
        prev + 1 < phrases.length ? prev + 1 : 0
      );
    }, 800);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 p-8">
      <div className="max-w-xl mx-auto bg-white p-8 rounded-3xl shadow-xl">
        <h2 className="text-xl font-semibold mb-6">
          {phrase.ru}
        </h2>

        <div className="space-y-3">
          {options.map((option, index) => {
            const isCorrect = index === correctIndex;
            const isSelected = index === selected;

            return (
              <div
                key={index}
                onClick={() => handleAnswer(index)}
                className={`p-4 rounded-xl cursor-pointer transition ${
                  isSelected
                    ? isCorrect
                      ? "bg-green-300"
                      : "bg-red-300"
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