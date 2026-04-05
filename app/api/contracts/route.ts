import { NextResponse } from "next/server";
import { contractRepository, employerRepository } from "../../../data-access/repositories";
import { contractSchema } from "../../../api/validators";
import { getRequestUserEmail } from "../../../api/requestAuth";

export const GET = async () => {
  const userEmail = await getRequestUserEmail();
  if (!userEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const contracts = await contractRepository.listByUser(userEmail);
  return NextResponse.json(contracts, { status: 200 });
};

export const POST = async (request: Request) => {
  const userEmail = await getRequestUserEmail();
  if (!userEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = contractSchema.parse(body);
    const employer = await employerRepository.getOrCreateDefaultByUser(userEmail);

    const contract = await contractRepository.create({
      ...parsed,
      employerId: employer.id,
      startDate: new Date(parsed.startDate),
      endDate: parsed.endDate ? new Date(parsed.endDate) : null,
      createdBy: userEmail
    });

    return NextResponse.json(contract, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Invalid contract payload", details: String(error) }, { status: 400 });
  }
};
