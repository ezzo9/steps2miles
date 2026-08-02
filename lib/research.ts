export type LifeExpectancyRow = {
  stepsPerDay: string;
  additionalYears: string;
};

/**
 * Additional years of life expectancy at age 40, compared with fewer than
 * 4,000 steps a day. From a NHANES-based life table analysis.
 */
export const LIFE_EXPECTANCY_TABLE: LifeExpectancyRow[] = [
  { stepsPerDay: "4,000–5,999", additionalYears: "+5.4 years" },
  { stepsPerDay: "6,000–7,999", additionalYears: "+9.0 years" },
  { stepsPerDay: "8,000–9,999", additionalYears: "+11.9 years" },
  { stepsPerDay: "10,000–11,999", additionalYears: "+13.6 years" },
  { stepsPerDay: "12,000+", additionalYears: "+14.8 years" },
];
