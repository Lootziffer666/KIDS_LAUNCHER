# Product Contract — Kids Launcher

## Kernversprechen

1. Kind sieht Spiel.
2. Kind drückt Start.
3. Spiel startet.
4. Eltern haben vorher kuratiert.

Das ist der gesamte Flow. Alles andere ist Unterstützung, nicht Hauptfunktion.

---

## Primärer Nutzer

### Kind (Couch-/Controller-Kontext)
- Sieht nur freigegebene Spiele
- Bedient per Controller oder Controller-ähnlichem Keyboard-Mapping
- Braucht keine Texte lesen können um zu spielen
- Keine Entscheidungen außer: welches Spiel

### Elternteil (Curation-/Setup-Kontext)
- Kuratiert die Spielbibliothek
- Gibt Spiele frei oder blockiert sie
- Verwaltet Kinderprofile
- Sieht PEGI/USK als Hilfe, nicht als Automatik

---

## Hauptsysteme

| System | Beschreibung |
|---|---|
| Lokale Spielbibliothek | Spiele werden lokal katalogisiert, nicht gestreamt |
| Elterliche Freigabe | Jedes Spiel hat einen manuellen Approval-State |
| Kinderprofile | Verschiedene Kinder sehen verschiedene Freigaben |
| Controller-first UI | Große Ziele, Couch-Distanz, kein Mouse-first |
| Launch-Adapter | Start über stabile Protokolle (steam://, exec, etc.) |

---

## Nicht Ziel (explizit gesperrt)

- ❌ **Kein Store-Ersatz** — der Launcher browst keine Stores
- ❌ **Keine Community-Features** — keine Chats, Foren, Freundeslisten
- ❌ **Keine Bewertungsautomatik als Wahrheit** — PEGI/USK sind Info, nicht Blocker
- ❌ **Keine riesige Game-Detailseite** — nur kleines Info-Overlay (Gate 8)
- ❌ **Keine automatische pädagogische Entscheidung** — Eltern entscheiden
- ❌ **Keine offene Browser-/Store-Navigation für Kinder** — geschlossenes System

---

## Produktregeln

1. **Elternentscheidung > Rating-Automatik.**
   PEGI 18 bedeutet nicht automatisch blockiert. Ein Elternteil kann es trotzdem freigeben.

2. **Keine große Detailseite.**
   X/Info öffnet ein kleines Overlay. Kein Seitenwechsel, keine Tabs, keine Reviews.

3. **Controller ist Primäreingabe.**
   Maus und Keyboard sind Fallback, nicht Hauptbedienung.

4. **Kinder sehen nur Freigegebenes.**
   Im Kinderprofil tauchen nur Spiele mit `approved` State auf.

5. **Der Launcher startet Spiele. Er verkauft keine.**
   Kein Preis, kein Warenkorb, kein "Jetzt kaufen".
