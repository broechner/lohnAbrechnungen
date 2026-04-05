import { NextResponse } from "next/server";
import { prisma } from "../../../data-access/prisma";
import { summarizePayroll } from "../../../payroll-engine/report";
import { generateReportPdf } from "../../../pdf/generateReportPdf";
import { getRequestUserEmail } from "../../../api/requestAuth";
import { periodSchema } from "../../../api/validators";

export const GET = async (request: Request) => {
  const userEmail = await getRequestUserEmail();
  if (!userEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const period = searchParams.get("period");
  const format = searchParams.get("format") ?? "json";

  if (!period) {
    return NextResponse.json({ error: "period is required" }, { status: 400 });
  }

  const validatedPeriod = periodSchema.safeParse(period);
  if (!validatedPeriod.success) {
    return NextResponse.json({ error: "period must be in YYYY-MM format" }, { status: 400 });
  }

  const runs = await prisma.payrollRun.findMany({
    where: { period, createdBy: userEmail },
    include: { employee: true }
  });
  const snapshots = runs.map((run: { snapshotJson: string }) => JSON.parse(run.snapshotJson));
  const totals = summarizePayroll(snapshots);

  const totalsByEmployee = runs.reduce<Record<string, { grossWageRappen: number; roundedNetWageRappen: number }>>(
    (acc, run) => {
      const snapshot = JSON.parse(run.snapshotJson) as { grossWageRappen: number; roundedNetWageRappen: number };
      const label = `${run.employee.firstName} ${run.employee.lastName}`;
      acc[label] = {
        grossWageRappen: (acc[label]?.grossWageRappen ?? 0) + snapshot.grossWageRappen,
        roundedNetWageRappen: (acc[label]?.roundedNetWageRappen ?? 0) + snapshot.roundedNetWageRappen
      };
      return acc;
    },
    {}
  );

  if (format === "csv") {
    const header = "metric,amountRappen";
    const rows = [
      `grossWageRappen,${totals.grossWageRappen}`,
      `netWageRappen,${totals.netWageRappen}`,
      `roundedNetWageRappen,${totals.roundedNetWageRappen}`,
      ...Object.entries(totals.deductions).map(([label, amount]) => `${label},${amount}`)
    ];
    const csv = [header, ...rows].join("\n");
    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv"
      }
    });
  }

  if (format === "pdf") {
    const locale = (searchParams.get("locale") ?? "de") === "en" ? "en" : "de";
    const pdfBytes = await generateReportPdf({ period, totals, locale });
    return new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=lohndeklaration-${period}.pdf`
      }
    });
  }

  if (format !== "json") {
    return NextResponse.json({ error: "Unsupported format" }, { status: 400 });
  }

  return NextResponse.json({
    period,
    totals,
    totalsByEmployee,
    runCount: runs.length
  });
};
