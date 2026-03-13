export type Question = {
  id: number;
  type: "choice" | "audio" | "drag" | "typing";
  question: string;

  options?: string[];
  correctIndex?: number;

  words?: string[];
  
  answer?: string;
};