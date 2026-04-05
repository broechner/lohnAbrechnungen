import { describe, expect, it } from "vitest";
import { calculatePayslip } from "../payroll-engine/calculatePayslip";
import type { EmploymentContract, TimeEntry } from "../domain/types";

const contract: EmploymentContract = {
  id: "contract-1",
  employeeId: "employee-1",
  employerId: "employer-1",
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
  employeeId: "employee-1",
  contractId: "contract-1",
  period: "2026-01",
  workDate: new Date("2026-01-05"),
  hoursWorked: 4.25,
  bonusRappen: 0,
  reimbursementRappen: 0,
  deductionRappen: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
  createdBy: null
};

describe("calculatePayslip", () => {
  it("calculates gross and net wages with rounding", () => {
    const snapshot = calculatePayslip({ contract, timeEntry: entry });

    expect(snapshot.baseWageRappen).toBe(14612);
    expect(snapshot.vacationPayRappen).toBe(1217);
    expect(snapshot.grossWageRappen).toBe(15829);
    expect(snapshot.roundedNetWageRappen).toBe(14820);
  });
});
