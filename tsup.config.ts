import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/main.ts'],
  format: ['esm'],
  target: 'es2022',
  outDir: 'dist',
  dts: true,
  clean: true,
});