import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";

const BARS = [
  { label: "Персонал", value: 90, count: "128 отзывов" },
  { label: "Стрижка", value: 76, count: "51 отзыв" },
  { label: "Компетентность", value: 96, count: "47 отзывов" },
  { label: "Маникюр", value: 89, count: "42 отзыва" },
  { label: "Атмосфера", value: 97, count: "32 отзыва" },
  { label: "Время ожидания", value: 79, count: "25 отзывов" },
  { label: "Окрашивание", value: 88, count: "16 отзывов" },
  { label: "Педикюр", value: 93, count: "14 отзывов" },
];

const REVIEWS = [
  { name: "Алина Ф.", date: "Май 2026", level: "Эксперт уровень 4", text: "Высокий профессионализм, уютная атмосфера и шикарные результаты! Маргарита — наращивание волос с точностью до мелочей. Бровист Марина — шикарные брови, быстро и качественно. Топ-мастер Дорина который год радует шикарными стрижками и окрашиванием — после неё волосы начали расти и стали гуще!" },
  { name: "Татьяна Шибаникова", date: "Апрель 2026", level: "Эксперт уровень 7", text: "Приветливый администратор — чай, кофе. Езжу из Серпухова к Дорине специально. Потрясающий блонд, стрижка супер, укладка без заморочек. Всем рекомендую!" },
  { name: "Елена Чистякова", date: "Февраль 2026", level: "Эксперт уровень 6", text: "В одном месте всё необходимое: топ-мастера маникюра, стилист Дорина, бровист Яна (коррекция, окрашивание, ламинирование, перманент), мастер по ресницам и косметолог. Администраторы всегда подберут удобное время и напомнят о записи." },
  { name: "Илья Б.", date: "Июнь 2026", level: "", text: "Мастер маникюра и педикюра Эля порадовала мастерством! Все девчонки в этом салоне работают на 100%. Так держать!" },
  { name: "Елена Терина", date: "Май 2026", level: "", text: "Лучшее место. Лучшие мастера. Кристиночка — боксёрские косы высшего класса. Талантливая, энергичная, профессиональная, аккуратная." },
];

function Counter({ to, decimals = 0, suffix = "" }: { to: number; decimals?: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const dur = 1500;
    const tick = (t: number) => {
      const p = Math.min((t - start) / dur, 1);
      setV(to * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, to]);
  return <span ref={ref}>{v.toFixed(decimals)}{suffix}</span>;
}

function Bar({ label, value, count }: { label: string; value: number; count: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  return (
    <div ref={ref}>
      <div className="flex justify-between text-sm mb-2">
        <span className="text-plum font-medium">{label}</span>
        <span className="text-muted-foreground">{value}% · {count}</span>
      </div>
      <div className="h-1.5 bg-[var(--mist)] rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={inView ? { width: `${value}%` } : {}}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{ background: "linear-gradient(90deg, var(--gold), var(--blush))" }}
        />
      </div>
    </div>
  );
}

export function Reviews() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % REVIEWS.length), 5500);
    return () => clearInterval(t);
  }, []);

  return (
    <section id="reviews" className="relative py-24 md:py-32 bg-[var(--mist)]/40 noise-overlay">
      <div className="max-w-7xl mx-auto px-5 lg:px-10">
        <div className="grid lg:grid-cols-12 gap-12 mb-16">
          <div className="lg:col-span-5">
            <div className="text-xs uppercase tracking-[0.25em] text-[var(--gold)] mb-4">Доверие клиентов</div>
            <h2 className="font-display text-plum leading-[1.05]" style={{ fontSize: "clamp(2rem, 5vw, 4rem)" }}>
              Отзывы клиентов
            </h2>
            <div className="mt-8 flex items-baseline gap-4">
              <div className="font-display text-7xl text-plum"><Counter to={4.9} decimals={1} /></div>
              <div className="flex flex-col">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-[var(--gold)] text-[var(--gold)]" />)}
                </div>
                <div className="text-sm text-muted-foreground mt-1"><Counter to={268} /> отзывов</div>
              </div>
            </div>
            <a href="https://yandex.ru/maps/org/dk_byuti/36772201301" target="_blank" rel="noopener noreferrer"
               className="mt-8 inline-flex items-center gap-2 text-sm text-plum border-b border-[var(--gold)] pb-1 hover:text-[var(--blush)] transition">
              Все отзывы на Яндекс Картах <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
          <div className="lg:col-span-7 grid sm:grid-cols-2 gap-x-8 gap-y-5">
            {BARS.map((b, i) => <Bar key={i} {...b} />)}
          </div>
        </div>

        <div className="relative">
          <div className="overflow-hidden">
            <motion.div
              animate={{ x: `-${idx * 100}%` }}
              transition={{ type: "spring", stiffness: 60, damping: 18 }}
              className="flex"
            >
              {REVIEWS.map((r, i) => (
                <div key={i} className="min-w-full px-2">
                  <div className="bg-white rounded-3xl p-8 md:p-12 border border-[var(--mist)] shadow-[0_30px_60px_-30px_rgba(44,26,46,0.2)] max-w-3xl mx-auto">
                    <div className="flex gap-0.5 mb-5">
                      {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-[var(--gold)] text-[var(--gold)]" />)}
                    </div>
                    <p className="text-lg md:text-xl text-[var(--ink)] leading-relaxed font-display italic">«{r.text}»</p>
                    <div className="mt-7 flex items-center gap-4">
                      <div className="w-11 h-11 rounded-full flex items-center justify-center font-display text-white" style={{ background: "linear-gradient(135deg, var(--blush), var(--gold))" }}>
                        {r.name[0]}
                      </div>
                      <div>
                        <div className="font-medium text-plum">{r.name}</div>
                        <div className="text-xs text-muted-foreground">{r.date}{r.level && ` · ${r.level}`}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          <div className="flex justify-center gap-3 mt-8">
            <button onClick={() => setIdx((idx - 1 + REVIEWS.length) % REVIEWS.length)} className="w-11 h-11 rounded-full border border-[var(--plum)]/20 text-plum flex items-center justify-center hover:bg-plum hover:text-white transition">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              {REVIEWS.map((_, i) => (
                <button key={i} onClick={() => setIdx(i)} className={`h-1.5 rounded-full transition-all ${i === idx ? "w-8 bg-[var(--blush)]" : "w-1.5 bg-[var(--mist)]"}`} />
              ))}
            </div>
            <button onClick={() => setIdx((idx + 1) % REVIEWS.length)} className="w-11 h-11 rounded-full border border-[var(--plum)]/20 text-plum flex items-center justify-center hover:bg-plum hover:text-white transition">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
