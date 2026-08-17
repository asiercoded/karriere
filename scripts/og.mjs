import fs from "fs";
import path from "path";
import sharp from "sharp";
import { createRequire } from "node:module";
const fontkit = createRequire(import.meta.url)("fontkit");

const d = JSON.parse(fs.readFileSync("./src/lib/careers.json", "utf8"));
const OUT = "./public/og";
fs.mkdirSync(OUT, { recursive: true });

/* ── Fonts (variable TTFs from google/fonts, stored in scripts/fonts) ── */
function loadFonts(file) {
  const font = fontkit.create(fs.readFileSync(file));
  const axes = font.variationAxes;
  const max = axes?.wght?.max ?? 700;
  const regular = font.getVariation({ wght: axes?.wght?.default ?? 400 });
  const bold = font.getVariation({ wght: max });
  return { regular, bold, unitsPerEm: font.unitsPerEm };
}
const manrope = loadFonts("scripts/fonts/Manrope.ttf");
const grotesk = loadFonts("scripts/fonts/SpaceGrotesk.ttf");

/* ── Text → SVG path (no <text> elements: deterministic, font-independent render) ── */
function textToPath(fontSet, text, x, y, size, { fill = "#F5F2EA", ls = 0, end = false } = {}) {
  const font = fontSet.useBold ? fontSet.bold : fontSet.regular;
  const scale = size / fontSet.unitsPerEm;
  const width = measure(fontSet, text, size, ls);
  const start = end ? x - width : x;
  let cx = start;
  let d = "";
  for (const ch of text) {
    const glyph = font.glyphForCodePoint(ch.codePointAt(0));
    if (!glyph || glyph.id === 0) {
      cx += size * 0.5 + ls;
      continue;
    }
    const cmds = glyph.path.commands;
    for (const c of cmds) {
      const a = c.args.map((n) => n * scale);
      switch (c.command) {
        case "moveTo": d += `M${(cx + a[0]).toFixed(1)} ${(y - a[1]).toFixed(1)} `; break;
        case "lineTo": d += `L${(cx + a[0]).toFixed(1)} ${(y - a[1]).toFixed(1)} `; break;
        case "curveTo": d += `C${(cx + a[0]).toFixed(1)} ${(y - a[1]).toFixed(1)} ${(cx + a[2]).toFixed(1)} ${(y - a[3]).toFixed(1)} ${(cx + a[4]).toFixed(1)} ${(y - a[5]).toFixed(1)} `; break;
        case "quadraticCurveTo": d += `Q${(cx + a[0]).toFixed(1)} ${(y - a[1]).toFixed(1)} ${(cx + a[2]).toFixed(1)} ${(y - a[3]).toFixed(1)} `; break;
        case "closePath": d += "Z "; break;
      }
    }
    cx += glyph.advanceWidth * scale + ls;
  }
  return `<path d="${d}" fill="${fill}"/>`;
}

function measure(fontSet, text, size, ls = 0) {
  const font = fontSet.useBold ? fontSet.bold : fontSet.regular;
  const scale = size / fontSet.unitsPerEm;
  let w = 0;
  for (const ch of text) {
    const glyph = font.glyphForCodePoint(ch.codePointAt(0));
    if (!glyph || glyph.id === 0) w += size * 0.5;
    else w += glyph.advanceWidth * scale;
    w += ls;
  }
  return w;
}

const text = (t, x, y, size, opts = {}) => textToPath({ ...manrope, useBold: false }, t, x, y, size, opts);
const boldText = (t, x, y, size, opts = {}) => textToPath({ ...manrope, useBold: true }, t, x, y, size, opts);
const displayText = (t, x, y, size, opts = {}) => textToPath({ ...grotesk, useBold: true }, t, x, y, size, opts);

/* ── Brand palette (dark mode) ── */
const C = {
  bg: "#161616",
  ink: "#F5F2EA",
  muted: "#A8A29A",
  faint: "#8C877D",
  saffron: "#F0A44A",
  saffronDim: "#2A2116",
  good: "#4CC38A",
};

function wrap(text, maxCharsPerLine) {
  const words = text.split(/\s+/);
  const lines = [];
  let cur = "";
  for (const w of words) {
    const test = cur ? `${cur} ${w}` : w;
    if (test.length > maxCharsPerLine && cur) {
      lines.push(cur);
      cur = w;
    } else cur = test;
  }
  if (cur) lines.push(cur);
  return lines;
}
function clip(lines, max) {
  if (lines.length <= max) return lines;
  const kept = lines.slice(0, max);
  kept[max - 1] = `${kept[max - 1].replace(/\s+[^\s]*$/, "")}…`;
  return kept;
}

const checkMark = (x, y, s = 10) =>
  `<path d="M ${x} ${y + s * 0.7} l ${s * 0.38} ${s * 0.38} l ${s * 0.9} -${s * 1.1}" fill="none" stroke="${C.good}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`;

function careerSVG(c) {
  const W = 1200, H = 630, P = 64, inner = W - P * 2;

  const nameLines = clip(wrap(c.name, Math.floor(inner / (64 * 0.58))), 2);
  const tagLines = clip(wrap(c.tagline, Math.floor(inner / (28 * 0.52))), 2);
  const verdictLines = clip(wrap(c.verdict, Math.floor((inner - 64) / (25 * 0.52))), 3);

  const nameTop = 196, nameLH = 74;
  const nameEnd = nameTop + (nameLines.length - 1) * nameLH;
  const tagTop = nameEnd + 46, tagLH = 38;
  const tagEnd = tagTop + (tagLines.length - 1) * tagLH;
  const boxTop = tagEnd + 38, boxPad = 32, labelH = 34, verdictLH = 33;
  const boxH = boxPad + labelH + verdictLines.length * verdictLH + 26;
  const chipText = c.category.toUpperCase();
  const chipW = chipText.length * 15 + 44;

  const el = [];
  el.push(`<rect width="${W}" height="${H}" fill="${C.bg}"/>`);
  el.push(`<rect width="${W}" height="7" fill="${C.saffron}"/>`);
  el.push(displayText("KARRIERE", P, 100, 30, { ls: 3 }));
  el.push(`<rect x="${W - P - chipW}" y="74" width="${chipW}" height="46" rx="23" fill="${C.saffronDim}" stroke="#F0A44A" stroke-opacity="0.35" stroke-width="1.5"/>`);
  el.push(boldText(chipText, W - P - chipW + 22, 105, 20, { fill: C.saffron, ls: 1.5 }));
  nameLines.forEach((l, i) => el.push(displayText(l, P, nameTop + i * nameLH, 64)));
  tagLines.forEach((l, i) => el.push(text(l, P, tagTop + i * tagLH, 28, { fill: C.muted })));
  el.push(`<rect x="${P}" y="${boxTop}" width="${inner}" height="${boxH}" rx="20" fill="${C.saffronDim}" stroke="#F0A44A" stroke-opacity="0.35" stroke-width="2"/>`);
  el.push(boldText("BOTTOM LINE", P + boxPad, boxTop + 34, 17, { fill: C.saffron, ls: 4 }));
  verdictLines.forEach((l, i) => el.push(text(l, P + boxPad, boxTop + labelH + 34 + i * verdictLH, 25)));
  el.push(checkMark(P, 604));
  el.push(text(`FACTS VERIFIED · ${c.last_verified.toUpperCase()}`, P + 20, 612, 20, { fill: C.faint }));
  el.push(text(`karrierehq.pages.dev/careers/${c.id}`, W - P, 612, 19, { fill: C.faint, end: true }));

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
${el.join("\n")}
</svg>`;
}

function defaultSVG() {
  const W = 1200, H = 630, P = 64;
  const n = d._metadata.total_careers;
  const fields = d._metadata.categories.length;
  const el = [];
  el.push(`<rect width="${W}" height="${H}" fill="${C.bg}"/>`);
  el.push(`<rect width="${W}" height="7" fill="${C.saffron}"/>`);
  el.push(displayText("KARRIERE", P, 100, 30, { ls: 3 }));
  el.push(displayText("The unfiltered career file.", P, 240, 72));
  el.push(text("Real salaries, real timelines, real regrets — from people who lived each path.", P, 300, 30, { fill: C.muted }));
  el.push(`<rect x="${P}" y="360" width="${W - P * 2}" height="110" rx="20" fill="${C.saffronDim}" stroke="#F0A44A" stroke-opacity="0.35" stroke-width="2"/>`);
  el.push(boldText("BOTTOM LINE", P + 32, 404, 17, { fill: C.saffron, ls: 4 }));
  el.push(text(`${n} careers · ${fields} fields · every figure sourced · no ads, no sponsors`, P + 32, 444, 27));
  el.push(checkMark(P, 604));
  el.push(text(`FACTS VERIFIED · ${d._metadata.last_updated.toUpperCase().replace(/-/g, ".")}`, P + 20, 612, 20, { fill: C.faint }));
  el.push(text("karrierehq.pages.dev", W - P, 612, 19, { fill: C.faint, end: true }));

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
${el.join("\n")}
</svg>`;
}

let count = 0;
for (const c of d.careers) {
  const out = path.join(OUT, `${c.id}.png`);
  await sharp(Buffer.from(careerSVG(c))).png({ compressionLevel: 9 }).toFile(out);
  count++;
}
await sharp(Buffer.from(defaultSVG())).png({ compressionLevel: 9 }).toFile(path.join(OUT, "default.png"));
count++;

console.log("wrote", count, "OG images to", OUT);
