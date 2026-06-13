import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Row = { name: string; price: string };
type Tab = { id: string; label: string; note?: string; rows: Row[]; cta?: { label: string; href: string } };

const TABS: Tab[] = [
  { id: "nails", label: "Маникюр и педикюр", rows: [
    { name: "Маникюр женский классический", price: "1 300 ₽" },
    { name: "Комбинированный маникюр", price: "1 300 ₽" },
    { name: "Аппаратный маникюр", price: "1 500 ₽" },
    { name: "Аппаратный маникюр + гель-лак", price: "2 500 ₽" },
    { name: "Маникюр мужской", price: "1 500 ₽" },
    { name: "Японский маникюр", price: "2 200 ₽" },
    { name: "Покрытие гель-лаком (без маникюра)", price: "1 000 ₽" },
    { name: "Покрытие обычным лаком", price: "500 ₽" },
    { name: "Обновление топом", price: "500 ₽" },
    { name: "Снятие гель-лака с приданием формы", price: "800 ₽" },
    { name: "Снятие геля с приданием формы", price: "1 000 ₽" },
    { name: "Ремонт / донаращивание ногтя", price: "от 100 ₽" },
    { name: "Дизайн", price: "от 100 ₽" },
    { name: "Моделирование (короткие/средние/длинные)", price: "3 000 ₽" },
    { name: "Моделирование выкладной френч", price: "6 000 ₽" },
    { name: "Коррекция гелем (короткие/средние/длинные)", price: "2 700 ₽" },
    { name: "Коррекция гелем — выкладной френч", price: "5 500 ₽" },
    { name: "Моделирование (готический миндаль)", price: "8 500 ₽" },
    { name: "Педикюр полная обработка без покрытия", price: "3 000 ₽" },
    { name: "Педикюр обработка пальцев + покрытие", price: "3 000 ₽" },
    { name: "Педикюр обработка пальцев без покрытия", price: "2 500 ₽" },
    { name: "Smart педикюр мужской", price: "4 000 ₽" },
  ]},
  { id: "hair", label: "Стрижки", rows: [
    { name: "Стрижка женская (короткие волосы)", price: "1 500 ₽" },
    { name: "Стрижка женская (ведущий мастер)", price: "3 000 ₽" },
    { name: "Стрижка кончиков", price: "1 500 ₽" },
    { name: "Стрижка кончиков (ведущий мастер)", price: "1 500 ₽" },
    { name: "Стрижка чёлки (ведущий мастер)", price: "500 ₽" },
    { name: "Стрижка детская", price: "1 000 ₽" },
    { name: "Мужская модельная стрижка (ведущий мастер)", price: "1 500 ₽" },
    { name: "Стрижка 2 насадки", price: "700 ₽" },
    { name: "Окантовка волос", price: "200 ₽" },
    { name: "Окантовка бороды", price: "500 ₽" },
    { name: "Оформление бороды", price: "600 ₽" },
    { name: "Рисунок", price: "200 ₽" },
    { name: "Ранний выход (до 9:00)", price: "+500 ₽" },
  ]},
  { id: "color", label: "Окрашивание", note: "Все цены указаны без учёта расхода краски.", rows: [
    { name: "Окрашивание в один тон", price: "от 5 000 ₽" },
    { name: "Окрашивание корней", price: "от 4 000 ₽" },
    { name: "Тонирование волос", price: "от 4 000 ₽" },
    { name: "Мелирование + тонирование", price: "от 5 000 ₽" },
    { name: "Осветление корней + тонирование", price: "от 6 000 ₽" },
    { name: "Осветление полностью", price: "от 5 000 ₽" },
    { name: "Осветление + окрашивание прядей", price: "от 2 000 ₽" },
    { name: "Растяжка цвета", price: "от 6 000 ₽" },
    { name: "Выход из красного", price: "от 5 000 ₽" },
    { name: "Выход из чёрного", price: "от 5 000 ₽" },
    { name: "Сложное окрашивание (Air Touch, шатуш, балаяж, омбре) — короткие", price: "6 000 ₽" },
    { name: "Сложное окрашивание — средние", price: "7 000 ₽" },
    { name: "Сложное окрашивание — длинные", price: "9 000 ₽" },
  ]},
  { id: "style", label: "Укладки и причёски", rows: [
    { name: "Мытьё + сушка по форме", price: "1 000 ₽" },
    { name: "Укладка прямые", price: "1 500 ₽" },
    { name: "Укладка кудри", price: "2 500 ₽" },
    { name: "Афро-кудри", price: "2 500 ₽" },
    { name: "Причёска", price: "2 500 ₽" },
    { name: "Детокс кожи головы", price: "1 500 ₽" },
    { name: "Зеркальный блеск", price: "2 000 ₽" },
    { name: "Мицелярное тонирование с цветом", price: "2 000 ₽" },
    { name: "Молекулярный уход", price: "1 500 ₽" },
    { name: "Протеиновый коктейль с цветом", price: "500 ₽" },
    { name: "Цветовая баня", price: "500 ₽" },
    { name: "Ботокс для волос", price: "3 000 ₽" },
  ]},
  { id: "care", label: "Уходы для волос", rows: [
    { name: "Маска от Estel", price: "300 ₽" },
    { name: "Маска от Matrix", price: "500 ₽" },
    { name: "Протеиновый коктейль", price: "500 ₽" },
    { name: "Маска Loreal Curl Expression", price: "500 ₽" },
    { name: "Маска Loreal Pro Longer", price: "1 500 ₽" },
    { name: "Уход Маска Loreal Vitamino Color", price: "500 ₽" },
    { name: "Маска-уход Loreal Metal Detox", price: "1 000 ₽" },
    { name: "Loreal пролонгер уход", price: "1 000 ₽" },
    { name: "Уход Estel Remount", price: "800 ₽" },
    { name: "Уход пептидный от Estel", price: "1 000 ₽" },
    { name: "Уход FILLER Technology от Estel", price: "1 000 ₽" },
    { name: "Collagen + уход", price: "800 ₽" },
    { name: "Экранирование волос", price: "1 000 ₽" },
    { name: "Уход Absolut Repair", price: "1 500 ₽" },
  ]},
  { id: "brows", label: "Брови и ресницы", rows: [
    { name: "Коррекция воском", price: "700 ₽" },
    { name: "Коррекция пинцетом", price: "700 ₽" },
    { name: "Коррекция воском + окрашивание краской", price: "1 400 ₽" },
    { name: "Коррекция пинцетом + окрашивание краской", price: "1 100 ₽" },
    { name: "Окрашивание бровей", price: "700 ₽" },
    { name: "Окрашивание хной", price: "1 000 ₽" },
    { name: "Скраб + коррекция + окрашивание + маска", price: "1 800 ₽" },
    { name: "SPA для бровей", price: "600 ₽" },
    { name: "Долговременная укладка бровей (без окрашивания)", price: "1 500 ₽" },
    { name: "Ламинирование бровей", price: "2 400 ₽" },
    { name: "Коррекция бровей (мужчины)", price: "800 ₽" },
    { name: "Верхняя губа (депиляция)", price: "300 ₽" },
    { name: "Подбородок (депиляция)", price: "400 ₽" },
    { name: "Депиляция нос", price: "300 ₽" },
    { name: "Окрашивание ресниц", price: "600 ₽" },
    { name: "Ламинирование ресниц", price: "2 400 ₽" },
    { name: "Наращивание ресниц Классика (1D)", price: "2 400 ₽" },
    { name: "Наращивание ресниц 1,5D", price: "2 600 ₽" },
    { name: "Наращивание ресниц 2D", price: "2 800 ₽" },
    { name: "Наращивание ресниц 2,5D", price: "3 000 ₽" },
    { name: "Наращивание ресниц 3D", price: "3 200 ₽" },
    { name: "Наращивание ресниц 3,5D", price: "3 400 ₽" },
    { name: "Цветные пучки (дизайн)", price: "от 500 ₽" },
    { name: "Лучики", price: "от 500 ₽" },
    { name: "Коррекция наращивания ресниц", price: "1 200 ₽" },
    { name: "Снятие наращенных ресниц", price: "700 ₽" },
  ]},
  { id: "cosm", label: "Косметология", rows: [
    { name: "Чистка лица", price: "3 000 ₽" },
    { name: "Чистка лица + пилинг", price: "5 000 ₽" },
    { name: "УЗ-чистка", price: "2 000 ₽" },
    { name: "УЗ-чистка + карбокситерапия", price: "4 000 ₽" },
    { name: "Лифтинг-массаж лица", price: "2 000 ₽" },
    { name: "Лифтинг-массаж + антивозрастной уход", price: "3 500 ₽" },
    { name: "Лифтинг-массаж + коллагеновый уход", price: "4 500 ₽" },
    { name: "Лифтинг-массаж + пилинг", price: "5 000 ₽" },
    { name: "Фарфоровая куколка + уход Janssen", price: "2 500 ₽" },
    { name: "Уходы по типу лица", price: "3 500 ₽" },
    { name: "Ретиноловый пилинг (жёлтый)", price: "5 000 ₽" },
    { name: "Карбокситерапия Elivon", price: "2 500 ₽" },
    { name: "Мезотерапия головы DERMA Heal HL", price: "4 000 ₽" },
    { name: "Биоревитализация Refaltis Lift (лицо+шея)", price: "8 000 ₽" },
    { name: "Биоревитализация Реви Ай (зона глаз)", price: "9 000 ₽" },
    { name: "Вакуумный массаж New Turbo 8G", price: "1 000 ₽" },
    { name: "Вибромассаж New Turbo 8G", price: "1 900 ₽" },
  ]},
  { id: "inj", label: "Инъекции (Анна В.)", rows: [
    { name: "Биоревитализация BIO Prospect", price: "6 500 ₽" },
    { name: "Мезотерапия", price: "5 000 ₽" },
    { name: "Мезотерапия глаз Refaltis Eye", price: "4 500 ₽" },
    { name: "Мезо головы Bio Cascade", price: "6 500 ₽" },
    { name: "Мезо головы F-Hair", price: "3 000 ₽" },
    { name: "Мезо головы HairSystem", price: "5 000 ₽" },
    { name: "Карбокситерапия", price: "2 700 ₽" },
    { name: "Миндальный пилинг", price: "2 500 ₽" },
    { name: "Жёлтый пилинг", price: "5 000 ₽" },
    { name: "Пилинг Biorepil", price: "3 500 ₽" },
    { name: "Комбинированная чистка лица", price: "3 000 ₽" },
    { name: "УЗ-чистка", price: "2 000 ₽" },
    { name: "УЗ-чистка + карбокситерапия", price: "4 000 ₽" },
    { name: "Лифтинг-массаж лица", price: "2 500 ₽" },
    { name: "Микротоки (+ сыворотка, маска, крем)", price: "2 500 ₽" },
    { name: "Экспресс-уход (массаж + альгинатная маска)", price: "2 500 ₽" },
  ]},
  { id: "sugar", label: "Шугаринг", rows: [
    { name: "Верхняя губа", price: "500 ₽" },
    { name: "Лицо", price: "500 ₽" },
    { name: "Белая линия живота", price: "200 ₽" },
    { name: "Подмышечная впадина", price: "650 ₽" },
    { name: "Бикини классика", price: "1 200 ₽" },
    { name: "Бикини глубокое", price: "2 000 ₽" },
    { name: "Руки до локтя", price: "750 ₽" },
    { name: "Руки полностью", price: "1 000 ₽" },
    { name: "Ноги до колена", price: "800 ₽" },
    { name: "Ноги полностью", price: "1 400 ₽" },
  ]},
  { id: "shop", label: "Продажа косметики", note: "В наличии: L'Oréal Professionnel, Matrix, Estel, Ollin, ARAVIA, GENEVIE, LUXURY 5. Цены от 300 ₽ до 6 500 ₽.", rows: [], cta: { label: "Узнать наличие в WhatsApp", href: "https://wa.me/+79775772229" } },
];

export function Services() {
  const [active, setActive] = useState(TABS[0].id);
  const tab = TABS.find((t) => t.id === active)!;

  return (
    <section id="services" className="relative py-24 md:py-32 noise-overlay">
      <div className="max-w-7xl mx-auto px-5 lg:px-10">
        <div className="text-xs uppercase tracking-[0.25em] text-[var(--gold)] mb-4">Прейскурант</div>
        <h2 className="font-display text-plum leading-[1.05] mb-12" style={{ fontSize: "clamp(2rem, 5vw, 4rem)" }}>
          Услуги и цены
        </h2>

        <div className="flex gap-2 overflow-x-auto pb-3 mb-10 -mx-5 px-5 lg:mx-0 lg:px-0 scrollbar-thin">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setActive(t.id)}
              className={`relative whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-medium transition ${active === t.id ? "text-white" : "text-plum hover:text-[var(--blush)] bg-[var(--mist)]"}`}
            >
              {active === t.id && (
                <motion.span layoutId="tab-pill" className="absolute inset-0 rounded-full bg-[var(--blush)]" transition={{ type: "spring", stiffness: 350, damping: 30 }} />
              )}
              <span className="relative z-10">{t.label}</span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={tab.id}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35 }}
            className="bg-white rounded-3xl border border-[var(--mist)] overflow-hidden"
          >
            {tab.note && (
              <div className="px-6 md:px-10 py-4 bg-[var(--mist)]/60 text-sm text-[var(--ink)]/75 italic">{tab.note}</div>
            )}
            {tab.rows.length > 0 && (
              <div>
                {tab.rows.map((r, i) => (
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
            {tab.cta && (
              <div className="px-6 md:px-10 py-8 flex justify-center">
                <a href={tab.cta.href} target="_blank" rel="noopener noreferrer" className="shimmer-btn inline-flex items-center justify-center rounded-full bg-[var(--blush)] text-white px-7 py-3.5 text-sm font-medium">
                  {tab.cta.label}
                </a>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
