"use client";

import QuestionRenderer from "@/components/questions/QuestionRenderer";
import ResultScreen from "@/components/course/ResultScreen";
import { useCourseProgress } from "@/hooks/useCourseProgress";
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

  if (!block) {
    return <div className="p-10">Блок не найден</div>;
  }

  const {
    currentQuestion,
    correctAnswers,
    selected,
    showResult,
    progress,
    setCorrectAnswers,
    setCurrentQuestion,
    handleAnswer,
  } = useCourseProgress(block.questions.length);

  const question = block.questions[currentQuestion] ?? null;

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

  useEffect(() => {
    if (question?.type === "audio") {
      const timer = setTimeout(() => {
        speak(question.question);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [question]);

  if (currentQuestion >= block.questions.length && !showResult) {
    return (
      <ResultScreen
        correctAnswers={correctAnswers}
        totalQuestions={block.questions.length}
        blockId={blockId}
        onBack={() => router.push("/course")}
      />
    );
  }

  if (showResult) {
    return (
      <ResultScreen
        correctAnswers={correctAnswers}
        totalQuestions={block.questions.length}
        blockId={blockId}
        onBack={() => router.push("/course")}
      />
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
        {question && (
          <QuestionRenderer
            question={question}
            selected={selected}
            onAnswer={(index) =>
              handleAnswer(index, question.correctIndex!, question)
            }
            onCorrect={() =>
              setCorrectAnswers((prev) => prev + 1)
            }
            nextQuestion={() =>
              setCurrentQuestion((prev) => prev + 1)
            }
            speak={speak}
          />
        )}
      </div>
    </main>
  );
}