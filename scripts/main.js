/* Kids Launcher — Main Script
   Gate 6: Library Grid v0
   Gate 7: Glyph Profiles (Xbox / PlayStation / Nintendo)
   Gate 8: Small Info Window
   Gate 9: Trailer Overlay v0
   Gate 10: Launch Adapter v0
   - Controller-first, couch-distance UI
   - No external navigation from child context */

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
  const trailerOverlay = document.getElementById('trailer-overlay');
  const launchOverlay = document.getElementById('launch-overlay');

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
    // Don't launch if trailer is open
    if (trailerOverlay.getAttribute('data-visible') === 'true') return;
    // Close info overlay if open
    if (infoOverlay.getAttribute('data-visible') === 'true') {
      closeInfo();
    }
    // Don't launch if launch overlay already showing
    if (launchOverlay.getAttribute('data-visible') === 'true') return;
    
    const game = filteredGames[focusIndex];
    openLaunchOverlay(game);
  }

  // ── Launch Overlay (Gate 10) ──
  function openLaunchOverlay(game) {
    launchOverlay.setAttribute('data-visible', 'true');
    const g = GlyphProfiles.get();
    
    // Show "Preparing" state
    const adapterInfo = LaunchAdapter.getAdapterInfo(game.launchType);
    const adapterLabel = adapterInfo ? adapterInfo.label : game.launchType;
    
    launchOverlay.innerHTML = `
      <div class="launch-panel" role="dialog" aria-label="Launch: ${game.title}">
        <h2 class="launch-panel__title">${game.title}</h2>
        <div class="launch-panel__status" id="launch-status">
          <div class="launch-panel__status-icon launch-panel__status-icon--preparing">⏳</div>
          <p class="launch-panel__status-text">Preparing…</p>
          <p class="launch-panel__status-detail">${adapterLabel}</p>
        </div>
      </div>
    `;
    
    // Simulate brief adapter delay, then execute
    setTimeout(() => {
      const result = LaunchAdapter.launch(game);
      showLaunchResult(game, result, g);
    }, 600);
  }

  function showLaunchResult(game, result, g) {
    const statusEl = document.getElementById('launch-status');
    if (!statusEl) return;
    
    let icon, statusClass;
    switch (result.status) {
      case 'requested':
        icon = '🚀';
        statusClass = 'launch-panel__status-icon--success';
        break;
      case 'not-available':
        icon = '⚠️';
        statusClass = 'launch-panel__status-icon--unavailable';
        break;
      case 'failed':
        icon = '❌';
        statusClass = 'launch-panel__status-icon--failed';
        break;
      default:
        icon = '❓';
        statusClass = '';
    }
    
    statusEl.innerHTML = `
      <div class="launch-panel__status-icon ${statusClass}">${icon}</div>
      <p class="launch-panel__status-text">${result.message}</p>
      ${result.detail ? `<p class="launch-panel__status-detail">${result.detail}</p>` : ''}
      <div class="launch-panel__actions">
        <span class="launch-panel__action">${g.back} Schließen</span>
      </div>
    `;
    
    // Auto-close on success after 2.5s
    if (result.status === 'requested') {
      setTimeout(() => {
        closeLaunchOverlay();
      }, 2500);
    }
  }

  function closeLaunchOverlay() {
    launchOverlay.setAttribute('data-visible', 'false');
    launchOverlay.innerHTML = '';
    updateFocus();
  }

  function actionBack() {
    if (launchOverlay.getAttribute('data-visible') === 'true') {
      closeLaunchOverlay();
      return;
    }
    if (trailerOverlay.getAttribute('data-visible') === 'true') {
      closeTrailer();
      return;
    }
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
    // Don't open trailer if info is open
    if (infoOverlay.getAttribute('data-visible') === 'true') return;
    // Don't open if trailer already open
    if (trailerOverlay.getAttribute('data-visible') === 'true') return;
    const game = filteredGames[focusIndex];
    openTrailer(game);
  }

  // ── Trailer Overlay (Gate 9) ──
  function openTrailer(game) {
    trailerOverlay.setAttribute('data-visible', 'true');
    const g = GlyphProfiles.get();

    if (!game.trailerUrl) {
      // Empty state — friendly message, no error
      trailerOverlay.innerHTML = `
        <div class="trailer-panel" role="dialog" aria-label="Trailer: ${game.title}">
          <h2 class="trailer-panel__title">${game.title}</h2>
          <div class="trailer-panel__empty">
            <div class="trailer-panel__empty-icon">🎬</div>
            <p class="trailer-panel__empty-text">Kein Trailer verfügbar.</p>
            <p class="trailer-panel__empty-hint">Vielleicht wird später einer hinzugefügt.</p>
          </div>
          <div class="trailer-panel__actions">
            <span class="trailer-panel__action">${g.back} Schließen</span>
          </div>
        </div>
      `;
      console.log(`[trailer] No trailer for: ${game.id}`);
      return;
    }

    // Extract YouTube video ID for controlled embed
    const ytId = extractYouTubeId(game.trailerUrl);

    if (ytId) {
      // Controlled YouTube embed: no related, no annotations, no autoplay
      // youtube-nocookie.com for enhanced privacy
      trailerOverlay.innerHTML = `
        <div class="trailer-panel trailer-panel--video" role="dialog" aria-label="Trailer: ${game.title}">
          <h2 class="trailer-panel__title">${game.title}</h2>
          <div class="trailer-panel__video-container">
            <iframe
              class="trailer-panel__iframe"
              src="https://www.youtube-nocookie.com/embed/${ytId}?rel=0&modestbranding=1&showinfo=0&iv_load_policy=3&fs=0&disablekb=0"
              title="Trailer: ${game.title}"
              allow="accelerometer; encrypted-media; gyroscope"
              allowfullscreen="false"
              frameborder="0"
              sandbox="allow-scripts allow-same-origin"
            ></iframe>
          </div>
          <div class="trailer-panel__actions">
            <span class="trailer-panel__action">${g.back} Schließen</span>
          </div>
        </div>
      `;
      console.log(`[trailer] Embedded YouTube (nocookie): ${ytId}`);
    } else {
      // Non-YouTube URL: show placeholder with URL info, don't navigate away
      trailerOverlay.innerHTML = `
        <div class="trailer-panel" role="dialog" aria-label="Trailer: ${game.title}">
          <h2 class="trailer-panel__title">${game.title}</h2>
          <div class="trailer-panel__placeholder">
            <div class="trailer-panel__placeholder-icon">🎬</div>
            <p class="trailer-panel__placeholder-text">Trailer vorhanden</p>
            <p class="trailer-panel__placeholder-hint">Externer Player wird in einer späteren Version kontrolliert eingebunden.</p>
          </div>
          <div class="trailer-panel__actions">
            <span class="trailer-panel__action">${g.back} Schließen</span>
          </div>
        </div>
      `;
      console.log(`[trailer] Non-YouTube URL (stub): ${game.trailerUrl}`);
    }
  }

  function closeTrailer() {
    trailerOverlay.setAttribute('data-visible', 'false');
    // Remove iframe to stop playback immediately
    trailerOverlay.innerHTML = '';
    updateFocus();
  }

  function extractYouTubeId(url) {
    if (!url) return null;
    // Match youtube.com/watch?v=ID, youtu.be/ID, youtube.com/embed/ID
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/
    ];
    for (const p of patterns) {
      const m = url.match(p);
      if (m) return m[1];
    }
    return null;
  }

  // ── Info Overlay (Gate 8: Small Info Window) ──
  function openInfo(game) {
    infoOverlay.setAttribute('data-visible', 'true');
    const g = GlyphProfiles.get();
    
    // Players info
    const playerRange = game.players.min === game.players.max
      ? `${game.players.min}`
      : `${game.players.min}–${game.players.max}`;
    
    const coopLines = [];
    coopLines.push(`Spieler: ${playerRange}`);
    coopLines.push(`Lokal Coop: ${game.players.localCoop ? 'Ja' : 'Nein'}`);
    coopLines.push(`Online Coop: ${game.players.onlineCoop ? 'Ja' : 'Nein'}`);
    coopLines.push(`Kompetitiv: ${game.players.competitive ? 'Ja' : 'Nein'}`);
    
    // Ratings (info only!)
    let ratingsHtml = '';
    if (game.ratings.pegi || game.ratings.usk) {
      const parts = [];
      if (game.ratings.pegi) parts.push(`PEGI ${game.ratings.pegi}`);
      if (game.ratings.usk) parts.push(`USK ${game.ratings.usk}`);
      ratingsHtml = `<div class="info-panel__ratings">${parts.join(' · ')}`;
      if (game.ratings.reasons && game.ratings.reasons.length > 0) {
        ratingsHtml += `<br><span class="info-panel__reasons">${game.ratings.reasons.join(', ')}</span>`;
      }
      ratingsHtml += `</div>`;
    }
    
    // Parent note
    let noteHtml = '';
    if (game.parent && game.parent.notes && game.parent.notes.trim()) {
      noteHtml = `<div class="info-panel__note">📝 ${game.parent.notes}</div>`;
    }
    
    infoOverlay.innerHTML = `
      <div class="info-panel" role="dialog" aria-label="Spielinfo: ${game.title}">
        <h2 class="info-panel__title">${game.title}</h2>
        <div class="info-panel__players">
          ${coopLines.map(l => `<div class="info-panel__line">${l}</div>`).join('')}
        </div>
        ${ratingsHtml}
        ${noteHtml}
        <div class="info-panel__actions">
          <span class="info-panel__action">${g.confirm} Start</span>
          <span class="info-panel__action">${g.back} Schließen</span>
        </div>
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
      const trailerOpen = trailerOverlay.getAttribute('data-visible') === 'true';
      const launchOpen = launchOverlay.getAttribute('data-visible') === 'true';
      const overlayOpen = infoOpen || trailerOpen || launchOpen;

      switch (e.key) {
        case 'ArrowLeft':  if (!overlayOpen) moveFocus('left');  break;
        case 'ArrowRight': if (!overlayOpen) moveFocus('right'); break;
        case 'ArrowUp':    if (!overlayOpen) moveFocus('up');    e.preventDefault(); break;
        case 'ArrowDown':  if (!overlayOpen) moveFocus('down');  e.preventDefault(); break;
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
