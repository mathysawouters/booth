import type { Category, Kind, Mode, Skill } from "./schema";
import { SKILLS } from "./levels";

export type LegendDraft = {
  kind: Kind;
  skill: Skill;
  title: string;
  steps: string[];
  story?: string[];
  question: string;
  challenge?: string;
};

type LibraryLegend = LegendDraft & { mode: Mode; category: Category };

export type RecentLegend = {
  day: string;
  kind: Kind;
  skill: Skill;
  title: string;
  challenge: boolean;
};

const LIBRARY: LibraryLegend[] = [
  {
    mode: "phone",
    category: "bedtime",
    kind: "story",
    skill: "reader",
    title: "The Sleepy Star",
    steps: [
      "Snuggle up together and hold the phone where you can both see it.",
      "Take turns reading the pages, or let {name} point at words they know.",
      "On the last page, both of you yawn the biggest yawn you can.",
    ],
    story: [
      "High above {name}'s house lived a little star called Twink. Every night Twink tried to shine, but tonight Twink felt wobbly and wide awake. \"I can't fall asleep,\" Twink whispered to the moon. The moon smiled and said, \"I know someone who is very good at bedtime. Their name is {name}.\" So Twink floated down, down, down, all the way to {name}'s window.",
      "{name} was already in pajamas. \"Hello, Twink! Can't sleep?\" Twink shook its five pointy arms. {name} knew just what to do. \"First we take a slow breath in, like smelling a flower. Then we blow it out, like cooling soup.\" Twink tried it. In... and out. In... and out. Twink's glow got a little softer.",
      "\"Next,\" said {name}, \"we say goodnight to everything we love.\" Goodnight, teddy. Goodnight, window. Goodnight, stars far away. Twink giggled and said goodnight to the clouds, the sleepy owls, and the quiet street. Each goodnight made Twink feel cozier and cozier, like a warm blanket made of whispers.",
      "Twink floated back up into the sky and tucked itself between two clouds. \"Thank you, {name},\" it murmured, twinkling very slowly now. {name} snuggled under the covers and watched the little star blink once, twice, three times. Then Twink was asleep. And so, very gently, was {name}. Goodnight.",
    ],
    question: "What would you say goodnight to tonight?",
  },
  {
    mode: "phone",
    category: "bedtime",
    kind: "story",
    skill: "kind",
    title: "The Blanket That Said Thank You",
    steps: [
      "Lie down side by side and read the story in a soft, slow voice.",
      "After each page, take one slow breath together.",
      "When the story ends, tuck {name}'s blanket in and whisper goodnight.",
    ],
    story: [
      "{name} had a blanket that was very special, because once a year, on a quiet night, it could talk. Tonight was that night. \"Psst, {name},\" said the blanket. \"You keep me warm all day by holding me. Tonight I want to say thank you.\" {name} rubbed their eyes. A talking blanket! That was new.",
      "\"How do blankets say thank you?\" asked {name}. The blanket wiggled its corners. \"We give the best snuggles in the world. But first, tell me something kind you did today.\" {name} thought hard and remembered sharing a snack, helping put shoes away, and giving a big hug. The blanket got softer with every kind thing.",
      "\"Now,\" said the blanket, \"let's thank everyone else.\" Thank you, pillow, for being squishy. Thank you, moon, for the night-light. Thank you, family, for the hugs. {name} thanked the floor for holding up the bed, which made the blanket laugh so hard it nearly fell off.",
      "The blanket wrapped itself around {name} like a warm hug. \"Thank you for being you,\" it whispered. {name}'s eyes grew heavy. The room was quiet, the pillow was squishy, and the moon was glowing. The blanket hummed a tiny lullaby, and {name} drifted off to sleep, warm and loved.",
    ],
    question: "What kind thing did you do today?",
  },
  {
    mode: "real",
    category: "bedtime",
    kind: "adventure",
    skill: "kind",
    title: "Stuffed Animal Tuck-In Parade",
    steps: [
      "Let {name} pick three stuffed animals for the parade.",
      "March them slowly to bed, whispering each one's name.",
      "Tuck each animal in and ask {name} what it dreams about.",
      "Finally, tuck {name} in too, and whisper goodnight to the whole parade.",
    ],
    question: "What do you think your favorite stuffed animal dreams about?",
  },
  {
    mode: "real",
    category: "bedtime",
    kind: "skill",
    skill: "curious",
    title: "Goodnight Shadow Puppets",
    steps: [
      "Turn off the big light and use one small lamp or flashlight.",
      "Make a bird, a dog and a bunny shadow on the wall together.",
      "Let {name} invent a brand new shadow animal and name it.",
      "Make all the shadow animals lie down and go to sleep, then switch off the light.",
    ],
    question: "What new animal did your hands make?",
    challenge: "I made a shadow bunny. It looked like a potato with ears. Can you do better?",
  },
  {
    mode: "phone",
    category: "build",
    kind: "draw",
    skill: "curious",
    title: "Dream Fort Blueprint",
    steps: [
      "Grab paper and crayons and sit side by side.",
      "Each draw the coolest fort you can imagine, with secret doors.",
      "Swap drawings and add one surprise to each other's fort.",
      "Snap a photo of both blueprints side by side.",
    ],
    question: "What's the secret room in your fort for?",
    challenge: "I drew a fort. It looks like a sandwich with a door. Can you do better?",
  },
  {
    mode: "real",
    category: "build",
    kind: "adventure",
    skill: "brave",
    title: "Pillow Fort Hideout",
    steps: [
      "Gather pillows, cushions and one big blanket.",
      "Let {name} be the chief builder while you are the helper.",
      "Build walls, then drape the blanket on top for a roof.",
      "Crawl inside together and tell one secret password.",
    ],
    question: "What's the secret password to get into your fort?",
    challenge: "I built a fort. It fell on me. Can you do better?",
  },
  {
    mode: "real",
    category: "build",
    kind: "skill",
    skill: "curious",
    title: "Tallest Cup Tower",
    steps: [
      "Collect paper or plastic cups and some cardboard pieces.",
      "Take turns adding one cup at a time to build a tower.",
      "Try a cardboard floor between levels to go higher.",
      "Count the levels before it falls, then knock it down on purpose!",
    ],
    question: "What made your tower stronger?",
    challenge: "My cup tower was two cups tall. Then I sneezed. Can you do better?",
  },
  {
    mode: "real",
    category: "build",
    kind: "skill",
    skill: "helper",
    title: "Cardboard Box Race Car",
    steps: [
      "Find a cardboard box big enough for {name} to sit in.",
      "Draw wheels, lights and a number on the sides.",
      "Add paper plates as a steering wheel.",
      "Push {name} on a slow victory lap around the room.",
    ],
    question: "What's the name of your race car?",
    challenge: "I built a race car. It only goes backwards. Can you do better?",
  },
  {
    mode: "phone",
    category: "story",
    kind: "story",
    skill: "reader",
    title: "The Map Under the Bed",
    steps: [
      "Sit together and read the story, taking turns page by page.",
      "Use a different silly voice for the dragon.",
      "When you finish, invent one more treasure for the map.",
    ],
    story: [
      "One rainy morning, {name} dropped a sock under the bed and found something strange: a crinkly old map. It had a big red X, a drawing of a staircase, and the words \"For the bravest explorer only.\" {name} looked around. The only explorer in the room was {name}. \"That's me,\" {name} said, and grabbed a flashlight.",
      "The map said: \"Start at the bed. Ten giant steps to the door.\" {name} counted out loud and took ten huge steps. Next: \"Find the place where food is kept cold.\" {name} ran to the fridge. Taped to the side was another clue, written in sparkly ink: \"Look where the books sleep.\"",
      "At the bookshelf, a tiny paper dragon was guarding the last clue. \"Who goes there?\" squeaked the dragon. \"It's {name}, the explorer!\" The dragon squinted. \"Answer my riddle: what has pages but isn't a tree?\" {name} grinned. \"A book!\" The dragon bowed and handed over the final clue.",
      "The clue said: \"The treasure is the one who found the map.\" {name} was puzzled, until they looked in the hall mirror and saw a brave explorer smiling back. Then a family member came by with a hug and a cookie, which was also treasure. {name} folded the map and kept it for the next adventure.",
    ],
    question: "If you found a treasure map, what would you hope the treasure is?",
  },
  {
    mode: "phone",
    category: "story",
    kind: "story",
    skill: "brave",
    title: "The Dragon Who Lost Its Roar",
    steps: [
      "Read the story together, with {name} doing all the roars.",
      "Pause on page three and guess how the dragon gets its roar back.",
      "At the end, practice your biggest roar together.",
    ],
    story: [
      "In a valley full of crunchy leaves lived a dragon named Pip. Pip was big and green and had a very important job: roaring at sunrise to wake up the valley. But one morning Pip opened its mouth and out came only a tiny squeak. \"Oh no,\" squeaked Pip. \"I've lost my roar!\" Just then, {name} came walking by.",
      "\"Don't worry, Pip,\" said {name}. \"We'll find it.\" They looked under rocks, behind trees and inside a very surprised rabbit's hole. No roar anywhere. Pip sat down sadly. \"Maybe I'm just not a roaring kind of dragon anymore.\" {name} sat right next to Pip and thought very hard.",
      "\"When I feel small,\" said {name}, \"I stand up tall, take a big breath, and remember something I'm proud of.\" Pip stood up tall. Pip took a breath so big that its belly looked like a balloon. Then Pip remembered the time it had helped a lost duckling find its mom.",
      "\"ROOOOAR!\" The roar was so big it shook the leaves off the trees and made the sun pop up. The whole valley woke up cheering. \"You found it!\" laughed {name}. \"No,\" said Pip, smiling a toothy smile. \"You helped me find it.\" From then on, Pip and {name} roared at sunrise together.",
    ],
    question: "What's something that makes you feel proud and brave?",
  },
  {
    mode: "real",
    category: "story",
    kind: "adventure",
    skill: "brave",
    title: "Act Out a Three-Scene Story",
    steps: [
      "Let {name} pick a hero, a place and a problem.",
      "Act out scene one: the hero meets the problem.",
      "Act out scene two: everything goes wrong in a silly way.",
      "Act out scene three: the hero saves the day. Take a bow!",
    ],
    question: "Who was the hero of your story, and what was their superpower?",
    challenge: "I acted out a story. I played the hero and the dragon. I lost. Can you do better?",
  },
  {
    mode: "real",
    category: "story",
    kind: "skill",
    skill: "reader",
    title: "Story Stones",
    steps: [
      "Find five small things around the house: a spoon, a sock, a toy, anything.",
      "Put them in a bag and take turns pulling one out.",
      "Each new object has to show up in the story you're telling together.",
      "End the story when the bag is empty.",
    ],
    question: "Which object made the silliest part of the story?",
  },
  {
    mode: "phone",
    category: "outside",
    kind: "sound",
    skill: "curious",
    title: "Sound Safari",
    steps: [
      "Step outside or open a window and stand very still together.",
      "Record ten seconds of sound with the phone.",
      "Play it back and list every sound you can hear.",
      "Guess which sound was farthest away.",
    ],
    question: "What was the most surprising sound you heard?",
  },
  {
    mode: "real",
    category: "outside",
    kind: "adventure",
    skill: "curious",
    title: "Rainbow Color Hunt",
    steps: [
      "Go outside together, to the yard, sidewalk or park.",
      "Find something red, orange, yellow, green, blue and purple.",
      "{name} gets to point, you have to guess what they spotted.",
      "Pick a favorite find to take a photo of.",
    ],
    question: "Which color was the hardest to find?",
  },
  {
    mode: "real",
    category: "outside",
    kind: "adventure",
    skill: "brave",
    title: "Backyard Obstacle Course",
    steps: [
      "Use sticks, rocks, chalk or toys to make a little course.",
      "Add a jump, a balance line and a spin.",
      "{name} runs it first while you time with your counting voice.",
      "Swap and let {name} cheer you on.",
    ],
    question: "What would you add to make the course even harder?",
    challenge: "I tried my own obstacle course. The stick won. Can you do better?",
  },
  {
    mode: "real",
    category: "outside",
    kind: "skill",
    skill: "kind",
    title: "Kindness Chalk Notes",
    steps: [
      "Grab sidewalk chalk and go to your driveway or sidewalk.",
      "Write or draw three happy messages for people walking by.",
      "Add a sun, a heart or a smiley to each one.",
      "Guess who will see them first.",
    ],
    question: "Who do you hope reads your chalk notes?",
  },
  {
    mode: "phone",
    category: "kitchen",
    kind: "quiz",
    skill: "curious",
    title: "Guess the Ingredient",
    steps: [
      "Pick three safe kitchen things: a lemon, a cracker, a cinnamon stick.",
      "{name} closes their eyes while you hold one under their nose.",
      "Ask the quiz question out loud and let {name} guess.",
      "Swap roles for the last round.",
    ],
    question: "Which smell was the easiest to guess, and which tricked you?",
  },
  {
    mode: "real",
    category: "kitchen",
    kind: "skill",
    skill: "money",
    title: "Pretend Snack Shop",
    steps: [
      "Set out three snacks and give each a price from 1 to 5 coins.",
      "{name} is the shopkeeper; you are the hungry customer.",
      "Pay with real or paper coins and let {name} count the change.",
      "Swap roles, then share the snacks.",
    ],
    question: "If you had 10 coins, what would you buy at your shop?",
    challenge: "I opened a snack shop. I ate all the snacks. Can you do better?",
  },
  {
    mode: "real",
    category: "kitchen",
    kind: "skill",
    skill: "helper",
    title: "Funny Fruit Faces",
    steps: [
      "Wash some fruit together and put it on two plates.",
      "With your help on any cutting, each make a face out of fruit.",
      "Give your fruit faces names and silly voices.",
      "Take a photo, then eat them!",
    ],
    question: "What did your fruit face look like?",
    challenge: "I made a fruit face. It looks grumpy. Can you do better?",
  },
  {
    mode: "real",
    category: "kitchen",
    kind: "skill",
    skill: "helper",
    title: "Fancy Restaurant Table",
    steps: [
      "{name} is the head waiter tonight.",
      "Set the table with plates, cups and napkins together.",
      "Fold napkins into triangles and add one tiny decoration.",
      "Welcome the family to the table in your fanciest voice.",
    ],
    question: "What would your restaurant be called?",
  },
  {
    mode: "phone",
    category: "art",
    kind: "draw",
    skill: "curious",
    title: "Monster Swap",
    steps: [
      "Each grab paper and draw the head of a monster, then fold it over.",
      "Swap papers and draw the body without peeking.",
      "Swap again and draw the legs.",
      "Unfold and give your monster a name. Snap a photo!",
    ],
    question: "What's your monster's name and what does it eat?",
  },
  {
    mode: "real",
    category: "art",
    kind: "draw",
    skill: "brave",
    title: "Paper Plate Masks",
    steps: [
      "Grab two paper plates, crayons and some string or tape.",
      "Each design a mask of an animal or a hero.",
      "Help cut eye holes and attach the string.",
      "Put them on and talk in character for one minute.",
    ],
    question: "Who did your mask turn you into?",
    challenge: "I made a lion mask. Everyone thought I was a muffin. Can you do better?",
  },
  {
    mode: "real",
    category: "art",
    kind: "draw",
    skill: "curious",
    title: "Sponge Stamp Art",
    steps: [
      "Cut a kitchen sponge into a few simple shapes.",
      "Dip the shapes in paint or wet them with marker color.",
      "Stamp a picture together: a garden, a city or a monster.",
      "Add faces with a marker once it dries.",
    ],
    question: "What did your stamps turn into?",
  },
  {
    mode: "phone",
    category: "music",
    kind: "sound",
    skill: "curious",
    title: "Animal Orchestra",
    steps: [
      "Take turns making an animal sound while the other closes their eyes.",
      "Record the funniest one on the phone.",
      "Guess the animal, then try to do two animals at once.",
      "Finish with a whole animal orchestra song together.",
    ],
    question: "Which animal sound was the hardest to make?",
  },
  {
    mode: "phone",
    category: "music",
    kind: "quiz",
    skill: "brave",
    title: "Name That Hum",
    steps: [
      "Think of songs you both know.",
      "Take turns humming a song while the other guesses.",
      "No words allowed, only hums!",
      "Record the trickiest one for the memory book.",
    ],
    question: "What song was the hardest to guess from a hum?",
  },
  {
    mode: "real",
    category: "music",
    kind: "skill",
    skill: "brave",
    title: "Pots and Pans Band",
    steps: [
      "Gather pots, pans, wooden spoons and a box of rice.",
      "Each pick an instrument and play a slow beat, then a fast one.",
      "{name} is the conductor and decides loud or quiet.",
      "Play a grand finale song together.",
    ],
    question: "What would your band be called?",
    challenge: "I started a band. The pan and I had creative differences. Can you do better?",
  },
  {
    mode: "real",
    category: "music",
    kind: "adventure",
    skill: "brave",
    title: "Freeze Dance",
    steps: [
      "Hum or sing a song together and dance like wild.",
      "When the singing stops, freeze like a statue.",
      "Take turns being the singer.",
      "Try a funny freeze pose: a flamingo, a robot, a melting ice cream.",
    ],
    question: "What was your silliest freeze pose?",
    challenge: "I played freeze dance. I froze. Then I forgot how to unfreeze. Can you do better?",
  },
  {
    mode: "phone",
    category: "skills",
    kind: "quiz",
    skill: "money",
    title: "Coin Detective",
    steps: [
      "Grab a handful of coins and look at them together.",
      "Ask the quiz: which coin is worth the most? Which is the biggest?",
      "Make a pretend price for a toy and count out the coins.",
      "Put one coin in a piggy bank or jar for later.",
    ],
    question: "If you saved one coin every day, what would you save up for?",
  },
  {
    mode: "phone",
    category: "skills",
    kind: "quiz",
    skill: "kind",
    title: "Feelings Faces Quiz",
    steps: [
      "Take turns making a feelings face: happy, sad, surprised, grumpy.",
      "The other person guesses the feeling.",
      "For each one, say something that would help someone feel better.",
      "Snap a selfie of your best surprised faces.",
    ],
    question: "What helps you feel better when you are sad?",
  },
  {
    mode: "real",
    category: "skills",
    kind: "skill",
    skill: "helper",
    title: "Sock Matching Race",
    steps: [
      "Dump a pile of clean socks on the floor.",
      "Race to find as many matching pairs as you can.",
      "Fold each pair into a sock ball.",
      "Count the pairs, then shoot the leftover socks into the basket.",
    ],
    question: "Where do you think the missing socks go?",
  },
  {
    mode: "real",
    category: "skills",
    kind: "skill",
    skill: "money",
    title: "Save, Spend, Share Jars",
    steps: [
      "Find three cups or jars and label them Save, Spend and Share.",
      "Give {name} some coins or buttons to sort.",
      "Talk about what each jar could be used for.",
      "Decide together who the Share jar could help.",
    ],
    question: "Who would you like to share with, and why?",
  },
  {
    mode: "real",
    category: "skills",
    kind: "skill",
    skill: "brave",
    title: "Knot Master",
    steps: [
      "Grab a shoelace or a piece of string.",
      "Show {name} how to make a simple loop knot, slowly.",
      "Let {name} try three times, cheering every attempt.",
      "Finish by tying a bow on a stuffed animal.",
    ],
    question: "What was the trickiest part of tying the knot?",
  },
  {
    mode: "phone",
    category: "calm",
    kind: "story",
    skill: "kind",
    title: "The Balloon Breath",
    steps: [
      "Sit comfortably together, maybe on the floor with a blanket.",
      "Read the story slowly, breathing along with the balloon.",
      "At the end, take three balloon breaths together.",
    ],
    story: [
      "{name} had a magic balloon that grew whenever {name} breathed in slowly. One afternoon, the balloon floated off the shelf and said, \"Let's go for a calm ride!\" {name} held the string. \"Breathe in,\" said the balloon, and as {name} filled up with air, the balloon grew bigger and lifted them gently off the ground.",
      "They floated over the rooftops. \"Breathe out,\" said the balloon, and they drifted softly sideways, over a park where ducks were napping. {name} breathed in slowly and up they went. Out slowly, and down they bobbed. It felt like riding a slow, quiet wave in the sky.",
      "Below them a little cloud looked grumpy. \"What's wrong?\" asked {name}. \"Everything's too loud and fast,\" said the cloud. So {name} showed the cloud how to breathe in like smelling cookies and out like blowing a dandelion. The grumpy cloud got fluffy and pink and started to smile.",
      "When the sun began to set, the balloon carried {name} home and settled on the shelf. \"You were a great pilot,\" it whispered. {name} sat on the floor feeling calm and light. Whenever things felt too loud or fast, {name} knew the secret: one slow breath in, one slow breath out.",
    ],
    question: "When could you use a balloon breath?",
  },
  {
    mode: "phone",
    category: "calm",
    kind: "sound",
    skill: "curious",
    title: "Quietest Sound Contest",
    steps: [
      "Sit together and close your eyes.",
      "Take turns making the quietest sound you can: a whisper, a page turn, a finger tap.",
      "Record each one on the phone and play them back.",
      "Vote for the quietest sound of the day.",
    ],
    question: "What's the quietest sound you know?",
  },
  {
    mode: "real",
    category: "calm",
    kind: "adventure",
    skill: "curious",
    title: "Cloud Watching",
    steps: [
      "Lie down outside or by a window where you can see the sky.",
      "Take turns finding shapes in the clouds.",
      "Make up a tiny story about the best cloud.",
      "Take three slow breaths while the clouds drift by.",
    ],
    question: "What was the funniest shape you saw in the clouds?",
  },
  {
    mode: "real",
    category: "calm",
    kind: "skill",
    skill: "kind",
    title: "Gratitude Pebbles",
    steps: [
      "Find a few small pebbles, buttons or blocks.",
      "For each one, say one thing you're thankful for.",
      "Stack them into a little gratitude tower.",
      "Keep the tower somewhere you'll see it tomorrow.",
    ],
    question: "What's one thing you're thankful for today?",
  },
  {
    mode: "phone",
    category: "surprise",
    kind: "quiz",
    skill: "brave",
    title: "Silly Would You Rather",
    steps: [
      "Take turns asking silly would-you-rather questions.",
      "Example: would you rather have spaghetti hair or jelly shoes?",
      "Explain every answer with a reason, the sillier the better.",
      "Record the funniest answer for the memory book.",
    ],
    question: "Would you rather fly like a bird or swim like a fish? Why?",
  },
  {
    mode: "real",
    category: "surprise",
    kind: "adventure",
    skill: "curious",
    title: "Living Room Treasure Hunt",
    steps: [
      "While {name} covers their eyes, hide a small toy somewhere safe.",
      "Give hot and cold clues as {name} searches.",
      "Swap and let {name} hide it for you.",
      "Celebrate each find with a treasure dance.",
    ],
    question: "What's the best hiding spot in your home?",
    challenge: "I hid a treasure. I forgot where. It's been three days. Can you do better?",
  },
  {
    mode: "real",
    category: "surprise",
    kind: "skill",
    skill: "helper",
    title: "Secret Helper Mission",
    steps: [
      "Whisper a secret mission: help someone without them noticing.",
      "Ideas: tidy shoes, fold a towel, leave a drawing on a pillow.",
      "Sneak around like spies and complete the mission.",
      "Later, ask if they noticed the secret helper!",
    ],
    question: "What secret helping did you do, and did anyone notice?",
  },
];

export const LEGGY_REACTIONS = [
  "WAY better than mine! Can I live in it?",
  "Okay, wow. Mine looked like a soggy pancake. Yours is a masterpiece!",
  "I'm showing this to all my friends. Well, my one friend. It's a rock.",
  "This is so good I dropped my snack. Again.",
  "Legendary! I'm framing this next to my participation trophy.",
  "You did THAT? I can't even tie my own legs!",
  "Ten out of ten. Eleven if I'm being honest.",
  "My attempt is crying in the corner. Yours is perfect!",
  "Can you teach me? I'll bring snacks. I'll probably drop them.",
  "Incredible! I tried this once and ended up stuck in a box.",
  "I'm so impressed my legs are doing a happy wiggle!",
  "That's the best thing I've seen since… ever. Ever ever.",
  "Hold on, I need to sit down. That was AMAZING.",
  "Officially better than mine. Mine fell over just from looking at it.",
  "You're a legend! I'm a Leggy. We make a great team!",
];

export const FIRST_CHALLENGE =
  "I tried this one first. My legs got tangled and I fell over. Can you do better?";

const KINDS_BY_MODE: Record<Mode, Partial<Record<Category, Kind[]>> & { default: Kind[] }> = {
  phone: {
    bedtime: ["story"],
    story: ["story"],
    art: ["draw"],
    music: ["sound", "quiz"],
    calm: ["story", "sound"],
    default: ["story", "draw", "quiz", "sound"],
  },
  real: {
    bedtime: ["adventure", "skill"],
    build: ["skill", "adventure"],
    outside: ["adventure", "skill"],
    kitchen: ["skill"],
    art: ["draw"],
    skills: ["skill"],
    default: ["adventure", "skill", "draw"],
  },
};

const SKILLS_BY_CATEGORY: Record<Category, Skill[]> = {
  bedtime: ["reader", "kind"],
  build: ["curious", "brave", "helper"],
  story: ["reader", "brave", "kind"],
  outside: ["brave", "curious", "kind"],
  kitchen: ["helper", "money", "curious"],
  art: ["curious", "brave", "kind"],
  music: ["brave", "curious"],
  skills: ["money", "helper", "reader", "kind"],
  calm: ["kind", "reader", "curious"],
  surprise: SKILLS,
};

const MAKE_CATEGORIES: Category[] = ["build", "art", "kitchen"];

function leastRecent<T>(options: T[], used: T[]): T {
  const ranked = options
    .map((option) => {
      const index = used.indexOf(option);
      return { option, score: (index === -1 ? 1000 : index) + Math.random() };
    })
    .sort((a, b) => b.score - a.score);
  return ranked[0].option;
}

export function chooseKindAndSkill(mode: Mode, category: Category, recent: RecentLegend[]) {
  const kinds = KINDS_BY_MODE[mode][category] ?? KINDS_BY_MODE[mode].default;
  return {
    kind: leastRecent(kinds, recent.map((legend) => legend.kind)),
    skill: leastRecent(SKILLS_BY_CATEGORY[category], recent.map((legend) => legend.skill)),
  };
}

export function rollChallenge(category: Category, challengeYesterday: boolean): boolean {
  if (challengeYesterday) {
    return false;
  }
  const chance = MAKE_CATEGORIES.includes(category) ? 0.6 : category === "surprise" ? 0.35 : 0.15;
  return Math.random() < chance;
}

export function pickFromLibrary(args: {
  mode: Mode;
  category: Category;
  name: string;
  recent: RecentLegend[];
  allowChallenge: boolean;
}): LegendDraft {
  const { mode, category, name, recent, allowChallenge } = args;
  const candidates = LIBRARY.filter(
    (legend) => legend.mode === mode && (category === "surprise" || legend.category === category),
  );
  const recentTitles = new Set(recent.map((legend) => legend.title));
  const recentSkills = recent.slice(0, 3).map((legend) => legend.skill);
  const picked = candidates
    .map((legend) => ({
      legend,
      score:
        (recentTitles.has(legend.title.replaceAll("{name}", name)) ? 100 : 0) +
        (recent[0]?.kind === legend.kind ? 5 : 0) +
        (recentSkills.includes(legend.skill) ? 3 : 0) +
        (allowChallenge && legend.challenge ? -2 : 0) +
        Math.random(),
    }))
    .sort((a, b) => a.score - b.score)[0].legend;
  const fill = (text: string) => text.replaceAll("{name}", name);
  return {
    kind: picked.kind,
    skill: picked.skill,
    title: fill(picked.title),
    steps: picked.steps.map(fill),
    story: picked.story?.map(fill),
    question: fill(picked.question),
    challenge: allowChallenge && picked.challenge ? fill(picked.challenge) : undefined,
  };
}
