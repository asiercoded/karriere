# Karriere

**Karriere** is a career guidance web app for students — helping them explore careers, take a personality-matched quiz, compare paths side by side, and save shortlists. It targets the Indian student audience with honest, practical career dossiers.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend framework | React 19 + Vite 7 |
| Language | TypeScript |
| Routing | React Router v7 (imports from `react-router`, not `react-router-dom`) |
| Styling | Tailwind CSS v4 (oklch colour format) |
| Component library | Shadcn UI (Radix primitives) |
| Icons | Lucide React |
| Animations | Framer Motion |
| Backend & DB | Convex |
| Auth | Convex Auth (email OTP + anonymous users) |
| Package manager | Bun |
| Deployment | Cloudflare Pages (frontend) + Convex Cloud (backend) |

---

## Pages & Routes

| Route | Page | Description |
|---|---|---|
| `/` | Landing | Hero, search, featured careers, testimonials |
| `/quiz` | Quiz | 5-min career match questionnaire |
| `/results` | Results | Quiz outcome with matched careers |
| `/careers` | CareerExplorer | Browse/search all career dossiers |
| `/careers/:id` | CareerProfile | In-depth dossier for a single career |
| `/careers/:id/report` | CareerReport | Printable/shareable report |
| `/compare` | Compare | Side-by-side career comparison picker |
| `/vs/:slug` | CareerVs | SEO-friendly comparison page |
| `/field-guide` | FieldGuide | Glossary of career jargon |
| `/for-parents` | ForParents | Parent-facing explainer |
| `/saved` | Saved | User's saved/shortlisted careers (auth required) |
| `/auth` | Auth | Login / sign-up (email OTP). Redirects to `/saved`. |
| `/admin` | Admin | Admin dashboard |

All routes are lazy-loaded for optimal code splitting.

---

## Project Structure

```
src/
├── pages/          # One file per route
├── components/     # Shared UI components
│   └── ui/         # Shadcn primitives (do not edit directly)
├── hooks/          # Custom React hooks (useAuth, etc.)
├── lib/            # Data, utilities, integrations
│   ├── career-data.ts          # Career profile types + helpers
│   ├── career-loader.ts        # useCareers hook (loads careers.json)
│   ├── careers.json            # Static career dossier data
│   ├── reviews-overrides.json  # Community review data
│   ├── vs-pairs.ts             # Pre-defined comparison pairs
│   ├── meta.ts                 # JSON-LD / meta tag helpers
│   ├── shortlist.ts            # Saved careers helpers
│   ├── checklist.ts            # Career checklist data
│   └── verdict.ts              # Verdict/rating helpers
├── types/          # Global TypeScript type declarations
├── index.css       # Global styles + Tailwind theme tokens
├── main.tsx        # App entry point, router, lazy route setup
└── instrumentation.tsx  # Analytics instrumentation provider
```

---

## Setup

### Prerequisites

- [Bun](https://bun.sh/) installed
- A [Convex](https://convex.dev/) account

### Install dependencies

```bash
bun install
```

### Environment variables

Create a `.env.local` file:

```env
CONVEX_DEPLOYMENT=dev:<your-deployment-name>
VITE_CONVEX_URL=https://<your-deployment>.convex.cloud
```

The Convex backend also needs these server-side environment variables (set via the Convex dashboard):

| Variable | Description |
|---|---|
| `JWKS` | Auth JWKS JSON |
| `JWT_PRIVATE_KEY` | Auth JWT private key |
| `SITE_URL` | Canonical site URL |

### Run locally

```bash
# Terminal 1 — Convex dev server
bunx convex dev

# Terminal 2 — Vite dev server
bun run dev
```

### Other scripts

```bash
bun run build        # Type-check + generate sitemap + Vite build → dist/
bun run og           # Regenerate Open Graph share-card PNGs
bun run sitemap      # Regenerate sitemap.xml
bun run lint         # ESLint
bun run format       # Prettier
bun run preview      # Preview production build locally
```

---

## Deployment (GitHub + Cloudflare Pages)

The frontend is a static Vite SPA (`dist/`). The backend is Convex, deployed separately to Convex Cloud.

### One-time setup

1. **Push to GitHub:**
   ```bash
   git remote add origin https://github.com/<you>/karriere.git
   git push -u origin main
   ```

2. **Deploy the Convex backend** (production):
   ```bash
   bunx convex deploy
   ```
   Copy the production URL from the Convex dashboard and mirror the auth env vars (`JWKS`, `JWT_PRIVATE_KEY`, `SITE_URL`) to the production deployment.

3. **Add GitHub Actions secrets** (Settings → Secrets and variables → Actions):
   - `CLOUDFLARE_API_TOKEN` — token with **Cloudflare Pages: Edit** permission
   - `CLOUDFLARE_ACCOUNT_ID` — your Cloudflare account ID
   - `VITE_CONVEX_URL` — production Convex URL from step 2
   - Optional repo variable: `CLOUDFLARE_PAGES_PROJECT` (defaults to `karriere`)

4. Push to `main` — `.github/workflows/deploy.yml` builds with Bun and deploys to Cloudflare Pages.

### Before going live

The following files hardcode the placeholder domain `karrierehq.pages.dev` — swap for your real domain:
- `index.html` (canonical, og:image, twitter:image)
- `public/sitemap.xml`, `public/robots.txt`
- `scripts/og.mjs` (URL baked into share-card PNGs — regenerate with `bun run og`)

---

# Using Authentication (Important!)

Auth is pre-configured using **Convex Auth** with email OTP and anonymous user support.

> **Do not modify** `src/convex/auth/emailOtp.ts`, `src/convex/auth.config.ts`, or `src/convex/auth.ts`.

## Using Convex Auth on the backend

Use `getCurrentUser` in `src/convex/users.ts` to get the current user's data.

## Using Convex Auth on the frontend

The `/auth` page handles all login/sign-up flows.

You MUST use this hook to get user data. Never do this yourself without the hook:
```typescript
import { useAuth } from "@/hooks/use-auth";

const { isLoading, isAuthenticated, user, signIn, signOut } = useAuth();
```

## Protected Routes

Check `isAuthenticated` and redirect to `/auth` to protect a page.

## Auth Page

Defined in `src/pages/Auth.tsx`. All login/sign-up flows go through `/auth`.

## Authorization

Check auth on the frontend via `useAuth` and protect queries/mutations/actions at the backend level too.

## Adding a redirect after auth

Edit `redirectAfterAuth` in `src/main.tsx` (currently set to `/saved`).

---

# Frontend Conventions

## Page routing

- Pages → `src/pages/`
- Reusable components → `src/components/`
- Shadcn primitives → `src/components/ui/` (use by default)
- Register new routes in `src/main.tsx`

## Shadcn UI conventions

- Use `cursor-pointer` on all clickable elements
- Title text: `tracking-tight font-bold`
- Always be **mobile responsive**
- **Avoid nested cards** — they add clutter
- **Avoid shadows** — use thin borders instead
- Use `Loader2` spinner instead of skeletons for loading states

## Landing Pages

Create designer-level, well-animated pages with a clear theme (neo-brutalist, glassmorphism, etc.). If the user is already logged in, show "Dashboard" instead of "Get started".

## Responsiveness and formatting

- Wrap content in a container with a max-width; center-align
- Verify correct min/max widths across breakpoints
- Protected/dashboard pages → **sidebar** navigation
- Public pages → **navbar** navigation
- Logo must be clickable and link to `/`

## Animating with Framer Motion

Framer Motion is pre-installed. Wrap elements with `motion.*` components.

```typescript
import { motion } from "framer-motion";
```

Animate: fade in/out, slide in/out, render transitions, button clicks, UI interactions — for all pages including landing.

## Colors

Override colours in `src/index.css` using the oklch format for Tailwind v4. Always use the defined CSS variable names. Support both light and dark mode. Set theme with `dark`/`light` class on the parent element.

## Styling and Theming

- Change the app-wide theme via `src/components/ui` and `src/index.css`
- Avoid hardcoding colours — use theme variables
- Ensure buttons and clickable elements have `cursor-pointer`

## Toasts

Use Sonner (already configured):

```typescript
import { toast } from "sonner";

toast("Event has been created", {
  description: "Sunday, December 03, 2023 at 9:00 AM",
  action: { label: "Undo", onClick: () => console.log("Undo") },
});
```

## Dialogs

- Prefer Dialogs over new pages for focused actions
- Always add scroll to dialog content so it doesn't overflow on small screens

---

# Using the Convex backend

## The Convex Schema

The schema is defined in `src/convex/schema.ts`.

- Do not include `_id` or `_creationTime` in queries (included by default)
- Do not index `_creationTime` — it is already indexed. No duplicate indexes.
- Keep `schemaValidation: false`

## Convex Actions: Using CRUD operations

Anything involving external connections must be a Convex action with `"use node"` at the top. Queries and mutations cannot share a file with `"use node"` actions.

Use the pre-installed internal CRUD helpers:

```ts
// in convex/users.ts
import { crud } from "convex-helpers/server/crud";
import schema from "./schema.ts";

export const { create, read, update, destroy } = crud(schema, "users");

// in an action:
const user = await ctx.runQuery(internal.users.read, { id: userId });

await ctx.runMutation(internal.users.update, {
  id: userId,
  patch: { status: "inactive" },
});
```

## Common Convex Mistakes To Avoid

- Document IDs → `_id` field (type `Id<"TableName">`, not `string`)
- Document objects → `Doc<"TableName">`
- Keep `schemaValidation: false` in the schema file
- Type all code correctly to pass the type checker
- Handle `null`/`undefined` from queries on both frontend and backend
- Always use `@/folder` paths: `@/convex/_generated/server`, `@/convex/_generated/api`
- Import `useQuery`, `useMutation`, `useAction` from `convex/react`
- **NEVER** add return type validators to Convex functions

