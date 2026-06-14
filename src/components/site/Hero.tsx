import { motion } from "framer-motion";
import { Star, Sparkles } from "lucide-react";
import heroImg from "@/assets/gallery/hero-portrait.jpg";

const heroWords = ["D&K", "Beauty", "—", "салон", "красоты", "в", "Губернском"];

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden noise-overlay bg-[var(--ivory)]">
      <div className="absolute inset-0 hero-pattern opacity-50" />
      <motion.div
        className="absolute -top-32 -right-32 w-[520px] h-[520px] rounded-full blur-3xl opacity-40"
        style={{ background: "radial-gradient(circle, var(--blush) 0%, transparent 65%)" }}
        animate={{ x: [0, 40, 0], y: [0, -30, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-40 -left-32 w-[480px] h-[480px] rounded-full blur-3xl opacity-30"
        style={{ background: "radial-gradient(circle, var(--gold) 0%, transparent 65%)" }}
        animate={{ x: [0, -30, 0], y: [0, 40, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative max-w-7xl mx-auto px-5 lg:px-10 w-full grid lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-8 relative">
          <motion.div
            initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: 0.8, delay: 0.2 }}
            className="absolute -left-4 lg:-left-8 top-2 bottom-2 w-[3px] bg-[var(--gold)] origin-top"
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[var(--gold)] mb-6"
          >
            <Sparkles className="w-3.5 h-3.5" /> Премиальный салон · с 2020
          </motion.div>

          <h1 className="font-display text-plum leading-[1.02]" style={{ fontSize: "clamp(2.5rem, 7vw, 6.5rem)" }}>
            {heroWords.map((w, i) => (
              <motion.span
                key={i}
                initial={{ y: 80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 + i * 0.08, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="inline-block mr-[0.25em]"
              >
                {w === "&" ? <span className="text-[var(--gold)] italic">&</span> : w}
              </motion.span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }}
            className="mt-7 text-lg md:text-xl text-[var(--ink)]/80 max-w-xl"
          >
            Ул. Земская, 18, Чехов · Ежедневно 9:00–21:00
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <a href="#booking" className="shimmer-btn inline-flex items-center justify-center rounded-full bg-[var(--blush)] text-white px-8 py-4 text-sm font-medium tracking-wide shadow-[0_10px_30px_-8px_rgba(201,160,160,0.7)] hover:-translate-y-0.5 transition">
              Записаться онлайн
            </a>
            <a href="#services" className="inline-flex items-center justify-center rounded-full border border-plum/30 text-plum px-8 py-4 text-sm font-medium tracking-wide hover:bg-plum hover:text-white transition">
              Наши услуги
            </a>

            <motion.div
              initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.6, type: "spring" }}
              className="flex items-center gap-2 rounded-full bg-white border border-[var(--gold-soft)] px-4 py-2 animate-soft-pulse"
            >
              <Star className="w-4 h-4 fill-[var(--gold)] text-[var(--gold)]" />
              <span className="font-medium text-plum">4.9</span>
              <span className="text-sm text-muted-foreground">· 268 отзывов</span>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}
            className="mt-12 grid sm:grid-cols-3 gap-5 max-w-2xl"
          >
            {[
              "Топ-мастера по стрижке и окрашиванию",
              "Маникюр, косметология, шугаринг",
              "Наращивание ресниц и волос",
            ].map((t, i) => (
              <div key={i} className="flex items-start gap-2.5 text-sm text-[var(--ink)]/85">
                <span className="text-[var(--gold)] mt-0.5">✦</span>
                <span>{t}</span>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="hidden lg:block lg:col-span-4 relative"
        >
          <div className="aspect-[3/4] rounded-[28px] overflow-hidden relative shadow-[0_40px_100px_-30px_rgba(44,26,46,0.55)] ring-1 ring-white/40">
            <img
              src={heroImg}
              alt="Интерьер салона D&K Beauty"
              width={832}
              height={1088}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-plum/55 via-plum/5 to-transparent" />
            <div className="absolute inset-0 noise-overlay opacity-60" />
            <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
              <div className="font-display text-6xl leading-none drop-shadow-lg">5+</div>
              <div className="mt-2 text-sm opacity-95 tracking-wide">лет в Губернском</div>
            </div>
            <div className="absolute top-6 right-6 w-20 h-20 rounded-full border border-white/60 backdrop-blur-sm bg-white/10 flex items-center justify-center font-display text-2xl text-white">
              D&K
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4 }}
            className="absolute -bottom-6 -left-6 bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-white"
          >
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Сегодня</div>
            <div className="text-sm font-medium text-plum mt-1">Свободно с 14:30</div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
