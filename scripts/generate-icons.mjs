// One-off script to generate PWA icons from public/DomIconApp.jpeg.
// Run with: node scripts/generate-icons.mjs
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const SRC = path.resolve("public/DomIconApp.jpeg");
const OUT_DIR = path.resolve("public/icons");

// Blue duotone palette: dark navy behind the tile, lighter blue toward the corners.
const DARK_BLUE = { r: 15, g: 31, b: 61 }; // #0f1f3d
const LIGHT_BLUE = { r: 147, g: 197, b: 253 }; // #93c5fd

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  // 1. Square crop (1500x1500) keeping the whole tile visible.
  const cropped = sharp(SRC).extract({ left: 0, top: 250, width: 1500, height: 1500 });
  const { data: rgbBuf, info } = await cropped
    .clone()
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;

  // 2. Build a geometric mask (rounded rectangle) matching the tile's known
  //    position in the crop, with a soft feathered edge. Geometric (not
  //    color-based) so the maroon/green pips keep their original colors
  //    instead of being swept into the "background" recolor.
  const RECT = { left: 352, right: 1052, top: -40, bottom: 1540, radius: 110 };
  const FEATHER = 40;
  const cx = width / 2;
  const cy = height / 2;
  const maxDist = Math.hypot(cx, cy);

  function roundedRectDistance(x, y) {
    // Signed distance (approx) to the rounded rect edge: negative = inside.
    const dx = Math.max(RECT.left + RECT.radius - x, x - (RECT.right - RECT.radius), 0);
    const dy = Math.max(RECT.top + RECT.radius - y, y - (RECT.bottom - RECT.radius), 0);
    const cornerDist = Math.hypot(dx, dy) - RECT.radius;
    const insideX = x >= RECT.left && x <= RECT.right;
    const insideY = y >= RECT.top && y <= RECT.bottom;
    if (dx === 0 && dy === 0) {
      // Inside the straight edges; distance to nearest side (negative = inside).
      const toLeft = x - RECT.left;
      const toRight = RECT.right - x;
      const toTop = y - RECT.top;
      const toBottom = RECT.bottom - y;
      return -Math.min(toLeft, toRight, toTop, toBottom);
    }
    return insideX && insideY ? cornerDist : Math.max(cornerDist, 1);
  }

  const out = Buffer.alloc(width * height * channels);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * channels;
      const r = rgbBuf[idx];
      const g = rgbBuf[idx + 1];
      const b = rgbBuf[idx + 2];
      const a = rgbBuf[idx + 3];

      const dist = roundedRectDistance(x, y);
      // tileWeight: 1 = fully original tile pixel, 0 = fully recolored background.
      const tileWeight = Math.min(1, Math.max(0, 0.5 - dist / FEATHER));

      const rd = Math.hypot(x - cx, y - cy) / maxDist; // 0 center -> 1 corner
      const t = Math.min(1, rd * 1.15);
      const bgR = DARK_BLUE.r + (LIGHT_BLUE.r - DARK_BLUE.r) * t;
      const bgG = DARK_BLUE.g + (LIGHT_BLUE.g - DARK_BLUE.g) * t;
      const bgB = DARK_BLUE.b + (LIGHT_BLUE.b - DARK_BLUE.b) * t;

      out[idx] = Math.round(r * tileWeight + bgR * (1 - tileWeight));
      out[idx + 1] = Math.round(g * tileWeight + bgG * (1 - tileWeight));
      out[idx + 2] = Math.round(b * tileWeight + bgB * (1 - tileWeight));
      out[idx + 3] = a;
    }
  }

  const recolored = sharp(out, { raw: { width, height, channels } });

  await recolored.clone().resize(512, 512).png().toFile(path.join(OUT_DIR, "icon-512.png"));
  await recolored.clone().resize(192, 192).png().toFile(path.join(OUT_DIR, "icon-192.png"));

  // Maskable icon: same duotone background, tile scaled to ~80% safe zone.
  const maskableCanvas = sharp({
    create: { width: 512, height: 512, channels: 4, background: { r: DARK_BLUE.r, g: DARK_BLUE.g, b: DARK_BLUE.b, alpha: 1 } },
  });
  const tileScaled = await recolored.clone().resize(410, 410).png().toBuffer();
  await maskableCanvas
    .composite([{ input: tileScaled, left: 51, top: 51 }])
    .png()
    .toFile(path.join(OUT_DIR, "icon-maskable-512.png"));

  console.log("Icons written to", OUT_DIR);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
