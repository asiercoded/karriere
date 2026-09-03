import fs from "fs";
import path from "path";

const careersPath = path.resolve("src/lib/careers.json");
const outPath = path.resolve("public/sitemap.xml");

const domain = "https://karrierehq.pages.dev";

const MONTH_MAP = {
  january: "01", february: "02", march: "03", april: "04",
  may: "05", june: "06", july: "07", august: "08",
  september: "09", october: "10", november: "11", december: "12",
  jan: "01", feb: "02", mar: "03", apr: "04",
  jun: "06", jul: "07", aug: "08",
  sep: "09", oct: "10", nov: "11", dec: "12",
};

/**
 * Normalise a lastmod string to YYYY-MM-DD.
 * Handles:
 *   "August 2026"  → "2026-08-01"
 *   "2026.08.18"   → "2026-08-18"
 *   "2026-08-18"   → "2026-08-18"  (already valid)
 * Falls back to today if unrecognised.
 */
function normaliseDate(raw, today) {
  if (!raw) return today;

  // Already ISO: YYYY-MM-DD or YYYY-MM
  if (/^\d{4}-\d{2}(-\d{2})?$/.test(raw)) return raw.length === 7 ? raw + "-01" : raw;

  // Dot-separated: YYYY.MM.DD or YYYY.MM
  if (/^\d{4}\.\d{2}(\.\d{2})?$/.test(raw)) return raw.replace(/\./g, "-").padEnd(10, "-01");

  // "Month YYYY" or "Mon YYYY"
  const monthYear = raw.trim().match(/^([a-z]+)\s+(\d{4})$/i);
  if (monthYear) {
    const mm = MONTH_MAP[monthYear[1].toLowerCase()];
    if (mm) return `${monthYear[2]}-${mm}-01`;
  }

  // "YYYY Month" or "YYYY Mon"
  const yearMonth = raw.trim().match(/^(\d{4})\s+([a-z]+)$/i);
  if (yearMonth) {
    const mm = MONTH_MAP[yearMonth[2].toLowerCase()];
    if (mm) return `${yearMonth[1]}-${mm}-01`;
  }

  console.warn(`  ⚠ Unrecognised lastmod "${raw}", using today`);
  return today;
}

function generateSitemap() {
  const data = JSON.parse(fs.readFileSync(careersPath, "utf8"));
  const careers = data.careers;
  const today = new Date().toISOString().split("T")[0];

  const staticRoutes = [
    "/",
    "/careers",
    "/quiz",
    "/compare",
    "/field-guide",
    "/for-parents",
    "/saved",
    "/vs/mbbs-vs-bds",
    "/vs/btech-vs-bca",
    "/vs/ba-vs-bcom",
    "/vs/core-vs-cs-engineering",
  ];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  for (const route of staticRoutes) {
    xml += `  <url>\n`;
    xml += `    <loc>${domain}${route}</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += `  </url>\n`;
  }

  for (const career of careers) {
    const lastmod = normaliseDate(career.last_verified, today);
    xml += `  <url>\n`;
    xml += `    <loc>${domain}/careers/${career.id}</loc>\n`;
    xml += `    <lastmod>${lastmod}</lastmod>\n`;
    xml += `  </url>\n`;
  }

  xml += `</urlset>\n`;

  fs.writeFileSync(outPath, xml, "utf8");
  console.log(`✓ Sitemap: ${staticRoutes.length + careers.length} URLs → ${outPath}`);
}

generateSitemap();

