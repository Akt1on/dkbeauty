import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="bg-[var(--plum)] text-[var(--ivory)] pt-20 pb-10 relative noise-overlay">
      <div className="max-w-7xl mx-auto px-5 lg:px-10">
        <div className="grid md:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          <div className="md:col-span-5">
            <div className="font-display text-3xl">D<span className="text-[var(--gold)]">&</span>K Beauty</div>
            <p className="text-white/70 mt-4 max-w-sm leading-relaxed">Салон красоты в мкр. Губернский, Чехов. Все услуги в одном месте — от стрижек до косметологии.</p>
            <div className="flex gap-3 mt-6">
              <a href="https://wa.me/+79775772229" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#25D366] flex items-center justify-center transition">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M20.52 3.48A12 12 0 0 0 3.46 20.4L2 22l1.66-1.43A12 12 0 1 0 20.52 3.48Z"/></svg>
              </a>
              <a href="https://max.ru/+79775772229" target="_blank" rel="noopener noreferrer" aria-label="MAX" className="w-10 h-10 rounded-full bg-white/10 hover:bg-[var(--blush)] flex items-center justify-center transition text-sm font-bold">M</a>
            </div>
          </div>

          <div className="md:col-span-3 md:border-l md:border-white/10 md:pl-8">
            <div className="text-xs uppercase tracking-wider text-[var(--gold)] mb-4">Навигация</div>
            <ul className="space-y-2 text-white/80">
              <li><a href="#services" className="hover:text-white transition">Услуги</a></li>
              <li><a href="#masters" className="hover:text-white transition">Мастера</a></li>
              <li><a href="#reviews" className="hover:text-white transition">Отзывы</a></li>
              <li><a href="#booking" className="hover:text-white transition">Записаться</a></li>
              <li><a href="#contacts" className="hover:text-white transition">Контакты</a></li>
            </ul>
          </div>

          <div className="md:col-span-4 md:border-l md:border-white/10 md:pl-8">
            <div className="text-xs uppercase tracking-wider text-[var(--gold)] mb-4">Контакты</div>
            <div className="space-y-2 text-white/80 text-sm">
              <div>г. Чехов, мкр. Губернский, ул. Земская, 18</div>
              <a href="tel:+79775772229" className="block hover:text-white transition">+7 (977) 577-22-29</a>
              <div>Ежедневно 9:00 – 21:00</div>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-xs text-white/60">
          <div>© 2025 D&K Beauty. Дорина Николаевна Зеленко. Все права защищены.</div>
          <div className="flex gap-5">
            <Link to="/privacy" className="hover:text-white transition">Политика конфиденциальности</Link>
            <Link to="/terms" className="hover:text-white transition">Пользовательское соглашение</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
