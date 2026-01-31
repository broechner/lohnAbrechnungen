import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { format } from "date-fns";
import { de, enGB } from "date-fns/locale";
import type { EmploymentContract, Employee, Employer, PayrollSnapshot } from "../domain/types";
import { formatChf } from "../payroll-engine/money";
import { labels } from "./templates";

export type PayslipPdfInput = {
  snapshot: PayrollSnapshot;
  employee: Employee;
  employer: Employer;
  contract: EmploymentContract;
  locale: "de" | "en";
};

const localeMap = {
  de,
  en: enGB
};

export const generatePayslipPdf = async ({ snapshot, employee, employer, contract, locale }: PayslipPdfInput) => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const labelSet = labels[locale];

  const monthLabel = format(new Date(`${snapshot.period}-01`), "MMMM yyyy", {
    locale: localeMap[locale]
  });

  const leftMargin = 50;
  let cursorY = 800;
  const lineHeight = 16;

  page.drawText(labelSet.personal, { x: leftMargin, y: cursorY, font: bold, size: 10 });
  page.drawText(labelSet.employer, { x: 300, y: cursorY, font: bold, size: 10 });

  cursorY -= lineHeight;
  page.drawText(`${employee.firstName} ${employee.lastName}`, { x: leftMargin, y: cursorY, font, size: 10 });
  page.drawText(employer.name, { x: 300, y: cursorY, font, size: 10 });
  cursorY -= lineHeight;
  page.drawText(employee.street, { x: leftMargin, y: cursorY, font, size: 10 });
  page.drawText(employer.street, { x: 300, y: cursorY, font, size: 10 });
  cursorY -= lineHeight;
  page.drawText(`${employee.zip} ${employee.city}`, { x: leftMargin, y: cursorY, font, size: 10 });
  page.drawText(`${employer.zip} ${employer.city}`, { x: 300, y: cursorY, font, size: 10 });

  cursorY -= 30;
  page.drawText(`${employee.city}, ${format(new Date(), "dd.MM.yyyy")}`, { x: leftMargin, y: cursorY, font, size: 10 });

  cursorY -= 60;
  page.drawText(labelSet.payslipTitle(monthLabel), {
    x: leftMargin,
    y: cursorY,
    font: bold,
    size: 18
  });

  cursorY -= 30;
  const headers = [
    labelSet.wageComponent,
    labelSet.hours,
    labelSet.rate,
    labelSet.base,
    labelSet.total
  ];

  headers.forEach((header, index) => {
    page.drawText(header, {
      x: leftMargin + index * 100,
      y: cursorY,
      font: bold,
      size: 10
    });
  });

  cursorY -= 12;
  page.drawLine({
    start: { x: leftMargin, y: cursorY },
    end: { x: 545, y: cursorY },
    thickness: 1,
    color: rgb(0.1, 0.1, 0.1)
  });

  cursorY -= 20;
  page.drawText(labelSet.baseWage, { x: leftMargin, y: cursorY, font, size: 10 });
  page.drawText(snapshot.hoursWorked.toFixed(2), { x: leftMargin + 110, y: cursorY, font, size: 10 });
  page.drawText(formatChf(snapshot.hourlyRateRappen, locale === "de" ? "de-CH" : "en-GB"), {
    x: leftMargin + 200,
    y: cursorY,
    font,
    size: 10
  });
  page.drawText(formatChf(snapshot.baseWageRappen, locale === "de" ? "de-CH" : "en-GB"), {
    x: leftMargin + 400,
    y: cursorY,
    font,
    size: 10
  });

  cursorY -= 18;
  if (!contract.vacationPayIncluded) {
    page.drawText(labelSet.vacationPay, { x: leftMargin, y: cursorY, font, size: 10 });
    page.drawText(`${(contract.vacationPayRateBps / 100).toFixed(2)} %`, {
      x: leftMargin + 200,
      y: cursorY,
      font,
      size: 10
    });
    page.drawText(formatChf(snapshot.baseWageRappen, locale === "de" ? "de-CH" : "en-GB"), {
      x: leftMargin + 300,
      y: cursorY,
      font,
      size: 10
    });
    page.drawText(formatChf(snapshot.vacationPayRappen, locale === "de" ? "de-CH" : "en-GB"), {
      x: leftMargin + 400,
      y: cursorY,
      font,
      size: 10
    });
    cursorY -= 18;
  }

  page.drawText(labelSet.grossWage, { x: leftMargin, y: cursorY, font: bold, size: 10 });
  page.drawText(formatChf(snapshot.grossWageRappen, locale === "de" ? "de-CH" : "en-GB"), {
    x: leftMargin + 400,
    y: cursorY,
    font: bold,
    size: 10
  });

  snapshot.deductions.forEach((deduction) => {
    cursorY -= 16;
    page.drawText(deduction.label, { x: leftMargin, y: cursorY, font, size: 10 });
    if (deduction.rateBps) {
      page.drawText(`${(deduction.rateBps / 100).toFixed(2)} %`, {
        x: leftMargin + 200,
        y: cursorY,
        font,
        size: 10
      });
      page.drawText(formatChf(snapshot.grossWageRappen, locale === "de" ? "de-CH" : "en-GB"), {
        x: leftMargin + 300,
        y: cursorY,
        font,
        size: 10
      });
    }
    page.drawText(formatChf(deduction.amountRappen, locale === "de" ? "de-CH" : "en-GB"), {
      x: leftMargin + 400,
      y: cursorY,
      font,
      size: 10
    });
  });

  cursorY -= 22;
  page.drawText(labelSet.netWage, { x: leftMargin, y: cursorY, font: bold, size: 10 });
  page.drawText(formatChf(snapshot.roundedNetWageRappen, locale === "de" ? "de-CH" : "en-GB"), {
    x: leftMargin + 400,
    y: cursorY,
    font: bold,
    size: 10
  });

  cursorY -= 26;
  page.drawLine({
    start: { x: leftMargin, y: cursorY },
    end: { x: 545, y: cursorY },
    thickness: 1,
    color: rgb(0.4, 0.4, 0.4)
  });

  cursorY -= 24;
  page.drawText(labelSet.totalPayout, { x: leftMargin, y: cursorY, font: bold, size: 10 });
  page.drawText(formatChf(snapshot.roundedNetWageRappen, locale === "de" ? "de-CH" : "en-GB"), {
    x: leftMargin + 400,
    y: cursorY,
    font: bold,
    size: 10
  });

  cursorY -= 30;
  page.drawText(labelSet.roundingNote, { x: leftMargin, y: cursorY, font, size: 9 });

  cursorY -= 24;
  page.drawText(labelSet.payoutMethod, { x: leftMargin, y: cursorY, font: bold, size: 10 });
  page.drawText(labelSet.payoutDefault, { x: leftMargin + 120, y: cursorY, font, size: 10 });

  return pdfDoc.save();
};
