import { Question } from "@/types/question";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export function useCourseProgress(
  totalQuestions: number,
  user: { id: string } | null
) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const progress =
    ((currentQuestion + 1) / totalQuestions) * 100;

  // ✅ сохраняем ошибку в БД
  const saveMistake = async (question: Question) => {
    if (!user) return;

    const { data: existing } = await supabase
      .from("mistakes")
      .select("*")
      .eq("user_id", user.id)
      .eq("question->>id", String(question.id))
      .maybeSingle();

    if (!existing) {
      await supabase.from("mistakes").insert({
        user_id: user.id,
        question: question,
      });
    }
  };

  const handleAnswer = async (
    index: number,
    correctIndex: number,
    question: Question
  ) => {
    if (selected !== null) return;

    setSelected(index);

    if (index === correctIndex) {
      setCorrectAnswers((prev) => prev + 1);
    } else {
      await saveMistake(question); // 🔥 ВАЖНО
    }

    setTimeout(() => {
      setSelected(null);

      setCurrentQuestion((prev) => {
        if (prev + 1 < totalQuestions) {
          return prev + 1;
        } else {
          setShowResult(true);
          return prev;
        }
      });
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