import { z } from "zod";

export const employeeSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  street: z.string().min(1),
  zip: z.string().min(1),
  city: z.string().min(1),
  country: z.string().min(1).default("CH"),
  dateOfBirth: z.string().min(1),
  nationality: z.string().optional().nullable(),
  ahvNumber: z
    .string()
    .regex(/^756\.[0-9]{4}\.[0-9]{4}\.[0-9]{2}$/, "AHV number must match 756.XXXX.XXXX.XX"),
  maritalStatus: z.string().optional().nullable(),
  childrenCount: z.number().int().optional().nullable(),
  email: z.string().email().optional().nullable(),
  phone: z.string().optional().nullable()
});

export const contractSchema = z.object({
  employeeId: z.string().min(1),
  employerId: z.string().min(1),
  startDate: z.string().min(1),
  endDate: z.string().optional().nullable(),
  hourlyWageRappen: z.number().int().min(0),
  monthlySalaryRappen: z.number().int().optional().nullable(),
  vacationPayIncluded: z.boolean(),
  vacationPayRateBps: z.number().int().min(0),
  ahvIveoRateBps: z.number().int().min(0),
  alvRateBps: z.number().int().min(0),
  additionalDeductionLabel: z.string().optional().nullable(),
  additionalDeductionRateBps: z.number().int().optional().nullable(),
  quellensteuerEnabled: z.boolean(),
  quellensteuerRateBps: z.number().int().optional().nullable(),
  roundingIncrementRappen: z.number().int().min(1)
});

export const timeEntrySchema = z.object({
  employeeId: z.string().min(1),
  contractId: z.string().min(1),
  period: z.string().regex(/^\d{4}-\d{2}$/),
  hoursWorked: z.number().min(0),
  bonusRappen: z.number().int().optional().default(0),
  reimbursementRappen: z.number().int().optional().default(0),
  deductionRappen: z.number().int().optional().default(0)
});
