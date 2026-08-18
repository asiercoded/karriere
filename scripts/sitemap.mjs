import fs from "fs";
import path from "path";

const careersPath = path.resolve("src/lib/careers.json");
const outPath = path.resolve("public/sitemap.xml");

const domain = "https://karrierehq.pages.dev";

function generateSitemap() {
  const data = JSON.parse(fs.readFileSync(careersPath, "utf8"));
  const careers = data.careers;
  const lastMod = new Date().toISOString().split("T")[0];

  const staticRoutes = [
    "/",
    "/careers",
    "/quiz",
    "/results",
    "/compare",
    "/field-guide",
    "/for-parents",
    "/vs/mbbs-vs-bds",
    "/vs/btech-vs-bca",
    "/vs/ba-vs-bcom",
    "/vs/core-vs-cs-engineering",
  ];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  // Add static routes
  for (const route of staticRoutes) {
    xml += `  <url>\n`;
    xml += `    <loc>${domain}${route}</loc>\n`;
    xml += `    <lastmod>${lastMod}</lastmod>\n`;
    xml += `  </url>\n`;
  }

  // Add dynamic career routes
  for (const career of careers) {
    xml += `  <url>\n`;
    xml += `    <loc>${domain}/careers/${career.id}</loc>\n`;
    xml += `    <lastmod>${career.last_verified.replace(/\./g, "-")}</lastmod>\n`;
    xml += `  </url>\n`;
  }

  xml += `</urlset>\n`;

  fs.writeFileSync(outPath, xml, "utf8");
  console.log(`Generated sitemap with ${staticRoutes.length + careers.length} URLs at ${outPath}`);
}

generateSitemap();
