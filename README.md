# Dota Battlepass - Frontend Demo

An archived Dota-inspired interactive game frontend built using **Vue 3, TypeScript, Pinia, GSAP, SCSS and Vite**.

The original experience included an animated scrolling map, characters, encounters, roulette interactions, a progression system, tasks and user-account screens. The original promotional backend is no longer part of this standalone portfolio demo.

## Explore the demo

- **Game:** the complete original four-region map (Radiant, River, Dire and Ancient), with 13 local encounters and 25 fictional progression stages. Use the new region navigation to jump between areas, or scroll/drag horizontally.
- **Tasks:** an interactive local exploration checklist (not real missions)
- **Account:** a read-only summary of the local game state
- **FAQ:** questions about this frontend project and its limitations
- **About:** explains the archived experience and which integrations are unavailable

The entire map is available without signing in. The original backend-driven progression and reward system are **not** restored; stages, points, spins and events are fictional local demo data. **There are no active prizes, accounts, payments, bets or redemption flows**.

## Running locally

Requires a current supported Node.js version and npm.

```bash
npm install
npm run dev
```

To produce a static build:

```bash
npm run build
npm run preview
```

The build output is `dist/`. On Vercel, `vercel.json` provides an SPA fallback for client-side routes. For Cloudflare Pages, `public/_redirects` serves the same purpose.

## Demo mode and API integrations

Public demo mode is **enabled by default** in `src/demo/config.ts`:

```ts
export const DEMO_MODE: boolean = import.meta.env.VITE_DEMO_MODE !== 'false';
```

In this mode, legacy login messages, API requests and tracking are disabled. The `src/services/api` directory and the original Pinia integration code remain in the repository as historical frontend implementation, but aren't used by the public visitor journey.

`VITE_DEMO_MODE=false` is intended **only for private testing with a compatible original backend** and must not be set on a public deployment. Such private testing additionally requires a trusted `VITE_PARENT_ORIGIN` for the original embedding protocol. No API credentials should be placed in public Vite environment variables.

## Project structure

- `src/pages/Index.vue` - animated map and original game
- `src/demo/DemoPage.vue` - demo Tasks, Account, FAQ and About pages
- `src/stores/` - state and local game data
- `src/services/` - original API integration source, disabled in demo mode
- `src/components/` - characters, animations and interface components
- `public/`, `src/assets/` - original image, sprite and styling assets

## Notes

This is an older client frontend project restored for portfolio purposes, not a production game. The original map art and animations are preserved, but not every historical gameplay/reward sequence has been verified. Test the four region buttons, clicking event markers, mousewheel and drag scrolling, and mobile layouts. Demo progress is temporary and does not correspond to real prizes or activities.

The downloadable code-only snapshot omits original font binaries. When applying it to your original project, **keep your own authorized local font files** and other assets in place.
