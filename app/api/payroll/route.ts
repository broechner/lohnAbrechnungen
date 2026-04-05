import { NextResponse } from "next/server";
import { prisma } from "../../../data-access/prisma";
import { createPayslip } from "../../../api/payrollService";
import { getRequestUserEmail } from "../../../api/requestAuth";
import { payrollRequestSchema } from "../../../api/validators";

export const POST = async (request: Request) => {
  const userEmail = await getRequestUserEmail();
  if (!userEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { timeEntryId: string; locale?: "de" | "en" };
  try {
    body = payrollRequestSchema.parse(await request.json());
  } catch (error) {
    return NextResponse.json({ error: "Invalid payroll payload", details: String(error) }, { status: 400 });
  }

  const timeEntry = await prisma.timeEntry.findFirst({
    where: { id: body.timeEntryId, createdBy: userEmail },
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
    locale: body.locale ?? "de",
    createdBy: userEmail
  });

  return new NextResponse(Buffer.from(pdfBytes), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=lohnabrechnung-${snapshot.period}.pdf`
    }
  });
};
