import {
  type To,
  isRouteErrorResponse,
  Links,
  data,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  Link,
} from "react-router";
import { useChangeLanguage } from "remix-i18next/react";
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

export async function clientLoader({ request }: Route.LoaderArgs) {
  return data({
    locale:
      new URL(request.url).searchParams.get(changeLanguageKey) ||
      i18nInitOptions.fallbackLng,
  });
}

export function Layout({ children }: { children: React.ReactNode }) {
  const { i18n } = useTranslation();

  return (
    <html lang={i18n.language} dir={i18n.dir()}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

const changeLanguageKey = "lng";

export default function App({ loaderData }: Route.ComponentProps) {
  useChangeLanguage(loaderData.locale);

  const links = Array.from(Object.entries(locales), ([locale, info], key) => ({
    label: info.name,
    to: {
      search: new URLSearchParams([[changeLanguageKey, locale]]).toString(),
    },
    key,
  })) satisfies Array<{ label: string; to: To; key: number }>;

  return (
    <>
      <section>
        <h3 className="text-2xl">search params</h3>

        <ul>
          {links.map((i) => (
            <li key={i.key}>
              <Link to={i.to}>{i.label}</Link>
            </li>
          ))}
        </ul>
      </section>

      <Outlet />
    </>
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
    <main className="container mx-auto p-4 pt-16">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full overflow-x-auto p-4">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
