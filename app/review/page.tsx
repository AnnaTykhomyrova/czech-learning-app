"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import QuestionRenderer from "@/components/questions/QuestionRenderer";
import type { Question } from "@/types/question";


function speak(text: string) {
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "cs-CZ";
  utter.rate = 0.9;
  window.speechSynthesis.speak(utter);
}

export default function ReviewPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const router = useRouter();
  const question = questions[current] ?? null;

  useEffect(() => {
    const stored = localStorage.getItem("reviewMistakes");

    if (stored) {
      const parsed = JSON.parse(stored);
      const shuffled = [...parsed].sort(() => Math.random() - 0.5);

      setQuestions(shuffled.slice(0, 10));
      setCurrent(0);
    }

    setLoaded(true);
  }, []);

  useEffect(() => {
    if (question?.type === "audio") {
      const timer = setTimeout(() => {
        speak(question.question);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [question]);

  useEffect(() => {
    if (!finished) return;

    const timer = setTimeout(() => {
      router.push("/course");
    }, 2000);

    return () => clearTimeout(timer);
  }, [finished]);

  if (!loaded) {
    return (
      <div className="p-10 text-center text-gray-500">
        Загрузка ошибок...
      </div>
    );
  }

  if (finished) {
    return (
      <div className="p-10 text-center">
        🎉 Ошибки разобраны!
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="p-10 text-center">
        🎉 Отлично! Ошибок для разбора нет
      </div>
    );
  }

  const handleAnswer = (index: number) => {
    if (selected !== null) return;

    setSelected(index);

    const correct = index === question.correctIndex;

    setTimeout(() => {
      setSelected(null);

      if (!correct) {
        const updated = [...questions];

        const failed = updated.splice(current, 1)[0];

        const insertPosition = Math.min(current + 2, updated.length);

        updated.splice(insertPosition, 0, failed);

        setQuestions(updated);
      }

      const stored = localStorage.getItem("reviewMistakes");
      const mistakes = stored ? JSON.parse(stored) : [];

      const updated = mistakes.filter(
        (m: Question) => m.id !== question.id
      );

      localStorage.setItem(
        "reviewMistakes",
        JSON.stringify(updated)
      );

      const newQuestions = questions.filter(
        (q) => q.id !== question.id
      );

      setQuestions(newQuestions);

      if (newQuestions.length === 0) {
        setFinished(true);
        return;
      }

      if (current >= newQuestions.length) {
        setCurrent(newQuestions.length - 1);
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
              onClick={() => router.push("/course")}
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
                {Math.min(current + 1, questions.length)} / {questions.length}
            </p>
        </div>
        {question && question.type && (
          <QuestionRenderer
            question={question}
            selected={selected}
            onAnswer={handleAnswer}
            onCorrect={() => {
              const stored = localStorage.getItem("reviewMistakes");
              const mistakes = stored ? JSON.parse(stored) : [];

              const updated = mistakes.filter(
                (m: Question) => m.id !== question.id
              );

              localStorage.setItem(
                "reviewMistakes",
                JSON.stringify(updated)
              );

              const newQuestions = questions.filter(
                (q) => q.id !== question.id
              );

              setQuestions(newQuestions);

              if (newQuestions.length === 0) {
                setFinished(true);
                return;
              }

              if (current >= newQuestions.length) {
                setCurrent(newQuestions.length - 1);
              }
            }}
            nextQuestion={() => setCurrent((prev) => prev + 1)}
            speak={speak}
          />
        )}
      </div>
    </main>
  );
}