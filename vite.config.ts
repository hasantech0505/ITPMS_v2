import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
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
