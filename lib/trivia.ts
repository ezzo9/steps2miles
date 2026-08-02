// A fixed pool of researched, verifiable facts about walking, distance, and
// the mile itself, selected deterministically per page (same pattern as
// content-fragments.ts), not generated. Two facts per page, picked with two
// coprime-multiplier indices so adjacent step counts don't repeat the same
// pairing, same trick used for the paragraph fragments.
//
// Sources, roughly in order below: Britannica/Missed History (mile
// etymology), Wikipedia (Roman roads), a 2007 human-vs-chimpanzee
// locomotion energy-cost study, general gait-cycle biomechanics literature,
// gait-and-aging research, Guinness World Records / NBC News (elephant
// seals), Smithsonian/wildlife sources (caribou), Guinness World Records
// (Jean Béliveau, Steven Newman, 24-hour walk record), American Pilgrims on
// the Camino (Camino de Santiago), NASA (ISS exercise and bone density),
// Darwin biographies (the Sandwalk), Nietzsche's published writing, Dickens
// biographies, World Athletics race-walking rules, general fitness-tracker
// accuracy reporting, Vitruvius' account of the Roman odometer, gait-reflex
// research (obstacle response latency), Althoff et al. 2017 (Nature) global
// step-count study, and reporting on shinrin-yoku (forest bathing).

export type TriviaFact = {
  text: string;
};

export const TRIVIA_FACTS: TriviaFact[] = [
  {
    text: "The word \"mile\" comes from the Latin mille passus, a thousand paces. A Roman pace wasn't one footstep though, it was a full left-right stride cycle, so a Roman mile actually worked out to around 2,000 individual steps, the same ballpark this calculator uses today.",
  },
  {
    text: "At its peak, the Roman road network stretched over 250,000 miles, with stone milestones planted every thousand paces so army commanders could calculate march times. It's one of the earliest large-scale uses of a standardized steps-to-distance conversion.",
  },
  {
    text: "Walking upright costs humans roughly a quarter of the energy that walking on all fours would, according to a study comparing human and chimpanzee locomotion. That efficiency is a big part of why our ancestors could travel further between food sources as forests thinned into open grassland.",
  },
  {
    text: "About 60% of your walking cycle is spent with a foot planted on the ground (stance) and the other 40% swinging through the air (swing). Speed up or slow down, and that ratio barely shifts, it's one of the more consistent things about human gait.",
  },
  {
    text: "Stride length naturally shortens with age, along with more time spent with both feet on the ground at once. Researchers sometimes use gait speed alone as a simple, low-cost marker of overall health in older adults.",
  },
  {
    text: "Northern elephant seals migrate up to 12,000 to 21,000 miles a year at sea, the longest migration of any mammal. Set against that, even a full marathon's 26.2 miles barely registers.",
  },
  {
    text: "Caribou make the longest annual land migration of any animal, with some herds covering close to 1,500 miles a year, almost entirely on foot.",
  },
  {
    text: "Canadian Jean Béliveau holds the record for the longest continuous walk ever documented: roughly 46,600 miles across 64 countries over 11 years, starting in 2000. That's close to circling the Earth's equator twice.",
  },
  {
    text: "George Meegan's 1977-1983 trek from the southern tip of South America to Alaska covered roughly 19,000 miles on foot the entire way, still recognized as the longest unbroken walking journey ever recorded.",
  },
  {
    text: "The record for farthest distance walked in 24 hours, set by Jesse Castenda in 1976, is about 142 miles, somewhere north of 280,000 steps in a single day without stopping.",
  },
  {
    text: "The most popular route of the Camino de Santiago, a pilgrimage walked for over a thousand years, is nearly 500 miles and usually takes about a month on foot, a tradition that predates GPS, cushioned sneakers, and the modern mile itself.",
  },
  {
    text: "Astronauts on the International Space Station exercise roughly two hours a day, six days a week, including treadmill sessions where they're strapped in with a harness, since without gravity there's nothing pulling their feet back down after each step.",
  },
  {
    text: "Even with all that scheduled treadmill time, astronauts still lose bone density in space. The impact forces from walking in microgravity are measurably lower than walking on Earth, which seems to be part of why exercise alone doesn't fully offset the loss.",
  },
  {
    text: "Charles Darwin walked a fixed loop near his home every day, he called it his \"Sandwalk\" and used it to think through his ideas, including parts of what became On the Origin of Species.",
  },
  {
    text: "Nietzsche was blunt about it: \"all truly great thoughts are conceived while walking.\" He, Kierkegaard, and Rousseau all wrote about walking as close to essential for their thinking, not just exercise.",
  },
  {
    text: "Charles Dickens was a famously restless walker, he'd sometimes cover 20 miles or more through London at night when he couldn't sleep, using the walks to work out plot details for his novels.",
  },
  {
    text: "Olympic race walkers can cover a mile in under 6 minutes, but they have to keep at least one foot on the ground at all times or risk disqualification, a rule that's surprisingly hard for judges to call correctly at that speed.",
  },
  {
    text: "Step counters can undercount you if you're pushing a stroller or shopping cart, a lot of them lean on arm-swing motion, not just leg movement, to detect a step. Wrist placement versus pocket placement can shift the count too.",
  },
  {
    text: "One of the earliest known odometers, described by the Roman architect Vitruvius, was a gear-driven device mounted on a chariot wheel that dropped a pebble into a box every time it completed one mile, a mechanical ancestor of the step counter on your phone.",
  },
  {
    text: "If you suddenly need to step over or around something in your path, your legs can adjust mid-stride in about 120 milliseconds, faster than you can consciously register you've seen the obstacle. That's your nervous system's fast, subconscious pathways doing the work.",
  },
  {
    text: "A large 2017 smartphone study across 46 countries (published in Nature) found average daily step counts varying enormously by country, roughly 4,000 to nearly 6,900. The researchers found that inequality in step counts within a country predicted obesity rates better than the average did.",
  },
  {
    text: "In Japan, shinrin-yoku, or \"forest bathing,\" is a recognized practice of slow, deliberate walking through forests, studied for links to lower cortisol and blood pressure. It's not about covering distance, just paying attention while you walk it.",
  },
];

const TRIVIA_MULTIPLIER = 7; // coprime with TRIVIA_FACTS.length (22), full-cycle index spread

export function selectTrivia(steps: number): [TriviaFact, TriviaFact] {
  const count = TRIVIA_FACTS.length;
  const firstIndex = steps % count;
  let secondIndex = (steps * TRIVIA_MULTIPLIER) % count;
  if (secondIndex === firstIndex) {
    secondIndex = (secondIndex + 1) % count;
  }
  return [TRIVIA_FACTS[firstIndex], TRIVIA_FACTS[secondIndex]];
}
