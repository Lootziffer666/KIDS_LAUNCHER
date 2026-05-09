# 🚪 GATES — KIDS LAUNCHER

> Controller-first. Kid-safe. Sequentiell.

---

## ✅ Abgeschlossen

| Gate | Titel | Status |
|------|-------|--------|
| KL-001 | Repo Audit | ✅ Done |

---

## 🔜 Nächste Gates

### Gate KL-002: Project Scaffold
- **Branch:** `gate/kl-002-scaffold`
- **Ziel:** Android-Projekt initialisieren
- **To-Dos:**
  - [ ] Android-Projekt mit Compose
  - [ ] Gradle Multi-Module
  - [ ] CI/CD Pipeline (GitHub Actions)
  - [ ] Basis-Theme
- **Akzeptanz:** Projekt kompiliert, leere Activity startet
- **Kill:** Nicht-Android-Framework

### Gate KL-003: Gamepad Input Layer
- **Branch:** `gate/kl-003-gamepad-input`
- **Ziel:** Controller als primäre Eingabe
- **To-Dos:**
  - [ ] InputManager für Gamepad-Events
  - [ ] D-Pad Navigation
  - [ ] A=Launch, B=Back
  - [ ] Vibration-Feedback
  - [ ] Touch-Fallback
- **Akzeptanz:** Navigation per Controller durch Dummy-Grid
- **Kill:** Touch-first Design

### Gate KL-004: Game Grid UI
- **Branch:** `gate/kl-004-game-grid`
- **Ziel:** Visuelles Grid installierter Spiele
- **To-Dos:**
  - [ ] Compose LazyGrid mit großen Icons
  - [ ] Fokus-Animation (Scale + Glow)
  - [ ] Kategorien: Favoriten, Zuletzt, Alle
  - [ ] Icons statt Textlabels
- **Akzeptanz:** Grid zeigt Spiele, Controller-navigierbar
- **Kill:** Listenansicht oder kleine Icons

### Gate KL-005: Parental Gate
- **Branch:** `gate/kl-005-parental-gate`
- **Ziel:** PIN-geschützter Elternbereich
- **To-Dos:**
  - [ ] PIN-Eingabe (4–6 Ziffern)
  - [ ] App-Whitelist verwalten
  - [ ] Zeitlimits pro Tag
  - [ ] Kein Exit ohne PIN
- **Akzeptanz:** Settings nur mit PIN
- **Kill:** Settings für Kinder sichtbar

### Gate KL-006: App Discovery
- **Branch:** `gate/kl-006-app-discovery`
- **Ziel:** Spiele automatisch erkennen und filtern
- **To-Dos:**
  - [ ] PackageManager-Scan
  - [ ] Game/Non-Game Kategorisierung
  - [ ] Eltern-Whitelist als Override
  - [ ] App-Icon in hoher Auflösung
- **Akzeptanz:** Spiele automatisch erkannt
- **Kill:** Nur manuelle Listen

### Gate KL-007: Themes & Sound
- **Branch:** `gate/kl-007-themes`
- **Ziel:** Kinderfreundliche Themes
- **To-Dos:**
  - [ ] 3 Themes (Space, Jungle, Ocean)
  - [ ] UI-Sounds optional
  - [ ] Background-Animation
  - [ ] Theme-Wechsel ohne Neustart
- **Akzeptanz:** Themes funktionieren
- **Kill:** In-App-Kauf für Themes
