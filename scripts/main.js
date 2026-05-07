/* Kids Launcher — Main Script
   Gate 6: Library Grid v0
   - Loads games from content/games.sample.json
   - Filters by active profile (only "approved" games shown)
   - Keyboard-based controller simulation
   - No real launches — only "Launch requested" toast */

'use strict';

const App = (() => {
  // ── State ──
  let games = [];
  let filteredGames = [];
  let focusIndex = 0;
  let activeProfile = 'jake'; // default child profile

  // ── DOM ──
  const grid = document.getElementById('library-grid');
  const loadingText = document.getElementById('loading-text');
  const focusBar = document.getElementById('focus-bar');
  const toast = document.getElementById('toast');
  const infoOverlay = document.getElementById('info-overlay');

  // ── Init ──
  async function init() {
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
    console.log(`Kids Launcher ready. Profile: ${activeProfile}`);
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

      // Cover image with fallback
      const cover = document.createElement('div');
      cover.className = 'game-card__cover-placeholder';
      cover.textContent = game.title.charAt(0);
      card.appendChild(cover);

      // Title overlay
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
    const gridEl = grid;
    const firstCard = gridEl.querySelector('.game-card');
    if (!firstCard) return 1;
    const gridWidth = gridEl.offsetWidth;
    const cardWidth = firstCard.offsetWidth;
    const gap = parseFloat(getComputedStyle(gridEl).gap) || 24;
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
    // Close info overlay if open
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

  // ── Info Overlay (minimal — Gate 8 will complete) ──
  function openInfo(game) {
    infoOverlay.setAttribute('data-visible', 'true');
    infoOverlay.innerHTML = `
      <div class="info-panel">
        <h2 class="info-panel__title">${game.title}</h2>
        <p class="info-panel__hint">Info-Overlay (Gate 8 baut das aus)</p>
        <p class="info-panel__close-hint">B / Escape → Schließen</p>
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

  // ── Keyboard (controller simulation) ──
  function bindKeys() {
    document.addEventListener('keydown', (e) => {
      // Skip if info overlay is open (only B/Escape to close)
      const infoOpen = infoOverlay.getAttribute('data-visible') === 'true';

      switch (e.key) {
        case 'ArrowLeft':  if (!infoOpen) moveFocus('left');  break;
        case 'ArrowRight': if (!infoOpen) moveFocus('right'); break;
        case 'ArrowUp':    if (!infoOpen) moveFocus('up');    e.preventDefault(); break;
        case 'ArrowDown':  if (!infoOpen) moveFocus('down');  e.preventDefault(); break;
        case 'Enter':      actionConfirm(); break;  // A / Confirm
        case 'Escape':     actionBack();    break;  // B / Back
        case 'i': case 'I': actionInfo();   break;  // X / Info
        case 't': case 'T': actionTrailer(); break; // Y / Trailer
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

  // Expose for console testing
  return { init, switchProfile };
})();

document.addEventListener('DOMContentLoaded', () => App.init());

// Expose globally for console testing
window.App = App;
