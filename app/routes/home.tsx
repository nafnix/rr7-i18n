import { useTranslation } from "react-i18next";
// import type { Route } from "./+types/home";

export function meta() {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  const { t } = useTranslation();

  return <div>{t("common.world")}</div>;
}
