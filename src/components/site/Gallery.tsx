import { useEffect, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { listPublicGallery } from "@/lib/public-content.functions";

import g1 from "@/assets/gallery/g1-nails.jpg";
import g2 from "@/assets/gallery/g2-hair.jpg";
import g3 from "@/assets/gallery/g3-lashes.jpg";
import g4 from "@/assets/gallery/g4-interior.jpg";
import g5 from "@/assets/gallery/g5-cosmetology.jpg";
import g6 from "@/assets/gallery/g6-products.jpg";

type Item = { src: string; alt: string };

const FALLBACK: Item[] = [
  { src: g1, alt: "Маникюр с нюдовым покрытием" },
  { src: g2, alt: "Окрашивание и укладка волос" },
  { src: g3, alt: "Наращивание ресниц и оформление бровей" },
  { src: g4, alt: "Интерьер салона D&K Beauty" },
  { src: g5, alt: "Косметологические процедуры" },
  { src: g6, alt: "Премиальная косметика" },
];

export function Gallery() {
  const fetchGal = useServerFn(listPublicGallery);
  const { data = [] } = useQuery({ queryKey: ["public-gallery"], queryFn: () => fetchGal(), staleTime: 60_000 });

  const ITEMS = useMemo<Item[]>(() => {
    if (data.length === 0) return FALLBACK;
    return data.map((r) => ({ src: r.image_url, alt: r.alt ?? "" }));
  }, [data]);

  const [idx, setIdx] = useState<number | null>(null);
  const close = useCallback(() => setIdx(null), []);
  const prev = useCallback(() => setIdx((i) => (i === null ? i : (i - 1 + ITEMS.length) % ITEMS.length)), [ITEMS.length]);
  const next = useCallback(() => setIdx((i) => (i === null ? i : (i + 1) % ITEMS.length)), [ITEMS.length]);

  useEffect(() => {
    if (idx === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [idx, close, prev, next]);

  return (
    <section id="gallery" className="relative py-24 md:py-32 noise-overlay">
      <div className="max-w-7xl mx-auto px-5 lg:px-10">
        <div className="flex items-end justify-between flex-wrap gap-6 mb-12">
          <div>
            <div className="text-xs uppercase tracking-[0.25em] text-[var(--gold)] mb-4">Портфолио</div>
            <h2 className="font-display text-plum leading-[1.05]" style={{ fontSize: "clamp(2rem, 5vw, 4rem)" }}>
              Работы и атмосфера
            </h2>
          </div>
          <p className="text-[var(--ink)]/70 max-w-md">
            Каждая работа — результат внимания к деталям и многолетнего опыта наших мастеров.
          </p>
        </div>

        <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 [column-fill:_balance]">
          {ITEMS.map((item, i) => (
            <motion.button
              key={`${item.src}-${i}`}
              onClick={() => setIdx(i)}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: (i % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="group mb-5 block w-full break-inside-avoid overflow-hidden rounded-2xl bg-[var(--mist)] relative cursor-zoom-in"
              aria-label={`Открыть фото: ${item.alt || "работа из портфолио"}`}
            >
              <img
                src={item.src}
                alt={item.alt}
                loading="lazy"
                decoding="async"
                className="w-full h-auto block transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-plum/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              {item.alt && (
                <div className="absolute bottom-0 left-0 right-0 p-5 text-white text-sm translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition duration-500">
                  {item.alt}
                </div>
              )}
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {idx !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] bg-plum/95 backdrop-blur-md flex items-center justify-center p-4"
            onClick={close}
          >
            <button onClick={close} className="absolute top-5 right-5 text-white/80 hover:text-white p-3" aria-label="Закрыть">
              <X className="w-7 h-7" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-3 md:left-8 text-white/80 hover:text-white p-3 rounded-full hover:bg-white/10 transition"
              aria-label="Предыдущее"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-3 md:right-8 text-white/80 hover:text-white p-3 rounded-full hover:bg-white/10 transition"
              aria-label="Следующее"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
            <motion.img
              key={idx}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              src={ITEMS[idx].src}
              alt={ITEMS[idx].alt}
              onClick={(e) => e.stopPropagation()}
              className="max-w-[92vw] max-h-[88vh] object-contain rounded-xl shadow-2xl"
            />
            <div className="absolute bottom-5 left-0 right-0 text-center text-white/80 text-sm pointer-events-none">
              {ITEMS[idx].alt} · {idx + 1} / {ITEMS.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
