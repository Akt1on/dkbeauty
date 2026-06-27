import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { listPublicServices } from "@/lib/public-content.functions";

// Per-category presentation metadata (notes + CTA buttons). Pricing comes from DB.
const META: Record<string, { note?: string; cta?: { label: string; href: string } }> = {
  "Окрашивание": { note: "Все цены указаны без учёта расхода краски." },
  "Продажа косметики": {
    note: "В наличии: L'Oréal Professionnel, Matrix, Estel, Ollin, ARAVIA, GENEVIE, LUXURY 5. Цены от 300 ₽ до 6 500 ₽.",
    cta: { label: "Узнать наличие в WhatsApp", href: "https://wa.me/+79775772229" },
  },
};

const ORDER = [
  "Маникюр и педикюр", "Стрижки", "Окрашивание", "Укладки и причёски",
  "Уходы для волос", "Брови и ресницы", "Косметология", "Инъекции (Анна В.)",
  "Шугаринг", "Продажа косметики",
];

export function Services() {
  const fetchSvc = useServerFn(listPublicServices);
  const { data = [] } = useQuery({ queryKey: ["public-services"], queryFn: () => fetchSvc(), staleTime: 60_000 });

  const tabs = useMemo(() => {
    const groups = new Map<string, { name: string; price: string }[]>();
    for (const row of data) {
      const arr = groups.get(row.category) ?? [];
      arr.push({ name: row.name, price: row.price });
      groups.set(row.category, arr);
    }
    const known = ORDER.filter((c) => groups.has(c) || META[c]);
    const extras = [...groups.keys()].filter((c) => !ORDER.includes(c));
    return [...known, ...extras].map((category) => ({
      id: category,
      label: category,
      rows: groups.get(category) ?? [],
      note: META[category]?.note,
      cta: META[category]?.cta,
    }));
  }, [data]);

  const [active, setActive] = useState<string | null>(null);
  const current = tabs.find((t) => t.id === active) ?? tabs[0];

  if (!current) {
    return (
      <section id="services" className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-5 lg:px-10 text-center text-[var(--ink)]/60">
          Загружаем прайс-лист…
        </div>
      </section>
    );
  }

  return (
    <section id="services" className="relative py-24 md:py-32 noise-overlay">
      <div className="max-w-7xl mx-auto px-5 lg:px-10">
        <div className="text-xs uppercase tracking-[0.25em] text-[var(--gold)] mb-4">Прейскурант</div>
        <h2 className="font-display text-plum leading-[1.05] mb-12" style={{ fontSize: "clamp(2rem, 5vw, 4rem)" }}>
          Услуги и цены
        </h2>

        <div className="flex gap-2 overflow-x-auto pb-3 mb-10 -mx-5 px-5 lg:mx-0 lg:px-0 scrollbar-thin">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActive(t.id)}
              className={`relative whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-medium transition ${current.id === t.id ? "text-white" : "text-plum hover:text-[var(--blush)] bg-[var(--mist)]"}`}
            >
              {current.id === t.id && (
                <motion.span layoutId="tab-pill" className="absolute inset-0 rounded-full bg-[var(--blush)]" transition={{ type: "spring", stiffness: 350, damping: 30 }} />
              )}
              <span className="relative z-10">{t.label}</span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35 }}
            className="bg-white rounded-3xl border border-[var(--mist)] overflow-hidden"
          >
            {current.note && (
              <div className="px-6 md:px-10 py-4 bg-[var(--mist)]/60 text-sm text-[var(--ink)]/75 italic">{current.note}</div>
            )}
            {current.rows.length > 0 && (
              <div>
                {current.rows.map((r, i) => (
                  <div
                    key={i}
                    className={`flex items-center justify-between gap-4 px-6 md:px-10 py-4 border-b border-[var(--mist)] last:border-0 hover:bg-[var(--ivory)] transition ${i % 2 === 1 ? "bg-[#F5F0EB]/40" : ""}`}
                  >
                    <span className="text-sm md:text-base text-[var(--ink)]">{r.name}</span>
                    <span className="text-sm md:text-base font-medium text-plum whitespace-nowrap">{r.price}</span>
                  </div>
                ))}
              </div>
            )}
            {current.cta && (
              <div className="px-6 md:px-10 py-8 flex justify-center">
                <a href={current.cta.href} target="_blank" rel="noopener noreferrer" className="shimmer-btn inline-flex items-center justify-center rounded-full bg-[var(--blush)] text-white px-7 py-3.5 text-sm font-medium">
                  {current.cta.label}
                </a>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
