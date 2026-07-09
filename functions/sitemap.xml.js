export async function onRequest(context) {
  const { request, env } = context;

  // 1. Fetch your career data directly from your deployed assets
  let careers = [];
  try {
    const res = await env.ASSETS.fetch(new URL('/careers.json', request.url));
    if (res.ok) {
      careers = await res.json();
    }
  } catch (err) {
    // If it fails, we will just return a basic sitemap with the homepage
  }

  // 2. Base URL of your production site (Update this to your actual custom domain later if you buy one)
  const baseUrl = 'https://karrierehq.pages.dev';

  // 3. Generate the XML
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  // Add Homepage
  xml += `  <url>\n`;
  xml += `    <loc>${baseUrl}/</loc>\n`;
  xml += `    <changefreq>weekly</changefreq>\n`;
  xml += `    <priority>1.0</priority>\n`;
  xml += `  </url>\n`;

  // Add About Page
  xml += `  <url>\n`;
  xml += `    <loc>${baseUrl}/about</loc>\n`;
  xml += `    <changefreq>monthly</changefreq>\n`;
  xml += `    <priority>0.8</priority>\n`;
  xml += `  </url>\n`;

  // Add Compare Page
  xml += `  <url>\n`;
  xml += `    <loc>${baseUrl}/compare</loc>\n`;
  xml += `    <changefreq>weekly</changefreq>\n`;
  xml += `    <priority>0.9</priority>\n`;
  xml += `  </url>\n`;

  // Loop through all careers and add them automatically
  careers.forEach(career => {
    xml += `  <url>\n`;
    xml += `    <loc>${baseUrl}/${career.id}</loc>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>0.8</priority>\n`;
    xml += `  </url>\n`;
  });

  xml += `</urlset>`;

  // 4. Return the response with the correct XML headers
  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600' // Cache at the edge for 1 hour
    }
  });
}