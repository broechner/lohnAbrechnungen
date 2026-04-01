import { describe, expect, it, vi } from "vitest";
import type { EmploymentContract, Employee, Employer, TimeEntry } from "../domain/types";

vi.mock("../data-access/repositories", () => ({
  payrollRunRepository: {
    create: vi.fn().mockResolvedValue({ id: "run-1" })
  }
}));

import { createPayslip } from "../api/payrollService";

const employer: Employer = {
  id: "employer-1",
  name: "Demo Employer",
  street: "Bahnhofstrasse 1",
  zip: "8001",
  city: "Zürich",
  country: "CH",
  email: null,
  phone: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  createdBy: null
};

const employee: Employee = {
  id: "employee-1",
  firstName: "Rebecca",
  lastName: "Siegfried",
  street: "In der Breiti 2",
  zip: "8185",
  city: "Winkel",
  country: "CH",
  dateOfBirth: new Date("1990-05-12"),
  nationality: "CH",
  ahvNumber: "756.9217.0769.85",
  maritalStatus: "ledig",
  childrenCount: 0,
  email: null,
  phone: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  createdBy: null
};

const contract: EmploymentContract = {
  id: "contract-1",
  employeeId: employee.id,
  employerId: employer.id,
  startDate: new Date("2024-01-01"),
  endDate: null,
  hourlyWageRappen: 3438,
  monthlySalaryRappen: null,
  vacationPayIncluded: false,
  vacationPayRateBps: 833,
  ahvIveoRateBps: 530,
  alvRateBps: 110,
  additionalDeductionLabel: null,
  additionalDeductionRateBps: null,
  quellensteuerEnabled: false,
  quellensteuerRateBps: null,
  roundingIncrementRappen: 5,
  createdAt: new Date(),
  updatedAt: new Date(),
  createdBy: null
};

const entry: TimeEntry = {
  id: "entry-1",
  employeeId: employee.id,
  contractId: contract.id,
  period: "2026-01",
  hoursWorked: 4.25,
  bonusRappen: 0,
  reimbursementRappen: 0,
  deductionRappen: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
  createdBy: null
};

describe("payroll flow", () => {
  it("creates a PDF and snapshot", async () => {
    const result = await createPayslip({
      employee,
      employer,
      contract,
      timeEntry: entry,
      locale: "de"
    });

    expect(result.snapshot.period).toBe("2026-01");
    expect(result.pdfBytes.byteLength).toBeGreaterThan(0);
  });
});
