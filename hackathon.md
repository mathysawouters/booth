# Hackathon log

- **Project:** booth
- **Event:** YC Consumer Mobile Hackathon 15 Nov 2026 (Capy + Revyl + Convex)
- **What it does:** Not documented yet
- **Live app:** not deployed
- **Repo:** private
- **Frontend:** not deployed
- **Convex deployment:** https://coordinated-armadillo-409.convex.cloud
- **Components:** none
- **Convex features:** none yet
- **Auth:** none
- **AI models:** none
- **Started:** 2026-11-15T19:09:37Z
- **Last updated:** 2026-11-15T19:22:36Z

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
