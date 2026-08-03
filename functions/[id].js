// Runs for any single-segment path: /mbbs, /cs_engineering, /about, etc.
// Cloudflare Pages auto-routes this file to match /:id — see functions/compare.js
// for the separate handler for /compare (Pages prefers the more specific static
// route over this dynamic one, so the two never collide).

export async function onRequest(context) {
  const { request, params, env } = context;
  const id = params.id;

  // Anything with a dot is a real static file (app.js, styles.css, favicon.svg,
  // careers.json, etc.) — never touch those, just let normal static serving handle it.
  if (!id || id.includes('.')) {
    return context.next();
  }

  // Get the normal SPA response first (this already goes through your _redirects
  // rule, so it's the same index.html every route serves today).
  const response = await context.next();

  if (id === 'about') {
    return rewriteMeta(response, {
      title: 'About Karriere — The unfiltered career file',
      description: "Why Karriere exists, how the content is created, and what we're honest about.",
      url: request.url
    });
  }

  let careers;
  try {
    const careersRes = await env.ASSETS.fetch(new URL('/careers.json', request.url));
    if (!careersRes.ok) return response;
    const data = await careersRes.json();
    careers = Array.isArray(data) ? data : (data.careers || []);
  } catch (err) {
    // Log the error so it appears in your Cloudflare dashboard
    console.error("Edge Worker failed to parse careers.json:", err.message);
    return response; // Fall back to the unmodified page
  }

  if (!Array.isArray(careers)) return response;

  const career = careers.find(c => c.id === id);
  if (!career) return response; // unknown path — not a career — leave it alone

  const title = `${career.name} — Karriere`;
  const description = career.tagline || (career.overview ? career.overview.slice(0, 155) : '');

  return rewriteMeta(response, { title, description, url: request.url, faq: career.faq });
}

function rewriteMeta(response, { title, description, url, faq }) {
  const rewriter = new HTMLRewriter()
    .on('title', { element(el) { el.setInnerContent(title); } })
    .on('meta[name="description"]', { element(el) { el.setAttribute('content', description); } })
    .on('meta[property="og:title"]', { element(el) { el.setAttribute('content', title); } })
    .on('meta[property="og:description"]', { element(el) { el.setAttribute('content', description); } })
    .on('meta[property="og:url"]', { element(el) { el.setAttribute('content', url); } })
    .on('link[rel="canonical"]', { element(el) { el.setAttribute('href', url); } });

  // Inject FAQPage schema for Google rich results when a career has FAQs
  if (faq && faq.length) {
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faq.map(f => ({
        "@type": "Question",
        "name": f.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": f.answer
        }
      }))
    };
    // Escape < to prevent </script> injection in the JSON-LD block
    const faqJson = JSON.stringify(faqSchema).replace(/</g, '\\u003c');
    rewriter.on('head', { element(el) { el.append(`<script type="application/ld+json">${faqJson}</script>`); } });
  }

  return rewriter.transform(response);
}