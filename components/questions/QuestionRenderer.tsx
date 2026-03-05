"use client";

import ChoiceQuestion from "./ChoiceQuestion";
import AudioQuestion from "./AudioQuestion";
import DragQuestion from "./DragQuestion";

type Question = {
  id: number;
  type: "choice" | "audio" | "drag";
  question: string;
  options?: string[];
  correctIndex?: number;
  words?: string[];
};

type Props = {
  question: Question;
  selected: number | null;
  onAnswer: (index: number) => void;
  onCorrect: () => void;
  nextQuestion: () => void;
  speak: (text: string) => void;
};

export default function QuestionRenderer({
  question,
  selected,
  onAnswer,
  onCorrect,
  nextQuestion,
  speak,
}: Props) {

  if (question.type === "choice") {
    return (
      <ChoiceQuestion
        question={question.question}
        options={question.options!}
        correctIndex={question.correctIndex!}
        selected={selected}
        onAnswer={onAnswer}
      />
    );
  }

  if (question.type === "audio") {
    return (
      <AudioQuestion
        question={question.question}
        options={question.options!}
        correctIndex={question.correctIndex!}
        selected={selected}
        onAnswer={onAnswer}
        speak={speak}
      />
    );
  }

  if (question.type === "drag") {
    return (
      <DragQuestion
        question={question}
        onCorrect={onCorrect}
        nextQuestion={nextQuestion}
      />
    );
  }

  return null;
}