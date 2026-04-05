import { NextResponse } from "next/server";
import { payrollRunRepository } from "../../../data-access/repositories";
import { getRequestUserEmail } from "../../../api/requestAuth";

export const GET = async () => {
  const userEmail = await getRequestUserEmail();
  if (!userEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payslips = await payrollRunRepository.listByUser(userEmail);
  return NextResponse.json(payslips, { status: 200 });
};
