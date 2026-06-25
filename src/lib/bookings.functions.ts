import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const bookingSchema = z.object({
  name: z.string().trim().min(2).max(100),
  phone: z.string().trim().min(10).max(30),
  category: z.string().trim().min(1).max(100),
  master: z.string().trim().max(100).optional().nullable(),
  preferred_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  preferred_time: z.string().regex(/^\d{2}:\d{2}$/),
  comment: z.string().trim().max(1000).optional().nullable(),
});

export type BookingInput = z.infer<typeof bookingSchema>;

async function notifyTelegram(booking: BookingInput, id: string): Promise<boolean> {
  const LOVABLE_API_KEY = process.env.LOVABLE_API_KEY;
  const TELEGRAM_API_KEY = process.env.TELEGRAM_API_KEY;
  if (!LOVABLE_API_KEY || !TELEGRAM_API_KEY) return false;

  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data: chatRow } = await supabaseAdmin
    .from("app_settings")
    .select("value")
    .eq("key", "telegram_admin_chat_id")
    .maybeSingle();
  const chatId = chatRow?.value;
  if (!chatId) return false;

  const text =
    `🌸 <b>Новая заявка D&K Beauty</b>\n\n` +
    `👤 <b>${booking.name}</b>\n` +
    `📞 ${booking.phone}\n` +
    `💅 ${booking.category}\n` +
    (booking.master ? `✨ Мастер: ${booking.master}\n` : "") +
    `📅 ${booking.preferred_date} в ${booking.preferred_time}\n` +
    (booking.comment ? `💬 ${booking.comment}\n` : "") +
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

export const submitBooking = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => bookingSchema.parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("bookings")
      .insert({
        name: data.name,
        phone: data.phone,
        category: data.category,
        master: data.master ?? null,
        preferred_date: data.preferred_date,
        preferred_time: data.preferred_time,
        comment: data.comment ?? null,
      })
      .select("id")
      .single();
    if (error || !row) throw new Error(error?.message ?? "Insert failed");

    const sent = await notifyTelegram(data, row.id);
    if (sent) {
      await supabaseAdmin.from("bookings").update({ telegram_sent: true }).eq("id", row.id);
    }
    return { ok: true as const, id: row.id, notified: sent };
  });
