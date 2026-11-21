// Entry runner for make.fun — "Make the AI judge feel brave".
// Copies the written text in entry.txt to the output directory.
//
// Usage: MAKEFUN_OUTPUT_DIR=<dir> node main.ts

import { copyFileSync, existsSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const source = join(here, "entry.txt");

const outDir = process.env.MAKEFUN_OUTPUT_DIR;
if (!outDir) {
  console.error("MAKEFUN_OUTPUT_DIR is not set");
  process.exit(1);
}

const target = resolve(outDir);

// Clear the output directory's contents, but never the directory itself.
if (existsSync(target)) {
  for (const name of readdirSync(target)) {
    rmSync(join(target, name), { recursive: true, force: true });
  }
} else {
  mkdirSync(target, { recursive: true });
}

copyFileSync(source, join(target, "entry.txt"));
console.log("wrote entry.txt to", target);
