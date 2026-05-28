import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Project site is served from https://ancientsky.github.io/lightningagent/
export default defineConfig({
  base: '/lightningagent/',
  plugins: [react()],
});
