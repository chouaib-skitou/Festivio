const fs = require('node:fs');

const version = process.argv[2];

if (!version || !/^\d+\.\d+\.\d+$/.test(version)) {
  throw new Error(`Invalid release version: ${version ?? '<missing>'}`);
}

for (const file of ['package.json', 'backend/package.json', 'frontend/package.json']) {
  const manifest = JSON.parse(fs.readFileSync(file, 'utf8'));
  manifest.version = version;
  fs.writeFileSync(file, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
}
