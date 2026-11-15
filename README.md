# Little Legends

One fun 10-minute thing with your kid, every day.

Built at the YC Consumer Mobile Hackathon (15 Nov 2026) with Capy, Convex and Revyl.

<p>
  <img src="assets/illustrations/leggy-waving.png" alt="Leggy waving" height="150">
  <img src="assets/illustrations/leggy-thinking.png" alt="Leggy thinking" height="150">
  <img src="assets/illustrations/leggy-cheering.png" alt="Leggy cheering" height="150">
  <img src="assets/illustrations/leggy-proud.png" alt="Leggy proud" height="150">
</p>

## The pitch

Parents want quality time with their kid, but at 7 PM they are out of ideas. Little Legends gives them one good idea a day, made for their kid, that takes about 10 minutes.

The phone is the campfire, not the babysitter: you gather around it together, then put it down and do the thing.

## How it works

1. **Add your kid.** Name, age, interests, and a note if you like ("a bit shy").
2. **Pick how and what.** *In real life* or *On the phone*, then a theme: Bedtime, Build, Story, Outside, Kitchen, Art, Music, Skills, Calm or Surprise me.
3. **Get today's Legend.** The AI writes a tailored activity in seconds. Stories star your kid by name.
4. **Leggy goes first, badly.** Sometimes Leggy, the mascot, shows its own failed attempt with a drawing and a dare: "Can you do better?"
5. **We did it.** Add a photo and what your kid said.
6. **Leggy reacts** to the photo and the quote.
7. **Skills level up.** Each Legend trains one of six skills: Brave, Kind, Curious, Money, Helper, Reader.
8. **The Book keeps the memories.** Every finished Legend, with its photo and quote.
9. **Family follow live and cheer.** Invite grandma by username; she sees each finished Legend the moment it lands and sends a cheer.

## Screenshots

Illustrations from `assets/illustrations`, generated with the same image model that draws Leggy's attempts:

<p>
  <img src="assets/illustrations/category-story.png" alt="Story" width="150">
  <img src="assets/illustrations/category-build.png" alt="Build" width="150">
  <img src="assets/illustrations/category-outside.png" alt="Outside" width="150">
  <img src="assets/illustrations/category-kitchen.png" alt="Kitchen" width="150">
  <img src="assets/illustrations/category-bedtime.png" alt="Bedtime" width="150">
</p>

Before and after the picture-book redesign ([#8](https://github.com/mathysawouters/booth/pull/8)):

| Screen | Before / after |
| --- | --- |
| Today | ![Today, before and after](https://api.capy.ai/pr-assets/gMoOJkTFw2shaGEguUBuOxXGz0P3p5RW-h7pQ_adXpE.png) |
| Legend | ![Legend, before and after](https://api.capy.ai/pr-assets/8GPemafxtxtKZG_TPnTKpvNx2CPSz2pWarnVSOYZ9AA.png) |
| Book | ![Book, before and after](https://api.capy.ai/pr-assets/9Q_LsWDDu2Hz58eR13ynpTWMOWucUkbqf4yimySPAtY.png) |
| Family | ![Family, before and after](https://api.capy.ai/pr-assets/dJAMhSC9EcaEd-ZAhEXxaJrhHp_U1YangVv7gNaALLw.png) |

## How it's built

An Expo (React Native) app on a Convex backend, built with the three required tools:

- **Capy** wrote the code across parallel threads: backend, screens, redesign, fixes, and the build log.
- **Convex** runs auth, data, file storage (photos, voice clips, Leggy's drawings), the realtime family feed, the scheduled Leggy image generation, and the server-side OpenAI calls. API keys never ship in the app.
- **Revyl** built the Release simulator app and ran the full parent and grandma flow on two cloud iPhones.

## AI models

Both are OpenAI models, called from Convex actions in [`convex/ai.ts`](convex/ai.ts):

| Model | What it does |
| --- | --- |
| `gpt-6.1-terra` | Writes the activity or story as structured JSON, and Leggy's reaction to the photo and quote |
| `gpt-image-2.5-flare` | Draws Leggy's failed attempt |

These are the defaults; `OPENAI_TEXT_MODEL` and `OPENAI_IMAGE_MODEL` override them. If OpenAI is unavailable, the activity comes from a built-in library and Leggy uses a stock reaction.

## Run it

```bash
npm install
npx convex dev    # backend, keep it running
npx expo start    # then open in Expo Go
```

For the AI on your own Convex deployment: `npx convex env set OPENAI_API_KEY <key>`.

## Build log

[hackathon.md](hackathon.md) has the commit-by-commit build log.
