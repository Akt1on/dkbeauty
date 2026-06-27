import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { submitBooking } from "@/lib/bookings.functions";

type FormVals = {
  name: string;
  phone: string;
  category: string;
  master: string;
  date: string;
  time: string;
  consent: boolean;
  website: string; // honeypot
};

const CATEGORIES = ["Маникюр / педикюр","Стрижка","Окрашивание волос","Укладка / причёска","Уходы для волос","Брови и ресницы","Косметология","Инъекции","Шугаринг","Наращивание волос"];
const MASTERS = ["Без предпочтений","Дорина","Маргарита","Марина (брови)","Кристина","Эля","Яна","Анна В. (инъекции)"];
const TIMES = (() => {
  const out: string[] = [];
  for (let h = 9; h <= 21; h++) {
    out.push(`${String(h).padStart(2,"0")}:00`);
    if (h < 21) out.push(`${String(h).padStart(2,"0")}:30`);
  }
  return out;
})();

const formatPhone = (v: string) => {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (!d) return "";
  const p = d.startsWith("8") || d.startsWith("7") ? d.slice(1) : d;
  let out = "+7";
  if (p.length > 0) out += ` (${p.slice(0,3)}`;
  if (p.length >= 3) out += `)`;
  if (p.length >= 4) out += ` ${p.slice(3,6)}`;
  if (p.length >= 7) out += `-${p.slice(6,8)}`;
  if (p.length >= 9) out += `-${p.slice(8,10)}`;
  return out;
};

export function Booking() {
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<FormVals>({
    defaultValues: { master: "Без предпочтений", consent: false, website: "" },
  });
  const submit = useServerFn(submitBooking);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const mounted = useRef(Date.now());
  const phone = watch("phone");
  const consent = watch("consent");

  const onSubmit = async (vals: FormVals) => {
    setError(null);
    setLoading(true);
    try {
      const res = await submit({
        data: {
          name: vals.name,
          phone: vals.phone,
          category: vals.category,
          master: vals.master === "Без предпочтений" ? null : vals.master,
          preferred_date: vals.date,
          preferred_time: vals.time,
          comment: null,
          website: vals.website ?? "",
          filled_ms: Date.now() - mounted.current,
        },
      });
      if (res.id === "bot-discarded") return;
      setDone(true);
      reset({ master: "Без предпочтений", consent: false, website: "" } as any);
      mounted.current = Date.now();
      setTimeout(() => setDone(false), 5000);
    } catch (e: any) {
      setError(e?.message?.includes("Слишком") ? e.message : "Не удалось отправить заявку. Попробуйте ещё раз или напишите в WhatsApp.");
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  const field = (label: string, err?: string, children?: React.ReactNode) => (
    <div className="flex flex-col gap-2">
      <label className="text-xs uppercase tracking-wider text-[var(--ink)]/60">{label}</label>
      {children}
      {err && <span className="text-xs text-red-500">{err}</span>}
    </div>
  );

  const inputCls = "w-full rounded-xl border border-[var(--mist)] bg-white px-4 py-3.5 text-[var(--ink)] focus:border-[var(--blush)] focus:outline-none focus:ring-2 focus:ring-[var(--blush)]/20 transition";

  return (
    <section id="booking" className="relative py-24 md:py-32 bg-[var(--plum)] text-white overflow-hidden noise-overlay">
      <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full blur-3xl opacity-20" style={{ background: "var(--blush)" }} />
      <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full blur-3xl opacity-10" style={{ background: "var(--gold)" }} />

      <div className="relative max-w-5xl mx-auto px-5 lg:px-10">
        <div className="text-center mb-12">
          <div className="text-xs uppercase tracking-[0.25em] text-[var(--gold)] mb-4">Запись</div>
          <h2 className="font-display leading-[1.05]" style={{ fontSize: "clamp(2rem, 5vw, 4rem)" }}>
            Запись онлайн
          </h2>
          <p className="text-white/70 mt-4 max-w-lg mx-auto">Оставьте заявку — администратор свяжется с вами для подтверждения времени.</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
          className="bg-[var(--ivory)] text-[var(--ink)] rounded-3xl p-7 md:p-12 shadow-2xl"
        >
          {/* Honeypot: invisible to humans, irresistible to bots */}
          <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: 1, height: 1, overflow: "hidden" }}>
            <label>Website<input type="text" tabIndex={-1} autoComplete="off" {...register("website")} /></label>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {field("Имя *", errors.name?.message,
              <input {...register("name", { required: "Укажите имя" })} placeholder="Ваше имя" className={inputCls} autoComplete="name" />
            )}
            {field("Телефон *", errors.phone?.message,
              <input
                {...register("phone", { required: "Укажите телефон", minLength: { value: 17, message: "Введите телефон полностью" } })}
                value={phone || ""}
                onChange={(e) => setValue("phone", formatPhone(e.target.value), { shouldValidate: true })}
                placeholder="+7 (___) ___-__-__" className={inputCls} inputMode="tel" autoComplete="tel"
              />
            )}
            {field("Категория услуги *", errors.category?.message,
              <select {...register("category", { required: "Выберите услугу" })} className={inputCls}>
                <option value="">Выберите...</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            )}
            {field("Мастер", undefined,
              <select {...register("master")} className={inputCls}>
                {MASTERS.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            )}
            {field("Дата *", errors.date?.message,
              <input type="date" min={today} {...register("date", { required: "Выберите дату" })} className={inputCls} />
            )}
            {field("Время *", errors.time?.message,
              <select {...register("time", { required: "Выберите время" })} className={inputCls}>
                <option value="">Выберите...</option>
                {TIMES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            )}
          </div>

          <label className="flex items-start gap-3 mt-7 cursor-pointer select-none">
            <span className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center transition ${consent ? "bg-[var(--blush)] border-[var(--blush)]" : "border-[var(--ink)]/30"}`}>
              {consent && <Check className="w-3.5 h-3.5 text-white" />}
            </span>
            <input type="checkbox" {...register("consent", { required: true })} className="sr-only" />
            <span className="text-sm text-[var(--ink)]/80">Я согласен(а) на обработку персональных данных</span>
          </label>
          {errors.consent && <div className="text-xs text-red-500 mt-1 ml-8">Подтвердите согласие</div>}

          {error && <div className="mt-5 rounded-xl bg-red-50 text-red-600 px-4 py-3 text-sm">{error}</div>}

          <button
            type="button"
            onClick={handleSubmit(onSubmit)}
            disabled={loading}
            className="shimmer-btn mt-7 w-full rounded-full bg-[var(--blush)] text-white py-4 text-center font-medium cursor-pointer hover:bg-[#b88f8f] transition select-none disabled:opacity-60"
          >
            {loading ? "Отправляем…" : done ? "Заявка отправлена ✓" : "Записаться"}
          </button>

          <p className="text-xs text-[var(--ink)]/60 text-center mt-4 leading-relaxed">
            Нажимая кнопку, вы соглашаетесь на обработку персональных данных согласно 152-ФЗ и нашей{" "}
            <a href="/privacy" className="underline">Политике конфиденциальности</a>.
          </p>
        </motion.div>

        <div className="mt-10 text-center">
          <div className="text-sm text-white/70 mb-4">Или напишите нам:</div>
          <div className="flex flex-wrap justify-center gap-3">
            <a href="https://wa.me/+79775772229" target="_blank" rel="noopener noreferrer" className="rounded-full bg-[#25D366] text-white px-6 py-3 text-sm font-medium hover:opacity-90 transition">WhatsApp</a>
            <a href="https://max.ru/+79775772229" target="_blank" rel="noopener noreferrer" className="rounded-full bg-white text-plum px-6 py-3 text-sm font-medium hover:opacity-90 transition">MAX / ВКонтакте</a>
          </div>
        </div>
      </div>
    </section>
  );
}
