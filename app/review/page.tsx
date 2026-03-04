"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type ReviewQuestion = {
  question: string;
  options: string[];
  correctIndex: number;
};

function speak(text: string) {
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "cs-CZ";
  utter.rate = 0.9;
  window.speechSynthesis.speak(utter);
}

export default function ReviewPage() {
  const [questions, setQuestions] = useState<ReviewQuestion[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("reviewMistakes");
    if (stored) {
      setQuestions(JSON.parse(stored));
    }
  }, []);

  if (questions.length === 0) {
    return (
      <div className="p-10 text-center">
        🎉 Отлично! Ошибок для разбора нет
      </div>
    );
  }

  const question = questions[current];

  const handleAnswer = (index: number) => {
  if (selected !== null) return;

  setSelected(index);

  setTimeout(() => {
    setSelected(null);

    if (current + 1 < questions.length) {
      setCurrent((prev) => prev + 1);
    } else {
      setFinished(true);
    }
  }, 900);
};

    if (finished) {
    return (
        <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
        <div className="bg-white p-10 rounded-3xl shadow-xl text-center">
            <h2 className="text-2xl font-bold mb-4">
            🎉 Разбор ошибок завершён
            </h2>

            <button
            onClick={() => {
                localStorage.removeItem("reviewMistakes");
                router.push("/course");
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded-xl"
            >
            Вернуться к курсу
            </button>
        </div>
        </main>
    );
    }

  return (
    <main className="min-h-screen p-8 bg-gradient-to-br from-blue-100 to-purple-100">
      <div className="max-w-xl mx-auto bg-white p-8 rounded-3xl shadow-xl">
        <button
            onClick={() => router.push("/course")}
            className="mb-6 text-sm text-blue-600"
        >
            ← Назад к курсу
        </button>
        <div className="mb-6">
            <p className="text-sm text-gray-500 mb-2">
                {current + 1} / {questions.length}
            </p>

            <h2 className="text-xl font-semibold">
                {question.question}
            </h2>
        </div>

        <div className="space-y-3">
          {question.options.map((option, index) => {
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
                    🔊 Прослушать
                </button>
            </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}