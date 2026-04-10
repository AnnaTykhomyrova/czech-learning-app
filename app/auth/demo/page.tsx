"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function DemoLogin() {
  const router = useRouter();

  useEffect(() => {
    const login = async () => {
      await supabase.auth.signInWithPassword({
        email: "demo@test.com",
        password: "12345678",
      });

      router.push("/course");
    };

    login();
  }, []);

  return <div className="p-10">Входим...</div>;
}