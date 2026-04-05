import type { ContractDocument, EmploymentContract, Employee, PayrollSnapshot, TimeEntry } from "../domain/types";
import { prisma } from "./prisma";

export const employerRepository = {
  getOrCreateDefaultByUser: async (createdBy: string) => {
    const existing = await prisma.employer.findFirst({ where: { createdBy }, orderBy: { createdAt: "asc" } });
    if (existing) {
      return existing;
    }

    return prisma.employer.create({
      data: {
        name: "Default Employer",
        street: "Unknown",
        zip: "0000",
        city: "Unknown",
        country: "CH",
        createdBy
      }
    });
  }
};

export const employeeRepository = {
  listByUser: (createdBy: string) => prisma.employee.findMany({ where: { createdBy }, orderBy: { lastName: "asc" } }),
  create: (data: Omit<Employee, "id" | "createdAt" | "updatedAt">) => prisma.employee.create({ data }),
  getByUser: (id: string, createdBy: string) => prisma.employee.findFirst({ where: { id, createdBy } }),
  updateByUser: (id: string, createdBy: string, data: Partial<Omit<Employee, "id" | "createdAt" | "updatedAt">>) =>
    prisma.employee.updateMany({ where: { id, createdBy }, data }),
  deleteByUser: (id: string, createdBy: string) => prisma.employee.deleteMany({ where: { id, createdBy } })
};

export const contractRepository = {
  create: (data: Omit<EmploymentContract, "id" | "createdAt" | "updatedAt">) =>
    prisma.employmentContract.create({ data }),
  listByUser: (createdBy: string) =>
    prisma.employmentContract.findMany({
      where: { createdBy },
      include: { employer: true, employee: true, documents: true },
      orderBy: { createdAt: "desc" }
    }),
  listByEmployee: (employeeId: string) =>
    prisma.employmentContract.findMany({ where: { employeeId }, include: { employer: true } }),
  getByUser: (id: string, createdBy: string) =>
    prisma.employmentContract.findFirst({ where: { id, createdBy }, include: { employer: true, employee: true, documents: true } }),
  deleteByUser: (id: string, createdBy: string) => prisma.employmentContract.deleteMany({ where: { id, createdBy } })
};

export const timeEntryRepository = {
  create: (data: Omit<TimeEntry, "id" | "createdAt" | "updatedAt">) =>
    prisma.timeEntry.create({ data }),
  listByUser: (createdBy: string, filters?: { period?: string; employeeId?: string }) =>
    prisma.timeEntry.findMany({
      where: {
        createdBy,
        period: filters?.period,
        employeeId: filters?.employeeId
      },
      include: {
        employee: true,
        contract: true
      },
      orderBy: [{ workDate: "desc" }, { createdAt: "desc" }]
    }),
  listByEmployeePeriod: (employeeId: string, period: string) =>
    prisma.timeEntry.findMany({ where: { employeeId, period } }),
  getByUser: (id: string, createdBy: string) =>
    prisma.timeEntry.findFirst({ where: { id, createdBy }, include: { employee: true, contract: true } }),
  updateByUser: (id: string, createdBy: string, data: Partial<Omit<TimeEntry, "id" | "createdAt" | "updatedAt">>) =>
    prisma.timeEntry.updateMany({ where: { id, createdBy }, data }),
  deleteByUser: (id: string, createdBy: string) => prisma.timeEntry.deleteMany({ where: { id, createdBy } })
};

export const payrollRunRepository = {
  upsertByUniquePeriod: (data: {
    employeeId: string;
    contractId: string;
    period: string;
    snapshotJson: string;
    createdBy: string;
    pdfPath?: string | null;
  }) =>
    prisma.payrollRun.upsert({
      where: {
        employeeId_contractId_period: {
          employeeId: data.employeeId,
          contractId: data.contractId,
          period: data.period
        }
      },
      create: data,
      update: {
        snapshotJson: data.snapshotJson,
        pdfPath: data.pdfPath ?? null,
        createdBy: data.createdBy
      }
    }),
  listByUserPeriod: (createdBy: string, period: string) =>
    prisma.payrollRun.findMany({ where: { createdBy, period }, include: { employee: true, contract: true }, orderBy: { createdAt: "desc" } }),
  listByUser: (createdBy: string) =>
    prisma.payrollRun.findMany({ where: { createdBy }, include: { employee: true, contract: true }, orderBy: { createdAt: "desc" } })
};

export const contractDocumentRepository = {
  create: (data: Omit<ContractDocument, "id" | "createdAt">) => prisma.contractDocument.create({ data }),
  getByIdAndUser: (id: string, createdBy: string) =>
    prisma.contractDocument.findFirst({
      where: {
        id,
        contract: {
          createdBy
        }
      }
    }),
  listByContractAndUser: (contractId: string, createdBy: string) =>
    prisma.contractDocument.findMany({
      where: {
        contractId,
        contract: {
          createdBy
        }
      },
      orderBy: { createdAt: "desc" }
    }),
  deleteByUser: (id: string, createdBy: string) =>
    prisma.contractDocument.deleteMany({
      where: {
        id,
        contract: {
          createdBy
        }
      }
    })
};

export type CreatePayrollRunInput = {
  employeeId: string;
  contractId: string;
  period: string;
  snapshot: PayrollSnapshot;
};
