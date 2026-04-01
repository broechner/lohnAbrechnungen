import { PDFDocument, StandardFonts } from "pdf-lib";
import { format } from "date-fns";
import { formatChf } from "../payroll-engine/money";
import type { ReportTotals } from "../payroll-engine/report";

export const generateReportPdf = async ({
  period,
  totals,
  locale
}: {
  period: string;
  totals: ReportTotals;
  locale: "de" | "en";
}) => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const title = locale === "de" ? "Lohndeklaration" : "Payroll declaration";
  const periodLabel = format(new Date(`${period}-01`), "MMMM yyyy");

  page.drawText(`${title} ${periodLabel}`, { x: 50, y: 780, size: 16, font: bold });

  let cursorY = 740;
  const drawLine = (label: string, value: number) => {
    page.drawText(label, { x: 50, y: cursorY, size: 11, font });
    page.drawText(formatChf(value, locale === "de" ? "de-CH" : "en-GB"), {
      x: 380,
      y: cursorY,
      size: 11,
      font
    });
    cursorY -= 18;
  };

  drawLine("Bruttolohn", totals.grossWageRappen);
  drawLine("Nettolohn", totals.netWageRappen);
  drawLine("Auszahlung (gerundet)", totals.roundedNetWageRappen);

  cursorY -= 10;
  page.drawText(locale === "de" ? "Abzüge" : "Deductions", { x: 50, y: cursorY, size: 12, font: bold });
  cursorY -= 18;

  Object.entries(totals.deductions).forEach(([label, value]) => {
    drawLine(label, value);
  });

  return pdfDoc.save();
};
