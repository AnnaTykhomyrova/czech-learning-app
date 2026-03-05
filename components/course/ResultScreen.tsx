"use client";

type Props = {
  correctAnswers: number;
  totalQuestions: number;
  blockId: number;
  onBack: () => void;
};

export default function ResultScreen({
  correctAnswers,
  totalQuestions,
  blockId,
  onBack,
}: Props) {
  const percentage = (correctAnswers / totalQuestions) * 100;
  const passed = percentage >= 80;

  const stats = JSON.parse(
    localStorage.getItem("learningStats") || "{}"
  );

  stats[blockId] = {
    accuracy: Math.round(percentage),
    date: Date.now(),
  };

  localStorage.setItem(
    "learningStats",
    JSON.stringify(stats)
  );

  if (passed) {
    const currentUnlocked = Number(
      localStorage.getItem("unlockedBlock") || "1"
    );

    if (blockId >= currentUnlocked) {
      localStorage.setItem(
        "unlockedBlock",
        String(blockId + 1)
      );
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-blue-100 relative overflow-hidden">
      <div className="bg-white p-12 rounded-3xl shadow-2xl text-center animate-[celebrationPop_0.7s_ease-out_forwards]">
        <h1 className="text-4xl font-bold mb-4">
          {percentage === 100
            ? "🌟 Идеально!"
            : passed
            ? "🎉 Отличный результат!"
            : "💪 Почти получилось!"}
        </h1>

        <p className="text-lg mb-6">
          Ты набрала {correctAnswers} из {totalQuestions}
        </p>

        <button
          onClick={onBack}
          className="px-8 py-3 bg-blue-500 text-white rounded-xl hover:scale-105 transition"
        >
          Вернуться к блокам
        </button>
      </div>
    </main>
  );
}