"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      router.push("/course");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6">Вход</h1>

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-3 p-3 border rounded-xl"
        />

        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 p-3 border rounded-xl"
        />

        {error && <p className="text-red-500 mb-3">{error}</p>}

        <button
          onClick={handleLogin}
          className="w-full bg-blue-500 text-white py-3 rounded-xl"
        >
          Войти
        </button>

        <button
          onClick={() => router.push("/auth/signup")}
          className="mt-3 text-sm text-blue-600"
        >
          Создать аккаунт
        </button>

        <button
          onClick={() => router.push("/auth/demo")}
          className="mt-2 text-sm text-gray-500"
        >
          Войти как гость
        </button>
      </div>
    </main>
  );
}