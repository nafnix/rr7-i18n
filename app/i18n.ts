import type { InitOptions } from "i18next";

export const loadPath = "locales/{{lng}}/{{ns}}.json";

export const locales = {
  zh: { name: "中文", iso: "" },
  en: { name: "English", iso: "" },
};

export const i18nInitOptions = {
  supportedLngs: Object.keys(locales),
  fallbackLng: "en",
  defaultNS: "common",
  nsSeparator: ".",
  keySeparator: ".",
  ns: ["common", "glossary", "validation"],
  react: { useSuspense: false },
  backend: { loadPath: `/${loadPath}` },
} satisfies InitOptions;
