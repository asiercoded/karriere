// Handles /compare specifically. Cloudflare Pages matches this exact static
// route ahead of the dynamic [id].js route, so this always wins for /compare.

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const id1 = url.searchParams.get('id1');
  const id2 = url.searchParams.get('id2');

  const response = await context.next();

  // If no params are passed, serve the bare picker page
  if (!id1 && !id2) return response; 

  let careers;
  try {
    const careersRes = await env.ASSETS.fetch(new URL('/careers.json', request.url));
    if (!careersRes.ok) return response;
    
    const data = await careersRes.json();
    
    // FIX: Extract the actual array from the JSON structure
    careers = Array.isArray(data) ? data : (data.careers || []);
    
  } catch {
    return response; // Failsafe
  }

  // Double-check to prevent TypeError: careers.find is not a function
  if (!Array.isArray(careers)) return response;

  const a = careers.find(c => c.id === id1);
  const b = careers.find(c => c.id === id2);

  let title, description;
  if (a && b) {
    title = `${a.name} vs ${b.name} — Karriere`;
    description = `Compare salary, stress, competition, and timelines between ${a.name} and ${b.name}.`;
  } else if (a || b) {
    const only = a || b;
    title = `Compare ${only.name} — Karriere`;
    description = `See how ${only.name} stacks up against other careers on salary, stress, and timelines.`;
  } else {
    return response; // neither id resolved to a real career — leave generic meta as-is
  }

  return new HTMLRewriter()
    .on('title', { element(el) { el.setInnerContent(title); } })
    .on('meta[name="description"]', { element(el) { el.setAttribute('content', description); } })
    .on('meta[property="og:title"]', { element(el) { el.setAttribute('content', title); } })
    .on('meta[property="og:description"]', { element(el) { el.setAttribute('content', description); } })
    .on('meta[property="og:url"]', { element(el) { el.setAttribute('content', request.url); } })
    .on('link[rel="canonical"]', { element(el) { el.setAttribute('href', request.url); } })
    .transform(response);
}