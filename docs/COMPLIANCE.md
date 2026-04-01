# Compliance / Umfang

Dieses MVP bildet **Standard-Lohnabrechnungen für private Haushalte** ab. Es ist kein offizielles Lohnprogramm und ersetzt keine rechtliche Beratung.

## Unterstützt

* Stundenlohn-Verträge mit Ferienzuschlag oder inkludiertem Ferienanteil.
* AHV/IV/EO und ALV als konfigurierbare Prozentsätze.
* Quellensteuer-Flag (derzeit deaktiviert gemäß Annahmen).
* Manuelle Zu-/Abzüge (z. B. Spesen, Bonus, Abzug).
* Nettolohn-Rundung auf 5 Rappen.
* Historische Reproduzierbarkeit durch gespeicherte Snapshots.

## Nicht unterstützt (aktuell)

* Quellensteuer-Tariftabellen nach Kanton.
* Pensionskasse (BVG) / koordinierter Lohn.
* Detaillierte Unfallversicherung (UVG/UVG-Z) pro Risiko.
* Komplexe Zulagen (Familienzulagen automatisch, Feiertage, 13. Monatslohn).
* Mehrmandanten-Setup oder umfassende Rollenverwaltung.

## Erweiterung

Die Abzüge und Regeln sind im Ordner `payroll-engine/` gekapselt. Weitere Versicherungen oder Steuertabellen können dort ergänzt werden, ohne die UI zu ändern.
