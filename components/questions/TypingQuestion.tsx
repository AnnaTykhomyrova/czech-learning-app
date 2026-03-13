"use client";

import { useState, useRef, useEffect } from "react";

type Props = {
  question: string;
  answer: string;
  onCorrect: () => void;
  onWrong: () => void;
  nextQuestion: () => void;
};

function normalize(text: string) {
    return text
        .toLowerCase()
        .trim()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

export default function TypingQuestion({
  question,
  answer,
  onCorrect,
  onWrong,
  nextQuestion,
}: Props) {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<"correct" | "wrong" | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
}, []);

  const checkAnswer = () => {
    const normalizedInput = normalize(input);
    const normalizedAnswer = normalize(answer);

    if (normalizedInput === normalizedAnswer) {
        setResult("correct");
        onCorrect();
    } else {
        setResult("wrong");
        onWrong();
    }

    setTimeout(() => {
      setResult(null);
      setInput("");
      nextQuestion();
    }, 1000);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">{question}</h2>

        <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
                if (e.key === "Enter") checkAnswer();
            }}
            className="w-full p-3 border rounded-xl mb-4"
            placeholder="Введите перевод"
        />

      <button
        onClick={checkAnswer}
        className="px-6 py-2 bg-blue-500 text-white rounded-xl"
      >
        Проверить
      </button>

      {result === "correct" && (
        <p className="text-green-600 mt-3">Правильно!</p>
      )}

      {result === "wrong" && (
        <p className="text-red-600 mt-3">
            Правильный ответ: <b>{answer}</b>
        </p>
    )}
    </div>
  );
}