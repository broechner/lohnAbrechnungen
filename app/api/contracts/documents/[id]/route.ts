import { readFile, unlink } from "fs/promises";
import { NextResponse } from "next/server";
import { contractDocumentRepository } from "../../../../../data-access/repositories";
import { getRequestUserEmail } from "../../../../../api/requestAuth";

export const GET = async (_request: Request, context: { params: { id: string } }) => {
  const userEmail = await getRequestUserEmail();
  if (!userEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const document = await contractDocumentRepository.getByIdAndUser(context.params.id, userEmail);
  if (!document) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 });
  }

  const fileBuffer = await readFile(document.storagePath);
  return new NextResponse(fileBuffer, {
    status: 200,
    headers: {
      "Content-Type": document.mimeType,
      "Content-Disposition": `attachment; filename="${encodeURIComponent(document.filename)}"`
    }
  });
};

export const DELETE = async (_request: Request, context: { params: { id: string } }) => {
  const userEmail = await getRequestUserEmail();
  if (!userEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const document = await contractDocumentRepository.getByIdAndUser(context.params.id, userEmail);
  if (!document) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 });
  }

  await contractDocumentRepository.deleteByUser(context.params.id, userEmail);
  await unlink(document.storagePath).catch(() => undefined);

  return new NextResponse(null, { status: 204 });
};
