"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function AdminPage() {
  const [blocks, setBlocks] = useState<any[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [selectedBlock, setSelectedBlock] = useState<number | null>(null);

  useEffect(() => {
    loadBlocks();
  }, []);

  const loadBlocks = async () => {
    const { data } = await supabase.from("blocks").select("*");
    setBlocks(data || []);
  };

  const loadQuestions = async (blockId: number) => {
    const { data } = await supabase
      .from("questions")
      .select("*")
      .eq("block_id", blockId);

    setQuestions(data || []);
    setSelectedBlock(blockId);
  };

  const addQuestion = async () => {
    if (!selectedBlock) return;

    await supabase.from("questions").insert({
      block_id: selectedBlock,
      type: "choice",
      question: "Новый вопрос",
      options: ["a", "b", "c"],
      correct_index: 0,
    });

    loadQuestions(selectedBlock);
  };

  const deleteQuestion = async (id: string) => {
    await supabase.from("questions").delete().eq("id", id);
    loadQuestions(selectedBlock!);
  };

  return (
    <div className="p-10 grid grid-cols-2 gap-10">

      {/* Блоки */}
      <div>
        <h2 className="text-xl font-bold mb-4">Блоки</h2>

        {blocks.map((block) => (
          <div
            key={block.id}
            onClick={() => loadQuestions(block.id)}
            className="p-3 bg-gray-100 rounded mb-2 cursor-pointer"
          >
            {block.title} ({block.difficulty})
          </div>
        ))}
      </div>

      {/* Вопросы */}
      <div>
        <h2 className="text-xl font-bold mb-4">Вопросы</h2>

        <button
          onClick={addQuestion}
          className="mb-4 px-4 py-2 bg-green-500 text-white rounded"
        >
          ➕ Добавить вопрос
        </button>

        {questions.map((q) => (
          <div key={q.id} className="p-3 bg-white shadow mb-2 rounded">
            <p>{q.question}</p>

            <button
              onClick={() => deleteQuestion(q.id)}
              className="text-red-500 text-sm"
            >
              Удалить
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}