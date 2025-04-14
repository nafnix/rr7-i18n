import { resolve } from "node:path";
import { RemixI18Next } from "remix-i18next/server";
import { i18nInitOptions, loadPath } from "~/i18n";

export const i18nServerInitOptions: typeof i18nInitOptions = {
  ...i18nInitOptions,
  backend: { loadPath: resolve("public", loadPath) },
};

export default new RemixI18Next({
  detection: {
    supportedLanguages: i18nServerInitOptions.supportedLngs as string[],
    fallbackLanguage: i18nServerInitOptions.fallbackLng as string,
  },
  // This is the configuration for i18next used when translating messages server-side only
  i18next: { ...i18nServerInitOptions },
});
