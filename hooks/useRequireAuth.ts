import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export function useRequireAuth() {
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();

      if (!data.session) {
        router.push("/auth/login");
      }
    };

    checkUser();
  }, []);

  useEffect(() => {
    const {
        data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
        if (!session) {
        router.push("/auth/login");
        }
    });

    return () => subscription.unsubscribe();
    }, []);
}