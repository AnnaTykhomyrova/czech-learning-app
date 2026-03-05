"use client";

import { useEffect, useState } from "react";
import { Question } from "@/types/question";

type Props = {
  question: Question;
  onCorrect: () => void;
  nextQuestion: () => void;
};

export default function DragQuestion({
  question,
  onCorrect,
  nextQuestion,
}: Props) {
  const [availableWords, setAvailableWords] = useState<string[]>([]);
  const [answerWords, setAnswerWords] = useState<string[]>([]);
  const [result, setResult] = useState<"correct" | "wrong" | null>(null);

  useEffect(() => {
    if (question.words) {
      const shuffled = [...question.words].sort(() => Math.random() - 0.5);
      setAvailableWords(shuffled);
      setAnswerWords([]);
      setResult(null);
    }
  }, [question]);

  const addWord = (word: string, index: number) => {
    const newAvailable = [...availableWords];
    newAvailable.splice(index, 1);

    setAvailableWords(newAvailable);
    setAnswerWords([...answerWords, word]);
  };

  const removeWord = (word: string, index: number) => {
    const newAnswer = [...answerWords];
    newAnswer.splice(index, 1);

    setAnswerWords(newAnswer);
    setAvailableWords([...availableWords, word]);
  };

  const checkAnswer = () => {
    if (!question.words) return;

    const isCorrect =
      answerWords.join(" ") === question.words.join(" ");

    if (isCorrect) {
      setResult("correct");
      onCorrect();
    } else {
      setResult("wrong");
    }

    setTimeout(() => {
      nextQuestion();
    }, 1200);
  };

  return (
    <div className="mb-6">

      <h2 className="text-xl font-semibold mb-2">
        Собери перевод
      </h2>

      <p className="text-gray-700 mb-4">
        {question.question}
      </p>

      {/* ANSWER */}

      <div
        className={`flex gap-2 flex-wrap min-h-[50px] mb-6 border-2 border-dashed p-3 rounded-xl ${
          result === "correct"
            ? "bg-green-200 border-green-400"
            : result === "wrong"
            ? "bg-red-200 border-red-400"
            : "border-gray-300"
        }`}
      >
        {answerWords.map((word, index) => (
          <button
            key={index}
            onClick={() => removeWord(word, index)}
            className="px-4 py-2 bg-blue-100 rounded-xl"
          >
            {word}
          </button>
        ))}
      </div>

      {/* AVAILABLE */}

      <p className="text-gray-500 mb-2">
        Доступные слова
      </p>

      <div className="flex gap-2 flex-wrap">
        {availableWords.map((word, index) => (
          <button
            key={index}
            onClick={() => addWord(word, index)}
            className="px-4 py-2 bg-blue-100 hover:bg-blue-200 rounded-xl"
          >
            {word}
          </button>
        ))}
      </div>

      <button
        onClick={checkAnswer}
        disabled={answerWords.length !== question.words?.length}
        className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-xl disabled:opacity-50"
      >
        Проверить
      </button>

    </div>
  );
}