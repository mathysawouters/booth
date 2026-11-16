export const COPY = {
  hook: ["It's 7 PM.", "You're tired.", 'Your kid wants to play.'],
  name: 'Little Legends',
  tagline: 'One fun thing with your kid, every day.',
  builtWith: 'Built with Capy, Convex, Revyl, OpenAI, Whop and Supermemory',
  disclaimer: 'Sample family, photos generated for this demo',
} as const;

export const KID = { name: 'Lina', age: 7, loves: 'dinosaurs' } as const;

export type WeekDay = {
  weekday: string;
  date: string;
  title: string;
  quote: string;
  reaction: string;
  photo: string;
  skill: string;
  level: number | null;
  cheer: string | null;
};

export const WEEK: WeekDay[] = [
  {
    weekday: 'Mon',
    date: 'Nov 9',
    title: 'Cardboard Box Race Car',
    quote: "Vroom! My car is a Velociraptor car so it's the fastest one in the whole world.",
    reaction: 'That car is faster than me! I only have legs. Very long, wobbly legs.',
    photo: 'race-car',
    skill: 'Curious',
    level: null,
    cheer: '❤️',
  },
  {
    weekday: 'Tue',
    date: 'Nov 10',
    title: 'Dino Snack Shop',
    quote: "That's three coins for a Dino Cracker. No wait, it's on sale, so it's two.",
    reaction: "I'd buy everything! I only have one coin though. It's a button.",
    photo: 'snack-shop',
    skill: 'Money',
    level: 2,
    cheer: null,
  },
  {
    weekday: 'Wed',
    date: 'Nov 11',
    title: 'Backyard Dino Obstacle Course',
    quote: 'I was a Stegosaurus but my spikes got stuck in the hula hoop.',
    reaction: "You made it through! I'm still stuck in the hula hoop from last time.",
    photo: 'obstacle-course',
    skill: 'Brave',
    level: 2,
    cheer: '😂',
  },
  {
    weekday: 'Thu',
    date: 'Nov 12',
    title: 'Paper Plate Dino Masks',
    quote: 'I made you a Triceratops so we can match. Now you have to roar too.',
    reaction: 'Those masks are terrifying! In a good way. Mine looked like a sad pancake.',
    photo: 'dino-masks',
    skill: 'Kind',
    level: 2,
    cheer: '🌟',
  },
  {
    weekday: 'Fri',
    date: 'Nov 13',
    title: 'Bedtime Story with Rexy',
    quote: 'Rexy is scared of the dark so I have to hold him the whole night.',
    reaction: 'Shh... Rexy looks so cozy. I fell asleep in the middle of my own story.',
    photo: 'bedtime-rexy',
    skill: 'Reader',
    level: 2,
    cheer: null,
  },
  {
    weekday: 'Sat',
    date: 'Nov 14',
    title: 'Sponge Stamp Dino Tracks',
    quote: 'Look, a dinosaur walked all over the paper and it was a green one.',
    reaction: 'Dino footprints everywhere! My sponge just got stuck to my foot.',
    photo: 'dino-tracks',
    skill: 'Curious',
    level: 3,
    cheer: '❤️',
  },
  {
    weekday: 'Sun',
    date: 'Nov 15',
    title: 'Dinosaur Word Hunt',
    quote: 'I found Spike! He was hiding under the couch pillow the whole time.',
    reaction: 'Wow, Lina, you found Spike under the couch pillow! I spent all day searching with a dinosaur on my head.',
    photo: 'tonight',
    skill: 'Reader',
    level: 2,
    cheer: '🎉',
  },
];
