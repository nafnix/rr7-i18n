import { resolve } from "node:path";
import { i18nInitOptions, loadPath } from "~/i18n";

export const i18nServerInitOptions: typeof i18nInitOptions = {
  ...i18nInitOptions,
  backend: { loadPath: resolve("public", loadPath) },
};
