type Props = {
  question: string;
  options: string[];
  correctIndex: number;
  selected: number | null;
  onAnswer: (index: number) => void;
};

export default function ChoiceQuestion({
  question,
  options,
  correctIndex,
  selected,
  onAnswer,
}: Props) {
  return (
    <>
      <h2 className="text-xl font-semibold mb-6">
        {question}
      </h2>

      <div className="space-y-3">
        {options.map((option, index) => {
          const isCorrect = index === correctIndex;
          const isSelected = index === selected;

          return (
            <div
              key={index}
              className={`p-4 rounded-xl transition-all ${
                isSelected
                  ? isCorrect
                    ? "bg-green-300"
                    : "bg-red-300"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
              onClick={() => onAnswer(index)}
            >
              {option}
            </div>
          );
        })}
      </div>
    </>
  );
}