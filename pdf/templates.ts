export const labels = {
  de: {
    payslipTitle: (monthLabel: string) => `Lohnabrechnung für ${monthLabel}`,
    personal: "Persönlich",
    employer: "Arbeitgeber",
    wageComponent: "Lohnbestandteil",
    hours: "Anzahl Stunden",
    rate: "Ansatz",
    base: "Basis in CHF",
    total: "Total in CHF",
    baseWage: "Basislohn",
    vacationPay: "Ferienzuschlag",
    grossWage: "Bruttolohn",
    netWage: "Nettolohn",
    totalPayout: "Total Auszahlung",
    roundingNote: "Nettolohn auf 5 Rappen gerundet.",
    payoutMethod: "Auszahlung",
    payoutDefault: "Twint"
  },
  en: {
    payslipTitle: (monthLabel: string) => `Payslip for ${monthLabel}`,
    personal: "Personal",
    employer: "Employer",
    wageComponent: "Wage component",
    hours: "Hours",
    rate: "Rate",
    base: "Base in CHF",
    total: "Total in CHF",
    baseWage: "Base wage",
    vacationPay: "Vacation pay",
    grossWage: "Gross wage",
    netWage: "Net wage",
    totalPayout: "Total payout",
    roundingNote: "Net wage rounded to 0.05 CHF.",
    payoutMethod: "Payout",
    payoutDefault: "Twint"
  }
};
