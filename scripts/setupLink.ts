import fs from 'fs-extra';
import path from 'path';
import url from 'url';

const _dirname =
  typeof __dirname !== 'undefined' ? __dirname : path.dirname(url.fileURLToPath(import.meta.url));

const ROOT = path.resolve(_dirname, '../');

const exampleWithAntd5 = path.resolve(ROOT, 'examples/with-antd5');
const exampleWithAntd4 = path.resolve(ROOT, 'examples/with-antd4');

const files = [
  {
    real: path.join(exampleWithAntd5, 'src/App.tsx'),
    targets: [path.join(exampleWithAntd4, 'src/App.tsx')],
  },
  {
    real: path.join(exampleWithAntd5, 'src/style.css'),
    targets: [path.join(exampleWithAntd4, 'src/style.css')],
  },
  {
    real: path.join(exampleWithAntd5, 'src/WithI18n.tsx'),
    targets: [path.join(exampleWithAntd4, 'src/WithI18n.tsx')],
  },
];

const toArray = (value: any) => (Array.isArray(value) ? value : [value]);

async function setupLink() {
  for (const file of files) {
    if (!fs.pathExistsSync(file.real)) continue;

    const finalTargets = toArray(file.targets).filter((p) => !fs.pathExistsSync(p));
    if (finalTargets.length === 0) continue;

    for (const target of finalTargets) {
      await fs.ensureSymlink(file.real, target);
      console.log(`🔗 Link created: ${file.real} -> ${target}`);
    }
  }

  console.log('✅ Link setup completed');
}

setupLink()
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
