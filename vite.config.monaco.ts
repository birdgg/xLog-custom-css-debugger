import { defineConfig } from 'vite'
import { isDev, outputDir, r } from './scripts/utils'

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
    outDir: r(`${outputDir}/monaco-editor/iframe`),
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
