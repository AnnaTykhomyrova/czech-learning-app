"use client";

import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };

    getUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  const navItems = [
    { label: "Курс", path: "/course" },
    { label: "Практика", path: "/practice" },
    { label: "Ошибки", path: "/review" },
    { label: "Фразы", path: "/phrases" },
  ];

  if (pathname.startsWith("/auth")) return null;

  return (
    <div className="w-full bg-white shadow-md px-6 py-3 flex items-center justify-between">
      
      {/* 🔹 Левая часть */}
      <div className="flex items-center gap-6">
        <span
          onClick={() => router.push("/course")}
          className="font-bold text-lg cursor-pointer"
        >
          🇨🇿 Czech Course
        </span>

        <div className="flex gap-4">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.path);

            return (
              <button
                key={item.path}
                onClick={() => router.push(item.path)}
                className={`px-3 py-1 rounded-lg text-sm transition ${
                  isActive
                    ? "bg-blue-500 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 🔹 Правая часть */}
      <div className="flex items-center gap-4">
        {user && (
          <span className="text-sm text-gray-600">
            {user.email}
          </span>
        )}

        <button
          onClick={handleLogout}
          className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm hover:opacity-90"
        >
          Выйти
        </button>
      </div>
    </div>
  );
}