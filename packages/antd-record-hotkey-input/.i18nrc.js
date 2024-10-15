const path = require('path');
const fs = require('fs');
const { defineConfig } = require('@lobehub/i18n-cli');

// 读取 antd 目录下的所有 locale 文件
const antdLocalePath = path.dirname(require.resolve('antd/lib/locale'));

const antdLocale = fs
  .readdirSync(antdLocalePath)
  .filter((file) => {
    return file.endsWith('.js') && file !== 'index.js' && file.includes('_');
  })
  .map((file) => file.replace('.js', ''));

module.exports = defineConfig({
  entry: path.resolve(__dirname, 'src/locale/en_US.json'),
  output: path.resolve(__dirname, 'src/locale'),
  outputLocales: antdLocale,
  // outputExtensions: locale => path.resolve(__dirname, `./src/locale/${locale}.json`),
});
