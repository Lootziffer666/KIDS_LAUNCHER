# Launch Adapter v0

## Übersicht

Der Launch Adapter entscheidet anhand von `launchType`, wie ein Spiel gestartet wird.
In v0 sind die meisten Adapter Stubs — sie loggen die Intention, führen aber nichts echtes aus.

---

## Unterstützte Launch Types

### `steam`
- Nutzt Steam-Protokoll-URI: `steam://rungameid/<id>`
- v0: Loggt Intent, zeigt "Launch requested"
- Später: `shell.openExternal()` in Electron/Native

### `edge-xcloud`
- Xbox Cloud Gaming via Edge Kiosk-Modus
- Zielformat: `https://www.xbox.com/play/games/<game>/<id>`
- Kommando: `msedge --kiosk "<url>" --edge-kiosk-type=fullscreen`
- **Session-Regel:** Jeder Start = genau eine Edge-Session. Session-Ende killt diese Session. Keine offenen Alt-Tabs.
- v0: Loggt Kommando, zeigt "Launch requested"
- `launchMode`: `fullscreen-edge-session`

### `local-stub`
- Für Spiele, die nicht vom Launcher gestartet werden können (z.B. Nintendo Switch)
- Zeigt "Nicht verfügbar" statt Crash
- v0: Sofort implementiert

### `exec`
- Generischer Start über Protokoll/Executable
- v0: Loggt Intent

---

## Fehlerzustände

| Status | Bedeutung | UI |
|---|---|---|
| `requested` | Adapter hat Launch-Request erstellt | 🚀 + Auto-Close nach 2.5s |
| `not-available` | Spiel kann nicht gestartet werden | ⚠️ + manuell schließen |
| `failed` | Fehler beim Starten | ❌ + manuell schließen |

---

## Datenmodell-Erweiterung

```json
{
  "launchType": "edge-xcloud",
  "launchTarget": "https://www.xbox.com/play/games/fortnite/BT5P2X999VH2",
  "launchMode": "fullscreen-edge-session"
}
```

`launchMode` ist optional. Erlaubte Werte:
- `protocol` — Protokoll-URI (steam, exec)
- `fullscreen-edge-session` — Edge Kiosk für Cloud Gaming
- `stub` — Nicht startbar

---

## Session-Regeln (für spätere Gates)

```
1. Jeder Spielstart erzeugt genau eine Edge-Session.
2. Session-Ende killt diese Session.
3. Keine offenen Alt-Tabs sammeln.
4. Launcher überwacht Sessions (Gate 16).
```
