import { NextResponse } from "next/server";
import { prisma } from "../../../data-access/prisma";
import { createPayslip } from "../../../api/payrollService";

export const POST = async (request: Request) => {
  const body = (await request.json()) as { timeEntryId: string; locale?: "de" | "en" };
  const timeEntry = await prisma.timeEntry.findUnique({
    where: { id: body.timeEntryId },
    include: { employee: true, contract: { include: { employer: true } } }
  });

  if (!timeEntry || !timeEntry.contract || !timeEntry.employee) {
    return NextResponse.json({ error: "Time entry not found." }, { status: 404 });
  }

  const { pdfBytes, snapshot } = await createPayslip({
    employee: timeEntry.employee,
    employer: timeEntry.contract.employer,
    contract: timeEntry.contract,
    timeEntry,
    locale: body.locale ?? "de"
  });

  return new NextResponse(pdfBytes, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=lohnabrechnung-${snapshot.period}.pdf`
    }
  });
};
