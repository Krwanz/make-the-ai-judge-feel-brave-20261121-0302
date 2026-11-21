// Entry runner for make.fun — "Make the AI judge feel brave".
// Copies the written text in entry.txt to the output directory, then
// reads the written file back and verifies it is a valid entry
// (1 to 280 Unicode code points, not only white space) before
// reporting success.
//
// Usage: MAKEFUN_OUTPUT_DIR=<dir> node main.ts

import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync } from "node:fs";
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

const written = join(target, "entry.txt");
copyFileSync(source, written);

// Verify what was actually written: read the output back and require
// it to be a valid entry — 1 to 280 Unicode code points, and not only
// white space — so a truncated copy or an empty file can never pass
// silently as a successful run.
const text = readFileSync(written, "utf8");
const length = [...text].length;
if (length < 1 || length > 280) {
  console.error(
    `output check failed: entry.txt is ${length} code points, expected 1 to 280`,
  );
  process.exit(1);
}
if (text.trim().length === 0) {
  console.error("output check failed: entry.txt contains only white space");
  process.exit(1);
}

console.log(`wrote entry.txt to ${target} (${length} characters, verified)`);
