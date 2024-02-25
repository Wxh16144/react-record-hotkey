import { defineConfig } from 'dumi';
import path from 'path';
import { homepage } from './package.json';

const isProd = process.env.NODE_ENV === 'production';
// 不是预览模式 同时是生产环境
const isProdSite = process.env.PREVIEW !== '1' && isProd;

const name = 'react-record-hotkey';

export default defineConfig({
  plugins: ['dumi-plugin-code-snippets'],
  themeConfig: {
    name,
    github: homepage,
    hero: {
      showCustomContent: true,
    },
  },
  base: isProdSite ? `/${name}/` : '/',
  publicPath: isProdSite ? `/${name}/` : '/',
  html2sketch: {},
  mfsu: false,
  outputPath: '.doc',
  alias: {
    antd$: require.resolve('antd'),
    'react-use-record-hotkey$': path.resolve(
      __dirname,
      './packages/react-use-record-hotkey/src/index.ts',
    ),
    'antd-record-hotkey-input$': path.resolve(
      __dirname,
      './packages/antd-record-hotkey-input/src/index.ts',
    ),
  },
});
