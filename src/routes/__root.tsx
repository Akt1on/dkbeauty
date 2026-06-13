import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ivory px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-display text-plum">404</h1>
        <h2 className="mt-4 text-xl font-display text-plum">Страница не найдена</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Возможно, страница была перемещена или удалена.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-[var(--blush)] px-6 py-3 text-sm font-medium text-white transition hover:opacity-90"
          >
            На главную
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-ivory px-4">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-display text-plum">Что-то пошло не так</h1>
        <p className="mt-2 text-sm text-muted-foreground">Попробуйте обновить страницу.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="rounded-full bg-[var(--blush)] px-6 py-3 text-sm text-white"
          >
            Попробовать снова
          </button>
          <a href="/" className="rounded-full border border-[var(--plum)] px-6 py-3 text-sm text-plum">
            На главную
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "D&K Beauty — салон красоты в Губернском, Чехов" },
      { name: "description", content: "Салон красоты D&K Beauty в мкр. Губернский, Чехов. Стрижки, окрашивание, маникюр, косметология, наращивание ресниц и волос. Ежедневно 9:00–21:00." },
      { name: "author", content: "D&K Beauty" },
      { property: "og:title", content: "D&K Beauty — салон красоты в Губернском, Чехов" },
      { property: "og:description", content: "Салон красоты D&K Beauty в мкр. Губернский, Чехов. Стрижки, окрашивание, маникюр, косметология, наращивание ресниц и волос. Ежедневно 9:00–21:00." },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "D&K Beauty" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "D&K Beauty — салон красоты в Губернском, Чехов" },
      { name: "twitter:description", content: "Салон красоты D&K Beauty в мкр. Губернский, Чехов. Стрижки, окрашивание, маникюр, косметология, наращивание ресниц и волос. Ежедневно 9:00–21:00." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/7e3ce70a-f57f-4ac8-a54a-208475b54acd/id-preview-f1f8e201--b4ba1549-fd82-415b-84a1-777d3ff15390.lovable.app-1781332831037.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/7e3ce70a-f57f-4ac8-a54a-208475b54acd/id-preview-f1f8e201--b4ba1549-fd82-415b-84a1-777d3ff15390.lovable.app-1781332831037.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BeautySalon",
          name: "D&K Beauty",
          address: {
            "@type": "PostalAddress",
            streetAddress: "ул. Земская, 18",
            addressLocality: "Чехов",
            addressRegion: "Московская область",
            postalCode: "142300",
            addressCountry: "RU",
          },
          telephone: "+79775772229",
          openingHours: "Mo-Su 09:00-21:00",
          aggregateRating: { "@type": "AggregateRating", ratingValue: "4.9", reviewCount: "268" },
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}
