# Hackathon log

- **Project:** Little Legends (repo: booth)
- **Event:** YC Consumer Mobile Hackathon 15 Nov 2026 (Capy + Revyl + Convex)
- **What it does:** One fun 10-minute activity a parent does with their kid every day, guided by Leggy the mascot, with skills, levels, and a family feed.
- **Live app:** not deployed
- **Repo:** https://github.com/mathysawouters/booth
- **Frontend:** not deployed
- **Convex deployment:** https://coordinated-armadillo-409.convex.cloud
- **Components:** @convex-dev/auth (with its password and username components)
- **Convex features:** schema, tables, indexes, queries, mutations, actions, scheduled functions, file storage, realtime queries
- **Auth:** Convex Auth
- **AI models:** gpt-6.1-terra (text), gpt-image-2.5-flare (images); defaults, overridable via `OPENAI_TEXT_MODEL` / `OPENAI_IMAGE_MODEL`
- **Started:** 2026-11-15T19:09:37Z
- **Last updated:** 2026-11-15T23:29:04Z

## Log

### 2026-11-15 - 07b1a10
Scaffolded the app from the default Expo template (SDK 58, TypeScript, Expo
Router with tab navigation in `src/app/`). Added Convex with an empty schema and
a `convex dev` script; no tables or functions yet (`convex/schema.ts`,
`package.json`).

### 2026-11-15 - 3c0bba6
Connected the app to a Convex dev deployment. Committed the public
`EXPO_PUBLIC_CONVEX_URL` and `EXPO_PUBLIC_CONVEX_SITE_URL` so cloud builds get
the backend URL without a local env file, and added the Convex TypeScript config
(`.env`, `convex/tsconfig.json`).

### 2026-11-15 - 119b600
Added the Convex backend for Booth with username/password sign-in. Convex Auth
v2 is registered with its password and username components, and the schema
gained users, friendships, strips, and reactions. Convex features: schema,
indexes, queries, mutations, Convex Auth (`convex/convex.config.ts`,
`convex/auth.ts`, `convex/schema.ts`, `convex/strips.ts`, `convex/friends.ts`).

### 2026-11-15 - 2a833dc
Built the Booth screens on that backend: sign-in, a home feed, friends, and the
booth capture flow, replacing the Expo template screens. Screens read live data
through realtime queries (`src/app/sign-in.tsx`, `src/app/booth.tsx`,
`src/app/(tabs)/`).

### 2026-11-15 - 834bc5b
Pivoted the product (around 14:00 PT) from Booth to Little Legends: one fun
10-minute activity a parent does with their kid every day, with Leggy the
mascot. Replaced strips and reactions with kids, legends (daily activities),
skills with XP and levels, and cheers for a family feed. An action plans
today's legend from a curated library plus OpenAI, and Leggy reacts to proof
photos; per-kid memories go to Supermemory when its key is set. Convex
features: actions, internal queries/mutations, file storage, indexes
(`convex/legends.ts`, `convex/library.ts`, `convex/kids.ts`, `convex/family.ts`,
`convex/ai.ts`, `convex/memory.ts`).

### 2026-11-15 - c053b33
Leggy's "funny fail" challenge image now generates in the background: creating
a legend schedules an internal action that draws the image and attaches it
from storage, so the activity appears without waiting on image generation.
OpenAI model ids are now configurable through env vars with the defaults
above. Convex features: scheduled functions (`convex/legends.ts`, `convex/ai.ts`).

### 2026-11-15 - d9c3369
Replaced the Booth screens with Little Legends: today's legend, the memory
book, the family feed, add-kid, story, and a done screen with confetti and
level-ups, plus a kid switcher, voice clips, and a Leggy placeholder while the
challenge image is still generating (`src/app/`, `src/components/`). After the
merge, started a Revyl test run on two cloud iPhones (per the builder; no
result in the repo yet).

### 2026-11-15 - e1463d3
Redesigned Little Legends as a picture-book app. Leggy is now illustrated in
six poses instead of an SVG, each category has its own artwork, and the theme
moved to white, neutral greys, and Leggy's green with Fredoka, Nunito, and
Literata loaded through `useFonts`. Every screen got soft cards, spring
presses, and light haptics; no logic, navigation, or Convex changes
(`assets/illustrations/`, `src/constants/theme.ts`, `src/components/leggy.tsx`,
`src/components/ui.tsx`, `src/lib/haptics.ts`).

### 2026-11-15 - 013987e
The level-up screen now uses a phrase per skill ("braver", "kinder", "smarter
with money", "a stronger reader") instead of "more" plus the skill name, which
read wrong for skills like Money and Reader. Dropped the unused `react-native-svg`
dependency now that Leggy is an illustration (`src/lib/legends.ts`,
`src/components/level-up.tsx`).

### 2026-11-15 - 384c24f
Three fixes from the simulator run. The quote field on the done screen stays
above the keyboard while typing. Picking the same category after finishing a
legend now makes a new one: only an open legend is reused. A kid's first
finished legend in a skill levels it up, because Level 2 now starts at 20 XP,
which is what a 5-minute legend earns (`src/app/done.tsx`, `convex/legends.ts`,
`convex/levels.ts`).

### 2026-11-15 - 599b9c6
Wrote the README for the hackathon judges: the pitch, how a day with the app
works, illustrations and before/after screenshots of the redesign, how Capy,
Convex, and Revyl were used, the AI models, and how to run it (`README.md`).

### 2026-11-15 - e329db9
Removed the MIT license file that came with the Expo template and named Expo
as the copyright holder of the whole project. The repo is now public without a
license file (`LICENSE`).

### 2026-11-15 - 1648fe3
A kid's very first legend now always carries Leggy's challenge, so the first
impression shows Leggy's failed attempt with its line and drawing. The action
skips the random roll when the kid has no legends yet and falls back to a
stock Leggy line if the draft has none; later legends keep the existing odds
(`convex/legends.ts`, `convex/library.ts`).

Final Revyl result (per the builder): a Release simulator build ran the full
parent and grandma flow on two cloud iPhones, including the first-legend
level-up and grandma's live cheer.
