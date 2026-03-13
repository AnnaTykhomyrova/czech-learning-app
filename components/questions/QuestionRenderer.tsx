"use client";

import ChoiceQuestion from "./ChoiceQuestion";
import AudioQuestion from "./AudioQuestion";
import DragQuestion from "./DragQuestion";
import TypingQuestion from "./TypingQuestion";
import type { Question } from "@/types/question";

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

  if (question.type === "typing") {
    return (
      <TypingQuestion
        question={question.question}
        answer={question.answer!}
        onCorrect={onCorrect}
        onWrong={() => onAnswer(-1)}
        nextQuestion={nextQuestion}
      />
    );
  }

  return null;
}