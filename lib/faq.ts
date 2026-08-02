export type FaqItem = {
  question: string;
  answer: string;
};

export const faqItems: FaqItem[] = [
  {
    question: "How many steps are in a mile?",
    answer:
      "About 2,000 for the average adult. That number comes from a typical stride length of roughly 2.5 feet. If your stride is longer or shorter than that, the real number for you will be a bit different.",
  },
  {
    question: "Is 10,000 steps a day good?",
    answer:
      "It's a solid target for most people, and it works out to about 5 miles using the standard conversion. But the 10,000 figure wasn't picked by a health study, it came from a 1960s pedometer marketing campaign in Japan. Any amount of regular walking helps, and going from 4,000 steps a day to 7,000 matters more than chasing a round number.",
  },
  {
    question: "Does stride length matter?",
    answer:
      "Yes. Someone who's 6'2\" covers more ground per step than someone who's 5'2\", so they need fewer steps to walk a mile. If you want a precise number, measure your stride (walk 10 steps, measure the distance, divide by 10) and enter that into the calculator instead of the 2,000 default.",
  },
  {
    question: "How accurate is this calculator?",
    answer:
      "The math itself is exact, dividing your steps by your steps-per-mile gives you a precise answer. Where it gets approximate is the default of 2,000 steps per mile, since that's an average and not your specific stride. Enter your own number if you know it, and the result will be as accurate as that input.",
  },
  {
    question: "How many miles is 6,000, 8,000, or 15,000 steps?",
    answer:
      "At the standard 2,000 steps per mile, 6,000 steps is 3 miles, 8,000 steps is 4 miles, and 15,000 steps is 7.5 miles. Type any of these numbers into the calculator above if you want a figure adjusted for your own stride.",
  },
];
