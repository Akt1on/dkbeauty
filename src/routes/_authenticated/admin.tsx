import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import {
  checkAdmin, claimAdmin, listBookings, updateBookingStatus, getSetting, setSetting,
} from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminPage,
  head: () => ({ meta: [{ title: "Админка — D&K Beauty" }] }),
});

type Booking = {
  id: string; name: string; phone: string; category: string; master: string | null;
  preferred_date: string; preferred_time: string; comment: string | null;
  status: string; telegram_sent: boolean; created_at: string;
};

function AdminPage() {
  const navigate = useNavigate();
  const checkFn = useServerFn(checkAdmin);
  const claimFn = useServerFn(claimAdmin);
  const listFn = useServerFn(listBookings);
  const updateFn = useServerFn(updateBookingStatus);
  const getSet = useServerFn(getSetting);
  const setSet = useServerFn(setSetting);

  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [tgChatId, setTgChatId] = useState("");
  const [savingChat, setSavingChat] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const load = async () => {
    const r = await checkFn();
    setIsAdmin(r.isAdmin);
    if (r.isAdmin) {
      const [b, s] = await Promise.all([listFn(), getSet({ data: { key: "telegram_admin_chat_id" } })]);
      setBookings(b as Booking[]);
      setTgChatId(s.value ?? "");
    }
  };

  useEffect(() => { load(); }, []);

  const claim = async () => {
    const r = await claimFn();
    if (r.claimed) { setMsg("Вы стали администратором ✓"); await load(); }
    else setMsg("Администратор уже назначен.");
  };

  const setStatus = async (id: string, status: "new" | "confirmed" | "done" | "cancelled") => {
    await updateFn({ data: { id, status } });
    setBookings((bs) => bs.map((b) => (b.id === id ? { ...b, status } : b)));
  };

  const saveChat = async () => {
    setSavingChat(true);
    try {
      await setSet({ data: { key: "telegram_admin_chat_id", value: tgChatId.trim() } });
      setMsg("Telegram chat_id сохранён ✓");
    } finally { setSavingChat(false); }
  };

  const signOut = async () => { await supabase.auth.signOut(); navigate({ to: "/auth" }); };

  if (isAdmin === null) {
    return <div className="min-h-screen flex items-center justify-center text-[var(--plum)]">Загрузка…</div>;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--ivory)] px-4">
        <div className="max-w-md text-center bg-white rounded-3xl shadow-xl p-8">
          <h1 className="font-display text-2xl text-[var(--plum)]">Доступ ограничен</h1>
          <p className="mt-2 text-sm text-[var(--ink)]/60">
            Если вы — первый администратор, нажмите кнопку ниже, чтобы получить роль.
          </p>
          <button onClick={claim} className="mt-5 rounded-full bg-[var(--blush)] text-white px-6 py-3 font-medium">
            Стать администратором
          </button>
          {msg && <div className="mt-4 text-sm text-[var(--plum)]">{msg}</div>}
          <button onClick={signOut} className="mt-6 text-xs text-[var(--ink)]/50 underline">Выйти</button>
        </div>
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    new: "bg-blue-100 text-blue-700",
    confirmed: "bg-green-100 text-green-700",
    done: "bg-gray-100 text-gray-700",
    cancelled: "bg-red-100 text-red-700",
  };

  return (
    <div className="min-h-screen bg-[var(--ivory)] px-4 py-8 md:px-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
          <div>
            <Link to="/" className="text-xs uppercase tracking-[0.25em] text-[var(--blush)]">D&K Beauty</Link>
            <h1 className="font-display text-3xl md:text-4xl text-[var(--plum)] mt-1">Админка</h1>
          </div>
          <button onClick={signOut} className="text-sm text-[var(--ink)]/60 hover:text-[var(--plum)] underline">Выйти</button>
        </div>

        {msg && <div className="mb-5 rounded-xl bg-[var(--blush)]/10 text-[var(--plum)] px-4 py-3 text-sm">{msg}</div>}

        <div className="bg-white rounded-3xl shadow-sm p-6 mb-6">
          <h2 className="font-display text-xl text-[var(--plum)]">Telegram-уведомления</h2>
          <p className="text-sm text-[var(--ink)]/60 mt-1">
            Chat ID Telegram-аккаунта, куда отправлять заявки. Узнайте свой ID у бота @userinfobot.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <input value={tgChatId} onChange={(e) => setTgChatId(e.target.value)} placeholder="например, 123456789"
              className="flex-1 min-w-[200px] rounded-xl border border-[var(--mist)] px-4 py-3 focus:outline-none focus:border-[var(--blush)]" />
            <button onClick={saveChat} disabled={savingChat}
              className="rounded-full bg-[var(--plum)] text-white px-6 py-3 disabled:opacity-50">
              {savingChat ? "..." : "Сохранить"}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm p-6">
          <h2 className="font-display text-xl text-[var(--plum)] mb-4">Заявки ({bookings.length})</h2>
          {bookings.length === 0 ? (
            <p className="text-sm text-[var(--ink)]/60">Заявок пока нет.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-xs uppercase tracking-wider text-[var(--ink)]/50">
                  <tr><th className="py-3">Когда</th><th>Клиент</th><th>Услуга</th><th>Дата/время</th><th>Статус</th><th>TG</th><th></th></tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b.id} className="border-t border-[var(--mist)]/50">
                      <td className="py-3 text-xs text-[var(--ink)]/60">{new Date(b.created_at).toLocaleString("ru-RU")}</td>
                      <td>
                        <div className="font-medium">{b.name}</div>
                        <a href={`tel:${b.phone}`} className="text-xs text-[var(--blush)]">{b.phone}</a>
                      </td>
                      <td>
                        <div>{b.category}</div>
                        {b.master && <div className="text-xs text-[var(--ink)]/50">{b.master}</div>}
                      </td>
                      <td className="text-xs">{b.preferred_date} <br/>{b.preferred_time}</td>
                      <td>
                        <select value={b.status} onChange={(e) => setStatus(b.id, e.target.value as any)}
                          className={`rounded-full px-3 py-1 text-xs ${statusColors[b.status] ?? ""}`}>
                          <option value="new">Новая</option>
                          <option value="confirmed">Подтверждена</option>
                          <option value="done">Выполнена</option>
                          <option value="cancelled">Отменена</option>
                        </select>
                      </td>
                      <td>{b.telegram_sent ? "✓" : "—"}</td>
                      <td><a href={`https://wa.me/${b.phone.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="text-xs text-[var(--plum)] underline">WhatsApp</a></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
