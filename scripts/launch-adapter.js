/* Kids Launcher — Launch Adapter v0
   Gate 10: Steam + Xbox Cloud Edge Stub + Local Stub
   
   Rules:
   - No direct URL opening from child context
   - Adapter decides based on launchType
   - Unsupported types handled gracefully
   - v0: mostly stubs/logs, real execution comes later */

'use strict';

const LaunchAdapter = (() => {
  
  // ── Supported launch types ──
  const adapters = {
    
    // Steam: protocol URI
    steam: {
      label: 'Steam',
      canLaunch: true,
      execute(game) {
        // In a real Electron/native context this would use shell.openExternal
        // In web prototype: log the intent, show status
        console.log(`[LaunchAdapter:steam] Would execute: ${game.launchTarget}`);
        return {
          status: 'requested',
          message: `Steam Launch: ${game.title}`,
          detail: game.launchTarget,
          command: game.launchTarget
        };
      }
    },
    
    // Xbox Cloud Gaming via Edge kiosk mode
    'edge-xcloud': {
      label: 'Xbox Cloud',
      canLaunch: true,
      execute(game) {
        const mode = game.launchMode || 'fullscreen-edge-session';
        const target = game.launchTarget;
        
        // v0: Document the intent, don't actually spawn process
        const edgeCommand = `msedge --kiosk "${target}" --edge-kiosk-type=fullscreen`;
        
        console.log(`[LaunchAdapter:edge-xcloud] Would launch Edge fullscreen:`);
        console.log(`  Target: ${target}`);
        console.log(`  Mode: ${mode}`);
        console.log(`  Command: ${edgeCommand}`);
        console.log(`  Session rule: One session per launch. Kill on exit.`);
        
        return {
          status: 'requested',
          message: `Xbox Cloud: ${game.title}`,
          detail: `Edge fullscreen → ${target}`,
          command: edgeCommand,
          sessionRule: 'single-session-kill-on-exit'
        };
      }
    },
    
    // Local stub: for games not launchable from web (e.g. Switch)
    'local-stub': {
      label: 'Lokal',
      canLaunch: false,
      execute(game) {
        console.log(`[LaunchAdapter:local-stub] Not launchable from launcher: ${game.title}`);
        return {
          status: 'not-available',
          message: `${game.title}`,
          detail: 'Dieses Spiel kann nicht direkt vom Launcher gestartet werden.',
          command: null
        };
      }
    },
    
    // Exec: generic executable/protocol (future use)
    exec: {
      label: 'Programm',
      canLaunch: true,
      execute(game) {
        console.log(`[LaunchAdapter:exec] Would execute: ${game.launchTarget}`);
        return {
          status: 'requested',
          message: `Start: ${game.title}`,
          detail: game.launchTarget,
          command: game.launchTarget
        };
      }
    }
  };

  // ── Main launch function ──
  function launch(game) {
    if (!game) {
      return { status: 'failed', message: 'Kein Spiel ausgewählt.', detail: null, command: null };
    }
    
    if (!game.launchTarget) {
      return { status: 'failed', message: `${game.title}: Kein Launch-Ziel definiert.`, detail: null, command: null };
    }
    
    const type = game.launchType;
    const adapter = adapters[type];
    
    if (!adapter) {
      console.warn(`[LaunchAdapter] Unsupported launchType: ${type}`);
      return {
        status: 'not-available',
        message: `${game.title}: Launch-Typ "${type}" nicht unterstützt.`,
        detail: `launchType: ${type}`,
        command: null
      };
    }
    
    try {
      return adapter.execute(game);
    } catch (err) {
      console.error(`[LaunchAdapter] Error launching ${game.id}:`, err);
      return {
        status: 'failed',
        message: `Fehler beim Starten von ${game.title}.`,
        detail: err.message,
        command: null
      };
    }
  }

  // ── Query adapter info ──
  function getAdapterInfo(launchType) {
    return adapters[launchType] || null;
  }

  function getSupportedTypes() {
    return Object.keys(adapters);
  }

  return { launch, getAdapterInfo, getSupportedTypes };
})();

// Export for main.js
window.LaunchAdapter = LaunchAdapter;
