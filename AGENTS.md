# Online Travel Guide — Agent Instructions

Autonomous agents working on this repo must follow these rules.

## Project

**Онлайн Путеводитель** — premium travel guide (Next.js 16 App Router, TypeScript, Tailwind v4).

- **Working directory**: repo root (`travel-guide/`)
- **Local dev**: `npm run dev` → http://localhost:3000
- **Build check**: `npm run build` must pass before opening PR
- **Deploy**: Vercel (only when user explicitly asks — default is local-only)

## Architecture

```
content/countries/{country}/meta.json
content/countries/{country}/cities/{city}.json
content/countries/{country}/cities/{city}.extras.json  # map, checklist, coords
src/app/[locale]/[country]/[city]/   # pages
src/app/api/chat|search|pdf/         # APIs
src/components/                      # UI
src/messages/ru.json, en.json        # i18n
```

## Content model

- Universal JSON schema in `src/types/content.ts`
- Add countries/cities via JSON only — never hardcode city names in logic
- Bilingual: every user-facing string has `ru` and `en`
- Real, practical travel info (prices in VND, scams, transport, food)

## Current scope

- **Country**: Vietnam
- **Cities**: Nha Trang (`nha-trang`), Da Nang (`da-nang`)
- **Features**: tabs, AI chat (Gemini), PDF download, map, live weather/currency, favorites, checklist, compare, PWA

## Code standards

1. Minimal diffs — don't refactor unrelated code
2. Match existing patterns (Framer Motion, next-themes, LocaleProvider)
3. Mobile-first UI, bold Space Grotesk headings, orange accent
4. Never commit secrets (`.env.local`, API keys)
5. Never force-push `main`
6. Run `npm run build` after changes

## Environment

- `GEMINI_API_KEY` — required for AI chat (Vercel + local `.env.local`)
- Model in API: `gemini-2.5-flash`

## Priority backlog (pick 1–2 items per run)

### Content
- [ ] Add Ho Chi Minh City or Hue
- [ ] Enrich existing city JSON (more restaurants, updated 2026 prices)
- [ ] Add photos/images to new items

### Product
- [ ] Improve mobile UX (tab bar, chat, map)
- [ ] Better offline/PWA caching
- [ ] Currency converter widget
- [ ] Share button for places

### Quality
- [ ] Fix ESLint warnings
- [ ] Improve accessibility (aria labels, contrast)
- [ ] Error boundaries for API routes
- [ ] Loading skeletons

### AI
- [ ] Better quick prompts per city
- [ ] Chat memory within session improvements
- [ ] Fallback when Gemini unavailable

## What NOT to do

- Don't deploy to Vercel unless task says so
- Don't add heavy dependencies without reason
- Don't break i18n (always update ru.json + en.json)
- Don't remove existing features
- Don't create empty commits or drive-by refactors

## Success criteria for a PR

1. `npm run build` passes
2. Clear PR title: `feat:`, `fix:`, or `content:`
3. Description lists what changed and why
4. Screenshots if UI changed (describe in PR body if can't attach)

## Memories

After each run, update automation memory with:
- What was completed
- What blocked progress
- Recommended next task
