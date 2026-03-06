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

  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const allQuestions = course.blocks.flatMap(
      (block) => block.questions
    );

    const randomQuestions = shuffleArray(allQuestions).slice(0, 5);

    setQuestions(randomQuestions);
  }, []);

  if (questions.length === 0) {
    return <div className="p-10">Загрузка...</div>;
  }

  const question = questions[current];

  const handleAnswer = (index: number) => {
    if (selected !== null) return;

    setSelected(index);

    if (index === question.correctIndex) {
      setCorrectCount((prev) => prev + 1);
    }

    setTimeout(() => {
      setSelected(null);

      if (current + 1 < questions.length) {
        setCurrent((prev) => prev + 1);
      } else {
        setFinished(true);
      }
    }, 800);
  };

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