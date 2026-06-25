import { motion } from "framer-motion";
import { Star } from "lucide-react";
import heroImg from "@/assets/gallery/hero-portrait.jpg";

export function Hero() {
  return (
    <section className="relative min-h-screen w-full bg-[var(--ivory)] flex items-center pt-24 pb-20 px-5 md:px-10 lg:px-16 overflow-hidden noise-overlay">
      {/* Decorative oversized background word */}
      <div
        className="pointer-events-none select-none absolute -top-20 md:-top-32 -left-6 md:-left-10 italic text-[var(--blush-soft)]/40 font-display leading-none"
        style={{ fontSize: "clamp(10rem, 28vw, 22rem)" }}
        aria-hidden
      >
        Beauty
      </div>

      <div className="relative max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* Left — narrative */}
        <div className="lg:col-span-5 z-10 space-y-8">
          <motion.header
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
            className="space-y-5"
          >
            <div className="flex items-center gap-4">
              <span className="h-px w-12 bg-[var(--plum)]" />
              <span className="uppercase tracking-[0.3em] text-[var(--plum)] text-[11px] font-medium">
                Chekhov · Premier Studio
              </span>
            </div>

            <h1
              className="font-display text-[var(--plum)] leading-[0.85] font-light"
              style={{ fontSize: "clamp(3.75rem, 10vw, 9rem)" }}
            >
              <motion.span
                initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.15, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="block"
              >
                D&K
              </motion.span>
              <motion.span
                initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.32, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="block italic pl-10 md:pl-16 lg:pl-24"
              >
                Beauty
              </motion.span>
            </h1>
          </motion.header>

          <motion.p
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55, duration: 0.8 }}
            className="text-[var(--ink)]/80 text-base md:text-lg leading-relaxed max-w-md font-light"
          >
            Искусство преображения в самом сердце Чехова. Мы создаём эстетику,
            которая подчёркивает вашу уникальность через премиальный уход.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75, duration: 0.8 }}
            className="flex flex-wrap items-center gap-3 pt-2"
          >
            <a
              href="#booking"
              className="shimmer-btn px-8 py-4 bg-[var(--plum)] text-white uppercase tracking-[0.25em] text-[11px] font-medium hover:bg-[var(--plum-soft)] transition-colors duration-500 shadow-xl shadow-[var(--plum)]/15"
            >
              Записаться
            </a>
            <a
              href="#services"
              className="px-8 py-4 border border-[var(--blush)] text-[var(--plum)] uppercase tracking-[0.25em] text-[11px] font-medium hover:bg-[var(--blush-soft)] transition-colors duration-500"
            >
              Услуги
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 0.6 }}
            className="flex items-center gap-4 pt-4"
          >
            <div className="flex items-center gap-2 animate-soft-pulse rounded-full bg-white/70 backdrop-blur border border-[var(--blush-soft)] px-4 py-2">
              <Star className="w-3.5 h-3.5 fill-[var(--plum)] text-[var(--plum)]" />
              <span className="font-medium text-[var(--plum)] text-sm">4.9</span>
              <span className="text-xs text-[var(--ink)]/60">· 268 отзывов</span>
            </div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--ink)]/50">
              Ежедневно 9:00–21:00
            </span>
          </motion.div>
        </div>

        {/* Right — editorial imagery */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-7 relative flex justify-end"
        >
          <div className="relative w-full aspect-[4/5] md:w-[88%] overflow-hidden shadow-[0_40px_120px_-30px_rgba(196,92,124,0.45)] bg-white group">
            <img
              src={heroImg}
              alt="Интерьер салона D&K Beauty"
              width={1200}
              height={1500}
              className="w-full h-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.04]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--plum)]/30 via-transparent to-transparent" />

            {/* Frosted glass card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.15, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="absolute bottom-6 md:bottom-8 -left-4 md:-left-10 max-w-[280px] bg-white/40 backdrop-blur-xl p-6 md:p-8 border border-white/50 shadow-2xl"
            >
              <p className="font-display italic text-2xl text-[var(--plum)] mb-2 leading-tight">
                Editorial Excellence
              </p>
              <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--plum)]/70 leading-snug">
                10 категорий услуг: от сложного окрашивания до профессиональной косметологии.
              </p>
            </motion.div>
          </div>

          {/* Secondary image detail */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.3, duration: 0.9 }}
            className="absolute -bottom-12 -right-2 lg:-right-6 w-1/3 aspect-square hidden md:block overflow-hidden border-[6px] md:border-8 border-[var(--ivory)] shadow-xl bg-white"
          >
            <img
              src={heroImg}
              alt=""
              aria-hidden
              className="w-full h-full object-cover scale-[1.4] -translate-y-6"
            />
          </motion.div>
        </motion.div>

        {/* Vertical scroll label */}
        <div className="absolute right-0 top-1/2 -rotate-90 origin-right translate-x-12 hidden xl:flex items-center gap-6 pointer-events-none">
          <span className="h-px w-24 bg-[var(--blush)]" />
          <span className="uppercase tracking-[0.4em] text-[var(--blush)] text-[10px]">
            Scroll for inspiration
          </span>
        </div>
      </div>
    </section>
  );
}
