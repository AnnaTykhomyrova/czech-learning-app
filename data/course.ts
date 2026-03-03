export type Question = {
  id: number;
  type: "choice";
  question: string;
  options: string[];
  correctIndex: number;
};

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
          type: "choice",
          question: "Как будет «Пока»?",
          options: ["Na shledanou", "Ahoj", "Děkuji"],
          correctIndex: 1,
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
          type: "choice",
          question: "Как будет «До свидания»?",
          options: ["Na shledanou", "Ahoj", "Čau"],
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
                question: "Как будет «Я понимаю»?",
                options: ["Já nerozumím", "Rozumím", "Nevím"],
                correctIndex: 1,
            },
            {
                id: 2,
                type: "choice",
                question: "Как будет «Я не понимаю»?",
                options: ["Rozumím", "Já nerozumím", "Prosím"],
                correctIndex: 1,
            },
            {
                id: 3,
                type: "choice",
                question: "Как будет «Где туалет?»?",
                options: ["Kde je toaleta?", "Kolik to stojí?", "Jak se máš?"],
                correctIndex: 0,
            },
            {
                id: 4,
                type: "choice",
                question: "Как будет «Сколько это стоит?»?",
                options: ["Kde je toaleta?", "Kolik to stojí?", "Děkuji"],
                correctIndex: 1,
            },
            {
                id: 5,
                type: "choice",
                question: "Как будет «Мне нужна помощь»?",
                options: ["Potřebuji pomoc", "Rozumím", "Ahoj"],
                correctIndex: 0,
            },
        ],
    },
  ],
};