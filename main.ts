// news-image-20261123 entry (Node 22, standard library only).
// The image beside this file sums up the world's news of Monday 23 November 2026:
// COP31 ending with no deal, the Democrats winning a historic 258-seat House
// majority, and Trump urging Nvidia to rehire Jensen Huang, with a footer strip
// of the day's other stories (Ukraine drone crippling a Russian warship off
// Libya, Iran claiming a U.S. drone downed over Hormuz, BepiColombo reaching
// Mercury orbit, and Delta delays hitting Thanksgiving travel).
// The program copies that image to the output directory as entry.png.
// Local run: mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { createHash } from 'node:crypto';
import { copyFileSync, mkdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const src = new URL('./entry.png', import.meta.url);
const dst = join(outDir, 'entry.png');

// The harness may hand us a fresh output directory, so create it ourselves.
mkdirSync(outDir, { recursive: true });
copyFileSync(src, dst);

// Fail loudly on a truncated copy: size first, then a read-back hash so a
// same-length but corrupted write is caught too.
const srcSize = statSync(src).size;
const dstSize = statSync(dst).size;
if (dstSize !== srcSize) {
  throw new Error(`entry.png copy truncated: wrote ${dstSize} of ${srcSize} bytes`);
}
const sha256 = (buf: Buffer) => createHash('sha256').update(buf).digest('hex');
const srcHash = sha256(readFileSync(src));
const dstHash = sha256(readFileSync(dst));
if (srcHash !== dstHash) {
  throw new Error(`entry.png copy corrupted: sha256 mismatch (${dstHash} != ${srcHash})`);
}
console.log(`wrote ${dst} (${dstSize} bytes, sha256 ${dstHash})`);
