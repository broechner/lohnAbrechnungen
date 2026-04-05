export type CurrencyRappen = number;

export type AuditFields = {
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string | null;
};

export type Employee = {
  id: string;
  firstName: string;
  lastName: string;
  street: string;
  zip: string;
  city: string;
  country: string;
  dateOfBirth: Date;
  nationality?: string | null;
  ahvNumber: string;
  maritalStatus?: string | null;
  childrenCount?: number | null;
  email?: string | null;
  phone?: string | null;
} & AuditFields;

export type Employer = {
  id: string;
  name: string;
  street: string;
  zip: string;
  city: string;
  country: string;
  email?: string | null;
  phone?: string | null;
} & AuditFields;

export type EmploymentContract = {
  id: string;
  employeeId: string;
  employerId: string;
  startDate: Date;
  endDate?: Date | null;
  hourlyWageRappen: CurrencyRappen;
  monthlySalaryRappen?: CurrencyRappen | null;
  vacationPayIncluded: boolean;
  vacationPayRateBps: number;
  ahvIveoRateBps: number;
  alvRateBps: number;
  additionalDeductionLabel?: string | null;
  additionalDeductionRateBps?: number | null;
  quellensteuerEnabled: boolean;
  quellensteuerRateBps?: number | null;
  roundingIncrementRappen: number;
} & AuditFields;

export type TimeEntry = {
  id: string;
  employeeId: string;
  contractId: string;
  period: string;
  workDate: Date;
  hoursWorked: number;
  bonusRappen: CurrencyRappen;
  reimbursementRappen: CurrencyRappen;
  deductionRappen: CurrencyRappen;
} & AuditFields;

export type ContractDocument = {
  id: string;
  contractId: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  storagePath: string;
  createdBy?: string | null;
  createdAt: Date;
};

export type PayrollSnapshot = {
  period: string;
  employeeId: string;
  contractId: string;
  employerId: string;
  baseWageRappen: CurrencyRappen;
  vacationPayRappen: CurrencyRappen;
  grossWageRappen: CurrencyRappen;
  deductions: Array<{ label: string; amountRappen: CurrencyRappen; rateBps?: number }>;
  netWageRappen: CurrencyRappen;
  roundedNetWageRappen: CurrencyRappen;
  roundingNote: string;
  hoursWorked: number;
  hourlyRateRappen: CurrencyRappen;
  adjustments: {
    bonusRappen: CurrencyRappen;
    reimbursementRappen: CurrencyRappen;
    deductionRappen: CurrencyRappen;
  };
  metadata: {
    createdAt: string;
    calculationVersion: string;
  };
};
