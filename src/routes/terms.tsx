import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Пользовательское соглашение — D&K Beauty" },
      { name: "description", content: "Условия использования сайта D&K Beauty." },
      { property: "og:title", content: "Пользовательское соглашение — D&K Beauty" },
      { property: "og:url", content: "/terms" },
    ],
    links: [{ rel: "canonical", href: "/terms" }],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <div className="min-h-screen bg-[var(--ivory)] text-[var(--ink)]">
      <div className="max-w-3xl mx-auto px-5 lg:px-10 py-16 md:py-24">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-plum hover:text-[var(--blush)] transition mb-10">
          <ArrowLeft className="w-4 h-4" /> На главную
        </Link>
        <div className="text-xs uppercase tracking-[0.25em] text-[var(--gold)] mb-4">Правовая информация</div>
        <h1 className="font-display text-plum text-4xl md:text-6xl leading-tight mb-10">Пользовательское соглашение</h1>

        <ul className="space-y-5 text-[var(--ink)]/85 leading-relaxed">
          <li className="flex gap-3"><span className="text-[var(--gold)] mt-1">✦</span><span>Использование сайта означает принятие настоящих условий в полном объёме.</span></li>
          <li className="flex gap-3"><span className="text-[var(--gold)] mt-1">✦</span><span>Сайт носит исключительно информационный характер.</span></li>
          <li className="flex gap-3"><span className="text-[var(--gold)] mt-1">✦</span><span>Цены, указанные на сайте, являются справочными. Актуальные цены уточняйте у администратора.</span></li>
          <li className="flex gap-3"><span className="text-[var(--gold)] mt-1">✦</span><span>Запись через сайт является предварительной и подтверждается администратором по телефону.</span></li>
          <li className="flex gap-3"><span className="text-[var(--gold)] mt-1">✦</span><span>Организация не несёт ответственности за технические перебои в работе сайта.</span></li>
        </ul>
      </div>
    </div>
  );
}
