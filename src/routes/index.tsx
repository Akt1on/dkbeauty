import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { About } from "@/components/site/About";
import { Masters } from "@/components/site/Masters";
import { Services } from "@/components/site/Services";
import { Reviews } from "@/components/site/Reviews";
import { Booking } from "@/components/site/Booking";
import { Contacts } from "@/components/site/Contacts";
import { Footer } from "@/components/site/Footer";
import { WhatsAppFloat } from "@/components/site/WhatsAppFloat";
import { ScrollProgress } from "@/components/site/ScrollProgress";
import { CookieBanner } from "@/components/site/CookieBanner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "D&K Beauty — салон красоты в Губернском, Чехов" },
      { name: "description", content: "Стрижки, окрашивание, маникюр, косметология, наращивание ресниц и волос. Ежедневно 9:00–21:00. Ул. Земская, 18, Чехов." },
      { property: "og:title", content: "D&K Beauty — салон красоты в Чехове" },
      { property: "og:description", content: "Топ-мастера, 4.9 ★, 268 отзывов. Запишитесь онлайн." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

function Home() {
  return (
    <div className="bg-[var(--ivory)] text-[var(--ink)]">
      <ScrollProgress />
      <Header />
      <main>
        <Hero />
        <About />
        <Masters />
        <Services />
        <Reviews />
        <Booking />
        <Contacts />
      </main>
      <Footer />
      <WhatsAppFloat />
      <CookieBanner />
    </div>
  );
}
