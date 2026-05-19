# Magic Soup Buddies

A vocabulary learning game for young learners. Players cook magic soup with a monster teacher by identifying ingredients by color and shape, repeating words aloud, recalling what went into the pot, and spelling vocabulary—earning points, unlocking achievements, and buying cosmetic skins.

Built with the [Next.js](https://nextjs.org) App Router, migrated and split from the HTML/JavaScript demo in `New project/`.

## Tech Stack

| Technology | Description |
|------------|-------------|
| [Next.js 16](https://nextjs.org) | App Router, server and client components |
| [React 19](https://react.dev) | UI |
| [TypeScript](https://www.typescriptlang.org) | Type safety |
| [Tailwind CSS 4](https://tailwindcss.com) | Base styles and CSS variables |
| Web Speech API | Kid-friendly text-to-speech |

## Getting Started

### Prerequisites

- Node.js 18+
- npm (or yarn / pnpm / bun)

### Install and Run

```bash
# Install dependencies
npm install

# Development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Other Commands

```bash
npm run build   # Production build
npm run start   # Start production server (run build first)
npm run lint    # ESLint
```

## Game Flow

```
Home (/) → Select (/select) → Game (/game) → Recall (/recall)
                ↑                                ↓
    Achievements (/achievements)  ← navbar →  Shop (/shop)
```

1. **Home** — Choose solo **Play** or **Play With a Friend**
2. **Select** — Pick Soup Buddy avatars (one each in duo mode)
3. **Game** — Six rounds: match color and shape, then say the word and add it to the pot
4. **Recall** — Remember ingredients in the pot, spell each word, earn 10 points
5. **Achievements / Shop** — Open anytime from the navbar; return to the current game if entered mid-play

Player progress (points, completions, owned and equipped skins) is stored in the browser under `localStorage` key `magicSoupProfile`.

## Routes

| Path | File | Description |
|------|------|-------------|
| `/` | `app/page.tsx` | Home — start a game |
| `/select` | `app/select/page.tsx` | Choose player avatars |
| `/game` | `app/game/page.tsx` | Main game (6 ingredient rounds) |
| `/recall` | `app/recall/page.tsx` | Recall and spelling round |
| `/achievements` | `app/achievements/page.tsx` | Badges and titles |
| `/shop` | `app/shop/page.tsx` | Pot decor and monster skins |

## Project Structure

```
group6-vocab-game/
├── app/                      # Next.js pages (App Router)
│   ├── page.tsx              # Home
│   ├── layout.tsx            # Root layout, providers, navbar
│   ├── globals.css           # Global styles (incl. Tailwind)
│   ├── select/page.tsx
│   ├── game/page.tsx
│   ├── recall/page.tsx
│   ├── achievements/page.tsx
│   └── shop/page.tsx
├── components/
│   ├── navbar.tsx            # Top navigation bar
│   ├── providers.tsx         # GameProvider wrapper
│   ├── button.tsx            # Shared button component
│   ├── game/                 # Game UI components
│   │   ├── game-shell.tsx    # Game shell container
│   │   ├── monster.tsx       # Monster teacher
│   │   ├── pot.tsx           # Soup pot
│   │   ├── ingredient-card.tsx
│   │   └── confetti.tsx
│   └── modals/               # Dialogs
│       ├── word-modal.tsx    # Spelling
│       ├── points-modal.tsx  # Points reward
│       ├── end-choice-modal.tsx
│       └── exit-confirm-modal.tsx
├── context/
│   └── game-provider.tsx     # Global game state and navigation
├── lib/
│   ├── data/                 # Static data
│   │   ├── ingredient-bank.ts
│   │   ├── avatars.ts
│   │   ├── achievements.ts
│   │   └── shop-items.ts
│   └── game/                 # Game logic utilities
│       ├── types.ts
│       ├── profile.ts        # localStorage read/write
│       ├── speech.ts         # Speech synthesis
│       ├── round-helpers.ts  # Round option generation
│       └── shapes.tsx        # Ingredient outline SVGs
├── styles/
│   └── game.css              # Game UI styles (from demo)
├── public/
│   └── logo-title.png
└── New project/              # Original HTML/JS demo (reference)
    ├── index.html
    ├── app.js
    └── styles.css
```

## State Management

`context/game-provider.tsx` centralizes:

- Game mode (solo / duo), current round, ingredients added to the pot
- Selected player avatars and spelling progress
- User profile (points, completions, owned and equipped skins)
- Navigation via `router.push` and returning from achievements/shop to an active game

Pages access this state through the `useGame()` hook.

## Deployment

Deploy to [Vercel](https://vercel.com) or any platform that supports Next.js:

```bash
npm run build
npm run start
```

See the [Next.js deployment docs](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Team

CS701 Group 6 — Vocabulary Game Project
