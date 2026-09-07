// Build script for the Chrome (Manifest V3) port of Tab Stash.
//
// Orchestrates the full build pipeline:
//   1. Clean dist/
//   2. Build HTML entry points (options, side panel, stash list, ...)
//   3. Build the background service worker (src/index.ts -> dist/index.js)
//   4. Copy static assets (manifest.json, _locales)
//   5. Generate themed SVG icons + PNG toolbar icons
//   6. Compile styles/index.less -> dist/tab-stash.css
//
// Usage: node scripts/build.mjs [development|production]

import {execFileSync} from "node:child_process";
import {
  copyFileSync,
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import {join, resolve} from "node:path";

import less from "less";

const ROOT = resolve(import.meta.dirname, "..");
const DIST = join(ROOT, "dist");
const NODE_ENV =
  process.argv[2] === "development" ? "development" : "production";

const rel = p => join(ROOT, p);

// ---------------------------------------------------------------------------
// 1. Clean
// ---------------------------------------------------------------------------
rmSync(DIST, {recursive: true, force: true});
mkdirSync(DIST, {recursive: true});

// ---------------------------------------------------------------------------
// 2 & 3. Vite builds
// ---------------------------------------------------------------------------
function vite(config) {
  execFileSync(
    "node",
    [
      join(ROOT, "node_modules/vite/bin/vite.js"),
      "build",
      "-c",
      rel(config),
      "-m",
      NODE_ENV,
    ],
    {stdio: "inherit", env: {...process.env, NODE_ENV}},
  );
}

vite("vite.config.html.ts");
vite("vite.config.lib.ts");

// ---------------------------------------------------------------------------
// 4. Static assets (manifest.json, _locales)
// ---------------------------------------------------------------------------
cpSync(rel("assets"), DIST, {recursive: true});

// ---------------------------------------------------------------------------
// 5. Icons
// ---------------------------------------------------------------------------
const ICONS_DIR = rel("icons");
const DARK_FILL = "#fbfbfe";
const LIGHT_FILL = "#222426";

function recolor(svg, fill) {
  // The raw SVGs all carry an inline `style="fill:#808080"` placeholder.
  return svg.replace(/style="[^"]*"/g, `style="fill:${fill}"`);
}

mkdirSync(join(DIST, "icons/light"), {recursive: true});
mkdirSync(join(DIST, "icons/dark"), {recursive: true});

for (const name of readdirSync(ICONS_DIR)) {
  if (!name.endsWith(".svg")) continue;
  const svg = readFileSync(join(ICONS_DIR, name), "utf8");

  // Favicon / generic icons (keep the original placeholder color).
  copyFileSync(join(ICONS_DIR, name), join(DIST, "icons", name));

  // Light theme: dark icons; dark theme: light icons.
  writeFileSync(join(DIST, "icons/light", name), recolor(svg, LIGHT_FILL));
  writeFileSync(join(DIST, "icons/dark", name), recolor(svg, DARK_FILL));
}

// Toolbar / manifest PNG icons.  We render the logo (recolored to the
// light-theme color, which reads well on Chrome's light toolbar) at the sizes
// referenced by manifest.json.
const PNG_SIZES = [16, 32, 48, 64, 96, 128];
const logo_dark = recolor(
  readFileSync(join(ICONS_DIR, "logo.svg"), "utf8"),
  LIGHT_FILL,
);
const tmp_logo = join(DIST, "icons/_logo-dark.svg");
writeFileSync(tmp_logo, logo_dark);

for (const size of PNG_SIZES) {
  execFileSync(
    "convert",
    [
      "-background",
      "none",
      "-density",
      "300",
      tmp_logo,
      "-resize",
      `${size}x${size}`,
      join(DIST, "icons", `logo-${size}.png`),
    ],
    {stdio: "inherit"},
  );
}
rmSync(tmp_logo, {force: true});

// ---------------------------------------------------------------------------
// 6. Styles
// ---------------------------------------------------------------------------
const less_src = readFileSync(rel("styles/index.less"), "utf8");
const {css} = await less.render(less_src, {
  paths: [rel("styles")],
  math: "strict",
  filename: "index.less",
});
writeFileSync(join(DIST, "tab-stash.css"), css);

console.log(`Build complete (${NODE_ENV}) -> ${DIST}`);
