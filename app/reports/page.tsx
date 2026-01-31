"use client";

import { useLocale } from "../../ui/useLocale";
import { getString } from "../../ui/i18n";

const ReportsPage = () => {
  const { locale } = useLocale();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">{getString(locale, "reports")}</h1>
      <div className="rounded-xl bg-neutral-900/70 p-6">
        <p className="text-sm text-neutral-300">Jahresübersicht für Lohndeklaration (Demoansicht).</p>
      </div>
    </div>
  );
};

export default ReportsPage;
