import { motion } from "framer-motion";
import { MapPin, Phone, Clock, MessageCircle, Bus, ParkingCircle, Accessibility, Dog, Gift, Wifi } from "lucide-react";

const FEATURES = [
  { icon: Bus, text: "Остановка «Поворот на Репниково» — 202 м, маршрут № 4" },
  { icon: ParkingCircle, text: "Парковка" },
  { icon: Accessibility, text: "Пандус" },
  { icon: Dog, text: "Можно с собакой" },
  { icon: Gift, text: "Подарочные сертификаты" },
  { icon: Wifi, text: "Wi-Fi" },
];

export function Contacts() {
  return (
    <section id="contacts" className="relative py-24 md:py-32 noise-overlay">
      <div className="max-w-7xl mx-auto px-5 lg:px-10">
        <div className="text-xs uppercase tracking-[0.25em] text-[var(--gold)] mb-4">Контакты</div>
        <h2 className="font-display text-plum leading-[1.05] mb-12" style={{ fontSize: "clamp(2rem, 5vw, 4rem)" }}>
          Как нас найти
        </h2>

        <div className="grid lg:grid-cols-2 gap-10">
          <motion.div
            initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
            className="space-y-6"
          >
            <div className="bg-white border border-[var(--mist)] rounded-2xl p-6 flex items-start gap-4">
              <MapPin className="w-5 h-5 text-[var(--gold)] mt-1 shrink-0" />
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">Адрес</div>
                <div className="text-plum font-medium mt-1">г. Чехов, мкр. Губернский, ул. Земская, 18</div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <a href="tel:+79775772229" className="bg-white border border-[var(--mist)] rounded-2xl p-6 flex items-start gap-4 hover:border-[var(--gold)] transition">
                <Phone className="w-5 h-5 text-[var(--gold)] mt-1 shrink-0" />
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">Телефон</div>
                  <div className="text-plum font-medium mt-1">+7 (977) 577-22-29</div>
                </div>
              </a>
              <div className="bg-white border border-[var(--mist)] rounded-2xl p-6 flex items-start gap-4">
                <Clock className="w-5 h-5 text-[var(--gold)] mt-1 shrink-0" />
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">Режим работы</div>
                  <div className="text-plum font-medium mt-1">Ежедневно 9:00 – 21:00</div>
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <a href="https://wa.me/+79775772229" target="_blank" rel="noopener noreferrer" className="bg-white border border-[var(--mist)] rounded-2xl p-6 flex items-start gap-4 hover:border-[#25D366] transition">
                <MessageCircle className="w-5 h-5 text-[#25D366] mt-1 shrink-0" />
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">WhatsApp</div>
                  <div className="text-plum font-medium mt-1">Написать</div>
                </div>
              </a>
              <a href="https://max.ru/+79775772229" target="_blank" rel="noopener noreferrer" className="bg-white border border-[var(--mist)] rounded-2xl p-6 flex items-start gap-4 hover:border-[var(--blush)] transition">
                <MessageCircle className="w-5 h-5 text-[var(--blush)] mt-1 shrink-0" />
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">MAX / ВКонтакте</div>
                  <div className="text-plum font-medium mt-1">Написать</div>
                </div>
              </a>
            </div>

            <div className="bg-[var(--mist)]/50 rounded-2xl p-6">
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-4">Удобства</div>
              <div className="grid sm:grid-cols-2 gap-3">
                {FEATURES.map((f, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-sm text-[var(--ink)]">
                    <f.icon className="w-4 h-4 text-[var(--gold)] mt-0.5 shrink-0" />
                    <span>{f.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
            className="rounded-3xl overflow-hidden border border-[var(--mist)] min-h-[500px] bg-[var(--mist)]"
          >
            <iframe
              src="https://yandex.ru/map-widget/v1/?ll=37.466%2C55.131&z=15&pt=37.466%2C55.131%2Cpm2rdm"
              title="Карта"
              width="100%"
              height="100%"
              style={{ minHeight: 500, border: 0 }}
              loading="lazy"
              allowFullScreen
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
