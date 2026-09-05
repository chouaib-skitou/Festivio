import { readFile } from 'node:fs/promises';

const files = ['package.json', 'backend/package.json', 'frontend/package.json'];
const manifests = await Promise.all(
  files.map(async (file) => ({
    file,
    data: JSON.parse(await readFile(new URL(`../${file}`, import.meta.url), 'utf8')),
  }))
);
const expected = manifests[0].data.version;
const mismatches = manifests.filter(({ data }) => data.version !== expected);

if (mismatches.length) {
  console.error(`Version mismatch. Root version is ${expected}.`);
  for (const { file, data } of mismatches) {
    console.error(`- ${file}: ${data.version}`);
  }
  process.exit(1);
}

console.log(`Festivio versions are synchronized at ${expected}.`);
