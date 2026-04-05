import { NextResponse } from "next/server";
import { employeeRepository } from "../../../data-access/repositories";
import { employeeSchema } from "../../../api/validators";
import { getRequestUserEmail } from "../../../api/requestAuth";

export const GET = async () => {
  const userEmail = await getRequestUserEmail();
  if (!userEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const employees = await employeeRepository.listByUser(userEmail);
  return NextResponse.json(employees, { status: 200 });
};

export const POST = async (request: Request) => {
  const userEmail = await getRequestUserEmail();
  if (!userEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = employeeSchema.parse(body);

    const employee = await employeeRepository.create({
      ...parsed,
      dateOfBirth: new Date(parsed.dateOfBirth),
      createdBy: userEmail
    });

    return NextResponse.json(employee, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Invalid employee payload", details: String(error) }, { status: 400 });
  }
};
