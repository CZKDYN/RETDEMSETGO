import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => ({
  base: mode === 'pages' ? '/RETDEMSETGO/' : '/',
  plugins: [react()],
  test: { include: ['src/**/*.test.ts'] },
}));
