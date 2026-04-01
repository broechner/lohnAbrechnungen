# LohnAbrechnungsApp

Eine schlanke, moderne Web-App für Schweizer Lohnabrechnungen im privaten Haushalt. Fokus: **1‑Klick‑Flow** von Mitarbeiter → Stunden → Lohnabrechnung → PDF.

## Stack (bewusst gewählt)

* **Next.js (App Router) + TypeScript**: schnelle Entwicklung, saubere Struktur, SSR/SSR‑Ready.
* **TailwindCSS**: performante UI mit Dark‑Mode.
* **Prisma + SQLite/Postgres**: lokal simpel, Produktion skalierbar.
* **pdf-lib**: serverseitige PDF‑Erzeugung ohne Headless‑Browser.
* **Vitest**: schnelle Tests für Berechnung & Workflow.

## Setup (lokal)

```bash
npm install
cp .env.example .env
npm run db:push
npm run db:seed
npm run dev
```

## Wichtige Umgebungsvariablen

| Variable | Bedeutung | Beispiel |
| --- | --- | --- |
| `DATABASE_URL` | Datenbankverbindung | `file:./dev.db` |

## Produktion

* Verwenden Sie **Postgres** in Produktion.
* Build & Start:

```bash
npm run build
npm run start
```

## Tests

```bash
npm test
```

## Projektstruktur

```
app/                Next.js App Router (UI + API)
api/                Server-Services + Validierung
domain/             Domain-Typen
payroll-engine/     Reine Berechnungslogik
pdf/                PDF-Templates
ui/                 UI-Komponenten + i18n
prisma/             DB-Schema + Seed
```

## Hinweise

* Quellensteuer ist im MVP ausgeschaltet (siehe docs/ASSUMPTIONS.md).
* PDF‑Layout orientiert sich am bereitgestellten Beispiel.
