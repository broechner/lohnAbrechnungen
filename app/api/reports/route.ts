import { NextResponse } from "next/server";
import { prisma } from "../../../data-access/prisma";
import { summarizePayroll } from "../../../payroll-engine/report";
import { generateReportPdf } from "../../../pdf/generateReportPdf";

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const period = searchParams.get("period");
  const format = searchParams.get("format") ?? "json";

  if (!period) {
    return NextResponse.json({ error: "period is required" }, { status: 400 });
  }

  const runs = await prisma.payrollRun.findMany({ where: { period } });
  const snapshots = runs.map((run) => JSON.parse(run.snapshotJson));
  const totals = summarizePayroll(snapshots);

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
    return new NextResponse(pdfBytes, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=lohndeklaration-${period}.pdf`
      }
    });
  }

  return NextResponse.json({ period, totals });
};
