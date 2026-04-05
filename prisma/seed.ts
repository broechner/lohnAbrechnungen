import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const employer = await prisma.employer.create({
    data: {
      name: "LohnAbrechnungsApp Demo",
      street: "Bahnhofstrasse 1",
      zip: "8001",
      city: "Zürich",
      country: "CH",
      email: "demo@lohnabrechnung.app",
      phone: "+41 44 000 00 00",
      createdBy: "demo@lohnabrechnung.app"
    }
  });

  const employee = await prisma.employee.create({
    data: {
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
      email: "rebecca@example.com",
      phone: "+41 79 000 00 00",
      createdBy: "demo@lohnabrechnung.app"
    }
  });

  const contract = await prisma.employmentContract.create({
    data: {
      employeeId: employee.id,
      employerId: employer.id,
      startDate: new Date("2024-01-01"),
      hourlyWageRappen: 3438,
      vacationPayIncluded: false,
      vacationPayRateBps: 833,
      ahvIveoRateBps: 530,
      alvRateBps: 110,
      roundingIncrementRappen: 5,
      createdBy: "demo@lohnabrechnung.app"
    }
  });

  await prisma.timeEntry.create({
    data: {
      employeeId: employee.id,
      contractId: contract.id,
      period: "2026-01",
      workDate: new Date("2026-01-05"), // Updated workDate
      hoursWorked: 4.25,
      createdBy: "demo@lohnabrechnung.app"
    }
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
