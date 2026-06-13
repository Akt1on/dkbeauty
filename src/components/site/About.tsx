import { motion } from "framer-motion";
import { Gift, Dog, Accessibility, Sparkles } from "lucide-react";

const FACTS = [
  { icon: Sparkles, title: "Один адрес — все услуги", text: "Парикмахер, маникюр, косметолог, бровист — всё здесь" },
  { icon: Gift, title: "Подарочные сертификаты", text: "Отличный подарок для близких" },
  { icon: Dog, title: "Можно с собакой", text: "Берём питомцев — ждём вас обоих" },
  { icon: Accessibility, title: "Пандус", text: "Удобный вход для всех гостей" },
];

export function About() {
  return (
    <section className="relative py-24 md:py-32 noise-overlay">
      <div className="max-w-7xl mx-auto px-5 lg:px-10 grid lg:grid-cols-12 gap-12">
        <motion.div
          initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
          className="lg:col-span-7"
        >
          <div className="text-xs uppercase tracking-[0.25em] text-[var(--gold)] mb-5">О салоне</div>
          <h2 className="font-display text-plum leading-[1.05]" style={{ fontSize: "clamp(2rem, 5vw, 4rem)" }}>
            Салон полного цикла<br />в сердце Губернского
          </h2>
          <p className="mt-7 text-lg text-[var(--ink)]/80 leading-relaxed max-w-2xl">
            D&K Beauty — салон полного цикла в микрорайоне Губернский. Стрижки и окрашивание, маникюр и педикюр, наращивание ресниц и волос, косметология, шугаринг и уходы для волос.
          </p>
          <p className="mt-4 text-lg text-[var(--ink)]/80 leading-relaxed max-w-2xl">
            Все специалисты в одном месте — от ведущего мастера-стилиста до косметолога. Приветливые администраторы, чай и кофе — как дома.
          </p>
        </motion.div>

        <div className="lg:col-span-5 grid sm:grid-cols-2 gap-5">
          {FACTS.map((F, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              whileHover={{ y: -4 }}
              className="bg-[var(--mist)] rounded-2xl p-6 border border-transparent hover:border-[var(--gold)] hover:shadow-[0_20px_40px_-20px_rgba(184,147,90,0.4)] transition-all"
            >
              <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center mb-4">
                <F.icon className="w-5 h-5 text-[var(--gold)]" />
              </div>
              <div className="font-display text-lg text-plum leading-tight">{F.title}</div>
              <div className="text-sm text-[var(--ink)]/70 mt-2 leading-relaxed">{F.text}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
