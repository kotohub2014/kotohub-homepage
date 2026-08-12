import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // ポートが埋まっていたら、自動で次の空き番号に繰り上げる
    strictPort: false,
    open: false,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
});
