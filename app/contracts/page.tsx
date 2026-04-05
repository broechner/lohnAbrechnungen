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

type ContractDocument = {
  id: string;
  filename: string;
  sizeBytes: number;
};

type ContractDto = {
  id: string;
  employeeId: string;
  startDate: string;
  endDate: string | null;
  hourlyWageRappen: number;
  vacationPayRateBps: number;
  employee: EmployeeOption;
  documents: ContractDocument[];
};

const ContractsPage = () => {
  const { locale } = useLocale();
  const [contracts, setContracts] = useState<ContractDto[]>([]);
  const [employees, setEmployees] = useState<EmployeeOption[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadContractId, setUploadContractId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    employeeId: "",
    startDate: "",
    endDate: "",
    hourlyWageRappen: 3500,
    monthlySalaryRappen: null as number | null,
    vacationPayIncluded: false,
    vacationPayRateBps: 833,
    ahvIveoRateBps: 530,
    alvRateBps: 110,
    additionalDeductionLabel: "",
    additionalDeductionRateBps: null as number | null,
    quellensteuerEnabled: false,
    quellensteuerRateBps: null as number | null,
    roundingIncrementRappen: 5
  });

  const employeeOptions = useMemo(
    () => employees.map((employee) => ({ value: employee.id, label: `${employee.firstName} ${employee.lastName}` })),
    [employees]
  );

  const loadData = useCallback(async () => {
    const [employeesResponse, contractsResponse] = await Promise.all([
      fetch("/api/employees", { cache: "no-store" }),
      fetch("/api/contracts", { cache: "no-store" })
    ]);

    if (!employeesResponse.ok || !contractsResponse.ok) {
      setError("Failed to load contract data.");
      return;
    }

    const employeeData = (await employeesResponse.json()) as EmployeeOption[];
    const contractData = (await contractsResponse.json()) as ContractDto[];
    setEmployees(employeeData);
    setContracts(contractData);
    setForm((previous) => {
      if (!previous.employeeId && employeeData.length > 0) {
        return { ...previous, employeeId: employeeData[0].id };
      }

      return previous;
    });
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const createContract = async () => {
    setError(null);
    if (!form.employeeId) {
      setError("Select an employee first.");
      return;
    }

    const response = await fetch("/api/contracts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        endDate: form.endDate || null,
        additionalDeductionLabel: form.additionalDeductionLabel || null
      })
    });

    if (!response.ok) {
      setError("Could not create contract.");
      return;
    }

    await loadData();
  };

  const uploadDocument = async () => {
    if (!uploadContractId || !selectedFile) {
      setError("Select a contract and file first.");
      return;
    }

    const formData = new FormData();
    formData.append("contractId", uploadContractId);
    formData.append("file", selectedFile);

    const response = await fetch("/api/contracts/upload", {
      method: "POST",
      body: formData
    });

    if (!response.ok) {
      setError("Failed to upload contract document.");
      return;
    }

    setSelectedFile(null);
    await loadData();
  };

  const removeContract = async (id: string) => {
    const response = await fetch(`/api/contracts/${id}`, { method: "DELETE" });
    if (!response.ok) {
      setError("Failed to delete contract.");
      return;
    }

    await loadData();
  };

  const deleteDocument = async (id: string) => {
    const response = await fetch(`/api/contracts/documents/${id}`, { method: "DELETE" });
    if (!response.ok) {
      setError("Failed to delete document.");
      return;
    }

    await loadData();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">{getString(locale, "contracts")}</h1>
      {error ? <p className="text-sm text-rose-300">{error}</p> : null}

      <section className="rounded-xl bg-neutral-900/70 p-6">
        <h2 className="mb-4 text-lg font-semibold">Create contract</h2>
        <div className="grid gap-3 md:grid-cols-2">
          <select className="rounded border border-neutral-700 bg-neutral-950 px-3 py-2" value={form.employeeId} onChange={(event) => setForm((previous) => ({ ...previous, employeeId: event.target.value }))}>
            <option value="">Select employee</option>
            {employeeOptions.map((employee) => (
              <option key={employee.value} value={employee.value}>{employee.label}</option>
            ))}
          </select>
          <input className="rounded border border-neutral-700 bg-neutral-950 px-3 py-2" type="date" value={form.startDate} onChange={(event) => setForm((previous) => ({ ...previous, startDate: event.target.value }))} />
          <input className="rounded border border-neutral-700 bg-neutral-950 px-3 py-2" type="number" value={form.hourlyWageRappen} onChange={(event) => setForm((previous) => ({ ...previous, hourlyWageRappen: Number(event.target.value) }))} placeholder="Hourly wage (rappen)" />
          <input className="rounded border border-neutral-700 bg-neutral-950 px-3 py-2" type="number" value={form.vacationPayRateBps} onChange={(event) => setForm((previous) => ({ ...previous, vacationPayRateBps: Number(event.target.value) }))} placeholder="Vacation BPS" />
        </div>
        <Button className="mt-4" onClick={() => void createContract()}>{getString(locale, "save")}</Button>
      </section>

      <section className="rounded-xl bg-neutral-900/70 p-6">
        <h2 className="mb-4 text-lg font-semibold">Contract capture (upload)</h2>
        <div className="grid gap-3 md:grid-cols-3">
          <select className="rounded border border-neutral-700 bg-neutral-950 px-3 py-2" value={uploadContractId ?? ""} onChange={(event) => setUploadContractId(event.target.value || null)}>
            <option value="">Select contract</option>
            {contracts.map((contract) => (
              <option key={contract.id} value={contract.id}>{contract.employee.firstName} {contract.employee.lastName} ({contract.id.slice(0, 8)})</option>
            ))}
          </select>
          <input className="rounded border border-neutral-700 bg-neutral-950 px-3 py-2" type="file" onChange={(event) => setSelectedFile(event.target.files?.[0] ?? null)} />
          <Button onClick={() => void uploadDocument()}>{getString(locale, "upload")}</Button>
        </div>
      </section>

      <div className="rounded-xl bg-neutral-900/70 p-6">
        <h2 className="mb-4 text-lg font-semibold">Contracts</h2>
        <div className="space-y-3">
          {contracts.map((contract) => (
            <div key={contract.id} className="rounded border border-neutral-800 p-4">
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <p className="font-medium">{contract.employee.firstName} {contract.employee.lastName} · {Math.round(contract.hourlyWageRappen / 100)} CHF/h</p>
                <Button className="bg-rose-700 hover:bg-rose-600" onClick={() => void removeContract(contract.id)}>{getString(locale, "remove")}</Button>
              </div>
              <p className="text-xs text-neutral-400">Start {contract.startDate.slice(0, 10)} · Vacation {(contract.vacationPayRateBps / 100).toFixed(2)}%</p>
              <div className="mt-3 space-y-2">
                {contract.documents.map((document) => (
                  <div key={document.id} className="flex items-center justify-between rounded border border-neutral-800 px-3 py-2 text-sm">
                    <a href={`/api/contracts/documents/${document.id}`} className="text-cyan-300 hover:underline">{document.filename}</a>
                    <Button className="bg-neutral-700 hover:bg-neutral-600" onClick={() => void deleteDocument(document.id)}>{getString(locale, "remove")}</Button>
                  </div>
                ))}
                {contract.documents.length === 0 ? <p className="text-xs text-neutral-500">No attachments.</p> : null}
              </div>
            </div>
          ))}
          {contracts.length === 0 ? <p className="text-sm text-neutral-400">No contracts yet.</p> : null}
        </div>
      </div>
    </div>
  );
};

export default ContractsPage;
