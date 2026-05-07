# Game Catalog Schema

## Übersicht

Das Game Catalog Schema definiert die Struktur der lokalen Spielbibliothek.
Es wird in `content/games.sample.json` verwendet und durch `docs/schema/game-catalog.schema.json` formal validierbar.

---

## Felder

### Pflichtfelder pro Spiel

| Feld | Typ | Beschreibung |
|---|---|---|
| `id` | string | Eindeutiger Slug (`kebab-case`) |
| `title` | string | Anzeigename |
| `source` | enum | Herkunft: steam, epic, gog, microsoft-store, nintendo, playstation, xbox, itch, manual |
| `launchType` | enum | Startmethode: steam, exec, url, manual |
| `launchTarget` | string | URI/Befehl zum Starten |
| `coverImage` | string | Relativer Pfad zum Cover-Bild |
| `trailerUrl` | string/null | URL zum Trailer (optional) |
| `players` | object | Spielerinfo |
| `ratings` | object | PEGI/USK — **nur Information, keine Automatik** |
| `parent` | object | Eltern-Kuration — **hat Vorrang vor Ratings** |
| `profiles` | object | Per-Kind-Profil States |

### players

| Feld | Typ | Beschreibung |
|---|---|---|
| `min` | int | Mindestanzahl Spieler |
| `max` | int | Maximalanzahl Spieler |
| `localCoop` | bool | Lokaler Coop möglich? |
| `onlineCoop` | bool | Online Coop möglich? |
| `competitive` | bool | Kompetitiver Modus? |

### ratings

| Feld | Typ | Beschreibung |
|---|---|---|
| `pegi` | int/null | PEGI-Einstufung (3, 7, 12, 16, 18) |
| `usk` | int/null | USK-Einstufung (0, 6, 12, 16, 18) |
| `reasons` | string[] | Rating-Gründe |

> ⚠️ **PEGI/USK sind Informationsfelder, KEINE automatische Wahrheit.**
> Ein Spiel mit PEGI 18 kann trotzdem `approved` sein, wenn ein Elternteil das entscheidet.

### parent

| Feld | Typ | Beschreibung |
|---|---|---|
| `approval` | enum | Globale Eltern-Entscheidung |
| `notes` | string | Freitext-Notiz |
| `reviewedStorePage` | bool | Hat Elternteil die Store-Seite geprüft? |

### profiles

Key-Value: `profileName` → approval state

---

## Erlaubte Approval States

| State | Bedeutung |
|---|---|
| `unknown` | Noch nicht betrachtet |
| `needs-review` | Muss geprüft werden |
| `approved` | Freigegeben — Kind sieht das Spiel |
| `blocked` | Gesperrt — Kind sieht das Spiel nicht |
| `hidden` | Versteckt — wie blocked, aber ohne explizite Nachricht |

---

## Wichtige Regeln

1. **Elternentscheidung hat Vorrang.** Kein Rating blockiert automatisch.
2. **Im Kinderprofil werden nur `approved` Spiele gezeigt.**
3. **Das Schema ist store-unabhängig.** `source` ist informativ, `launchType` bestimmt den Start.
4. **Keine Scraper in diesem Gate.** Alle Daten sind manuell kuratiert.

---

## Sample-Katalog

`content/games.sample.json` enthält 8 Spiele mit diversen States:

| Spiel | Jake | Luke | Parent |
|---|---|---|---|
| LEGO Star Wars | approved | approved | approved |
| Minecraft | approved | approved | approved |
| Rocket League | approved | blocked | approved |
| Stardew Valley | needs-review | unknown | needs-review |
| Fortnite | approved | blocked | blocked |
| Zelda: TotK | approved | hidden | approved |
| Overcooked! 2 | approved | approved | approved |
| Cyberpunk 2077 | blocked | blocked | blocked |
