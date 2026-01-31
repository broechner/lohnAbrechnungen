import { NextResponse } from "next/server";
import { employeeRepository } from "../../../data-access/repositories";
import { employeeSchema } from "../../../api/validators";

export const GET = async () => {
  const employees = await employeeRepository.list();
  return NextResponse.json(employees);
};

export const POST = async (request: Request) => {
  const body = await request.json();
  const parsed = employeeSchema.parse(body);

  const employee = await employeeRepository.create({
    ...parsed,
    dateOfBirth: new Date(parsed.dateOfBirth)
  });

  return NextResponse.json(employee, { status: 201 });
};
