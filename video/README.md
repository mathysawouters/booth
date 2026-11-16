# Little Legends launch video

The launch video, built with [Remotion](https://www.remotion.dev). This folder is its own package and does not touch the app.

```bash
cd video
npm install
npm run studio          # preview and scrub the compositions
npm run render:samples  # writes samples/a.mp4, b.mp4 and c.mp4
```

All compositions are vertical, 1080x1920 at 30 fps, rendered as H.264.

## Style samples

| File | Composition | Style |
| --- | --- | --- |
| `samples/a.mp4` | `SampleA-CandyPop` | Candy Pop |
| `samples/b.mp4` | `SampleB-Scrapbook` | Storybook Scrapbook |
| `samples/c.mp4` | `SampleC-Premium` | Premium Launch |

## Assets

- Leggy and the category art are imported straight from `assets/illustrations` in the app.
- `public/screens` holds screenshots of the app's web build at 390x844 (3x), taken from a demo family: a kid called Lina, 7, who loves dinosaurs.
- `public/photos` holds the photos from Lina's Book. They were generated for the demo by `demo:seedWeek`, so every scene that shows them carries the note "Sample family, photos generated for this demo".
- `src/lib/data.ts` holds the copy and the week of legends (titles, quotes, Leggy's reactions) as they appear in the Book.
