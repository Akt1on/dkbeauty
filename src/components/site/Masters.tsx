import { motion } from "framer-motion";

const MASTERS = [
  { name: "Дорина", role: "Топ-мастер, стилист", quote: "Золотые руки — волосы начинают расти и укладываться. Едут из Серпухова специально к ней", initials: "Д" },
  { name: "Маргарита", role: "Наращивание волос", quote: "Подробно объяснит уход, посадит капсулы незаметно, исправит тон", initials: "М" },
  { name: "Марина", role: "Бровист", quote: "Шикарные брови — быстро и очень качественно", initials: "М" },
  { name: "Кристина", role: "Причёски и косоплетение", quote: "Таланты без границ — боксёрские косы, вечерние образы", initials: "К" },
  { name: "Эля", role: "Маникюр и педикюр", quote: "Работает на 100 процентов — все клиентки в восторге", initials: "Э" },
  { name: "Яна", role: "Бровист", quote: "Коррекция, окрашивание, ламинирование и перманентный макияж", initials: "Я" },
  { name: "Анна В.", role: "Инъекционная косметология", quote: "Биоревитализация, мезотерапия, карбокситерапия, пилинги", initials: "А" },
  { name: "Косметолог", role: "Аппаратная и уходовая косметология", quote: "Чистки, уходы по типу кожи, микротоки, лифтинг-массаж", initials: "К" },
];

export function Masters() {
  return (
    <section id="masters" className="relative py-24 md:py-32 bg-[var(--mist)]/40 noise-overlay">
      <div className="max-w-7xl mx-auto px-5 lg:px-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <div className="text-xs uppercase tracking-[0.25em] text-[var(--gold)] mb-4">Команда</div>
            <h2 className="font-display text-plum leading-[1.05]" style={{ fontSize: "clamp(2rem, 5vw, 4rem)" }}>
              Наши мастера
            </h2>
          </div>
          <p className="text-[var(--ink)]/70 max-w-md">Каждый специалист — со своей экспертизой и постоянным потоком клиентов, многие приезжают из соседних городов.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {MASTERS.map((m, i) => (
            <motion.article
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: (i % 4) * 0.08, duration: 0.6 }}
              whileHover={{ y: -6 }}
              className="group bg-white rounded-3xl p-7 border border-[var(--mist)] hover:border-[var(--gold)] transition-all hover:shadow-[0_30px_60px_-30px_rgba(44,26,46,0.3)]"
            >
              <div className="relative w-24 h-24 mb-5">
                <div className="absolute inset-0 rounded-full" style={{ background: "linear-gradient(135deg, var(--gold) 0%, var(--gold-soft) 100%)" }} />
                <div className="absolute inset-0 rounded-full flex items-center justify-center font-display text-white text-3xl">
                  {m.initials}
                </div>
                <div className="absolute inset-0 rounded-full ring-1 ring-[var(--gold)]/30 ring-offset-4 ring-offset-white opacity-0 group-hover:opacity-100 transition" />
              </div>
              <div className="font-display text-xl text-plum">{m.name}</div>
              <div className="text-xs uppercase tracking-wider text-[var(--gold)] mt-1">{m.role}</div>
              <p className="text-sm text-[var(--ink)]/75 mt-4 leading-relaxed">«{m.quote}»</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
