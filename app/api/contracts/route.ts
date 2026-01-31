import { NextResponse } from "next/server";
import { contractRepository } from "../../../data-access/repositories";
import { contractSchema } from "../../../api/validators";

export const POST = async (request: Request) => {
  const body = await request.json();
  const parsed = contractSchema.parse(body);

  const contract = await contractRepository.create({
    ...parsed,
    startDate: new Date(parsed.startDate),
    endDate: parsed.endDate ? new Date(parsed.endDate) : null
  });

  return NextResponse.json(contract, { status: 201 });
};
