"use client";

import { useState } from "react";
import { useLocale } from "../../ui/useLocale";
import { getString } from "../../ui/i18n";
import { Button } from "../../ui/Button";

type ReportResponse = {
  period: string;
  totals: {
    grossWageRappen: number;
    netWageRappen: number;
    roundedNetWageRappen: number;
    deductions: Record<string, number>;
  };
  totalsByEmployee: Record<string, { grossWageRappen: number; roundedNetWageRappen: number }>;
  runCount: number;
};

const toCurrency = (rappen: number, locale: "de" | "en") =>
  new Intl.NumberFormat(locale === "de" ? "de-CH" : "en-GB", {
    style: "currency",
    currency: "CHF"
  }).format(rappen / 100);

const ReportsPage = () => {
  const { locale } = useLocale();
  const [period, setPeriod] = useState(new Date().toISOString().slice(0, 7));
  const [report, setReport] = useState<ReportResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadReport = async () => {
    setError(null);
    const response = await fetch(`/api/reports?period=${encodeURIComponent(period)}&format=json`, {
      cache: "no-store"
    });

    if (!response.ok) {
      setError("Failed to load report.");
      return;
    }

    setReport((await response.json()) as ReportResponse);
  };

  const downloadReport = async (format: "csv" | "pdf") => {
    const response = await fetch(
      `/api/reports?period=${encodeURIComponent(period)}&format=${format}&locale=${locale}`,
      { cache: "no-store" }
    );

    if (!response.ok) {
      setError("Failed to export report.");
      return;
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `report-${period}.${format}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">{getString(locale, "reports")}</h1>
      {error ? <p className="text-sm text-rose-300">{error}</p> : null}

      <section className="rounded-xl bg-neutral-900/70 p-6">
        <div className="flex flex-wrap items-center gap-3">
          <input
            className="rounded border border-neutral-700 bg-neutral-950 px-3 py-2"
            type="month"
            value={period}
            onChange={(event) => setPeriod(event.target.value)}
          />
          <Button onClick={() => void loadReport()}>{getString(locale, "refresh")}</Button>
          <Button className="bg-neutral-700 hover:bg-neutral-600" onClick={() => void downloadReport("csv")}>Export CSV</Button>
          <Button className="bg-neutral-700 hover:bg-neutral-600" onClick={() => void downloadReport("pdf")}>Export PDF</Button>
        </div>
      </section>

      <section className="rounded-xl bg-neutral-900/70 p-6">
        <h2 className="mb-4 text-lg font-semibold">Period summary</h2>
        {!report ? <p className="text-sm text-neutral-400">Load a period to view totals.</p> : null}
        {report ? (
          <div className="space-y-2 text-sm">
            <p>Runs: {report.runCount}</p>
            <p>Gross: {toCurrency(report.totals.grossWageRappen, locale)}</p>
            <p>Net: {toCurrency(report.totals.netWageRappen, locale)}</p>
            <p>Rounded payout: {toCurrency(report.totals.roundedNetWageRappen, locale)}</p>
            <div className="mt-3 rounded border border-neutral-800 p-3">
              <p className="mb-2 font-medium">Deductions</p>
              {Object.entries(report.totals.deductions).map(([label, value]) => (
                <p key={label}>{label}: {toCurrency(value, locale)}</p>
              ))}
              {Object.keys(report.totals.deductions).length === 0 ? <p className="text-neutral-400">No deductions in this period.</p> : null}
            </div>
          </div>
        ) : null}
      </section>

      <section className="rounded-xl bg-neutral-900/70 p-6">
        <h2 className="mb-4 text-lg font-semibold">By employee</h2>
        {report ? (
          <div className="space-y-2">
            {Object.entries(report.totalsByEmployee).map(([name, values]) => (
              <div key={name} className="rounded border border-neutral-800 px-3 py-2 text-sm">
                {name}: Gross {toCurrency(values.grossWageRappen, locale)} · Payout {toCurrency(values.roundedNetWageRappen, locale)}
              </div>
            ))}
            {Object.keys(report.totalsByEmployee).length === 0 ? <p className="text-sm text-neutral-400">No employee totals for this period.</p> : null}
          </div>
        ) : (
          <p className="text-sm text-neutral-400">No report loaded.</p>
        )}
      </section>
    </div>
  );
};

export default ReportsPage;
