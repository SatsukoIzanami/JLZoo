import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const rootDir = resolve(import.meta.dirname, "..");
const packageJsonPath = resolve(rootDir, "package.json");
const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));

const outputPath = resolve(rootDir, "src/build-info.js");
const version = packageJson.version ?? "0.0.0";
const builtAt = new Date().toISOString();

const source = `export const buildInfo = {
  version: "${version}",
  builtAt: "${builtAt}",
};
`;

mkdirSync(resolve(rootDir, "src"), { recursive: true });
writeFileSync(outputPath, source, "utf8");

console.log(`Generated build stamp: v${version} @ ${builtAt}`);
