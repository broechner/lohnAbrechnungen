import { NextResponse } from "next/server";
import { employeeRepository } from "../../../../data-access/repositories";
import { employeeUpdateSchema } from "../../../../api/validators";
import { getRequestUserEmail } from "../../../../api/requestAuth";

export const GET = async (_request: Request, context: { params: { id: string } }) => {
  const userEmail = await getRequestUserEmail();
  if (!userEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const employee = await employeeRepository.getByUser(context.params.id, userEmail);
  if (!employee) {
    return NextResponse.json({ error: "Employee not found" }, { status: 404 });
  }

  return NextResponse.json(employee, { status: 200 });
};

export const PATCH = async (request: Request, context: { params: { id: string } }) => {
  const userEmail = await getRequestUserEmail();
  if (!userEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = employeeUpdateSchema.parse(body);

    const updateResult = await employeeRepository.updateByUser(context.params.id, userEmail, {
      ...parsed,
      dateOfBirth: parsed.dateOfBirth ? new Date(parsed.dateOfBirth) : undefined
    });

    if (updateResult.count === 0) {
      return NextResponse.json({ error: "Employee not found" }, { status: 404 });
    }

    const employee = await employeeRepository.getByUser(context.params.id, userEmail);
    return NextResponse.json(employee, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Invalid employee payload", details: String(error) }, { status: 400 });
  }
};

export const DELETE = async (_request: Request, context: { params: { id: string } }) => {
  const userEmail = await getRequestUserEmail();
  if (!userEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const deletion = await employeeRepository.deleteByUser(context.params.id, userEmail);
  if (deletion.count === 0) {
    return NextResponse.json({ error: "Employee not found" }, { status: 404 });
  }

  return new NextResponse(null, { status: 204 });
};
