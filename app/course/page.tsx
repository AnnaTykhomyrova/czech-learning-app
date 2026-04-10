"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRequireAuth } from "@/hooks/useRequireAuth";


export default function CoursePage() {
  useRequireAuth();
  
  const router = useRouter();
  const [unlockedBlock, setUnlockedBlock] = useState(1);
  const [hasMistakes, setHasMistakes] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [blockStats, setBlockStats] = useState<any>({});
  const [blocks, setBlocks] = useState<any[]>([]);

  useEffect(() => {
    const loadBlocks = async () => {
      const { data } = await supabase
        .from("blocks")
        .select("*")
        .order("order_index");

      setBlocks(data || []);
    };

    loadBlocks();
  }, []);

  useEffect(() => {
    const initUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      console.log("USER:", data.user);
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

      if (data && data.length > 0) {
        const maxBlock = Math.max(...data.map((d) => d.block_id));
        setUnlockedBlock(maxBlock);
      } else {
        setUnlockedBlock(1);
      }
    };

    loadProgress();
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const loadBlockStats = async () => {
      const { data } = await supabase
        .from("block_stats")
        .select("*")
        .eq("user_id", user.id);

      const mapped: any = {};

      data?.forEach((item) => {
        mapped[item.block_id] = {
          accuracy: item.accuracy,
        };
      });

      setBlockStats(mapped);
    };

    loadBlockStats();
  }, [user]);

    useEffect(() => {
      if (!user) return; 

      const checkMistakes = async () => {
        const { data } = await supabase
          .from("mistakes")
          .select("id")
          .eq("user_id", user.id)
          .limit(1);

        if (data && data.length > 0) {
          setHasMistakes(true);
        }
      };

      checkMistakes();
    }, [user]);


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
          {blocks.map((block) => (
            <div
              key={block.id}
              onClick={() => {
                if (block.order_index > unlockedBlock) return;
                router.push(`/course/block/${block.id}`);
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
              {blockStats[block.id] && (
                <p className="text-sm text-gray-500">
                  Эффективность: {blockStats[block.id].accuracy}%
                </p>
              )}
              {block.id > unlockedBlock && (
                <div className="text-red-400 text-sm mt-2">
                  🔒 Заблокировано
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}