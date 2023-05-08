import { defineConfig } from 'vite'
import { isDev, r } from './scripts/utils'

export default defineConfig({
  root: r('src'),
  resolve: {
    alias: {
      '~/': `${r('src')}/`,
    },
  },
  build: {
    watch: isDev
      ? {}
      : undefined,
    outDir: r('extension/monaco-editor/iframe'),
    assetsDir: '',
    emptyOutDir: false,
    sourcemap: false,
    rollupOptions: {
      input: r('src/monaco-editor/index.ts'),
      output: {
        entryFileNames: 'index.js',
      },
    },
  },
})
