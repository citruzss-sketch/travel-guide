# Online Travel Guide

A premium Next.js travel guide app with bilingual content (RU/EN), AI city assistant powered by Google Gemini, and offline PDF guides.

## Features

- Structured city guides (transport, food, sights, lifehacks, scams, phrases)
- Locale routing (`/ru`, `/en`)
- Dark/light theme
- Global search across countries and cities
- Streaming AI chat with city-specific context
- Bilingual PDF download (Russian + English sections)

## Getting Started

```bash
cd travel-guide
npm install
cp .env.example .env.local
```

Add your [Gemini API key](https://aistudio.google.com/apikey) to `.env.local`:

```
GEMINI_API_KEY=your_key_here
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you will be redirected to `/ru`.

## Project Structure

```
content/countries/     # Country meta + city JSON content
src/app/[locale]/      # Localized pages
src/app/api/           # Search, chat, PDF APIs
src/components/        # UI, city panels, chat
src/lib/               # Content loading, i18n, PDF template
src/messages/          # UI translations (ru.json, en.json)
```

## Adding Content

1. Create `content/countries/{slug}/meta.json`
2. Add city files under `content/countries/{slug}/cities/{city-slug}.json`
3. List city slugs in `meta.json` → `cities` array

## Deploy to Vercel

1. Push the repository to GitHub
2. Import the project in [Vercel](https://vercel.com/new)
3. Set environment variable:
   - `GEMINI_API_KEY` — required for AI chat
4. Deploy

PDF generation works without an API key. AI chat returns a friendly error if `GEMINI_API_KEY` is missing.

## Environment Variables

| Variable         | Required | Description              |
|------------------|----------|--------------------------|
| `GEMINI_API_KEY` | For chat | Google Gemini API key    |

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm run start` — start production server
- `npm run lint` — ESLint

## Tech Stack

- Next.js 16 (App Router)
- Tailwind CSS v4
- Framer Motion
- next-themes
- @google/generative-ai
- @react-pdf/renderer
