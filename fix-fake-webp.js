// fix-fake-webp.js
//
// Usage: node fix-fake-webp.js <path-to-folder>
//   node fix-fake-webp.js ../backend/uploads
//   node fix-fake-webp.js ../frontend/public/images
//
// Requires sharp — if the target project doesn't already have it:
//   npm install sharp --no-save
// (--no-save keeps it out of package.json for a one-off script; skip that
// flag if you want it to stick around, e.g. to re-run this later.)
//
// Checks every file in the given folder, detects its REAL image format via
// sharp (not the filename), and if a .webp-named file isn't actually
// webp-encoded, re-encodes it to true webp in place — same filename, same
// URL/path, no other code changes needed.

import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const targetDir = process.argv[2];

if (!targetDir) {
  console.error("Usage: node fix-fake-webp.js <path-to-folder>");
  process.exit(1);
}

async function run() {
  const resolvedDir = path.resolve(targetDir);
  const files = await fs.readdir(resolvedDir);
  let fixed = 0;
  let alreadyOk = 0;
  let skipped = 0;
  let totalBefore = 0;
  let totalAfter = 0;

  console.log(`Scanning ${resolvedDir}...\n`);

  for (const file of files) {
    const fullPath = path.join(resolvedDir, file);
    const stat = await fs.stat(fullPath);
    if (!stat.isFile()) continue;

    let metadata;
    try {
      metadata = await sharp(fullPath).metadata();
    } catch (err) {
      console.log(`SKIP  ${file} — couldn't read as an image (${err.message})`);
      skipped++;
      continue;
    }

    const beforeSize = stat.size;
    totalBefore += beforeSize;

    if (metadata.format === "webp") {
      console.log(`OK    ${file} — already true webp (${(beforeSize / 1024).toFixed(0)} KB)`);
      alreadyOk++;
      totalAfter += beforeSize;
      continue;
    }

    const tempPath = fullPath + ".tmp";
    await sharp(fullPath)
      .resize({ width: 1600, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(tempPath);

    await fs.rename(tempPath, fullPath);
    const afterStat = await fs.stat(fullPath);
    totalAfter += afterStat.size;

    console.log(
      `FIXED ${file} — was actually ${metadata.format}, ${(beforeSize / 1024).toFixed(0)} KB -> true webp, ${(afterStat.size / 1024).toFixed(0)} KB`
    );
    fixed++;
  }

  console.log(`\nDone. Fixed: ${fixed}, already fine: ${alreadyOk}, skipped: ${skipped}`);
  console.log(`Total size: ${(totalBefore / 1024 / 1024).toFixed(2)} MB -> ${(totalAfter / 1024 / 1024).toFixed(2)} MB`);
}

run().catch((err) => {
  console.error("Script failed:", err);
  process.exit(1);
});