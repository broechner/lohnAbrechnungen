"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocale } from "../../ui/useLocale";
import { getString } from "../../ui/i18n";
import { Button } from "../../ui/Button";

type EmployeeOption = {
  id: string;
  firstName: string;
  lastName: string;
};

type ContractOption = {
  id: string;
  employeeId: string;
};

type TimeEntryDto = {
  id: string;
  employeeId: string;
  contractId: string;
  period: string;
  workDate: string;
  hoursWorked: number;
  bonusRappen: number;
  reimbursementRappen: number;
  deductionRappen: number;
  employee?: EmployeeOption;
};

const TimeEntriesPage = () => {
  const { locale } = useLocale();
  const [employees, setEmployees] = useState<EmployeeOption[]>([]);
  const [contracts, setContracts] = useState<ContractOption[]>([]);
  const [entries, setEntries] = useState<TimeEntryDto[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filterPeriod, setFilterPeriod] = useState(new Date().toISOString().slice(0, 7));
  const [form, setForm] = useState({
    employeeId: "",
    contractId: "",
    period: new Date().toISOString().slice(0, 7),
    workDate: new Date().toISOString().slice(0, 10),
    hoursWorked: 0,
    bonusRappen: 0,
    reimbursementRappen: 0,
    deductionRappen: 0
  });

  const filteredContracts = useMemo(
    () => contracts.filter((contract) => !form.employeeId || contract.employeeId === form.employeeId),
    [contracts, form.employeeId]
  );

  const sortedEntries = useMemo(
    () => [...entries].sort((a, b) => new Date(b.workDate).getTime() - new Date(a.workDate).getTime()),
    [entries]
  );

  const loadData = useCallback(async () => {
    const [employeesResponse, contractsResponse, entriesResponse] = await Promise.all([
      fetch("/api/employees", { cache: "no-store" }),
      fetch("/api/contracts", { cache: "no-store" }),
      fetch(`/api/time-entries?period=${encodeURIComponent(filterPeriod)}`, { cache: "no-store" })
    ]);

    if (!employeesResponse.ok || !contractsResponse.ok || !entriesResponse.ok) {
      setError("Failed to load time entry data.");
      return;
    }

    const employeesData = (await employeesResponse.json()) as EmployeeOption[];
    const contractsData = (await contractsResponse.json()) as Array<{ id: string; employeeId: string }>;
    const entriesData = (await entriesResponse.json()) as TimeEntryDto[];

    setEmployees(employeesData);
    setContracts(contractsData.map((contract) => ({ id: contract.id, employeeId: contract.employeeId })));
    setEntries(entriesData);
  }, [filterPeriod]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const saveEntry = async () => {
    setError(null);
    const endpoint = editingId ? `/api/time-entries/${editingId}` : "/api/time-entries";
    const method = editingId ? "PATCH" : "POST";

    const response = await fetch(endpoint, {
      method,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(form)
    });

    if (!response.ok) {
      setError("Could not save time entry.");
      return;
    }

    setEditingId(null);
    await loadData();
  };

  const editEntry = (entry: TimeEntryDto) => {
    setEditingId(entry.id);
    setForm({
      employeeId: entry.employeeId,
      contractId: entry.contractId,
      period: entry.period,
      workDate: entry.workDate.slice(0, 10),
      hoursWorked: entry.hoursWorked,
      bonusRappen: entry.bonusRappen,
      reimbursementRappen: entry.reimbursementRappen,
      deductionRappen: entry.deductionRappen
    });
  };

  const removeEntry = async (id: string) => {
    const response = await fetch(`/api/time-entries/${id}`, { method: "DELETE" });
    if (!response.ok) {
      setError("Could not delete time entry.");
      return;
    }

    await loadData();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">{getString(locale, "timeEntries")}</h1>
      {error ? <p className="text-sm text-rose-300">{error}</p> : null}

      <section className="rounded-xl bg-neutral-900/70 p-6">
        <h2 className="mb-4 text-lg font-semibold">Entry by date</h2>
        <div className="grid gap-3 md:grid-cols-2">
          <select className="rounded border border-neutral-700 bg-neutral-950 px-3 py-2" value={form.employeeId} onChange={(event) => setForm((previous) => ({ ...previous, employeeId: event.target.value, contractId: "" }))}>
            <option value="">Select employee</option>
            {employees.map((employee) => (
              <option key={employee.id} value={employee.id}>{employee.firstName} {employee.lastName}</option>
            ))}
          </select>
          <select className="rounded border border-neutral-700 bg-neutral-950 px-3 py-2" value={form.contractId} onChange={(event) => setForm((previous) => ({ ...previous, contractId: event.target.value }))}>
            <option value="">Select contract</option>
            {filteredContracts.map((contract) => (
              <option key={contract.id} value={contract.id}>{contract.id.slice(0, 8)}</option>
            ))}
          </select>
          <input className="rounded border border-neutral-700 bg-neutral-950 px-3 py-2" type="month" value={form.period} onChange={(event) => setForm((previous) => ({ ...previous, period: event.target.value }))} />
          <input className="rounded border border-neutral-700 bg-neutral-950 px-3 py-2" type="date" value={form.workDate} onChange={(event) => setForm((previous) => ({ ...previous, workDate: event.target.value }))} />
          <input className="rounded border border-neutral-700 bg-neutral-950 px-3 py-2" type="number" step="0.25" value={form.hoursWorked} onChange={(event) => setForm((previous) => ({ ...previous, hoursWorked: Number(event.target.value) }))} placeholder="Hours" />
          <input className="rounded border border-neutral-700 bg-neutral-950 px-3 py-2" type="number" value={form.bonusRappen} onChange={(event) => setForm((previous) => ({ ...previous, bonusRappen: Number(event.target.value) }))} placeholder="Bonus (rappen)" />
        </div>
        <div className="mt-4 flex gap-3">
          <Button onClick={() => void saveEntry()}>{getString(locale, "save")}</Button>
          {editingId ? <Button className="bg-neutral-700 hover:bg-neutral-600" onClick={() => setEditingId(null)}>Cancel</Button> : null}
        </div>
      </section>

      <section className="rounded-xl bg-neutral-900/70 p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">Historic values</h2>
          <input className="rounded border border-neutral-700 bg-neutral-950 px-3 py-2" type="month" value={filterPeriod} onChange={(event) => setFilterPeriod(event.target.value)} />
        </div>
        <div className="space-y-2">
          {sortedEntries.map((entry) => (
            <div key={entry.id} className="flex flex-wrap items-center justify-between gap-3 rounded border border-neutral-800 p-3">
              <div>
                <p className="font-medium">{entry.employee?.firstName} {entry.employee?.lastName} · {entry.hoursWorked.toFixed(2)}h</p>
                <p className="text-xs text-neutral-400">{entry.workDate.slice(0, 10)} · {entry.period}</p>
              </div>
              <div className="flex gap-2">
                <Button className="bg-neutral-700 hover:bg-neutral-600" onClick={() => editEntry(entry)}>Edit</Button>
                <Button className="bg-rose-700 hover:bg-rose-600" onClick={() => void removeEntry(entry.id)}>{getString(locale, "remove")}</Button>
              </div>
            </div>
          ))}
          {sortedEntries.length === 0 ? <p className="text-sm text-neutral-400">No entries for this period.</p> : null}
        </div>
      </section>
    </div>
  );
};

export default TimeEntriesPage;
