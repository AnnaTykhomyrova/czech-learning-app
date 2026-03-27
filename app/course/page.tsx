"use client";

import { useRouter } from "next/navigation";
import { course } from "@/data/course";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function CoursePage() {
  const router = useRouter();
  const [unlockedBlock, setUnlockedBlock] = useState(1);
  const [hasMistakes, setHasMistakes] = useState(false);
  const [stats, setStats] = useState<any>({});
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const initUser = async () => {
      const { data } = await supabase.auth.signInWithPassword({
        email: "test@test.com",
        password: "12345678",
      });

      setUser(data.user);
    };

    initUser();
  }, []);

  useEffect(() => {
    if (!user) return;

    const loadProgress = async () => {
      const { data } = await supabase
        .from("progress")
        .select("block_id")
        .eq("user_id", user.id)
        .order("block_id", { ascending: false })
        .limit(1);

      if (data && data.length > 0) {
        setUnlockedBlock(data[0].block_id);
      } else {
        setUnlockedBlock(1); // дефолт
      }
    };

    loadProgress();
  }, [user]);

  useEffect(() => {
    const loadStats = async () => {
      const { data } = await supabase
        .from("stats")
        .select("*");

      const mapped: any = {};

      data?.forEach((item) => {
        mapped[item.question_id] = {
          correct: item.correct,
          wrong: item.wrong,
        };
      });

      setStats(mapped);
    };

    loadStats();
  }, []);

    useEffect(() => {
      const checkMistakes = async () => {
          const { data } = await supabase
              .from("mistakes")
              .select("id")
              .limit(1);

          if (data && data.length > 0) {
              setHasMistakes(true);
          }
      };

      checkMistakes();
  }, []);


  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 p-10">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Czech Course 🇨🇿
        </h1>

        <div className="space-y-4">
            {hasMistakes && (
            <button
                onClick={() => router.push("/review")}
                className="mb-6 px-4 py-2 bg-purple-500 text-white rounded-xl"
            >
                Разбор ошибок
            </button>
            )}
            <button
              onClick={() => router.push("/practice")}
              className="mb-4 px-4 py-2 bg-green-500 text-white rounded-xl"
            >
              Быстрая тренировка
            </button>
          {course.blocks.map((block) => (
            <div
              key={block.id}
              onClick={() => {
                if (block.id <= unlockedBlock) {
                    router.push(`/course/block/${block.id}`);
                }
            }}
              className={`bg-white p-6 rounded-2xl shadow-md transition-transform ${
                block.id <= unlockedBlock
                    ? "cursor-pointer hover:scale-105"
                    : "opacity-50 cursor-not-allowed"
                }`}
            >
              <h2 className="text-xl font-semibold">{block.title}</h2>
              <p className="text-gray-500 capitalize">
                Сложность: {block.difficulty}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}