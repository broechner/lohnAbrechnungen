import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import { join } from "path";
import { NextResponse } from "next/server";
import { contractDocumentRepository, contractRepository } from "../../../../data-access/repositories";
import { getRequestUserEmail } from "../../../../api/requestAuth";

const MAX_UPLOAD_SIZE_BYTES = 10 * 1024 * 1024;

export const POST = async (request: Request) => {
  const userEmail = await getRequestUserEmail();
  if (!userEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const contractId = String(formData.get("contractId") ?? "").trim();
  const file = formData.get("file");

  if (!contractId || !(file instanceof File)) {
    return NextResponse.json({ error: "contractId and file are required" }, { status: 400 });
  }

  if (file.size > MAX_UPLOAD_SIZE_BYTES) {
    return NextResponse.json({ error: "File too large. Maximum size is 10MB." }, { status: 400 });
  }

  const contract = await contractRepository.getByUser(contractId, userEmail);
  if (!contract) {
    return NextResponse.json({ error: "Contract not found" }, { status: 404 });
  }

  const uploadRoot = join(process.cwd(), "uploads", "contracts", contractId);
  await mkdir(uploadRoot, { recursive: true });

  const safeFilename = `${Date.now()}-${randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
  const storagePath = join(uploadRoot, safeFilename);
  const bytes = new Uint8Array(await file.arrayBuffer());
  await writeFile(storagePath, bytes);

  const document = await contractDocumentRepository.create({
    contractId,
    filename: file.name,
    mimeType: file.type || "application/octet-stream",
    sizeBytes: file.size,
    storagePath,
    createdBy: userEmail
  });

  return NextResponse.json(document, { status: 201 });
};
