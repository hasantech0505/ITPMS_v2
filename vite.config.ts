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
      // NOTE (fixed): this used to be hardcoded `hmr: false`, on the theory
      // that disabling HMR here would stop the browser's failed websocket
      // attempts (ws://localhost:24678, "WebSocket closed without opened").
      // It didn't -- the browser-side @vite/client still tried to connect
      // regardless of this boolean, because dev always runs through
      // server.ts's createViteServer(), which is an inline config that
      // overrides this file's `server.hmr` value entirely. The real fix now
      // lives in server.ts: it creates an explicit http.Server and passes it
      // as `hmr: { server: httpServer } }`, which properly attaches Vite's
      // HMR websocket to the same server Express listens on. Restored to the
      // original DISABLE_HMR-conditional value here so this file no longer
      // silently overrides that when the inline config is ever omitted.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      //
      // NOTE (2026-09-07): server/db_store.json is a runtime-written local
      // cache (see server/repositories/entity.repository.ts) that the
      // backend rewrites on essentially every /api/db call and repeatedly
      // during the startup migration chain (server.ts's boot sequence runs
      // several sequential read-modify-write passes over it). Vite's dev
      // watcher was treating every one of those writes as a source change
      // and sending the browser a full-page reload ("[vite] (client) page
      // reload server/db_store.json") - which itself re-mounts the app,
      // re-fires syncState()'s GET /api/db, rewrites db_store.json again,
      // and triggers ANOTHER reload. That's a self-sustaining reload storm,
      // not a one-off: left alone it kept firing every few hundred ms.
      // `ignored` below excludes the runtime-only JSON files the backend
      // writes to itself so editing actual source still reloads normally.
      watch: process.env.DISABLE_HMR === 'true' ? null : {
        ignored: ['**/server/db_store.json', '**/server/.migrations_applied.json'],
      },
    },
  };
});
