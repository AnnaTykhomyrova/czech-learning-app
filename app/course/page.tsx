"use client";

import { useRouter } from "next/navigation";
import { course } from "@/data/course";
import { useEffect, useState } from "react";

export default function CoursePage() {
  const router = useRouter();
  const [unlockedBlock, setUnlockedBlock] = useState(1);

    useEffect(() => {
    const stored = Number(localStorage.getItem("unlockedBlock") || "1");
    setUnlockedBlock(stored);
    }, []);


  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 p-10">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Czech Course 🇨🇿
        </h1>

        <div className="space-y-4">
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