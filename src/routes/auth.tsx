import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  ssr: false,
  component: AuthPage,
  head: () => ({ meta: [{ title: "Вход — D&K Beauty" }] }),
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/admin" });
    });
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin + "/admin" },
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      navigate({ to: "/admin" });
    } catch (err: any) {
      setError(err.message ?? "Ошибка");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--ivory)] px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 md:p-10">
        <Link to="/" className="text-xs uppercase tracking-[0.25em] text-[var(--blush)]">D&K Beauty</Link>
        <h1 className="font-display text-3xl text-[var(--plum)] mt-3">
          {mode === "signin" ? "Вход в админку" : "Регистрация"}
        </h1>
        <p className="text-sm text-[var(--ink)]/60 mt-2">
          {mode === "signin" ? "Только для администраторов салона." : "Создайте аккаунт администратора."}
        </p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <label className="text-xs uppercase tracking-wider text-[var(--ink)]/60">Email</label>
            <input
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-[var(--mist)] bg-white px-4 py-3 focus:border-[var(--blush)] focus:outline-none focus:ring-2 focus:ring-[var(--blush)]/20"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wider text-[var(--ink)]/60">Пароль</label>
            <input
              type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-[var(--mist)] bg-white px-4 py-3 focus:border-[var(--blush)] focus:outline-none focus:ring-2 focus:ring-[var(--blush)]/20"
            />
          </div>
          {error && <div className="text-sm text-red-500">{error}</div>}
          <button type="submit" disabled={loading}
            className="w-full rounded-full bg-[var(--blush)] text-white py-3.5 font-medium hover:opacity-90 transition disabled:opacity-50">
            {loading ? "..." : mode === "signin" ? "Войти" : "Зарегистрироваться"}
          </button>
        </form>

        <button
          onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setError(null); }}
          className="mt-5 text-sm text-[var(--plum)] underline w-full text-center"
        >
          {mode === "signin" ? "Нет аккаунта? Создать" : "Уже есть аккаунт? Войти"}
        </button>

        <Link to="/" className="mt-6 block text-center text-xs text-[var(--ink)]/50 hover:text-[var(--plum)]">
          ← На главную
        </Link>
      </div>
    </div>
  );
}
