// fix-oversized-images.js
//
// Usage: node fix-oversized-images.js <path-to-folder> <max-width>
//   node fix-oversized-images.js ../backend/uploads 320        (brand logos)
//   node fix-oversized-images.js ../frontend/public/images 900  (hero/card images)
//
// Windows note: earlier versions passed the file PATH straight to sharp(),
// which can leave a low-level handle open on the file even after the read
// finishes (a known sharp/libvips quirk on Windows) — Windows then refuses
// to let anything else write to that file, causing UNKNOWN/EPERM errors
// no matter how many retries or how long the delay.
//
// Fix: read the file into memory with Node's own fs.readFile first, then
// pass sharp a BUFFER instead of a path. Sharp never opens the actual file
// on disk at all this way, so there's nothing left to lock when we write
// the result back to the same path afterward.

import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const targetDir = process.argv[2];
const maxWidth = Number(process.argv[3]);

if (!targetDir || !maxWidth) {
  console.error("Usage: node fix-oversized-images.js <path-to-folder> <max-width>");
  process.exit(1);
}

async function run() {
  const resolvedDir = path.resolve(targetDir);
  const files = await fs.readdir(resolvedDir);
  let resized = 0;
  let alreadyOk = 0;
  let skipped = 0;
  let totalBefore = 0;
  let totalAfter = 0;

  console.log(`Scanning ${resolvedDir} — target max width ${maxWidth}px...\n`);

  for (const file of files) {
    const fullPath = path.join(resolvedDir, file);
    const stat = await fs.stat(fullPath);
    if (!stat.isFile()) continue;

    let inputBuffer;
    try {
      inputBuffer = await fs.readFile(fullPath);
    } catch (err) {
      console.log(`SKIP  ${file} — couldn't read file (${err.message})`);
      skipped++;
      continue;
    }

    let metadata;
    try {
      metadata = await sharp(inputBuffer).metadata();
    } catch (err) {
      console.log(`SKIP  ${file} — couldn't read as an image (${err.message})`);
      skipped++;
      continue;
    }

    const beforeSize = stat.size;
    totalBefore += beforeSize;

    if (metadata.width <= maxWidth && metadata.format === "webp") {
      console.log(`OK    ${file} — already ${metadata.width}px wide, true webp (${(beforeSize / 1024).toFixed(0)} KB)`);
      alreadyOk++;
      totalAfter += beforeSize;
      continue;
    }

    let outputBuffer;
    try {
      outputBuffer = await sharp(inputBuffer)
        .resize({ width: maxWidth, withoutEnlargement: true })
        .webp({ quality: 82 })
        .toBuffer();
    } catch (err) {
      console.log(`SKIP  ${file} — failed to process (${err.message})`);
      skipped++;
      continue;
    }

    let written = false;
    for (let attempt = 1; attempt <= 5 && !written; attempt++) {
      try {
        await fs.writeFile(fullPath, outputBuffer);
        written = true;
      } catch (err) {
        if (attempt === 5) {
          console.log(`SKIP  ${file} — still locked after 5 attempts (${err.message}).`);
          skipped++;
        } else {
          await new Promise((r) => setTimeout(r, 500));
        }
      }
    }
    if (!written) continue;

    const afterStat = await fs.stat(fullPath);
    totalAfter += afterStat.size;

    console.log(
      `RESIZED ${file} — was ${metadata.width}px/${(beforeSize / 1024).toFixed(0)} KB -> ${maxWidth}px max/${(afterStat.size / 1024).toFixed(0)} KB`
    );
    resized++;
  }

  console.log(`\nDone. Resized: ${resized}, already fine: ${alreadyOk}, skipped: ${skipped}`);
  console.log(`Total size: ${(totalBefore / 1024 / 1024).toFixed(2)} MB -> ${(totalAfter / 1024 / 1024).toFixed(2)} MB`);
}

run().catch((err) => {
  console.error("Script failed:", err);
  process.exit(1);
});