import { NextResponse } from "next/server";
import { getRequestUserEmail } from "../../../../api/requestAuth";
import { timeEntryUpdateSchema } from "../../../../api/validators";
import { timeEntryRepository } from "../../../../data-access/repositories";

export const PATCH = async (request: Request, context: { params: { id: string } }) => {
  const userEmail = await getRequestUserEmail();
  if (!userEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = timeEntryUpdateSchema.parse(body);

    const updateResult = await timeEntryRepository.updateByUser(context.params.id, userEmail, {
      ...parsed,
      workDate: parsed.workDate ? new Date(parsed.workDate) : undefined
    });

    if (updateResult.count === 0) {
      return NextResponse.json({ error: "Time entry not found" }, { status: 404 });
    }

    const entry = await timeEntryRepository.getByUser(context.params.id, userEmail);
    return NextResponse.json(entry, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Invalid time entry payload", details: String(error) }, { status: 400 });
  }
};

export const DELETE = async (_request: Request, context: { params: { id: string } }) => {
  const userEmail = await getRequestUserEmail();
  if (!userEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const deletion = await timeEntryRepository.deleteByUser(context.params.id, userEmail);
  if (deletion.count === 0) {
    return NextResponse.json({ error: "Time entry not found" }, { status: 404 });
  }

  return new NextResponse(null, { status: 204 });
};
