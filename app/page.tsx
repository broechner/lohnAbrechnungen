"use client";

import { useState } from "react";
import { Button } from "../ui/Button";
import { getString } from "../ui/i18n";
import { useLocale } from "../ui/useLocale";

const DashboardPage = () => {
  const { locale } = useLocale();
  const [period, setPeriod] = useState("2026-01");
  const [hours, setHours] = useState("4.25");

  return (
    <div className="space-y-8">
      <section className="rounded-xl bg-accent-gradient p-[1px] shadow-lg">
        <div className="rounded-[11px] bg-neutral-900/70 p-6">
          <h1 className="text-2xl font-semibold">{getString(locale, "dashboardTitle")}</h1>
          <p className="mt-2 text-sm text-neutral-300">
            {getString(locale, "employeePicker")}: Rebecca Siegfried (Demo)
          </p>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        <div className="rounded-xl bg-neutral-900/70 p-6">
          <h2 className="text-lg font-semibold">{getString(locale, "quickHours")}</h2>
          <label className="mt-4 block text-sm text-neutral-400">
            {getString(locale, "period")}
            <input
              className="mt-2 w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2"
              type="month"
              value={period}
              onChange={(event) => setPeriod(event.target.value)}
            />
          </label>
          <label className="mt-4 block text-sm text-neutral-400">
            {getString(locale, "hours")}
            <input
              className="mt-2 w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2"
              type="number"
              step="0.01"
              value={hours}
              onChange={(event) => setHours(event.target.value)}
            />
          </label>
          <div className="mt-4 text-xs text-neutral-400">
            Demo: {period} · {hours}h
          </div>
        </div>

        <div className="rounded-xl bg-neutral-900/70 p-6">
          <h2 className="text-lg font-semibold">{getString(locale, "generateSlip")}</h2>
          <p className="mt-2 text-sm text-neutral-400">
            One-click flow: employee → hours → payslip.
          </p>
          <Button className="mt-6 w-full">{getString(locale, "generateSlip")}</Button>
        </div>

        <div className="rounded-xl bg-neutral-900/70 p-6">
          <h2 className="text-lg font-semibold">{getString(locale, "exportShare")}</h2>
          <div className="mt-4 space-y-3">
            <Button className="w-full">{getString(locale, "exportPdf")}</Button>
            <Button className="w-full">{getString(locale, "mailDraft")}</Button>
            <Button className="w-full">{getString(locale, "shareWhatsapp")}</Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
