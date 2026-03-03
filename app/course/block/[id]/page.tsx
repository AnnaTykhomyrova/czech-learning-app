"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { course } from "@/data/course";
import { useEffect } from "react";

function speak(text: string) {
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "cs-CZ";
  utter.rate = 0.9;
  window.speechSynthesis.speak(utter);
}

export default function BlockPage() {
  const params = useParams();
  const router = useRouter();
  const blockId = Number(params.id);

  const block = course.blocks.find((b) => b.id === blockId);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  if (!block) {
    return <div className="p-10">Блок не найден</div>;
  }

  const question = block.questions[currentQuestion];

  const handleAnswer = (index: number) => {
    if (selected !== null) return;

    setSelected(index);

    if (index === question.correctIndex) {
      setCorrectAnswers((prev) => prev + 1);
    }

    setTimeout(() => {
      setSelected(null);
      if (currentQuestion + 1 < block.questions.length) {
        setCurrentQuestion((prev) => prev + 1);
      } else {
        setShowResult(true);
      }
    }, 800);
  };

  const progress =
    ((currentQuestion + 1) / block.questions.length) * 100;

    useEffect(() => {
  if (!showResult) return;

  const duration = 2000;
  const end = Date.now() + duration;

  const interval = setInterval(() => {
    if (Date.now() > end) {
      clearInterval(interval);
      return;
    }

    const confetti = document.createElement("div");
    confetti.style.position = "fixed";
    confetti.style.top = "-10px";
    confetti.style.left = Math.random() * 100 + "vw";
    confetti.style.width = "8px";
    confetti.style.height = "8px";
    confetti.style.backgroundColor = ["#60a5fa", "#a78bfa", "#34d399", "#f472b6"][
      Math.floor(Math.random() * 4)
    ];
    confetti.style.borderRadius = "50%";
    confetti.style.zIndex = "9999";
    confetti.style.transition = "transform 2s linear, opacity 2s";
    document.body.appendChild(confetti);

    setTimeout(() => {
      confetti.style.transform = "translateY(100vh)";
      confetti.style.opacity = "0";
    }, 10);

    setTimeout(() => {
      confetti.remove();
    }, 2000);
  }, 50);

  return () => clearInterval(interval);
}, [showResult]);

  if (showResult) {
  const percentage =
    (correctAnswers / block.questions.length) * 100;

  const passed = percentage >= 80;

  if (passed) {
    const currentUnlocked = Number(
      localStorage.getItem("unlockedBlock") || "1"
    );

    if (blockId >= currentUnlocked) {
      localStorage.setItem(
        "unlockedBlock",
        String(blockId + 1)
      );
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-blue-100 relative overflow-hidden">
      <div className="bg-white p-12 rounded-3xl shadow-2xl text-center animate-[celebrationPop_0.7s_ease-out_forwards]">
        <h1 className="text-4xl font-bold mb-4">
          {percentage === 100
            ? "🌟 Идеально!"
            : passed
            ? "🎉 Отличный результат!"
            : "💪 Почти получилось!"}
        </h1>

        <p className="text-lg mb-6">
          Ты набрала {correctAnswers} из{" "}
          {block.questions.length}
        </p>

        <button
          onClick={() => router.push("/course")}
          className="px-8 py-3 bg-blue-500 text-white rounded-xl hover:scale-105 transition"
        >
          Вернуться к блокам
        </button>
      </div>
    </main>
  );
}

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 p-8">
      <div className="max-w-xl mx-auto bg-white p-8 rounded-3xl shadow-xl">
        <div className="w-full bg-gray-200 h-3 rounded-full mb-6">
          <div
            className="bg-blue-500 h-3 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        <h2 className="text-xl font-semibold mb-6">
          {question.question}
        </h2>

        <div className="space-y-3">
          {question.options.map((option, index) => {
            const isCorrect = index === question.correctIndex;
            const isSelected = index === selected;

            return (
                <div
                    key={index}
                    className={`p-4 rounded-xl transition-all ${
                    isSelected
                        ? isCorrect
                        ? "bg-green-300"
                        : "bg-red-300"
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