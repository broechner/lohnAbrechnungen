import type { PayrollSnapshot } from "../domain/types";

export type ReportTotals = {
  grossWageRappen: number;
  netWageRappen: number;
  roundedNetWageRappen: number;
  deductions: Record<string, number>;
};

export const summarizePayroll = (snapshots: PayrollSnapshot[]): ReportTotals => {
  return snapshots.reduce<ReportTotals>(
    (acc, snapshot) => {
      acc.grossWageRappen += snapshot.grossWageRappen;
      acc.netWageRappen += snapshot.netWageRappen;
      acc.roundedNetWageRappen += snapshot.roundedNetWageRappen;

      snapshot.deductions.forEach((deduction) => {
        acc.deductions[deduction.label] =
          (acc.deductions[deduction.label] ?? 0) + deduction.amountRappen;
      });

      return acc;
    },
    {
      grossWageRappen: 0,
      netWageRappen: 0,
      roundedNetWageRappen: 0,
      deductions: {}
    }
  );
};
