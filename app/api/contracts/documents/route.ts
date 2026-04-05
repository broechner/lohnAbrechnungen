import { NextResponse } from "next/server";
import { contractDocumentRepository } from "../../../../data-access/repositories";
import { getRequestUserEmail } from "../../../../api/requestAuth";

export const GET = async (request: Request) => {
  const userEmail = await getRequestUserEmail();
  if (!userEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const contractId = searchParams.get("contractId");
  if (!contractId) {
    return NextResponse.json({ error: "contractId is required" }, { status: 400 });
  }

  const documents = await contractDocumentRepository.listByContractAndUser(contractId, userEmail);
  return NextResponse.json(documents, { status: 200 });
};
