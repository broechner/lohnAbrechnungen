import { NextResponse } from "next/server";
import { timeEntryRepository } from "../../../data-access/repositories";
import { timeEntrySchema } from "../../../api/validators";

export const POST = async (request: Request) => {
  const body = await request.json();
  const parsed = timeEntrySchema.parse(body);

  const entry = await timeEntryRepository.create({
    ...parsed,
    bonusRappen: parsed.bonusRappen ?? 0,
    reimbursementRappen: parsed.reimbursementRappen ?? 0,
    deductionRappen: parsed.deductionRappen ?? 0
  });

  return NextResponse.json(entry, { status: 201 });
};
