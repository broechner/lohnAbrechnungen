import { NextResponse } from "next/server";
import { contractRepository } from "../../../../data-access/repositories";
import { getRequestUserEmail } from "../../../../api/requestAuth";

export const DELETE = async (_request: Request, context: { params: { id: string } }) => {
  const userEmail = await getRequestUserEmail();
  if (!userEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await contractRepository.deleteByUser(context.params.id, userEmail);
  if (result.count === 0) {
    return NextResponse.json({ error: "Contract not found" }, { status: 404 });
  }

  return new NextResponse(null, { status: 204 });
};
