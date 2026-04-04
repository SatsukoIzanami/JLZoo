import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const rootDir = resolve(import.meta.dirname, '..');
const packageJsonPath = resolve(rootDir, 'package.json');
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));

const outputPath = resolve(rootDir, 'src/app/build-info.ts');
const version = packageJson.version ?? '0.0.0';
const builtAt = new Date().toISOString();

const source = `export const buildInfo = {
  version: '${version}',
  builtAt: '${builtAt}'
} as const;
`;

mkdirSync(resolve(rootDir, 'src/app'), { recursive: true });
writeFileSync(outputPath, source, 'utf8');

console.log(`Generated build stamp: v${version} @ ${builtAt}`);
