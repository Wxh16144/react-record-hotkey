import { resolve } from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    setupFiles: './tests/test-setup.ts',
    environment: 'jsdom',
    globals: true,
    css: true,
    alias: {
      'antd-record-hotkey-input': resolve(__dirname, './packages/antd-record-hotkey-input/src'),
      'react-use-record-hotkey': resolve(__dirname, './packages/react-use-record-hotkey/src'),
    },
    coverage: {
      reporter: ['text', 'text-summary', 'json', 'lcov'],
      include: ['packages/*/src/**/*'],
    },
  },
});
