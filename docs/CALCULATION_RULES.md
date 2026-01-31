# Berechnungsregeln

## Geldwerte

* Alle Geldbeträge werden in **Rappen (Integer)** gespeichert, um Rundungsfehler zu vermeiden.

## Bruttolohn

1. **Basislohn** = `Stunden × Stundenansatz`.
2. **Ferienzuschlag** (wenn nicht im Stundenlohn enthalten) = `Basislohn × Ferienzuschlag%`.
3. **Bruttolohn** = `Basislohn + Ferienzuschlag + Bonus + Spesen - Abzüge`.

## Abzüge

* AHV/IV/EO = `Bruttolohn × AHV/IV/EO %`.
* ALV = `Bruttolohn × ALV %`.
* Weitere Abzüge = optional konfigurierbar.

## Nettolohn

* **Nettolohn** = `Bruttolohn - Summe Abzüge`.
* **Rundung**: Nettolohn wird auf **0.05 CHF** gerundet.

## Versionierung

Jede Lohnabrechnung speichert einen **Snapshot** der Berechnung. So bleiben historische Abrechnungen reproduzierbar, auch wenn Raten später geändert werden.
