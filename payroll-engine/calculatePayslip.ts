import { formatChf, roundToIncrement } from "./money";
import type { EmploymentContract, PayrollSnapshot, TimeEntry } from "../domain/types";

const calculationVersion = "2024-09";

const bpsToRate = (bps: number): number => bps / 10000;

export type PayslipInput = {
  contract: EmploymentContract;
  timeEntry: TimeEntry;
  locale?: string;
};

export const calculatePayslip = ({ contract, timeEntry, locale = "de-CH" }: PayslipInput): PayrollSnapshot => {
  const baseWageRappen = Math.round(timeEntry.hoursWorked * contract.hourlyWageRappen);
  const vacationPayRappen = contract.vacationPayIncluded
    ? 0
    : Math.round(baseWageRappen * bpsToRate(contract.vacationPayRateBps));

  const grossWageRappen =
    baseWageRappen +
    vacationPayRappen +
    timeEntry.bonusRappen +
    timeEntry.reimbursementRappen -
    timeEntry.deductionRappen;

  const deductions = [] as PayrollSnapshot["deductions"];
  deductions.push({
    label: "AHV/IV/EO",
    amountRappen: -Math.round(grossWageRappen * bpsToRate(contract.ahvIveoRateBps)),
    rateBps: contract.ahvIveoRateBps
  });
  deductions.push({
    label: "ALV",
    amountRappen: -Math.round(grossWageRappen * bpsToRate(contract.alvRateBps)),
    rateBps: contract.alvRateBps
  });

  if (contract.quellensteuerEnabled && contract.quellensteuerRateBps) {
    deductions.push({
      label: "Quellensteuer",
      amountRappen: -Math.round(grossWageRappen * bpsToRate(contract.quellensteuerRateBps)),
      rateBps: contract.quellensteuerRateBps
    });
  }

  if (contract.additionalDeductionLabel && contract.additionalDeductionRateBps) {
    deductions.push({
      label: contract.additionalDeductionLabel,
      amountRappen: -Math.round(grossWageRappen * bpsToRate(contract.additionalDeductionRateBps)),
      rateBps: contract.additionalDeductionRateBps
    });
  }

  const totalDeductions = deductions.reduce((sum, item) => sum + item.amountRappen, 0);
  const netWageRappen = grossWageRappen + totalDeductions;
  const roundedNetWageRappen = roundToIncrement(netWageRappen, contract.roundingIncrementRappen);

  return {
    period: timeEntry.period,
    employeeId: timeEntry.employeeId,
    contractId: timeEntry.contractId,
    employerId: contract.employerId,
    baseWageRappen,
    vacationPayRappen,
    grossWageRappen,
    deductions,
    netWageRappen,
    roundedNetWageRappen,
    roundingNote: `Nettolohn auf ${formatChf(contract.roundingIncrementRappen, locale)} gerundet.`,
    hoursWorked: timeEntry.hoursWorked,
    hourlyRateRappen: contract.hourlyWageRappen,
    adjustments: {
      bonusRappen: timeEntry.bonusRappen,
      reimbursementRappen: timeEntry.reimbursementRappen,
      deductionRappen: timeEntry.deductionRappen
    },
    metadata: {
      createdAt: new Date().toISOString(),
      calculationVersion
    }
  };
};
