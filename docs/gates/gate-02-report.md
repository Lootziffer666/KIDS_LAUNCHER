# Gate 2 Report — Product Contract / Hard Constraints

**Repo:** `Lootziffer666/KIDS_LAUNCHER`
**Branch:** `agent/gate-02-product-contract`
**Datum:** 2026-05-07

---

## Ergebnis

### ✅ Produktvertrag dokumentiert
- Kernversprechen: Kind sieht → drückt → startet → Eltern haben kuratiert
- Primärnutzer: Kind (Controller/Couch) + Elternteil (Curation/Setup)
- Hauptsysteme: 5 definiert
- Produktregeln: 5 harte Regeln

### ✅ Non-Goals dokumentiert
- 10 explizit gesperrte Richtungen
- Grenzfälle definiert (Trailer, Notizen, Profile, Coop-Info)

### ✅ Controller-Vertrag dokumentiert
- 4 interne Aktionen: confirm, back, info, trailer
- Tastatur-Testmapping: Enter, Escape, I, T, Pfeiltasten
- 3 Glyph-Profile: Xbox, PlayStation (EU), Nintendo
- Verbotene Steuerungsfeatures aufgelistet

---

## Akzeptanzkriterien — Prüfung

| Kriterium | Status |
|---|---|
| Alle harten Produktregeln in Docs | ✅ |
| A/B/X/Y-Logik dokumentiert | ✅ |
| "Keine große Detailseite" explizit gesperrt | ✅ |
| Parental Curation > automatische Ratings | ✅ |

## Kill-Kriterien — Prüfung

| Kill-Kriterium | Status |
|---|---|
| Agent schlägt Store-Browsing vor | ✅ Bestanden — explizit gesperrt |
| Agent baut Detailseitenfluss | ✅ Bestanden — nur Overlay erlaubt |
| PEGI/USK als automatische Sperrlogik | ✅ Bestanden — nur Info, Eltern entscheiden |

## Output-Dateien

- `docs/product-contract.md` ✅
- `docs/non-goals.md` ✅
- `docs/control-contract.md` ✅
- `docs/gates/gate-02-report.md` ✅
