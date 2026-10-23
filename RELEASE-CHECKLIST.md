# Dota Battlepass restoration: review and test

## Changed source

- `src/App.vue` - removed automatic external authentication/tracking for demo, added compact dismissible notice, and shows intro only on the game route
- `src/pages/Index.vue` - prevents the original registration-and-prize modal from opening in demo mode
- `src/components/Singular/Game/PreviewScreen.vue` - shorter introduction and accurate demo text
- `src/router/index.ts` - public demo routes go to a standalone view; old page implementations remain in source and are reserved for non-demo operation
- `src/demo/config.ts` and `src/demo/DemoPage.vue` - centralized demo mode and usable tasks/profile/FAQ/about
- `src/services/http/http.service.ts` - stops outbound requests from the original API client in demo mode
- `src/services/http/http.helper.ts` - disables old postMessage authentication unless explicitly private and bound to a trusted origin
- `src/stores/auth.ts` - blocks demo login and deletes a legacy commented token-looking value
- `src/components/Reusable/Game/Roulette.vue`, `src/components/Singular/Game/RouletteScreen.vue`, `src/components/Singular/Game/AwardsScreen.vue` - prevent original API refreshes during guest/demo roulette and award interactions
- `package.json` - removed obsolete `node-sass` and `sass-loader`; retained modern `sass`
- `index.html` - updated title/description and removed historical analytics references
- `.gitignore`, `.env.example` - exclude environment/registry files and document demo mode
- `vercel.json`, `public/_redirects` - SPA refresh fallback
- `README.md` - updated project description and local instructions

## Test before deploying

- Run `npm install`, `npm run type-check` and `npm run build`
- Open `/` and click Continue after the intro; move through the map and try a game action
- Visit `/tasks`, mark a checklist item, and navigate back to Game
- Visit `/account` and confirm game state is displayed without login prompts
- Open `/faq` and expand answers
- Open `/about`, then refresh the page directly
- Verify no old `sync_user` messages, API requests to the former servers, analytics or registration links are activated
- Check 375px/768px and desktop, particularly the map and overlays
- Confirm `.npmrc`, `.env.prod`, `.env.stage`, and any credential files are **not tracked** before publishing

## Source archive note

This updated source code was prepared from the user's uploaded archive. Original binary font files are not redistributed. Keep existing local fonts when overlaying the updated code onto the original project.

A full dependency installation or Vite browser build was not available in the preparation environment. Do not treat syntax-only checks as a full integration test.
