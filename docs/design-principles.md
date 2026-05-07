# Design Principles — Kids Launcher

## Kernprinzipien

### 1. Controller-first
Die gesamte Bedienung ist für Controller designt. Maus und Tastatur sind Fallback/Test-Tools, nicht primäre Eingabe.

### 2. Couch Distance Readable
Alle Texte, Icons und Fokuszustände müssen aus 2–3 Meter Entfernung auf einem Fernseher erkennbar sein.

### 3. Big Targets
Game-Cards sind groß. Buttons sind groß. Keine winzigen Desktop-Controls als Hauptbedienung.

### 4. Warm-White / Calm Library Surface
Die Oberfläche ist warm, ruhig und einladend. Kein kaltes Schwarz, kein grelles Neon. Ein dunkles, warmes Violett-Blau als Basis, warmes Weiß als Textfarbe.

### 5. Game Art May Carry Emotion
Die Cover-Bilder der Spiele bringen Farbe und Emotion. Die UI selbst bleibt zurückhaltend.

### 6. UI Itself Stays Simple
Keine überladenen Panels, keine Dashboard-Ästhetik, keine Shop-Hektik.

---

## Verboten

| Verboten | Warum |
|---|---|
| Dashboard | Ist kein Analytics-Tool |
| Dense Panels | Nicht couch-tauglich |
| Store Noise | Ist kein Store — keine Preise, Badges, Rabatte |
| Tiny Desktop Controls | Nicht controller-tauglich |
| Sidebar-Menü als Hauptinteraktion | Zu versteckt, zu mausig |
| Mouse-first UI als Standard | Controller ist Primäreingabe |
| Neon / Cyberpunk | Passt nicht zur Kinder-/Familien-Bibliothek |
| Kartenhölle mit winziger Metainfo | Gegen Couch-Readability |

---

## Farbpalette

| Token | Hex | Verwendung |
|---|---|---|
| `--color-bg` | `#1b1b2f` | Hintergrund — tiefes, ruhiges Dunkelblau |
| `--color-surface` | `#252540` | Karten, Panels, Info-Overlay |
| `--color-text` | `#f5f0eb` | Primärtext — warmes Weiß |
| `--color-muted` | `#8b8ba0` | Sekundärtext, Hinweise |
| `--color-focus` | `#ffd166` | Fokusring — Gold, klar sichtbar |
| `--color-approved` | `#06d6a0` | Eltern-Freigabe |
| `--color-blocked` | `#ef476f` | Blockiert/Hidden |

---

## Typografie

**Font: Nunito** — rund, freundlich, kindgerecht, gut lesbar auf Bildschirmen.

- Display/Titel: Nunito 800
- Body: Nunito 400–600
- Alle Größen über `clamp()` für responsive Skalierung

---

## Fokus-Konzept

- Fokussiertes Element bekommt einen 4px goldenen Ring (`--color-focus`)
- Zusätzlich: leichte Skalierung (1.04×) + Glow-Shadow
- Focus-Bar am unteren Rand zeigt verfügbare Aktionen mit aktuellen Glyph-Symbolen
- Kein Hover als primäre Interaktion
