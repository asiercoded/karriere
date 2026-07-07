# Karriere — The unfiltered career file

**Honest career guidance for Indian students.** Real salaries, real timelines, real regrets — from people who lived each path. No brochures, no fluff.

[![Live Site](https://img.shields.io/badge/Live-View%20Site-blue)](https://asiercoded.github.io/karriere/)

---

## What is Karriere?

Every year, millions of Indian students choose a career based on coaching institutes, relatives, social media, or random YouTube videos. Most career websites tell you "High salary. Excellent scope. Bright future." — but they rarely answer the questions students actually have:

- What is the work really like?
- Who regrets choosing this career?
- What does a typical career path look like?
- Is this career actually a good fit for me?

Karriere exists to answer those questions honestly.

## Features

- **18+ careers profiled** with honest overviews, salaries, timelines, and more
- **Compare tool** — side-by-side comparison of any two careers
- **Real experiences** — anonymous accounts from students and professionals
- **Verdict cards** — who should choose this career, who should avoid it, and what to do before committing
- **Dark mode** — toggle between light and dark themes
- **Fully responsive** — works on mobile, tablet, and desktop

## Careers Covered

| Category | Careers |
|----------|---------|
| Medical | MBBS, BDS, Pharmacy |
| Paramedical | Nursing, Physiotherapy, Radiology Tech |
| Life Sciences | Zoology, Botany |
| Engineering | CS Engineering, Mechanical, Civil, ECE, BCA/MCA |
| Commerce | CA, BCom |
| Law | Law (LLB) |
| Design | Design (NID/NIFT) |
| Management | BBA, MBA |

## Tech Stack

- **Plain HTML, CSS, JavaScript** — no frameworks, no build tools
- **Single-page application** with hash-based routing
- **JSON data file** — easy to extend with new careers
- **Google Fonts** — Manrope typeface
- **Formspree** — contact form backend
- **GitHub Pages** — hosting

## Local Development

No build tools required. Just serve the files locally:

```bash
# Using Python
python -m http.server 8000

# Using VS Code Live Server
npx live-server
```

Then open `http://localhost:8000` in your browser.

## Adding a New Career

1. Open `careers.json`
2. Add a new entry following the existing schema:
   - `id`, `name`, `tagline`, `category`, `overview`
   - `metrics` — duration, stress, competition, etc.
   - `salary` — entry, mid, senior
   - `what_nobody_tells_you`, `why_people_love_it`
   - `who_thrives`, `who_regrets_it`
   - `choose_if`, `avoid_if`, `before_you_commit`
   - `real_experiences` — array of quote/source/url objects
   - `related_careers` — array of career IDs
   - `career_outlook` — india/abroad objects
   - `category_icon` — if new category, add to `CATEGORY_ICONS` in `app.js`
3. If adding a new category, also:
   - Add to `CATEGORY_LABELS` in `app.js`
   - Add to `CATEGORY_ICONS` in `app.js` with an SVG icon
4. Verify locally and submit a PR

## Contributing

Contributions are welcome! Here's how you can help:

- **Add a new career** — follow the schema above
- **Share your experience** — submit a testimonial via the contact form on the site
- **Report errors** — if you spot outdated or incorrect information, open an issue
- **Suggest improvements** — ideas for new features or better UX are always appreciated

## License

MIT — feel free to use, modify, and share.

## About the Creator

Built by [Asier](https://github.com/asiercoded) — a student in India who wanted to create the resource he wish he'd had before making his own career decision.