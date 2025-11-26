import eslintReact from "@eslint-react/eslint-plugin";
import js from "@eslint/js";
import json from "@eslint/json";
import markdown from "@eslint/markdown";
import { defineConfig } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import reactPerfPlugin from "eslint-plugin-react-perf";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default defineConfig(
  [
    {
      files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
      plugins: { js },
      extends: [
        "js/recommended",
        eslintReact.configs["recommended-typescript"],
      ],
    },
    {
      files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
      languageOptions: { globals: globals.browser },
    },
    tseslint.configs.recommended,
    {
      files: ["**/*.json"],
      plugins: { json },
      language: "json/json",
      extends: ["json/recommended"],
    },
    {
      files: ["**/*.md"],
      plugins: { markdown },
      language: "markdown/gfm",
      extends: ["markdown/recommended"],
    },
    reactHooks.configs.flat["recommended-latest"],
    // reactRefresh.configs.recommended,
    reactPerfPlugin.configs.flat.recommended,
  ],
  { ignores: [".react-router"] },
  compat.extends("prettier"),
);
