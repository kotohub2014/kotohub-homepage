import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    // ポートが埋まっている場合に備えて PORT を優先し、空いていなければ自動で繰り上げる
    port: Number(process.env.PORT) || 5173,
    strictPort: false,
    open: false,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
});
