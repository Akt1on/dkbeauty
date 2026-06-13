import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Политика конфиденциальности — D&K Beauty" },
      { name: "description", content: "Политика обработки персональных данных D&K Beauty согласно 152-ФЗ." },
      { property: "og:title", content: "Политика конфиденциальности — D&K Beauty" },
      { property: "og:url", content: "/privacy" },
    ],
    links: [{ rel: "canonical", href: "/privacy" }],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[var(--ivory)] text-[var(--ink)]">
      <div className="max-w-3xl mx-auto px-5 lg:px-10 py-16 md:py-24">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-plum hover:text-[var(--blush)] transition mb-10">
          <ArrowLeft className="w-4 h-4" /> На главную
        </Link>
        <div className="text-xs uppercase tracking-[0.25em] text-[var(--gold)] mb-4">Правовая информация</div>
        <h1 className="font-display text-plum text-4xl md:text-6xl leading-tight mb-10">Политика конфиденциальности</h1>

        <div className="prose prose-neutral max-w-none space-y-7 text-[var(--ink)]/85 leading-relaxed">
          <section>
            <h2 className="font-display text-2xl text-plum mb-3">1. Оператор персональных данных</h2>
            <p>ИП Зеленко Дорина Николаевна, ИНН 504814289760.<br/>
            Адрес: Московская область, г. Чехов, мкр. Губернский, ул. Земская, 18.<br/>
            Телефон: <a href="tel:+79775772229" className="underline">+7 (977) 577-22-29</a>.</p>
          </section>
          <section>
            <h2 className="font-display text-2xl text-plum mb-3">2. Собираемые данные</h2>
            <p>Имя, номер телефона.</p>
          </section>
          <section>
            <h2 className="font-display text-2xl text-plum mb-3">3. Цель обработки</h2>
            <p>Запись на услуги, обратная связь с клиентом.</p>
          </section>
          <section>
            <h2 className="font-display text-2xl text-plum mb-3">4. Правовое основание</h2>
            <p>ст. 6 ч. 1 п. 1 Федерального закона № 152-ФЗ «О персональных данных».</p>
          </section>
          <section>
            <h2 className="font-display text-2xl text-plum mb-3">5. Срок хранения</h2>
            <p>До отзыва согласия субъектом персональных данных.</p>
          </section>
          <section>
            <h2 className="font-display text-2xl text-plum mb-3">6. Передача третьим лицам</h2>
            <p>Не осуществляется.</p>
          </section>
          <section>
            <h2 className="font-display text-2xl text-plum mb-3">7. Права субъекта</h2>
            <p>Доступ к данным, исправление, удаление, отзыв согласия.</p>
          </section>
          <section>
            <h2 className="font-display text-2xl text-plum mb-3">8. Способ отзыва согласия</h2>
            <p>Звонок на номер <a href="tel:+79775772229" className="underline">+7 (977) 577-22-29</a>.</p>
          </section>
          <section>
            <h2 className="font-display text-2xl text-plum mb-3">9. Дата обновления</h2>
            <p>1 января 2025 г.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
