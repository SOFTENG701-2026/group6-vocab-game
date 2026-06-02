# Magic Soup Buddies

An interactive vocabulary learning game built for young learners. Players choose a theme, pick a difficulty, and practice words through drag-and-drop, recall, color and shape matching, spelling minigames, and voice-guided narration.

## Features

- **Theme selection** — Browse vocabulary themes in a carousel. *Fruits & Vegetables* is currently playable; *Transport* and *Garden* are coming soon.
- **Play modes** — Single player (with a buddy bot) or two-player local play.
- **Difficulty levels**
  - **Easy** — Guided soup-making flow: drag ingredients into the pot, recall what was added, pick the correct color, review shapes, and practice saying the word.
  - **Medium** — Letter-spelling minigame.
  - **Hard** — Ingredient matching and letter-spelling minigames.
- **Narrator & speech** — A monster companion and narrator provide spoken feedback using the Web Speech API and pre-recorded audio cues.
- **Achievements & shop** — Track progress and browse in-game rewards.
- **Accessible UI** — Large touch targets, visual hints (finger prompts, progress indicators), and kid-friendly illustrations.

## Tech Stack

- [Next.js 16](https://nextjs.org/) (App Router)
- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [Lucide React](https://lucide.dev/) for icons

## Getting Started

### Prerequisites

- Node.js 20+
- npm (or yarn / pnpm / bun)

### Install dependencies

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Other scripts

```bash
npm run build   # Production build
npm run start   # Start production server
npm run lint    # Run ESLint
```

## User Flow

1. **`/`** — Choose a vocabulary theme.
2. **`/home?theme=…`** — Select 1-player or 2-player mode, then pick a difficulty.
3. **`/easygame`** — Play the easy-mode soup game.
4. **`/game`** — Play medium/hard minigames (ingredient match, block spelling).
5. **`/achievements`** — View achievement progress.
6. **`/shop`** — Browse shop items.

## Project Structure

```
app/              # Next.js routes and pages
components/       # Reusable UI (cards, modals, minigames, narrator, etc.)
context/          # React context (game setup, currency, pause, narrative)
domain/           # Game rules, types, themes, avatars, narrator scripts
hooks/            # Custom hooks (e.g. useEasyGame)
lib/              # Utilities (speech, game helpers, shop data)
data/             # Static ingredient and game data
public/           # Images, audio, SVG assets
```

## Key Modules

| Module | Purpose |
|--------|---------|
| `hooks/use-easy-game.ts` | State and flow for the easy game (drag, recall, color, shape, speech) |
| `domain/themes/theme-options.ts` | Available vocabulary themes |
| `domain/minigame-type.ts` | Minigame mapping per difficulty |
| `components/modals/` | Difficulty, ingredient, and preview modals |
| `context/game-setup-context.tsx` | Play mode, difficulty, and player setup |
| `lib/speak.ts` | Web Speech API wrapper |

## Browser Notes

Speech and audio features work best in modern Chromium-based browsers. Some browsers require a user interaction (click or tap) before playing speech on the theme selection screen.

## License

Private — CS701 Group 6 project.
