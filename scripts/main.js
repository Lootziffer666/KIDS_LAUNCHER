/* Kids Launcher — Main Script
   Gate 6: Library Grid v0
   Gate 7: Glyph Profiles (Xbox / PlayStation / Nintendo)
   - Display-only toggle, internal actions unchanged
   - Stored in localStorage */

'use strict';

// ── Glyph Profile System ──
const GlyphProfiles = (() => {
  const STORAGE_KEY = 'kids-launcher-glyph-profile';

  // Internal actions → display labels per profile
  const profiles = {
    xbox: {
      label: 'Xbox',
      confirm: 'A',
      back:    'B',
      info:    'X',
      trailer: 'Y'
    },
    playstation: {
      label: 'PlayStation',
      confirm: '✕',
      back:    '○',
      info:    '□',
      trailer: '△'
    },
    nintendo: {
      label: 'Nintendo',
      confirm: 'B',
      back:    'A',
      info:    'Y',
      trailer: 'X'
    }
  };

  let current = 'xbox';

  function load() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && profiles[saved]) {
      current = saved;
    }
    return current;
  }

  function save() {
    localStorage.setItem(STORAGE_KEY, current);
  }

  function get() {
    return profiles[current];
  }

  function getName() {
    return current;
  }

  function set(name) {
    if (!profiles[name]) {
      console.warn(`Unknown glyph profile: ${name}`);
      return false;
    }
    current = name;
    save();
    return true;
  }

  function cycle() {
    const names = Object.keys(profiles);
    const idx = names.indexOf(current);
    current = names[(idx + 1) % names.length];
    save();
    return current;
  }

  function getAll() {
    return Object.keys(profiles);
  }

  return { load, get, getName, set, cycle, getAll };
})();


// ── Main App ──
const App = (() => {
  // ── State ──
  let games = [];
  let filteredGames = [];
  let focusIndex = 0;
  let activeProfile = 'jake';

  // ── DOM ──
  const grid = document.getElementById('library-grid');
  const loadingText = document.getElementById('loading-text');
  const focusBar = document.getElementById('focus-bar');
  const toast = document.getElementById('toast');
  const infoOverlay = document.getElementById('info-overlay');

  // ── Init ──
  async function init() {
    // Load glyph profile from localStorage
    GlyphProfiles.load();

    try {
      const res = await fetch('content/games.sample.json');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      games = await res.json();
      console.log(`Loaded ${games.length} games.`);
    } catch (err) {
      console.error('Failed to load game catalog:', err);
      loadingText.textContent = 'Fehler beim Laden der Bibliothek.';
      return;
    }

    filterByProfile();
    render();
    bindKeys();
    updateGlyphIndicator();
    updateFocusBarGlyphs();
    console.log(`Kids Launcher ready. Profile: ${activeProfile}, Glyphs: ${GlyphProfiles.getName()}`);
  }

  // ── Profile filter ──
  function filterByProfile() {
    filteredGames = games.filter(g => {
      const profileState = g.profiles && g.profiles[activeProfile];
      return profileState === 'approved';
    });
    focusIndex = 0;
  }

  // ── Render ──
  function render() {
    if (filteredGames.length === 0) {
      loadingText.textContent = 'Keine Spiele freigegeben.';
      loadingText.style.display = '';
      grid.style.display = 'none';
      focusBar.style.display = 'none';
      return;
    }

    loadingText.style.display = 'none';
    grid.style.display = 'grid';
    focusBar.style.display = 'flex';

    grid.innerHTML = '';
    filteredGames.forEach((game, i) => {
      const card = document.createElement('div');
      card.className = 'game-card';
      card.setAttribute('tabindex', '0');
      card.setAttribute('data-index', i);
      card.setAttribute('data-game-id', game.id);
      if (i === focusIndex) card.setAttribute('data-focused', 'true');

      const cover = document.createElement('div');
      cover.className = 'game-card__cover-placeholder';
      cover.textContent = game.title.charAt(0);
      card.appendChild(cover);

      const title = document.createElement('div');
      title.className = 'game-card__title';
      title.textContent = game.title;
      card.appendChild(title);

      grid.appendChild(card);
    });

    updateFocus();
  }

  // ── Focus management ──
  function updateFocus() {
    const cards = grid.querySelectorAll('.game-card');
    cards.forEach((card, i) => {
      card.setAttribute('data-focused', i === focusIndex ? 'true' : 'false');
      if (i === focusIndex) card.focus();
    });
  }

  function getGridColumns() {
    if (filteredGames.length === 0) return 1;
    const firstCard = grid.querySelector('.game-card');
    if (!firstCard) return 1;
    const gridWidth = grid.offsetWidth;
    const cardWidth = firstCard.offsetWidth;
    const gap = parseFloat(getComputedStyle(grid).gap) || 24;
    return Math.max(1, Math.floor((gridWidth + gap) / (cardWidth + gap)));
  }

  function moveFocus(direction) {
    if (filteredGames.length === 0) return;
    const cols = getGridColumns();
    let next = focusIndex;

    switch (direction) {
      case 'left':  next = Math.max(0, focusIndex - 1); break;
      case 'right': next = Math.min(filteredGames.length - 1, focusIndex + 1); break;
      case 'up':    next = Math.max(0, focusIndex - cols); break;
      case 'down':  next = Math.min(filteredGames.length - 1, focusIndex + cols); break;
    }

    if (next !== focusIndex) {
      focusIndex = next;
      updateFocus();
    }
  }

  // ── Actions ──
  function actionConfirm() {
    if (filteredGames.length === 0) return;
    const game = filteredGames[focusIndex];
    showToast(`Launch requested: ${game.title}`);
    console.log(`[confirm] Would launch: ${game.launchTarget}`);
  }

  function actionBack() {
    if (infoOverlay.getAttribute('data-visible') === 'true') {
      closeInfo();
      return;
    }
    showToast('Zurück');
  }

  function actionInfo() {
    if (filteredGames.length === 0) return;
    const game = filteredGames[focusIndex];
    openInfo(game);
  }

  function actionTrailer() {
    if (filteredGames.length === 0) return;
    const game = filteredGames[focusIndex];
    if (game.trailerUrl) {
      showToast(`Trailer: ${game.title}`);
      console.log(`[trailer] URL: ${game.trailerUrl}`);
    } else {
      showToast('Kein Trailer verfügbar.');
    }
  }

  // ── Info Overlay (minimal — Gate 8 completes) ──
  function openInfo(game) {
    infoOverlay.setAttribute('data-visible', 'true');
    const g = GlyphProfiles.get();
    infoOverlay.innerHTML = `
      <div class="info-panel">
        <h2 class="info-panel__title">${game.title}</h2>
        <p class="info-panel__hint">Info-Overlay (Gate 8 baut das aus)</p>
        <p class="info-panel__close-hint">${g.back} / Escape → Schließen</p>
      </div>
    `;
  }

  function closeInfo() {
    infoOverlay.setAttribute('data-visible', 'false');
    infoOverlay.innerHTML = '';
    updateFocus();
  }

  // ── Toast ──
  function showToast(message) {
    toast.textContent = message;
    toast.setAttribute('data-visible', 'true');
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
      toast.setAttribute('data-visible', 'false');
    }, 2000);
  }

  // ── Glyph UI Updates ──
  function updateFocusBarGlyphs() {
    const g = GlyphProfiles.get();
    const keys = focusBar.querySelectorAll('.focus-bar__key');
    keys.forEach(key => {
      const action = key.getAttribute('data-action');
      if (action && g[action]) {
        key.textContent = g[action];
      }
    });
  }

  function updateGlyphIndicator() {
    let indicator = document.getElementById('glyph-indicator');
    if (!indicator) {
      indicator = document.createElement('div');
      indicator.id = 'glyph-indicator';
      indicator.className = 'glyph-indicator';
      document.getElementById('app').appendChild(indicator);
    }
    const profile = GlyphProfiles.get();
    indicator.textContent = `🎮 ${profile.label}`;
    indicator.title = 'Taste G: Glyph-Profil wechseln';
  }

  // ── Keyboard (controller simulation) ──
  function bindKeys() {
    document.addEventListener('keydown', (e) => {
      const infoOpen = infoOverlay.getAttribute('data-visible') === 'true';

      switch (e.key) {
        case 'ArrowLeft':  if (!infoOpen) moveFocus('left');  break;
        case 'ArrowRight': if (!infoOpen) moveFocus('right'); break;
        case 'ArrowUp':    if (!infoOpen) moveFocus('up');    e.preventDefault(); break;
        case 'ArrowDown':  if (!infoOpen) moveFocus('down');  e.preventDefault(); break;
        case 'Enter':      actionConfirm(); break;
        case 'Escape':     actionBack();    break;
        case 'i': case 'I': actionInfo();   break;
        case 't': case 'T': actionTrailer(); break;
        // Glyph profile cycling
        case 'g': case 'G':
          const newProfile = GlyphProfiles.cycle();
          updateFocusBarGlyphs();
          updateGlyphIndicator();
          showToast(`Glyph-Profil: ${GlyphProfiles.get().label}`);
          console.log(`Glyph profile: ${newProfile}`);
          break;
        default: return;
      }
      e.stopPropagation();
    });
  }

  // ── Profile switching (for testing) ──
  function switchProfile(name) {
    activeProfile = name;
    filterByProfile();
    render();
    showToast(`Profil: ${name}`);
    console.log(`Switched to profile: ${name}`);
  }

  // ── Glyph profile switching (for testing) ──
  function setGlyphProfile(name) {
    if (GlyphProfiles.set(name)) {
      updateFocusBarGlyphs();
      updateGlyphIndicator();
      showToast(`Glyph-Profil: ${GlyphProfiles.get().label}`);
    }
  }

  return { init, switchProfile, setGlyphProfile };
})();

document.addEventListener('DOMContentLoaded', () => App.init());
window.App = App;
