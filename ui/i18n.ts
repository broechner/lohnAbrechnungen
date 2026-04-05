export type Locale = "de" | "en";

export const uiStrings: Record<Locale, Record<string, string>> = {
  de: {
    appName: "LohnAbrechnungsApp",
    dashboardTitle: "Dashboard",
    employeePicker: "Mitarbeiter auswählen",
    quickHours: "Stunden erfassen",
    generateSlip: "Lohnabrechnung erstellen",
    exportShare: "Exportieren & Teilen",
    period: "Periode",
    hours: "Stunden",
    settings: "Einstellungen",
    employerSettings: "Arbeitgeber",
    employees: "Mitarbeitende",
    contracts: "Verträge",
    timeEntries: "Stundenerfassung",
    reports: "Lohndeklaration",
    payslips: "Lohnzettel",
    darkMode: "Dark Mode",
    language: "Sprache",
    exportPdf: "PDF herunterladen",
    shareWhatsapp: "WhatsApp öffnen",
    mailDraft: "E-Mail Entwurf öffnen",
    save: "Speichern",
    remove: "Löschen",
    upload: "Hochladen",
    refresh: "Aktualisieren"
  },
  en: {
    appName: "LohnAbrechnungsApp",
    dashboardTitle: "Dashboard",
    employeePicker: "Select employee",
    quickHours: "Enter hours",
    generateSlip: "Generate payslip",
    exportShare: "Export & Share",
    period: "Period",
    hours: "Hours",
    settings: "Settings",
    employerSettings: "Employer",
    employees: "Employees",
    contracts: "Contracts",
    timeEntries: "Time entries",
    reports: "Payroll report",
    payslips: "Payslips",
    darkMode: "Dark mode",
    language: "Language",
    exportPdf: "Download PDF",
    shareWhatsapp: "Open WhatsApp",
    mailDraft: "Open email draft",
    save: "Save",
    remove: "Delete",
    upload: "Upload",
    refresh: "Refresh"
  }
};

export const getString = (locale: Locale, key: string): string => {
  return uiStrings[locale][key] ?? key;
};
