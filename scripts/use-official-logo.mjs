import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const source = path.join(root, "logo.png");
const brandDir = path.join(root, "public", "brand");
await mkdir(brandDir, { recursive: true });

function icoFromPng(png) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(1, 4);
  const entry = Buffer.alloc(16);
  entry.writeUInt8(32, 0);
  entry.writeUInt8(32, 1);
  entry.writeUInt8(0, 2);
  entry.writeUInt8(0, 3);
  entry.writeUInt16LE(1, 4);
  entry.writeUInt16LE(32, 6);
  entry.writeUInt32LE(png.length, 8);
  entry.writeUInt32LE(22, 12);
  return Buffer.concat([header, entry, png]);
}

await sharp(source)
  .trim({ background: "#ffffff", threshold: 18 })
  .extend({ top: 18, bottom: 18, left: 18, right: 18, background: "#ffffff" })
  .png()
  .toFile(path.join(brandDir, "leandoze-logo-official.png"));

const rawMark = await sharp(source)
  .extract({ left: 88, top: 150, width: 470, height: 570 })
  .png()
  .toBuffer();

const mark = await sharp(rawMark)
  .trim({ background: "#ffffff", threshold: 18 })
  .extend({ top: 40, bottom: 40, left: 40, right: 40, background: "#ffffff" })
  .resize(512, 512, { fit: "contain", background: "#ffffff" })
  .png()
  .toBuffer();

await writeFile(path.join(brandDir, "leandoze-mark-official.png"), mark);
await writeFile(path.join(brandDir, "leandoze-icon-official.png"), mark);
await sharp(mark).resize(512, 512).png().toFile(path.join(root, "public", "icon-512.png"));
await sharp(mark).resize(192, 192).png().toFile(path.join(root, "public", "icon-192.png"));
await sharp(mark).resize(180, 180).png().toFile(path.join(root, "public", "apple-touch-icon.png"));
await writeFile(
  path.join(root, "public", "favicon.ico"),
  icoFromPng(await sharp(mark).resize(32, 32).png().toBuffer()),
);
