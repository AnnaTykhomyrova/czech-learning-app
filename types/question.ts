export type Question = {
  id: number;
  type: "choice" | "audio" | "drag";
  question: string;

  options?: string[];
  correctIndex?: number;

  words?: string[];
};