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
      <section className="rounded-[28px] bg-accent-gradient p-[1px] shadow-[0_24px_70px_rgba(1,112,193,0.22)]">
        <div className="brand-panel rounded-[27px] p-8">
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="brand-accent-text text-xs font-normal uppercase tracking-[0.28em]">abbi Payroll</p>
              <h1 className="mt-3 text-4xl font-light">{getString(locale, "dashboardTitle")}</h1>
              <p className="mt-3 max-w-2xl text-sm text-neutral-300">
                Schweizer Lohnabrechnung mit fokussiertem 1-Klick-Flow, klarer Historie und schneller Ausgabe als PDF.
              </p>
            </div>
            <div className="hidden rounded-3xl border border-[rgba(1,112,193,0.2)] bg-[rgba(255,255,255,0.03)] p-4 md:block">
              <svg viewBox="0 0 24 24" className="h-10 w-10 text-[rgba(126,185,229,0.95)]" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M4 19h16" />
                <path d="M6 15h12" />
                <path d="M6 10h7" />
                <circle cx="16.5" cy="10" r="2.5" fill="#ff5800" stroke="none" />
              </svg>
            </div>
          </div>
          <p className="mt-6 text-sm text-neutral-300">
            {getString(locale, "employeePicker")}: Rebecca Siegfried (Demo)
          </p>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        <div className="brand-panel rounded-3xl p-6">
          <h2 className="text-lg font-semibold">{getString(locale, "quickHours")}</h2>
          <label className="mt-4 block text-sm text-neutral-400">
            {getString(locale, "period")}
            <input
              className="mt-2 w-full rounded-2xl border border-[rgba(1,112,193,0.18)] bg-neutral-950/80 px-3 py-2"
              type="month"
              value={period}
              onChange={(event) => setPeriod(event.target.value)}
            />
          </label>
          <label className="mt-4 block text-sm text-neutral-400">
            {getString(locale, "hours")}
            <input
              className="mt-2 w-full rounded-2xl border border-[rgba(1,112,193,0.18)] bg-neutral-950/80 px-3 py-2"
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

        <div className="brand-panel rounded-3xl p-6">
          <h2 className="text-lg font-semibold">{getString(locale, "generateSlip")}</h2>
          <p className="mt-2 text-sm text-neutral-400">
            One-click flow: employee → hours → payslip.
          </p>
          <Button className="mt-6 w-full">{getString(locale, "generateSlip")}</Button>
        </div>

        <div className="brand-panel rounded-3xl p-6">
          <h2 className="text-lg font-semibold">{getString(locale, "exportShare")}</h2>
          <div className="mt-4 space-y-3">
            <Button className="w-full">{getString(locale, "exportPdf")}</Button>
            <Button className="w-full bg-[linear-gradient(135deg,#353535_0%,#212121_100%)] shadow-[0_10px_24px_rgba(0,0,0,0.2)] hover:shadow-[0_14px_28px_rgba(0,0,0,0.26)]">{getString(locale, "mailDraft")}</Button>
            <Button className="w-full bg-signal-gradient shadow-[0_12px_28px_rgba(255,88,0,0.28)]">{getString(locale, "shareWhatsapp")}</Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
