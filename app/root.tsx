import {
  type To,
  isRouteErrorResponse,
  Links,
  data,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import type { Route } from "./+types/root";
import "./app.css";
import { useTranslation } from "react-i18next";
import { i18nInitOptions } from "~/i18n";
import { locales } from "~/i18n";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

function I18nHTML({ children }: { children: React.ReactNode }) {
  const { i18n } = useTranslation();

  return (
    <html lang={i18n.language} dir={i18n.dir()}>
      {children}
    </html>
  );
}

export function HydrateFallback() {
  return (
    <I18nHTML>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
      </head>
      <body>
        <div
          // eslint-disable-next-line react-perf/jsx-no-new-object-as-prop
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          Loading...
        </div>
        <Scripts />
      </body>
    </I18nHTML>
  );
}

const changeLanguageKey = "lng";

export async function clientLoader({ request }: Route.LoaderArgs) {
  return data({
    locale:
      new URL(request.url).searchParams.get(changeLanguageKey) ||
      i18nInitOptions.fallbackLng,
  });
}

export default function Root() {
  return (
    <I18nHTML>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <ChangeLanguage />
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </I18nHTML>
  );
}

function ChangeLanguage() {
  const { i18n } = useTranslation();
  const links = Array.from(Object.entries(locales), ([locale, info], key) => ({
    label: info.name,
    to: {
      search: new URLSearchParams([[changeLanguageKey, locale]]).toString(),
    },
    value: locale,
    key,
  })) satisfies Array<{ label: string; to: To; key: number }>;

  function onClick(locale: string) {
    return () => i18n.changeLanguage(locale);
  }
  return (
    <section>
      <h3 className="text-2xl">Select language</h3>

      <ul>
        {links.map((i) => (
          <li key={i.key}>
            <button
              type="button"
              onClick={onClick(i.value)}
              className="cursor-pointer"
            >
              {i.label}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <I18nHTML>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <main className="container mx-auto p-4 pt-16">
          <h1>{message}</h1>
          <p>{details}</p>
          {stack && (
            <pre className="w-full overflow-x-auto p-4">
              <code>{stack}</code>
            </pre>
          )}
        </main>
        <ScrollRestoration />
        <Scripts />
      </body>
    </I18nHTML>
  );
}
