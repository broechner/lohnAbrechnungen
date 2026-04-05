"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale } from "../../ui/useLocale";
import { getString } from "../../ui/i18n";
import { Button } from "../../ui/Button";

type EmployeeDto = {
  id: string;
  firstName: string;
  lastName: string;
  street: string;
  zip: string;
  city: string;
  country: string;
  dateOfBirth: string;
  ahvNumber: string;
  createdAt: string;
};

const EmployeesPage = () => {
  const { locale } = useLocale();
  const [employees, setEmployees] = useState<EmployeeDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    street: "",
    zip: "",
    city: "",
    country: "CH",
    dateOfBirth: "",
    ahvNumber: ""
  });

  const sortedEmployees = useMemo(
    () => [...employees].sort((a, b) => `${a.lastName}${a.firstName}`.localeCompare(`${b.lastName}${b.firstName}`)),
    [employees]
  );

  const loadEmployees = async () => {
    setLoading(true);
    setError(null);
    const response = await fetch("/api/employees", { cache: "no-store" });
    if (!response.ok) {
      setError("Failed to load employees.");
      setLoading(false);
      return;
    }

    const data = (await response.json()) as EmployeeDto[];
    setEmployees(data);
    setLoading(false);
  };

  useEffect(() => {
    void loadEmployees();
  }, []);

  const resetForm = () => {
    setForm({
      firstName: "",
      lastName: "",
      street: "",
      zip: "",
      city: "",
      country: "CH",
      dateOfBirth: "",
      ahvNumber: ""
    });
    setEditingId(null);
  };

  const saveEmployee = async () => {
    setError(null);
    const endpoint = editingId ? `/api/employees/${editingId}` : "/api/employees";
    const method = editingId ? "PATCH" : "POST";

    const response = await fetch(endpoint, {
      method,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(form)
    });

    if (!response.ok) {
      setError("Could not save employee.");
      return;
    }

    resetForm();
    await loadEmployees();
  };

  const deleteEmployee = async (id: string) => {
    const response = await fetch(`/api/employees/${id}`, { method: "DELETE" });
    if (!response.ok) {
      setError("Could not delete employee.");
      return;
    }

    await loadEmployees();
  };

  const startEditing = (employee: EmployeeDto) => {
    setEditingId(employee.id);
    setForm({
      firstName: employee.firstName,
      lastName: employee.lastName,
      street: employee.street,
      zip: employee.zip,
      city: employee.city,
      country: employee.country,
      dateOfBirth: employee.dateOfBirth.slice(0, 10),
      ahvNumber: employee.ahvNumber
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">{getString(locale, "employees")}</h1>
      {error ? <p className="text-sm text-rose-300">{error}</p> : null}

      <div className="rounded-xl bg-neutral-900/70 p-6">
        <h2 className="mb-4 text-lg font-semibold">{editingId ? "Employee edit" : "New employee"}</h2>
        <div className="grid gap-3 md:grid-cols-2">
          <input className="rounded border border-neutral-700 bg-neutral-950 px-3 py-2" placeholder="First name" value={form.firstName} onChange={(event) => setForm((previous) => ({ ...previous, firstName: event.target.value }))} />
          <input className="rounded border border-neutral-700 bg-neutral-950 px-3 py-2" placeholder="Last name" value={form.lastName} onChange={(event) => setForm((previous) => ({ ...previous, lastName: event.target.value }))} />
          <input className="rounded border border-neutral-700 bg-neutral-950 px-3 py-2" placeholder="Street" value={form.street} onChange={(event) => setForm((previous) => ({ ...previous, street: event.target.value }))} />
          <input className="rounded border border-neutral-700 bg-neutral-950 px-3 py-2" placeholder="ZIP" value={form.zip} onChange={(event) => setForm((previous) => ({ ...previous, zip: event.target.value }))} />
          <input className="rounded border border-neutral-700 bg-neutral-950 px-3 py-2" placeholder="City" value={form.city} onChange={(event) => setForm((previous) => ({ ...previous, city: event.target.value }))} />
          <input className="rounded border border-neutral-700 bg-neutral-950 px-3 py-2" placeholder="Date of birth" type="date" value={form.dateOfBirth} onChange={(event) => setForm((previous) => ({ ...previous, dateOfBirth: event.target.value }))} />
          <input className="rounded border border-neutral-700 bg-neutral-950 px-3 py-2 md:col-span-2" placeholder="AHV number (756.XXXX.XXXX.XX)" value={form.ahvNumber} onChange={(event) => setForm((previous) => ({ ...previous, ahvNumber: event.target.value }))} />
        </div>
        <div className="mt-4 flex gap-3">
          <Button onClick={() => void saveEmployee()}>{getString(locale, "save")}</Button>
          {editingId ? (
            <Button className="bg-neutral-700 hover:bg-neutral-600" onClick={resetForm}>
              Cancel
            </Button>
          ) : null}
        </div>
      </div>

      <div className="rounded-xl bg-neutral-900/70 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Employees</h2>
          <Button className="bg-neutral-700 hover:bg-neutral-600" onClick={() => void loadEmployees()}>
            {getString(locale, "refresh")}
          </Button>
        </div>
        {loading ? <p className="text-sm text-neutral-300">Loading...</p> : null}
        <div className="space-y-2">
          {sortedEmployees.map((employee) => (
            <div key={employee.id} className="flex flex-wrap items-center justify-between gap-3 rounded border border-neutral-800 p-3">
              <div>
                <p className="font-medium">{employee.firstName} {employee.lastName}</p>
                <p className="text-xs text-neutral-400">{employee.ahvNumber} · {employee.zip} {employee.city}</p>
              </div>
              <div className="flex gap-2">
                <Button className="bg-neutral-700 hover:bg-neutral-600" onClick={() => startEditing(employee)}>Edit</Button>
                <Button className="bg-rose-700 hover:bg-rose-600" onClick={() => void deleteEmployee(employee.id)}>{getString(locale, "remove")}</Button>
              </div>
            </div>
          ))}
          {!loading && sortedEmployees.length === 0 ? <p className="text-sm text-neutral-400">No employees yet.</p> : null}
        </div>
      </div>
    </div>
  );
};

export default EmployeesPage;
