import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import {defineConfig, Plugin} from 'vite';

/**
 * maplibre-gl v6 resolves its web worker at RUNTIME:
 *   new URL(`./maplibre-gl-worker.mjs`, import.meta.url)
 * Because that URL is built from a variable, Vite cannot see it statically and
 * never emits the worker into dist/. In dev it resolves inside node_modules and
 * works; in a production build the request hits /assets/maplibre-gl-worker.mjs,
 * falls through to the SPA catch-all, receives index.html, and the browser
 * refuses it ("non-JavaScript MIME type of text/html"). The map then paints its
 * background but no tiles, because the worker that parses them never starts.
 * Copy the worker (and the shared chunk it imports) next to the built assets.
 */
function copyMaplibreWorker(): Plugin {
  return {
    name: 'copy-maplibre-worker',
    apply: 'build',
    closeBundle() {
      const src = path.resolve(__dirname, 'node_modules/maplibre-gl/dist');
      const dest = path.resolve(__dirname, 'dist/assets');
      fs.mkdirSync(dest, {recursive: true});
      for (const file of ['maplibre-gl-worker.mjs', 'maplibre-gl-shared.mjs']) {
        const from = path.join(src, file);
        if (fs.existsSync(from)) {
          fs.copyFileSync(from, path.join(dest, file));
        } else {
          this.warn(`maplibre worker asset missing: ${from}`);
        }
      }
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), copyMaplibreWorker()],
    optimizeDeps: {
      exclude: ['maplibre-gl'],
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      // Force-false, not just under DISABLE_HMR: dev always runs through
      // server.ts's createViteServer({ server: { middlewareMode: true, hmr: false } }),
      // which never wires Vite's HMR websocket to the real Express http.Server.
      // With this set to true, the browser still tried an HMR websocket on every
      // page load, always failed ("WebSocket closed without opened"), and threw an
      // uncaught-promise console error each time. false here matches server.ts's
      // intent and stops those failed attempts. Real HMR would need server.ts to
      // pass its actual http.Server into Vite (or forward the upgrade event) --
      // a separate, bigger change.
      hmr: false,
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
