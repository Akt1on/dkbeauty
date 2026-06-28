import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { z } from "zod";

const bookingSchema = z.object({
  name: z.string().trim().min(2).max(100),
  phone: z.string().trim().min(10).max(30),
  category: z.string().trim().min(1).max(100),
  master: z.string().trim().max(100).optional().nullable(),
  preferred_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  preferred_time: z.string().regex(/^\d{2}:\d{2}$/),
  comment: z.string().trim().max(1000).optional().nullable(),
  // Honeypot — bots fill all fields including hidden ones. Must be empty.
  website: z.string().max(0).optional().nullable(),
  // Anti-instant-submit: time spent on the form (ms). Real users take >1.5s.
  filled_ms: z.number().int().min(0).max(86_400_000).optional(),
});

export type BookingInput = z.infer<typeof bookingSchema>;

async function notifyTelegram(b: BookingInput, id: string): Promise<boolean> {
  const LOVABLE_API_KEY = process.env.LOVABLE_API_KEY;
  const TELEGRAM_API_KEY = process.env.TELEGRAM_API_KEY;
  if (!LOVABLE_API_KEY || !TELEGRAM_API_KEY) return false;

  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data: chatRow } = await supabaseAdmin
    .from("app_settings").select("value").eq("key", "telegram_admin_chat_id").maybeSingle();
  const chatId = chatRow?.value;
  if (!chatId) return false;

  const text =
    `🌸 <b>Новая заявка D&K Beauty</b>\n\n` +
    `👤 <b>${b.name}</b>\n` +
    `📞 ${b.phone}\n` +
    `💅 ${b.category}\n` +
    (b.master ? `✨ Мастер: ${b.master}\n` : "") +
    `📅 ${b.preferred_date} в ${b.preferred_time}\n` +
    (b.comment ? `💬 ${b.comment}\n` : "") +
    `\n<code>ID: ${id}</code>`;

  try {
    const res = await fetch("https://connector-gateway.lovable.dev/telegram/sendMessage", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "X-Connection-Api-Key": TELEGRAM_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
    });
    return res.ok;
  } catch (e) {
    console.error("Telegram notify failed", e);
    return false;
  }
}

async function checkRateLimit(supabaseAdmin: any, ip: string): Promise<boolean> {
  const LIMIT = 5; // requests
  const WINDOW_MIN = 10;
  const now = new Date();
  const { data: row } = await supabaseAdmin
    .from("booking_rate_limit").select("count,window_start").eq("ip", ip).maybeSingle();
  if (!row) {
    await supabaseAdmin.from("booking_rate_limit").insert({ ip, count: 1, window_start: now.toISOString() });
    return true;
  }
  const ageMin = (now.getTime() - new Date(row.window_start).getTime()) / 60_000;
  if (ageMin > WINDOW_MIN) {
    await supabaseAdmin.from("booking_rate_limit").update({ count: 1, window_start: now.toISOString() }).eq("ip", ip);
    return true;
  }
  if (row.count >= LIMIT) return false;
  await supabaseAdmin.from("booking_rate_limit").update({ count: row.count + 1 }).eq("ip", ip);
  return true;
}

export const submitBooking = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => bookingSchema.parse(d))
  .handler(async ({ data }) => {
    // Honeypot — silently succeed without persisting
    if (data.website && data.website.length > 0) {
      return { ok: true as const, id: "bot-discarded", notified: false };
    }
    // Anti-instant-submit
    if (typeof data.filled_ms === "number" && data.filled_ms < 1500) {
      throw new Error("Слишком быстрая отправка. Попробуйте ещё раз.");
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Rate limit per IP
    const req = getRequest();
    const fwd = req?.headers.get("x-forwarded-for") ?? req?.headers.get("cf-connecting-ip") ?? "";
    const ip = (fwd.split(",")[0] ?? "").trim() || "unknown";
    const allowed = await checkRateLimit(supabaseAdmin, ip);
    if (!allowed) {
      throw new Error("Слишком много заявок. Подождите 10 минут или напишите в WhatsApp.");
    }

    const { data: row, error } = await supabaseAdmin
      .from("bookings")
      .insert({
        name: data.name, phone: data.phone, category: data.category,
        master: data.master ?? null,
        preferred_date: data.preferred_date, preferred_time: data.preferred_time,
        comment: data.comment ?? null,
      })
      .select("id").single();
    if (error || !row) throw new Error(error?.message ?? "Insert failed");

    const sent = await notifyTelegram(data, row.id);
    if (sent) {
      await supabaseAdmin.from("bookings").update({ telegram_sent: true }).eq("id", row.id);
    }
    return { ok: true as const, id: row.id, notified: sent };
  });
