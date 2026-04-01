import type { EmploymentContract, Employee, PayrollSnapshot, TimeEntry } from "../domain/types";
import { prisma } from "./prisma";

export const employeeRepository = {
  list: () => prisma.employee.findMany(),
  create: (data: Omit<Employee, "id" | "createdAt" | "updatedAt">) => prisma.employee.create({ data }),
  get: (id: string) => prisma.employee.findUnique({ where: { id } })
};

export const contractRepository = {
  create: (data: Omit<EmploymentContract, "id" | "createdAt" | "updatedAt">) =>
    prisma.employmentContract.create({ data }),
  listByEmployee: (employeeId: string) =>
    prisma.employmentContract.findMany({ where: { employeeId }, include: { employer: true } }),
  get: (id: string) => prisma.employmentContract.findUnique({ where: { id }, include: { employer: true } })
};

export const timeEntryRepository = {
  create: (data: Omit<TimeEntry, "id" | "createdAt" | "updatedAt">) =>
    prisma.timeEntry.create({ data }),
  listByEmployeePeriod: (employeeId: string, period: string) =>
    prisma.timeEntry.findMany({ where: { employeeId, period } }),
  get: (id: string) => prisma.timeEntry.findUnique({ where: { id } })
};

export const payrollRunRepository = {
  create: (data: { employeeId: string; contractId: string; period: string; snapshotJson: string; pdfPath?: string | null }) =>
    prisma.payrollRun.create({ data }),
  listByPeriod: (period: string) =>
    prisma.payrollRun.findMany({ where: { period } })
};

export type CreatePayrollRunInput = {
  employeeId: string;
  contractId: string;
  period: string;
  snapshot: PayrollSnapshot;
};
