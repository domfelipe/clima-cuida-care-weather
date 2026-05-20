import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/clima-cuida-care-weather/' : '/',
  plugins: [react()],
  test: {
    environment: 'node',
    globals: true,
  },
}));
