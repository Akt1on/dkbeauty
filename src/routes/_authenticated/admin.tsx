import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import {
  checkAdmin, claimAdmin, listBookings, updateBookingStatus, getSetting, setSetting,
} from "@/lib/admin.functions";
import {
  adminListServices, adminUpsertService, adminDeleteService,
  adminListGallery, adminUpsertGallery, adminDeleteGallery,
  adminListReviews, adminUpsertReview, adminDeleteReview,
} from "@/lib/admin-content.functions";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminPage,
  head: () => ({ meta: [{ title: "Админка — D&K Beauty" }, { name: "robots", content: "noindex" }] }),
});

type Booking = {
  id: string; name: string; phone: string; category: string; master: string | null;
  preferred_date: string; preferred_time: string; comment: string | null;
  status: string; telegram_sent: boolean; created_at: string;
};
type Service = { id: string; category: string; name: string; price: string; duration: string | null; sort_order: number; is_active: boolean };
type GalleryItem = { id: string; image_url: string; alt: string | null; sort_order: number; is_active: boolean };
type Review = { id: string; author: string; rating: number; text: string; source: string | null; is_published: boolean };

type Tab = "bookings" | "services" | "gallery" | "reviews" | "settings";

function AdminPage() {
  const navigate = useNavigate();
  const checkFn = useServerFn(checkAdmin);
  const claimFn = useServerFn(claimAdmin);
  const listFn = useServerFn(listBookings);
  const updateFn = useServerFn(updateBookingStatus);
  const getSet = useServerFn(getSetting);
  const setSet = useServerFn(setSetting);

  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [tab, setTab] = useState<Tab>("bookings");
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
  useEffect(() => {
    if (!msg) return;
    const t = setTimeout(() => setMsg(null), 4000);
    return () => clearTimeout(t);
  }, [msg]);

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

  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: "bookings", label: "Заявки", count: bookings.length },
    { id: "services", label: "Услуги" },
    { id: "gallery", label: "Галерея" },
    { id: "reviews", label: "Отзывы" },
    { id: "settings", label: "Настройки" },
  ];

  return (
    <div className="min-h-screen bg-[var(--ivory)] px-4 py-8 md:px-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <Link to="/" className="text-xs uppercase tracking-[0.25em] text-[var(--blush)]">D&K Beauty</Link>
            <h1 className="font-display text-3xl md:text-4xl text-[var(--plum)] mt-1">Админка</h1>
          </div>
          <button onClick={signOut} className="text-sm text-[var(--ink)]/60 hover:text-[var(--plum)] underline">Выйти</button>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-3 mb-5">
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition ${tab === t.id ? "bg-[var(--plum)] text-white" : "bg-white text-[var(--plum)] hover:bg-[var(--mist)]"}`}>
              {t.label}{typeof t.count === "number" && <span className="ml-1 opacity-60">{t.count}</span>}
            </button>
          ))}
        </div>

        {msg && <div className="mb-5 rounded-xl bg-[var(--blush)]/10 text-[var(--plum)] px-4 py-3 text-sm">{msg}</div>}

        {tab === "bookings" && <BookingsPanel bookings={bookings} setStatus={setStatus} />}
        {tab === "services" && <ServicesPanel onMsg={setMsg} />}
        {tab === "gallery" && <GalleryPanel onMsg={setMsg} />}
        {tab === "reviews" && <ReviewsPanel onMsg={setMsg} />}
        {tab === "settings" && (
          <SettingsPanel tgChatId={tgChatId} setTgChatId={setTgChatId} saveChat={saveChat} savingChat={savingChat} />
        )}
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

function BookingsPanel({ bookings, setStatus }: { bookings: Booking[]; setStatus: (id: string, s: any) => void }) {
  return (
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
                    <select aria-label="Статус заявки" value={b.status} onChange={(e) => setStatus(b.id, e.target.value as any)}
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
  );
}

function SettingsPanel({ tgChatId, setTgChatId, saveChat, savingChat }: { tgChatId: string; setTgChatId: (v: string) => void; saveChat: () => void; savingChat: boolean }) {
  return (
    <div className="bg-white rounded-3xl shadow-sm p-6">
      <h2 className="font-display text-xl text-[var(--plum)]">Telegram-уведомления</h2>
      <p className="text-sm text-[var(--ink)]/60 mt-1">
        Chat ID Telegram-аккаунта, куда отправлять заявки. Узнайте свой ID у бота <a className="underline" href="https://t.me/userinfobot" target="_blank" rel="noopener noreferrer">@userinfobot</a>.
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
  );
}

/* ---------- SERVICES ---------- */
function ServicesPanel({ onMsg }: { onMsg: (m: string) => void }) {
  const list = useServerFn(adminListServices);
  const upsert = useServerFn(adminUpsertService);
  const del = useServerFn(adminDeleteService);
  const [rows, setRows] = useState<Service[]>([]);
  const reload = async () => setRows((await list()) as Service[]);
  useEffect(() => { reload(); }, []);

  const empty: Service = { id: "", category: "", name: "", price: "", duration: null, sort_order: 0, is_active: true };
  const [draft, setDraft] = useState<Service>(empty);

  const save = async (s: Service) => {
    const payload: any = { category: s.category, name: s.name, price: s.price, duration: s.duration || null, sort_order: s.sort_order, is_active: s.is_active };
    if (s.id) payload.id = s.id;
    await upsert({ data: payload });
    setDraft(empty);
    onMsg("Услуга сохранена ✓");
    reload();
  };
  const remove = async (id: string) => {
    if (!confirm("Удалить услугу?")) return;
    await del({ data: { id } });
    onMsg("Услуга удалена");
    reload();
  };

  return (
    <div className="space-y-4">
      <ServiceRowEditor key="new" value={draft} onChange={setDraft} onSave={save} label="Добавить услугу" />
      <div className="bg-white rounded-3xl shadow-sm p-6">
        <h2 className="font-display text-xl text-[var(--plum)] mb-4">Все услуги ({rows.length})</h2>
        <div className="space-y-2">
          {rows.map((r) => <ServiceRow key={r.id} row={r} onSave={save} onDelete={remove} />)}
        </div>
      </div>
    </div>
  );
}

function ServiceRowEditor({ value, onChange, onSave, label }: { value: Service; onChange: (s: Service) => void; onSave: (s: Service) => void; label: string }) {
  return (
    <div className="bg-white rounded-3xl shadow-sm p-5 grid md:grid-cols-12 gap-3 items-center">
      <input placeholder="Категория" className="md:col-span-3 rounded-xl border border-[var(--mist)] px-3 py-2" value={value.category} onChange={(e) => onChange({ ...value, category: e.target.value })} />
      <input placeholder="Название" className="md:col-span-5 rounded-xl border border-[var(--mist)] px-3 py-2" value={value.name} onChange={(e) => onChange({ ...value, name: e.target.value })} />
      <input placeholder="Цена" className="md:col-span-2 rounded-xl border border-[var(--mist)] px-3 py-2" value={value.price} onChange={(e) => onChange({ ...value, price: e.target.value })} />
      <input type="number" placeholder="№" className="md:col-span-1 rounded-xl border border-[var(--mist)] px-3 py-2" value={value.sort_order} onChange={(e) => onChange({ ...value, sort_order: parseInt(e.target.value) || 0 })} />
      <button onClick={() => onSave(value)} disabled={!value.category || !value.name || !value.price} className="md:col-span-1 rounded-full bg-[var(--blush)] text-white text-sm py-2 disabled:opacity-40">{label === "Добавить услугу" ? "+" : "✓"}</button>
    </div>
  );
}
function ServiceRow({ row, onSave, onDelete }: { row: Service; onSave: (s: Service) => void; onDelete: (id: string) => void }) {
  const [edit, setEdit] = useState(false);
  const [draft, setDraft] = useState(row);
  useEffect(() => setDraft(row), [row.id]);
  if (edit) return (
    <div className="grid md:grid-cols-12 gap-3 items-center bg-[var(--mist)]/30 rounded-2xl p-3">
      <input className="md:col-span-3 rounded-lg border border-[var(--mist)] px-2 py-1.5 text-sm" value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })} />
      <input className="md:col-span-5 rounded-lg border border-[var(--mist)] px-2 py-1.5 text-sm" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
      <input className="md:col-span-2 rounded-lg border border-[var(--mist)] px-2 py-1.5 text-sm" value={draft.price} onChange={(e) => setDraft({ ...draft, price: e.target.value })} />
      <input type="number" className="md:col-span-1 rounded-lg border border-[var(--mist)] px-2 py-1.5 text-sm" value={draft.sort_order} onChange={(e) => setDraft({ ...draft, sort_order: parseInt(e.target.value) || 0 })} />
      <div className="md:col-span-1 flex gap-1">
        <button onClick={() => { onSave(draft); setEdit(false); }} className="text-xs px-2 py-1.5 rounded bg-[var(--plum)] text-white">✓</button>
        <button onClick={() => { setDraft(row); setEdit(false); }} className="text-xs px-2 py-1.5 rounded bg-[var(--mist)]">✕</button>
      </div>
    </div>
  );
  return (
    <div className="grid md:grid-cols-12 gap-3 items-center py-2 border-b border-[var(--mist)]/40 text-sm">
      <div className="md:col-span-3 text-[var(--ink)]/60 text-xs uppercase tracking-wider">{row.category}</div>
      <div className="md:col-span-5">{row.name}</div>
      <div className="md:col-span-2 font-medium text-[var(--plum)]">{row.price}</div>
      <button onClick={() => onSave({ ...row, is_active: !row.is_active })} className={`md:col-span-1 text-xs rounded-full px-2 py-1 ${row.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>{row.is_active ? "вкл" : "скр"}</button>
      <div className="md:col-span-1 flex gap-1">
        <button onClick={() => setEdit(true)} className="text-xs px-2 py-1 rounded bg-[var(--mist)]">✎</button>
        <button onClick={() => onDelete(row.id)} className="text-xs px-2 py-1 rounded bg-red-50 text-red-600">×</button>
      </div>
    </div>
  );
}

/* ---------- GALLERY ---------- */
function GalleryPanel({ onMsg }: { onMsg: (m: string) => void }) {
  const list = useServerFn(adminListGallery);
  const upsert = useServerFn(adminUpsertGallery);
  const del = useServerFn(adminDeleteGallery);
  const [rows, setRows] = useState<GalleryItem[]>([]);
  const reload = async () => setRows((await list()) as GalleryItem[]);
  useEffect(() => { reload(); }, []);

  const empty: GalleryItem = { id: "", image_url: "", alt: "", sort_order: 0, is_active: true };
  const [draft, setDraft] = useState<GalleryItem>(empty);

  const save = async (g: GalleryItem) => {
    const payload: any = { image_url: g.image_url, alt: g.alt || null, sort_order: g.sort_order, is_active: g.is_active };
    if (g.id) payload.id = g.id;
    await upsert({ data: payload });
    setDraft(empty);
    onMsg("Фото сохранено ✓");
    reload();
  };
  const remove = async (id: string) => { if (!confirm("Удалить фото?")) return; await del({ data: { id } }); reload(); };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-3xl shadow-sm p-5 grid md:grid-cols-12 gap-3 items-center">
        <input placeholder="URL фото (https://…)" className="md:col-span-6 rounded-xl border border-[var(--mist)] px-3 py-2" value={draft.image_url} onChange={(e) => setDraft({ ...draft, image_url: e.target.value })} />
        <input placeholder="Описание (alt)" className="md:col-span-4 rounded-xl border border-[var(--mist)] px-3 py-2" value={draft.alt ?? ""} onChange={(e) => setDraft({ ...draft, alt: e.target.value })} />
        <input type="number" placeholder="№" className="md:col-span-1 rounded-xl border border-[var(--mist)] px-3 py-2" value={draft.sort_order} onChange={(e) => setDraft({ ...draft, sort_order: parseInt(e.target.value) || 0 })} />
        <button onClick={() => save(draft)} disabled={!draft.image_url} className="md:col-span-1 rounded-full bg-[var(--blush)] text-white text-sm py-2 disabled:opacity-40">+</button>
      </div>
      <div className="bg-white rounded-3xl shadow-sm p-6">
        <h2 className="font-display text-xl text-[var(--plum)] mb-4">Галерея ({rows.length})</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {rows.map((g) => (
            <div key={g.id} className="rounded-2xl overflow-hidden border border-[var(--mist)] bg-[var(--mist)]/30">
              <img src={g.image_url} alt={g.alt ?? ""} className="w-full aspect-[4/3] object-cover" loading="lazy" />
              <div className="p-3 flex items-center justify-between gap-2">
                <div className="text-xs text-[var(--ink)]/70 truncate">{g.alt || "—"}</div>
                <div className="flex gap-1">
                  <button onClick={() => save({ ...g, is_active: !g.is_active })} className={`text-xs rounded-full px-2 py-1 ${g.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>{g.is_active ? "вкл" : "скр"}</button>
                  <button onClick={() => remove(g.id)} className="text-xs px-2 py-1 rounded bg-red-50 text-red-600">×</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {rows.length === 0 && <p className="text-sm text-[var(--ink)]/60">Пока пусто. Если фото нет, сайт показывает базовый набор по умолчанию.</p>}
      </div>
    </div>
  );
}

/* ---------- REVIEWS ---------- */
function ReviewsPanel({ onMsg }: { onMsg: (m: string) => void }) {
  const list = useServerFn(adminListReviews);
  const upsert = useServerFn(adminUpsertReview);
  const del = useServerFn(adminDeleteReview);
  const [rows, setRows] = useState<Review[]>([]);
  const reload = async () => setRows((await list()) as Review[]);
  useEffect(() => { reload(); }, []);

  const empty: Review = { id: "", author: "", rating: 5, text: "", source: "Яндекс Карты", is_published: true };
  const [draft, setDraft] = useState<Review>(empty);

  const save = async (r: Review) => {
    const payload: any = { author: r.author, rating: r.rating, text: r.text, source: r.source || null, is_published: r.is_published };
    if (r.id) payload.id = r.id;
    await upsert({ data: payload });
    setDraft(empty);
    onMsg("Отзыв сохранён ✓");
    reload();
  };
  const remove = async (id: string) => { if (!confirm("Удалить отзыв?")) return; await del({ data: { id } }); reload(); };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-3xl shadow-sm p-5 grid md:grid-cols-12 gap-3">
        <input placeholder="Автор" className="md:col-span-4 rounded-xl border border-[var(--mist)] px-3 py-2" value={draft.author} onChange={(e) => setDraft({ ...draft, author: e.target.value })} />
        <select aria-label="Рейтинг" className="md:col-span-2 rounded-xl border border-[var(--mist)] px-3 py-2" value={draft.rating} onChange={(e) => setDraft({ ...draft, rating: parseInt(e.target.value) })}>
          {[5,4,3,2,1].map(n => <option key={n} value={n}>{"★".repeat(n)}</option>)}
        </select>
        <input placeholder="Источник" className="md:col-span-3 rounded-xl border border-[var(--mist)] px-3 py-2" value={draft.source ?? ""} onChange={(e) => setDraft({ ...draft, source: e.target.value })} />
        <button onClick={() => save(draft)} disabled={!draft.author || !draft.text} className="md:col-span-3 rounded-full bg-[var(--blush)] text-white text-sm py-2 disabled:opacity-40">Добавить отзыв</button>
        <textarea placeholder="Текст отзыва" rows={3} className="md:col-span-12 rounded-xl border border-[var(--mist)] px-3 py-2" value={draft.text} onChange={(e) => setDraft({ ...draft, text: e.target.value })} />
      </div>
      <div className="bg-white rounded-3xl shadow-sm p-6 space-y-3">
        <h2 className="font-display text-xl text-[var(--plum)]">Отзывы ({rows.length})</h2>
        {rows.map((r) => (
          <div key={r.id} className="border-b border-[var(--mist)]/50 last:border-0 pb-3 flex flex-wrap items-start gap-3">
            <div className="flex-1 min-w-[260px]">
              <div className="flex items-center gap-2">
                <span className="font-medium text-[var(--plum)]">{r.author}</span>
                <span className="text-[var(--gold)] text-sm">{"★".repeat(r.rating)}</span>
                {r.source && <span className="text-xs text-[var(--ink)]/50">· {r.source}</span>}
              </div>
              <p className="text-sm text-[var(--ink)]/80 mt-1">{r.text}</p>
            </div>
            <div className="flex gap-1">
              <button onClick={() => save({ ...r, is_published: !r.is_published })} className={`text-xs rounded-full px-2 py-1 ${r.is_published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>{r.is_published ? "опубл." : "скрыт"}</button>
              <button onClick={() => remove(r.id)} className="text-xs px-2 py-1 rounded bg-red-50 text-red-600">×</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
