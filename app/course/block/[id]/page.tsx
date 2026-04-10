"use client";

import QuestionRenderer from "@/components/questions/QuestionRenderer";
import ResultScreen from "@/components/course/ResultScreen";
import { useCourseProgress } from "@/hooks/useCourseProgress";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRequireAuth } from "@/hooks/useRequireAuth";


function speak(text: string) {
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "cs-CZ";
  utter.rate = 0.9;
  window.speechSynthesis.speak(utter);
}

export default function BlockPage() {
  useRequireAuth();

  const params = useParams();
  const router = useRouter();
  const blockId = Number(params.id);
  const [questions, setQuestions] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [unlocked, setUnlocked] = useState(false);
  const [currentBlock, setCurrentBlock] = useState<any>(null);

  useEffect(() => {
    const loadBlock = async () => {
      const { data } = await supabase
        .from("blocks")
        .select("*")
        .eq("id", blockId)
        .single();

      setCurrentBlock(data);
    };

    loadBlock();
}, [blockId]);

  useEffect(() => {
    const loadQuestions = async () => {
      const { data } = await supabase
        .from("questions")
        .select("*")
        .eq("block_id", blockId);

      // 🔥 ВАЖНО: преобразуем snake_case → camelCase
      const mapped = (data || []).map((q) => ({
        ...q,
        correctIndex: q.correct_index,
        options:
          typeof q.options === "string"
            ? JSON.parse(q.options)
            : q.options,
        words:
          typeof q.words === "string"
            ? JSON.parse(q.words)
            : q.words,
      }));

      setQuestions(mapped);
    };

    loadQuestions();
  }, [blockId]);

  const {
    currentQuestion,
    correctAnswers,
    selected,
    showResult,
    progress,
    setCorrectAnswers,
    setCurrentQuestion,
    handleAnswer,
  } = useCourseProgress(questions.length, user);

  const question = questions[currentQuestion] ?? null;
  const isFinished = questions.length > 0 && currentQuestion >= questions.length;

  useEffect(() => {
    const initUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      console.log("USER:", data.user);
    };

    initUser();
  }, []);

  const unlockNextBlock = async () => {
    if (!user || !currentBlock) return;

    const nextOrder = currentBlock.order_index + 1;

    const { data: nextBlock } = await supabase
      .from("blocks")
      .select("id")
      .eq("order_index", nextOrder)
      .single();

    if (!nextBlock) return;

    console.log("🔥 UNLOCKING BLOCK", nextBlock.id); // ✅ ВОТ ТУТ

    const accuracy = Math.round(
      (correctAnswers / questions.length) * 100
    );

    const { error } = await supabase
      .from("progress")
      .upsert({
        user_id: user.id,
        block_id: nextBlock.id,
        accuracy,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "user_id,block_id",
      }
    )
    if (error) {
      console.error("❌ SUPABASE ERROR:", error);
    }
  };

  useEffect(() => {
    if (!isFinished || !user || unlocked || !currentBlock) return;

    const runUnlock = async () => {
      const percentage = Math.round(
        (correctAnswers / questions.length) * 100
      );

      if (percentage >= 80) {
        await unlockNextBlock();
        setUnlocked(true);
      }
    };

  runUnlock();
}, [isFinished, user, unlocked, correctAnswers, currentBlock]);

  useEffect(() => {
    if (!isFinished) return;

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
  }, [isFinished]);

  useEffect(() => {
    if (question?.type === "audio") {
      const timer = setTimeout(() => {
        speak(question.question);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [question]);

  if (questions.length === 0) {
    return <div className="p-10">Загрузка...</div>;
  }

  if (currentQuestion >= questions.length || showResult) {
    return (
      <ResultScreen
        correctAnswers={correctAnswers}
        totalQuestions={questions.length}
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
            onAnswer={(index) => {
              if (question.correctIndex === undefined) return;

              handleAnswer(index, question.correctIndex, question);
            }}
            nextQuestion={() =>
              setCurrentQuestion((prev) => prev + 1)
            }
            speak={speak}
            handleTypingAnswer={(isCorrect, question) => {
              if (isCorrect) {
                setCorrectAnswers((prev) => prev + 1);
              }

              setTimeout(() => {
                setCurrentQuestion((prev) => prev + 1);
              }, 800);
            }}
          />
        )}
      </div>
    </main>
  );
}