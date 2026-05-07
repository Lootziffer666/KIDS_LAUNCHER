# Control Contract — Kids Launcher

## Interne Aktionen

Die interne Logik arbeitet mit vier Aktionen. Diese ändern sich **nie**, egal welches Glyph-Profil aktiv ist.

| Interne Aktion | Funktion |
|---|---|
| `confirm` | Spiel starten / Auswahl bestätigen |
| `back` | Zurück / Schließen |
| `info` | Kleines Info-Fenster öffnen |
| `trailer` | Trailer abspielen |

---

## Controller-Mapping

| Aktion | Tastatur (Test) | Gamepad (logisch) |
|---|---|---|
| confirm | Enter | A / Kreuz |
| back | Escape | B / Kreis |
| info | I | X / Quadrat |
| trailer | T | Y / Dreieck |
| Navigation | Pfeiltasten | D-Pad / Left Stick |

---

## Glyph-Profile

Glyphen sind **Anzeigeprofile**, nicht neue Steuerungslogik.
Die interne Aktion bleibt identisch — nur die angezeigte Taste ändert sich.

### Xbox (Standard)

| Aktion | Anzeige |
|---|---|
| confirm | A |
| back | B |
| info | X |
| trailer | Y |

### PlayStation (europäisch)

| Aktion | Anzeige |
|---|---|
| confirm | ✕ |
| back | ○ |
| info | □ |
| trailer | △ |

### Nintendo

| Aktion | Anzeige |
|---|---|
| confirm | B |
| back | A |
| info | Y |
| trailer | X |

---

## Wichtig

- Glyphen sind **Anzeigeprofile**, nicht neue Steuerungslogik
- Die physische Taste auf dem Controller bestimmt die interne Aktion
- Das Glyph-Profil bestimmt nur, welches Symbol in der UI angezeigt wird
- Beispiel: Auf einem Xbox-Controller löst die physische A-Taste `confirm` aus — egal ob das Glyph-Profil Xbox, PlayStation oder Nintendo ist
- Die Glyph-Einstellung wird lokal gespeichert (localStorage)

---

## Verbotene Steuerungsfeatures

- ❌ Kein frei konfigurierbares Input-System
- ❌ Kein Custom-Keybinding
- ❌ Keine Doppelbelegung
- ❌ Kein Combo-System
- ❌ Kein Langdruck-Feature (vorerst)
