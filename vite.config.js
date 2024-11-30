import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.js',
      name: 'QARL',
      fileName: (format) => `qarl.${format}.min.js`,
      formats: ['es'],
    },
    rollupOptions: {
      external: ['eventemitter3'],
      output: {
        globals: {
          eventemitter3: 'EventEmitter',
        },
      },
    },
  },
});
