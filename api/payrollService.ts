import { calculatePayslip } from "../payroll-engine/calculatePayslip";
import { generatePayslipPdf } from "../pdf/generatePayslipPdf";
import { payrollRunRepository } from "../data-access/repositories";
import type { EmploymentContract, Employee, Employer, PayrollSnapshot, TimeEntry } from "../domain/types";

export type GeneratedPayslip = {
  snapshot: PayrollSnapshot;
  pdfBytes: Uint8Array;
};

export const createPayslip = async ({
  employee,
  employer,
  contract,
  timeEntry,
  locale
}: {
  employee: Employee;
  employer: Employer;
  contract: EmploymentContract;
  timeEntry: TimeEntry;
  locale: "de" | "en";
}): Promise<GeneratedPayslip> => {
  const snapshot = calculatePayslip({ contract, timeEntry, locale: locale === "de" ? "de-CH" : "en-GB" });
  const pdfBytes = await generatePayslipPdf({ snapshot, employee, employer, contract, locale });

  await payrollRunRepository.create({
    employeeId: employee.id,
    contractId: contract.id,
    period: snapshot.period,
    snapshotJson: JSON.stringify(snapshot)
  });

  return { snapshot, pdfBytes };
};
