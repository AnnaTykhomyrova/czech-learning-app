type Props = {
  question: string;
  options: string[];
  correctIndex: number;
  selected: number | null;
  onAnswer: (index: number) => void;
  speak: (text: string) => void;
};

export default function AudioQuestion({
  question,
  options,
  correctIndex,
  selected,
  onAnswer,
  speak,
}: Props) {
  return (
    <>
      <div className="mb-6 text-left">
        <p className="text-gray-600 mb-3">
          Прослушай слово и выбери перевод
        </p>

        <button
          onClick={() => speak(question)}
          className="px-6 py-3 bg-blue-500 text-white rounded-xl"
        >
          🔊 Прослушать
        </button>
      </div>

      <div className="space-y-3">
        {options.map((option, index) => {
          const isCorrect = index === correctIndex;
          const isSelected = index === selected;

          return (
            <div
              key={index}
              onClick={() => onAnswer(index)}
              className={`p-4 rounded-xl ${
                isSelected
                  ? isCorrect
                    ? "bg-green-300"
                    : "bg-red-300"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {option}
            </div>
          );
        })}
      </div>
    </>
  );
}