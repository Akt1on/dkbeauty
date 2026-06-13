import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";

export function CookieBanner() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!localStorage.getItem("cookie_accepted")) {
      const t = setTimeout(() => setShow(true), 800);
      return () => clearTimeout(t);
    }
  }, []);
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-4 left-4 right-4 md:left-6 md:right-auto md:max-w-md z-50 bg-white border border-[var(--mist)] rounded-2xl shadow-2xl p-5"
        >
          <p className="text-sm text-[var(--ink)] leading-relaxed">
            Мы используем файлы cookie. Продолжая использование сайта, вы соглашаетесь с Политикой конфиденциальности.
          </p>
          <div className="flex gap-3 mt-4">
            <button
              onClick={() => { localStorage.setItem("cookie_accepted", "1"); setShow(false); }}
              className="rounded-full bg-[var(--blush)] text-white px-5 py-2 text-sm font-medium"
            >Принять</button>
            <Link to="/privacy" className="rounded-full border border-[var(--plum)] text-plum px-5 py-2 text-sm">Подробнее</Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
