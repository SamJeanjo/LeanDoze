import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const brandDir = path.join(root, "public", "brand");
await mkdir(brandDir, { recursive: true });

const ink = "#0B1220";
const white = "#FFFFFF";

function iconGlyph(color = ink) {
  return `
    <g fill="none" stroke="${color}" stroke-width="28" stroke-linecap="round" stroke-linejoin="round">
      <path d="M64 52v152h72" />
      <path d="M132 52h28c44.183 0 80 35.817 80 80s-35.817 80-80 80h-28" />
    </g>`;
}

function fullLogoSvg({
  mode = "light",
  width = 760,
  height = 220,
} = {}) {
  const bg = mode === "dark" ? ink : white;
  const fg = mode === "dark" ? white : ink;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="title desc">
  <title id="title">LeanDoze</title>
  <desc id="desc">LeanDoze LD monogram with GLP-1 Care. Simplified. tagline</desc>
  <rect width="${width}" height="${height}" fill="${bg}"/>
  <g transform="translate(44 30)">
    <rect x="0" y="0" width="160" height="160" rx="30" fill="none"/>
    <g transform="translate(-39 -22) scale(.78)">
      ${iconGlyph(fg)}
    </g>
  </g>
  <g transform="translate(238 67)">
    <text x="0" y="52" font-family="Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="66" font-weight="500" letter-spacing="-2" fill="${fg}">LeanDoze</text>
    <text x="2" y="96" font-family="Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="20" font-weight="400" letter-spacing="3.2" fill="${fg}" opacity=".72">GLP-1 CARE. SIMPLIFIED.</text>
  </g>
</svg>`;
}

function markSvg({ mode = "light", tile = false, size = 256 } = {}) {
  const bg = mode === "dark" ? ink : white;
  const fg = mode === "dark" ? white : ink;
  const tileRect = tile
    ? `<rect width="${size}" height="${size}" rx="${Math.round(size * 0.19)}" fill="${bg}"/>`
    : `<rect width="${size}" height="${size}" fill="transparent"/>`;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="title desc">
  <title id="title">LeanDoze LD mark</title>
  <desc id="desc">Minimal geometric LD monogram</desc>
  ${tileRect}
  <g transform="translate(${size * 0.08} ${size * 0.08}) scale(${size / 256 * 0.84})">
    ${iconGlyph(fg)}
  </g>
</svg>`;
}

async function writeSvg(name, svg) {
  await writeFile(path.join(brandDir, name), svg, "utf8");
}

async function pngFromSvg(svg, output, width) {
  await sharp(Buffer.from(svg)).resize({ width }).png().toFile(output);
}

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

const lightLogo = fullLogoSvg({ mode: "light" });
const darkLogo = fullLogoSvg({ mode: "dark" });
const lightMark = markSvg({ mode: "light" });
const darkMark = markSvg({ mode: "dark" });
const appIcon = markSvg({ mode: "dark", tile: true, size: 512 });

await writeSvg("leandoze-logo-light.svg", lightLogo);
await writeSvg("leandoze-logo-dark.svg", darkLogo);
await writeSvg("leandoze-mark-light.svg", lightMark);
await writeSvg("leandoze-mark-dark.svg", darkMark);
await writeSvg("leandoze-app-icon.svg", appIcon);

await pngFromSvg(lightLogo, path.join(brandDir, "leandoze-logo-v2.png"), 1040);
await pngFromSvg(lightMark, path.join(brandDir, "leandoze-mark-v2.png"), 512);
await pngFromSvg(appIcon, path.join(brandDir, "leandoze-icon-v2.png"), 512);
await pngFromSvg(appIcon, path.join(root, "public", "icon-512.png"), 512);
await pngFromSvg(appIcon, path.join(root, "public", "icon-192.png"), 192);
await pngFromSvg(appIcon, path.join(root, "public", "apple-touch-icon.png"), 180);

const faviconPng = await sharp(Buffer.from(appIcon)).resize({ width: 32, height: 32 }).png().toBuffer();
await writeFile(path.join(root, "public", "favicon.ico"), icoFromPng(faviconPng));
