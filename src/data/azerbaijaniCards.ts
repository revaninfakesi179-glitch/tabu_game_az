import { TabuCard } from '../types/game';
import { KITCHEN_CARDS } from './cards/kitchen';
import { SPORTS_CARDS } from './cards/sports';
import { CINEMA_ART_CARDS } from './cards/cinemaArt';
import { TECH_SCIENCE_CARDS } from './cards/techScience';
import { GEOGRAPHY_CARDS } from './cards/geography';
import { SCHOOL_EDUCATION_CARDS } from './cards/schoolEducation';
import { BAKU_AZERBAIJAN_CARDS } from './cards/bakuAzerbaijan';
import { DAILY_LIFE_CARDS } from './cards/dailyLife';
import { MUSIC_CULTURE_CARDS } from './cards/musicCulture';
import { ANIMALS_NATURE_CARDS } from './cards/animalsNature';
import { PROFESSIONS_CARDS } from './cards/professions';
import { CHILDHOOD_CARDS } from './cards/childhood';
import { HISTORY_LEGENDS_CARDS } from './cards/historyLegends';

// Raw aggregated list of all curated cards
const ALL_RAW_CARDS: TabuCard[] = [
  ...KITCHEN_CARDS,
  ...SPORTS_CARDS,
  ...CINEMA_ART_CARDS,
  ...TECH_SCIENCE_CARDS,
  ...GEOGRAPHY_CARDS,
  ...SCHOOL_EDUCATION_CARDS,
  ...BAKU_AZERBAIJAN_CARDS,
  ...DAILY_LIFE_CARDS,
  ...MUSIC_CULTURE_CARDS,
  ...ANIMALS_NATURE_CARDS,
  ...PROFESSIONS_CARDS,
  ...CHILDHOOD_CARDS,
  ...HISTORY_LEGENDS_CARDS,
];

// Deduplicate by target word to ensure every single card is unique
const seenWords = new Set<string>();
export const AZERBAIJANI_TABOO_CARDS: TabuCard[] = [];

for (const card of ALL_RAW_CARDS) {
  const normalizedKey = card.word.toUpperCase().trim();
  if (!seenWords.has(normalizedKey)) {
    seenWords.add(normalizedKey);
    AZERBAIJANI_TABOO_CARDS.push(card);
  }
}

export const CATEGORY_LABELS: Record<TabuCard['category'], string> = {
  baki_azerbaijan: 'Bakı & Azərbaycan',
  umumi: 'Gündəlik Həyat',
  filmler_senet: 'Film & İncəsənət',
  elm_texnologiya: 'Texnologiya & Elm',
  idman: 'İdman & Əyləncə',
  ushaq: 'Uşaq & Nağıllar',
};

export {
  KITCHEN_CARDS,
  SPORTS_CARDS,
  CINEMA_ART_CARDS,
  TECH_SCIENCE_CARDS,
  GEOGRAPHY_CARDS,
  SCHOOL_EDUCATION_CARDS,
  BAKU_AZERBAIJAN_CARDS,
  DAILY_LIFE_CARDS,
  MUSIC_CULTURE_CARDS,
  ANIMALS_NATURE_CARDS,
  PROFESSIONS_CARDS,
  CHILDHOOD_CARDS,
  HISTORY_LEGENDS_CARDS,
};
