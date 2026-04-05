"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "../../ui/Button";
import { getString } from "../../ui/i18n";
import { useLocale } from "../../ui/useLocale";

type TimeEntryOption = {
  id: string;
  period: string;
  workDate: string;
  employee: {
    firstName: string;
    lastName: string;
  };
};

type PayslipRun = {
  id: string;
  period: string;
  createdAt: string;
  employee: {
    firstName: string;
    lastName: string;
  };
};

const PayslipsPage = () => {
  const { locale } = useLocale();
  const [entries, setEntries] = useState<TimeEntryOption[]>([]);
  const [runs, setRuns] = useState<PayslipRun[]>([]);
  const [selectedEntryId, setSelectedEntryId] = useState("");
  const [error, setError] = useState<string | null>(null);

  const sortedRuns = useMemo(
    () => [...runs].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [runs]
  );

  const loadData = useCallback(async () => {
    setError(null);
    const [entriesResponse, runsResponse] = await Promise.all([
      fetch("/api/time-entries", { cache: "no-store" }),
      fetch("/api/payslips", { cache: "no-store" })
    ]);

    if (!entriesResponse.ok || !runsResponse.ok) {
      setError("Could not load payslip data.");
      return;
    }

    const entriesData = (await entriesResponse.json()) as TimeEntryOption[];
    const runsData = (await runsResponse.json()) as PayslipRun[];
    setEntries(entriesData);
    setRuns(runsData);
    setSelectedEntryId((previous) => {
      if (!previous && entriesData.length > 0) {
        return entriesData[0].id;
      }

      return previous;
    });
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const generatePayslip = async () => {
    if (!selectedEntryId) {
      setError("Select a time entry first.");
      return;
    }

    const response = await fetch("/api/payroll", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        timeEntryId: selectedEntryId,
        locale
      })
    });

    if (!response.ok) {
      setError("Failed to generate payslip.");
      return;
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `payslip-${new Date().toISOString().slice(0, 10)}.pdf`;
    link.click();
    URL.revokeObjectURL(url);

    await loadData();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">{getString(locale, "payslips")}</h1>
      {error ? <p className="text-sm text-rose-300">{error}</p> : null}

      <section className="rounded-xl bg-neutral-900/70 p-6">
        <h2 className="mb-4 text-lg font-semibold">Generate payslip</h2>
        <div className="flex flex-wrap items-center gap-3">
          <select
            className="min-w-72 rounded border border-neutral-700 bg-neutral-950 px-3 py-2"
            value={selectedEntryId}
            onChange={(event) => setSelectedEntryId(event.target.value)}
          >
            <option value="">Select time entry</option>
            {entries.map((entry) => (
              <option key={entry.id} value={entry.id}>
                {entry.employee.firstName} {entry.employee.lastName} · {entry.period} · {entry.workDate.slice(0, 10)}
              </option>
            ))}
          </select>
          <Button onClick={() => void generatePayslip()}>{getString(locale, "generateSlip")}</Button>
          <Button className="bg-neutral-700 hover:bg-neutral-600" onClick={() => void loadData()}>{getString(locale, "refresh")}</Button>
        </div>
      </section>

      <section className="rounded-xl bg-neutral-900/70 p-6">
        <h2 className="mb-4 text-lg font-semibold">Payslip history</h2>
        <div className="space-y-2">
          {sortedRuns.map((run) => (
            <div key={run.id} className="rounded border border-neutral-800 px-3 py-2 text-sm">
              {run.employee.firstName} {run.employee.lastName} · {run.period} · {new Date(run.createdAt).toLocaleString()}
            </div>
          ))}
          {sortedRuns.length === 0 ? <p className="text-sm text-neutral-400">No payslips generated yet.</p> : null}
        </div>
      </section>
    </div>
  );
};

export default PayslipsPage;
