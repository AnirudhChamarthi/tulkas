import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import { crx } from '@crxjs/vite-plugin';
import chromeManifest  from './manifest.chrome.json';
import firefoxManifest from './manifest.firefox.json';

export default defineConfig(({ mode }) => {
  const isFirefox = mode === 'firefox';
  const manifest  = isFirefox ? firefoxManifest : chromeManifest;

  return {
    plugins: [
      preact(),
      crx({ manifest: manifest as Parameters<typeof crx>[0]['manifest'] }),
    ],
    base: './',
    build: {
      outDir:   isFirefox ? 'dist/firefox' : 'dist/chrome',
      emptyOutDir: true,
    },
  };
});
