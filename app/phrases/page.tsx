"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Phrase = {
  id: number;
  ru: string;
  cz: string;
  en?: string;
};

function speak(text: string) {
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "cs-CZ";
  utter.rate = 0.9;
  window.speechSynthesis.speak(utter);
}

export default function PhrasesPage() {
    const router = useRouter();
    const [mode, setMode] = useState<"ru-cz" | "cz-en">("ru-cz");
  const [input, setInput] = useState("");
  const [phrases, setPhrases] = useState<Phrase[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
const [editRu, setEditRu] = useState("");
const [editCz, setEditCz] = useState("");
const [editEn, setEditEn] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("myPhrases");
    if (stored) {
      setPhrases(JSON.parse(stored));
    }
  }, []);

  const savePhrases = (updated: Phrase[]) => {
    setPhrases(updated);
    localStorage.setItem("myPhrases", JSON.stringify(updated));
  };

  const handleAdd = () => {
  if (!input.trim()) return;

  const parts = input.split(" - ");

  if (parts.length < 2) {
    alert("Введите в формате: русский - чешский");
    return;
  }

  const newPhrase: Phrase = {
    id: Date.now(),
    ru: parts[0].trim(),
    cz: parts[1].trim(),
  };

  savePhrases([newPhrase, ...phrases]);
  setInput("");
};

const handleSaveEdit = () => {
  if (!editingId) return;

  const updated = phrases.map((p) =>
    p.id === editingId
      ? { ...p, ru: editRu, cz: editCz, en: editEn }
      : p
  );

  savePhrases(updated);
  setEditingId(null);
};

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-100 to-blue-100 p-8">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-3xl shadow-xl">
        <h1 className="text-2xl font-bold mb-6">
          Мои фразы ✍️
        </h1>
        <div className="flex gap-3 mb-4">
            <button
                onClick={() => setMode("ru-cz")}
                className={`px-4 py-2 rounded-xl ${
                mode === "ru-cz"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
            >
                RU → CZ
            </button>

            <button
                onClick={() => setMode("cz-en")}
                className={`px-4 py-2 rounded-xl ${
                mode === "cz-en"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
            >
                CZ → EN
            </button>
        </div>

        <div className="flex gap-3 mb-6">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Введите фразу..."
            className="flex-1 p-3 border rounded-xl"
          />
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-blue-500 text-white rounded-xl"
          >
            Добавить
          </button>
        </div>
        <button
            onClick={() => router.push("/phrases/train")}
            className="mb-6 px-4 py-2 bg-green-500 text-white rounded-xl"
            >
            🎯 Тренироваться
        </button>
        <div className="space-y-4">
          {phrases.map((phrase) => (
            <div key={phrase.id} className="p-4 bg-gray-100 rounded-xl transition-all duration-300">

  {editingId === phrase.id ? (
    <>
      <input
        value={editRu}
        onChange={(e) => setEditRu(e.target.value)}
        className="w-full mb-2 p-2 border rounded"
        placeholder="Русский"
      />

      <input
        value={editCz}
        onChange={(e) => setEditCz(e.target.value)}
        className="w-full mb-2 p-2 border rounded"
        placeholder="Чешский"
      />

      <input
        value={editEn}
        onChange={(e) => setEditEn(e.target.value)}
        className="w-full mb-3 p-2 border rounded"
        placeholder="Английский (необязательно)"
      />

      <div className="flex gap-3">
        <button
          onClick={handleSaveEdit}
          className="px-3 py-1 bg-green-500 text-white rounded"
        >
          Сохранить
        </button>

        <button
          onClick={() => setEditingId(null)}
          className="px-3 py-1 bg-gray-400 text-white rounded"
        >
          Отмена
        </button>
      </div>
    </>
  ) : (
    <>
      {mode === "ru-cz" ? (
        <>
          <p className="font-medium">{phrase.ru}</p>
          <div className="flex justify-between mt-2">
            <span>{phrase.cz}</span>
            <button
              onClick={() => speak(phrase.cz)}
              className="text-blue-600"
            >
              🔊
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="font-medium">{phrase.cz}</p>
          <div className="flex justify-between mt-2">
            <span>{phrase.en || "— добавь перевод позже —"}</span>
            <button
              onClick={() => speak(phrase.cz)}
              className="text-blue-600"
            >
              🔊
            </button>
          </div>
        </>
      )}

      <div className="flex gap-4 mt-3 text-sm">
        <button
          onClick={() => {
            setEditingId(phrase.id);
            setEditRu(phrase.ru);
            setEditCz(phrase.cz);
            setEditEn(phrase.en || "");
          }}
          className="text-blue-500"
        >
          Редактировать
        </button>

        <button
          onClick={() => {
            if (confirm("Удалить фразу?")) {
              const updated = phrases.filter(
                (p) => p.id !== phrase.id
              );
              savePhrases(updated);
            }
          }}
          className="text-red-500"
        >
          Удалить
        </button>
      </div>
    </>
  )}
</div>
          ))}
        </div>
      </div>
    </main>
  );
}