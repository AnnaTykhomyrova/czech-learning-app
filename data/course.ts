import { Question } from "@/types/question";

export type Block = {
  id: number;
  title: string;
  difficulty: "easy" | "medium" | "hard";
  questions: Question[];
};

export const course = {
  blocks: [
    {
      id: 1,
      title: "Приветствия",
      difficulty: "easy",
      questions: [
        {
          id: 1,
          type: "choice",
          question: "Как будет «Добрый день»?",
          options: ["Ahoj", "Dobrý den", "Dobrou noc"],
          correctIndex: 1,
        },
        {
          id: 2,
          type: "audio",
          question: "Ahoj",
          options: ["Привет", "Спасибо", "До свидания"],
          correctIndex: 0,
        },
        {
          id: 3,
          type: "choice",
          question: "Как будет «Спасибо»?",
          options: ["Prosím", "Děkuji", "Promiň"],
          correctIndex: 1,
        },
        {
          id: 4,
          type: "audio",
          question: "Na shledanou",
          options: ["До свидания", "Привет", "Спасибо"],
          correctIndex: 0,
        },
        {
          id: 5,
          type: "choice",
          question: "Как будет «Извините»?",
          options: ["Promiňte", "Děkuji", "Prosím"],
          correctIndex: 0,
        },
      ],
    },
    {
      id: 2,
      title: "Базовые фразы",
      difficulty: "medium",
      questions: [
        {
          id: 1,
          type: "choice",
          question: "Как будет «Я не понимаю»?",
          options: ["Rozumím", "Já nerozumím", "Prosím"],
          correctIndex: 1,
        },
        {
          id: 2,
          type: "audio",
          question: "Kde je toaleta?",
          options: ["Где туалет?", "Сколько это стоит?", "Как дела?"],
          correctIndex: 0,
        },
        {
          id: 3,
          type: "audio",
          question: "Kolik to stojí?",
          options: ["Где туалет?", "Сколько это стоит?", "Спасибо"],
          correctIndex: 1,
        },
        {
          id: 4,
          type: "choice",
          question: "Как будет «Мне нужна помощь»?",
          options: ["Potřebuji pomoc", "Rozumím", "Ahoj"],
          correctIndex: 0,
        },
        {
          id: 5,
          type: "drag",
          question: "Я Анна",
          words: ["Já", "se", "jmenuji", "Anna"]
        }
      ],
    },
  ],
};