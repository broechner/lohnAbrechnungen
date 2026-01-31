"use client";

import { useLocale } from "../../ui/useLocale";
import { getString } from "../../ui/i18n";

const SettingsPage = () => {
  const { locale } = useLocale();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">{getString(locale, "employerSettings")}</h1>
      <div className="rounded-xl bg-neutral-900/70 p-6">
        <p className="text-sm text-neutral-300">
          Arbeitgeberdaten werden hier gepflegt und auf die Lohnabrechnungen übernommen.
        </p>
      </div>
    </div>
  );
};

export default SettingsPage;
