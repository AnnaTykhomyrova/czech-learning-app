"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Props = {
  correctAnswers: number;
  totalQuestions: number;
  blockId: number;
  onBack: () => void;
};

export default function ResultScreen({
  correctAnswers,
  totalQuestions,
  blockId,
  onBack,
}: Props) {
  const percentage = (correctAnswers / totalQuestions) * 100;
  const passed = percentage >= 80;
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [saved, setSaved] = useState(false);

  // 🔐 получаем юзера
  useEffect(() => {
    const initUser = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user);
    };

    initUser();
  }, []);

  // 💾 сохраняем результат блока
  useEffect(() => {
    if (!user || saved) return;
    console.log("SAVE DEBUG", { user, percentage });

    const saveResult = async () => {
        const { error } = await supabase
        .from("block_stats")
        .upsert(
          {
            user_id: user.id,
            block_id: blockId,
            accuracy: Math.round(percentage),
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id,block_id" }
        );

        if (error) {
          console.error("SAVE ERROR", error);
        }

      setSaved(true);
    };

    saveResult();
  }, [user, saved, blockId, percentage]);

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
          {correctAnswers} из {totalQuestions}
        </p>

        <button
          onClick={onBack}
          className="px-8 py-3 bg-blue-500 text-white rounded-xl hover:scale-105 transition"
        >
          Вернуться к блокам
        </button>

        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-8 py-3 bg-green-500 text-white rounded-xl hover:scale-105 transition"
        >
          🔁 Пройти блок ещё раз
        </button>
      </div>
    </main>
  );
}