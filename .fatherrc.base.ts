import babelPluginImportLib2Es from '@rc-component/father-plugin/dist/babelPluginImportLib2Es';
import { defineConfig } from 'father';

export default defineConfig({
  cjs: { output: 'lib' },
  esm: {
    output: 'es',
    extraBabelPlugins: [babelPluginImportLib2Es],
  },
});
