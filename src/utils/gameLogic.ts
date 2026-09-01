import { COUNTRIES_DATA } from '../data/flagsData';
import { CountryFlagData, FlagVariation, Question } from '../types';

/**
 * Fisher-Yates array shuffler
 */
export function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Generates a round of 10 unique questions with randomized flag choices and guaranteed no duplicates.
 */
export function generateGameQuestions(totalQuestions: number = 10): Question[] {
  // 1. Shuffle all available countries and pick 10 distinct countries
  const shuffledCountries = shuffleArray(COUNTRIES_DATA);
  const selectedCountries = shuffledCountries.slice(0, Math.min(totalQuestions, shuffledCountries.length));

  // 2. Build question for each country
  return selectedCountries.map((country: CountryFlagData, index: number) => {
    // Find the correct variation
    const correctVariation = country.variations.find((v) => v.isCorrect)!;

    // Get distractor variations
    const distractors = country.variations.filter((v) => !v.isCorrect);

    // Shuffle distractors and pick 3 unique ones
    const selectedDistractors = shuffleArray(distractors).slice(0, 3);

    // Combine 1 correct + 3 distractors
    const allOptions: FlagVariation[] = [correctVariation, ...selectedDistractors];

    // Ensure all 4 options have distinct color fingerprints
    const uniqueOptions: FlagVariation[] = [];
    const seenSignatures = new Set<string>();

    for (const opt of allOptions) {
      const sig = opt.colors.join('|');
      if (!seenSignatures.has(sig)) {
        seenSignatures.add(sig);
        uniqueOptions.push(opt);
      }
    }

    // If somehow duplicates existed in raw data, pull another distractor
    if (uniqueOptions.length < 4) {
      for (const d of distractors) {
        const sig = d.colors.join('|');
        if (!seenSignatures.has(sig)) {
          seenSignatures.add(sig);
          uniqueOptions.push(d);
          if (uniqueOptions.length === 4) break;
        }
      }
    }

    // Shuffle the 4 choices so the correct answer position is completely randomized
    const shuffledOptions = shuffleArray(uniqueOptions);

    return {
      questionNumber: index + 1,
      country,
      options: shuffledOptions,
      correctOptionId: correctVariation.id,
    };
  });
}
