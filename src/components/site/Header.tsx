import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const NAV = [
  { href: "#services", label: "Услуги" },
  { href: "#gallery", label: "Галерея" },
  { href: "#masters", label: "Мастера" },
  { href: "#reviews", label: "Отзывы" },
  { href: "#contacts", label: "Контакты" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 30);
      setHidden(y > 200 && y > lastY);
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      animate={{ y: hidden ? -100 : 0 }}
      transition={{ duration: 0.3 }}
      className={`fixed top-0 inset-x-0 z-50 transition-all ${scrolled ? "bg-[var(--ivory)]/90 backdrop-blur-md" : "bg-[var(--ivory)]"}`}
    >
      <div className="max-w-7xl mx-auto px-5 lg:px-10 flex items-center justify-between h-[72px]">
        <Link to="/" className="font-display text-plum tracking-tight" style={{ fontSize: scrolled ? "1.35rem" : "1.6rem", transition: "font-size .3s" }}>
          D<span className="text-[var(--gold)]">&</span>K Beauty
        </Link>

        <nav className="hidden lg:flex items-center gap-9">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} className="text-sm text-[var(--ink)] hover:text-[var(--blush)] transition relative group">
              {n.label}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-[var(--gold)] transition-all group-hover:w-full" />
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a href="tel:+79775772229" className="hidden md:flex items-center gap-2 text-sm text-plum hover:text-[var(--blush)] transition">
            <Phone className="w-4 h-4 text-[var(--gold)]" />
            +7 (977) 577-22-29
          </a>
          <a href="#booking" className="hidden sm:inline-flex shimmer-btn items-center justify-center rounded-full bg-[var(--blush)] text-white px-5 py-2.5 text-sm font-medium hover:bg-[#b88f8f] transition shadow-[0_4px_20px_-6px_rgba(201,160,160,0.6)]">
            Записаться
          </a>
          <button onClick={() => setOpen(!open)} className="lg:hidden p-2 text-plum" aria-label="Меню">
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>
      <div className="gold-divider" />

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="lg:hidden bg-[var(--ivory)] border-b border-[var(--border)] overflow-hidden"
          >
            <div className="px-5 py-6 flex flex-col gap-4">
              {NAV.map((n) => (
                <a key={n.href} href={n.href} onClick={() => setOpen(false)} className="text-base text-plum py-2 border-b border-[var(--mist)]">
                  {n.label}
                </a>
              ))}
              <a href="tel:+79775772229" className="text-base text-plum">+7 (977) 577-22-29</a>
              <a href="#booking" onClick={() => setOpen(false)} className="text-center rounded-full bg-[var(--blush)] text-white px-5 py-3 font-medium mt-2">
                Записаться онлайн
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
