import { NextResponse } from "next/server";
import { timeEntryRepository } from "../../../data-access/repositories";
import { timeEntrySchema } from "../../../api/validators";
import { getRequestUserEmail } from "../../../api/requestAuth";

export const GET = async (request: Request) => {
  const userEmail = await getRequestUserEmail();
  if (!userEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const period = searchParams.get("period") ?? undefined;
  const employeeId = searchParams.get("employeeId") ?? undefined;

  const entries = await timeEntryRepository.listByUser(userEmail, { period, employeeId });
  return NextResponse.json(entries, { status: 200 });
};

export const POST = async (request: Request) => {
  const userEmail = await getRequestUserEmail();
  if (!userEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = timeEntrySchema.parse(body);

    const entry = await timeEntryRepository.create({
      ...parsed,
      workDate: new Date(parsed.workDate),
      bonusRappen: parsed.bonusRappen ?? 0,
      reimbursementRappen: parsed.reimbursementRappen ?? 0,
      deductionRappen: parsed.deductionRappen ?? 0,
      createdBy: userEmail
    });

    return NextResponse.json(entry, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Invalid time entry payload", details: String(error) }, { status: 400 });
  }
};
