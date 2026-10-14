import { TabuCard } from '../types/game';
import { AZERBAIJANI_TABOO_CARDS } from '../data/azerbaijaniCards';

/**
 * Service to manage AI-generated cards and provide an infinite deck for any chosen or custom topic.
 */

// In-memory cache for fast instant retrieval across screens
const TOPIC_CARDS_CACHE = new Map<string, TabuCard[]>();

// Helper to sanitize topic
export function normalizeTopic(topic: string): string {
  return topic.trim().toLowerCase();
}

// Request new cards from Gemini backend
export async function fetchAiCardsFromBackend(
  topic: string,
  existingWords: string[] = [],
  count: number = 15
): Promise<TabuCard[]> {
  const norm = normalizeTopic(topic);
  if (!norm) return [];

  try {
    const response = await fetch('/api/generate-ai-cards', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        topic: norm,
        existingWords,
        count,
      }),
    });

    if (!response.ok) {
      console.warn('Backend AI card generation returned status:', response.status);
      return [];
    }

    const data = await response.json();
    if (Array.isArray(data.cards) && data.cards.length > 0) {
      // Store in memory cache
      const cached = TOPIC_CARDS_CACHE.get(norm) || [];
      const cachedSet = new Set(cached.map((c) => c.word.toUpperCase().trim()));
      const newNonDupes = (data.cards as TabuCard[]).filter(
        (c) => !cachedSet.has(c.word.toUpperCase().trim())
      );
      TOPIC_CARDS_CACHE.set(norm, [...cached, ...newNonDupes]);

      return data.cards;
    }
  } catch (err) {
    console.warn('Network error fetching AI cards from backend:', err);
  }
  return [];
}

/**
 * Preloads cards as soon as user types or picks a topic in settings screen
 */
export async function preloadAiTopicCards(topic: string): Promise<TabuCard[]> {
  const norm = normalizeTopic(topic);
  if (!norm) return [];

  const existing = TOPIC_CARDS_CACHE.get(norm) || [];
  if (existing.length >= 10) {
    return existing;
  }

  const existingWords = existing.map((c) => c.word);
  const fetched = await fetchAiCardsFromBackend(norm, existingWords, 15);
  return fetched;
}

// Curated seed dictionary for popular themes & custom searches like Galatasaray, Fenerbahçe, etc.
const RICH_THEMATIC_SEEDS: Record<string, TabuCard[]> = {
  galatasaray: [
    { id: 'gs-1', word: 'GALATASARAY', tabooWords: ['Sarı-qırmızı', 'Aslan', 'İstanbul', 'Cimbom', 'Çempion'], category: 'idman', topic: 'galatasaray' },
    { id: 'gs-2', word: 'ALİ SAMİ YEN', tabooWords: ['Qurucu', 'Stadion', 'Rams Park', 'Meydança', 'Klub'], category: 'idman', topic: 'galatasaray' },
    { id: 'gs-3', word: 'FATİH TERİM', tabooWords: ['İmperator', 'Məşqçi', 'Türkiyə', 'Uğur', 'Taktika'], category: 'idman', topic: 'galatasaray' },
    { id: 'gs-4', word: 'UEFA KUBOKU', tabooWords: ['2000', 'Arsenal', 'Final', 'Avropa', 'Penalti'], category: 'idman', topic: 'galatasaray' },
    { id: 'gs-5', word: 'İCARDİ', tabooWords: ['Hücumçu', 'Qol', 'Aşkın olayım', 'Argentina', 'Wanda'], category: 'idman', topic: 'galatasaray' },
    { id: 'gs-6', word: 'MUSLERA', tabooWords: ['Qapıçı', 'Uruqvay', 'Kapitan', 'Seyv', 'Əlcək'], category: 'idman', topic: 'galatasaray' },
    { id: 'gs-7', word: 'CİMBOM', tabooWords: ['Ləqəb', 'Şüar', 'Azarkeş', 'Sarı-qırmızı', 'Futbol'], category: 'idman', topic: 'galatasaray' },
    { id: 'gs-8', word: 'METİN OKTAY', tabooWords: ['Taclı kral', 'Əfsanə', 'Qol vuran', 'Torları cıran', '10 nömrə'], category: 'idman', topic: 'galatasaray' },
    { id: 'gs-9', word: 'RAMS PARK', tabooWords: ['Stadion', 'Seyrantepe', 'Azarkeş', 'Cəhənnəm', 'Matç'], category: 'idman', topic: 'galatasaray' },
    { id: 'gs-10', word: 'SUPER LİQ', tabooWords: ['Türkiyə', 'Çempionat', 'Dördulduz', 'Derbi', 'Kubok'], category: 'idman', topic: 'galatasaray' },
    { id: 'gs-11', word: 'SNEİJDER', tabooWords: ['Hollandiya', 'Uzaqdan zərbə', 'Fənərbaxçaya qol', '10 nömrə', 'Ulduz'], category: 'idman', topic: 'galatasaray' },
    { id: 'gs-12', word: 'DROGBA', tabooWords: ['Kot Divuar', 'Çelsi', 'Hücumçu', 'Qol', 'Əfsanə'], category: 'idman', topic: 'galatasaray' },
    { id: 'gs-13', word: 'HAGİ', tabooWords: ['Rumıniya', 'Karpat Maradonası', 'Cərimə zərbəsi', 'Sol ayaq', 'Əfsanəvi'], category: 'idman', topic: 'galatasaray' },
  ],
  fenerbahce: [
    { id: 'fb-1', word: 'FENƏRBAXÇA', tabooWords: ['Sarı-lacivərd', 'Qanarya', 'Kadıköy', 'Şükrü Saracoğlu', 'Klub'], category: 'idman', topic: 'fenerbahce' },
    { id: 'fb-2', word: 'KADIKÖY', tabooWords: ['İstanbul', 'Anadolu sahili', 'Stadion', 'Azarkeş', 'Qala'], category: 'idman', topic: 'fenerbahce' },
    { id: 'fb-3', word: 'ALEX DE SOUZA', tabooWords: ['Braziliya', 'Heykəl', 'Kapitan', 'Qol', '10 nömrə'], category: 'idman', topic: 'fenerbahce' },
    { id: 'fb-4', word: 'SARI QANARYA', tabooWords: ['Ləqəb', 'Quş', 'Rəmz', 'Sarı-mavi', 'Şüar'], category: 'idman', topic: 'fenerbahce' },
    { id: 'fb-5', word: 'ŞÜKRÜ SARACOĞLU', tabooWords: ['Stadion', 'Ülkər Arena', 'Kadıköy', 'Tribuna', 'Meydança'], category: 'idman', topic: 'fenerbahce' },
    { id: 'fb-6', word: 'ƏZİZ YILDIRIM', tabooWords: ['Prezident', '20 il', 'Rəhbər', 'Baskeball', 'Qalmaqal'], category: 'idman', topic: 'fenerbahce' },
  ],
  fenerbahçe: [
    { id: 'fb-1b', word: 'FENƏRBAXÇA', tabooWords: ['Sarı-lacivərd', 'Qanarya', 'Kadıköy', 'Şükrü Saracoğlu', 'Klub'], category: 'idman', topic: 'fenerbahçe' },
    { id: 'fb-2b', word: 'KADIKÖY', tabooWords: ['İstanbul', 'Anadolu sahili', 'Stadion', 'Azarkeş', 'Qala'], category: 'idman', topic: 'fenerbahçe' },
    { id: 'fb-3b', word: 'ALEX DE SOUZA', tabooWords: ['Braziliya', 'Heykəl', 'Kapitan', 'Qol', '10 nömrə'], category: 'idman', topic: 'fenerbahçe' },
    { id: 'fb-4b', word: 'SARI QANARYA', tabooWords: ['Ləqəb', 'Quş', 'Rəmz', 'Sarı-mavi', 'Şüar'], category: 'idman', topic: 'fenerbahçe' },
  ],
  besiktas: [
    { id: 'bjk-1', word: 'BEŞİKTAŞ', tabooWords: ['Qara qartal', 'Ağ-qara', 'Vodafone Park', 'Çarşı', 'İnönü'], category: 'idman', topic: 'besiktas' },
    { id: 'bjk-2', word: 'QARA QARTAL', tabooWords: ['Ləqəb', 'Rəmz', 'Uçmaq', 'Pəncə', 'Beşiktaş'], category: 'idman', topic: 'besiktas' },
    { id: 'bjk-3', word: 'ÇARŞI', tabooWords: ['Azarkeş qrupu', 'Hər şeyə qarşı', 'Səs-küy', 'Tribuna', 'Şüar'], category: 'idman', topic: 'besiktas' },
    { id: 'bjk-4', word: 'SƏRGƏN YALÇIN', tabooWords: ['Məşqçi', 'Çempion', 'Sol ayaq', 'Ulduz', '10 nömrə'], category: 'idman', topic: 'besiktas' },
  ],
  beşiktaş: [
    { id: 'bjk-1b', word: 'BEŞİKTAŞ', tabooWords: ['Qara qartal', 'Ağ-qara', 'Vodafone Park', 'Çarşı', 'İnönü'], category: 'idman', topic: 'beşiktaş' },
    { id: 'bjk-2b', word: 'QARA QARTAL', tabooWords: ['Ləqəb', 'Rəmz', 'Uçmaq', 'Pəncə', 'Beşiktaş'], category: 'idman', topic: 'beşiktaş' },
    { id: 'bjk-3b', word: 'ÇARŞI', tabooWords: ['Azarkeş qrupu', 'Hər şeyə qarşı', 'Səs-küy', 'Tribuna', 'Şüar'], category: 'idman', topic: 'beşiktaş' },
  ],
  'real madrid': [
    { id: 'rm-1', word: 'REAL MADRİD', tabooWords: ['Kral klubu', 'Santyaqo Bernabeu', 'Ağlar', 'Çempionlar Liqası', 'İspaniya'], category: 'idman', topic: 'real madrid' },
    { id: 'rm-2', word: 'SANTIAGO BERNABEU', tabooWords: ['Stadion', 'Madrid', 'Meydança', 'Tribuna', 'Möhtəşəm'], category: 'idman', topic: 'real madrid' },
    { id: 'rm-3', word: 'EL CLASICO', tabooWords: ['Barselona', 'Derbi', 'Dünya matçı', 'Rəqabət', 'Qələbə'], category: 'idman', topic: 'real madrid' },
    { id: 'rm-4', word: 'KİNGS OF EUROPE', tabooWords: ['15 kubok', 'Çempionlar Liqası', 'Final', 'Uğur', 'Tarix'], category: 'idman', topic: 'real madrid' },
  ],
  barselona: [
    { id: 'bar-1', word: 'BARSELONA', tabooWords: ['Kataloniya', 'Kamp Nou', 'Məssi', 'Göy-qırmızı', 'Tiki-taka'], category: 'idman', topic: 'barselona' },
    { id: 'bar-2', word: 'KAMP NOU', tabooWords: ['Böyük stadion', 'Katalonlar', 'Tribuna', 'Barselona', 'Meydan'], category: 'idman', topic: 'barselona' },
    { id: 'bar-3', word: 'LİONEL MESSİ', tabooWords: ['10 nömrə', 'Argentina', 'Qızıl top', 'Əfsanə', 'Qol vuran'], category: 'idman', topic: 'barselona' },
    { id: 'bar-4', word: 'LA MASİA', tabooWords: ['Akademiya', 'Gənclər', 'Futbol məktəbi', 'İnyesta', 'Xavi'], category: 'idman', topic: 'barselona' },
  ],
  avtomobil: [
    { id: 'car-1', word: 'MÜHƏRRİK', tabooWords: ['Motor', 'At gücü', 'Porshen', 'Benzin', 'Kapot'], category: 'elm_texnologiya', topic: 'avtomobil' },
    { id: 'car-2', word: 'SÜRƏTLƏR QUTUSU', tabooWords: ['Karobka', 'Mexanika', 'Avtomat', 'Pillə', 'Rıçaq'], category: 'elm_texnologiya', topic: 'avtomobil' },
    { id: 'car-3', word: 'TƏKƏR', tabooWords: ['Diski', 'Şin', 'Fırlanmaq', 'Hava vurmaq', 'Qış və yay'], category: 'elm_texnologiya', topic: 'avtomobil' },
    { id: 'car-4', word: 'SÜKAN', tabooWords: ['Sürmək', 'Döngə', 'Əl', 'Fırlatmaq', 'Siqnal'], category: 'elm_texnologiya', topic: 'avtomobil' },
    { id: 'car-5', word: 'RADAR', tabooWords: ['Sürət', 'DYP', 'Kamera', 'Cərimə', 'Şəkil çəkmək'], category: 'elm_texnologiya', topic: 'avtomobil' },
    { id: 'car-6', word: 'BENZİN', tabooWords: ['Yanacaq', 'Doldurmaq', 'Zapravka', 'Litr', 'Aİ-92'], category: 'elm_texnologiya', topic: 'avtomobil' },
  ],
  mətbəx: [
    { id: 'th-f-1', word: 'ŞƏKƏRBURA', tabooWords: ['Novruz', 'Xəmir', 'Badam', 'Naxış', 'Maqqaş'], category: 'baki_azerbaijan', topic: 'mətbəx' },
    { id: 'th-f-2', word: 'PAXLAVA', tabooWords: ['Qoz', 'Şərbət', 'Romb', 'Şirniyyat', 'Süfrə'], category: 'baki_azerbaijan', topic: 'mətbəx' },
    { id: 'th-f-3', word: 'QUYMAQ', tabooWords: ['Un', 'Yağ', 'Doğuş', 'İsti', 'Darçın'], category: 'baki_azerbaijan', topic: 'mətbəx' },
    { id: 'th-f-4', word: 'SƏBƏT', tabooWords: ['Meyvə', 'Hədiyyə', 'Qamış', 'Dəstə', 'Toy'], category: 'umumi', topic: 'mətbəx' },
    { id: 'th-f-5', word: 'ÇAYNİK', tabooWords: ['Çay', 'Dəm', 'Qaynamaq', 'Burun', 'Qapaq'], category: 'umumi', topic: 'mətbəx' },
    { id: 'th-f-6', word: 'PİTİ', tabooWords: ['Şəki', 'Kuzə', 'Qoyun əti', 'Quyruq', 'Lavaş'], category: 'baki_azerbaijan', topic: 'mətbəx' },
  ],
  futbol: [
    { id: 'th-ft-1', word: 'DİVAR', tabooWords: ['Cərimə', 'Oyunçu', 'Qorumaq', 'Zərbə', 'Düzülüş'], category: 'idman', topic: 'futbol' },
    { id: 'th-ft-2', word: 'DÜDÜK', tabooWords: ['Hakim', 'Fit', 'Səs', 'Cərimə', 'Oyun'], category: 'idman', topic: 'futbol' },
    { id: 'th-ft-3', word: 'XET-TRİK', tabooWords: ['Üç qol', 'Futbolçu', 'Oyun', 'Bombardir', 'Matç'], category: 'idman', topic: 'futbol' },
    { id: 'th-ft-4', word: 'DİREK', tabooWords: ['Qapı', 'Dəmir', 'Zərbə', 'Tir', 'Qol'], category: 'idman', topic: 'futbol' },
    { id: 'th-ft-5', word: 'AUT', tabooWords: ['Xətt', 'Kənar', 'Əllə atmaq', 'Meydan', 'Oyun'], category: 'idman', topic: 'futbol' },
  ],
  məktəb: [
    { id: 'th-m-1', word: 'DƏRSLİK', tabooWords: ['Kitab', 'Səhifə', 'Mövzu', 'Oxumaq', 'Şagird'], category: 'umumi', topic: 'məktəb' },
    { id: 'th-m-2', word: 'ATTESTAT', tabooWords: ['Məzun', '11-ci sinif', 'Sənəd', 'Məktəb', 'Qiymət'], category: 'umumi', difficulty: 'asand', topic: 'məktəb' },
    { id: 'th-m-3', word: 'TƏNƏFFÜS', tabooWords: ['Fasilə', 'Zəng', 'Dəhliz', 'Oyun', 'Dərs'], category: 'umumi', topic: 'məktəb' },
  ],
  coğrafiya: [
    { id: 'th-c-1', word: 'XƏZƏR DƏNİZİ', tabooWords: ['Göl', 'Bakı', 'Neft', 'Sahil', 'Nərə'], category: 'baki_azerbaijan', topic: 'coğrafiya' },
    { id: 'th-c-2', word: 'QAFQAZ DAĞLARI', tabooWords: ['Zirvə', 'Bazar-düzü', 'Qar', 'Şimal', 'Yüksəklik'], category: 'baki_azerbaijan', topic: 'coğrafiya' },
  ],
  kino: [
    { id: 'th-k-1', word: 'OSKAR', tabooWords: ['Heykəlcik', 'Mükafat', 'Hollivud', 'Film', 'Aktyor'], category: 'filmler_senet', topic: 'kino' },
    { id: 'th-k-2', word: 'REJİSSOR', tabooWords: ['Kamera', 'Çəkmək', 'Film', 'Ssenari', 'Motor'], category: 'filmler_senet', topic: 'kino' },
  ],
};

/**
 * Intelligent client-side fallback generator for completely novel or unknown topics
 * Ensures players NEVER get stuck with dummy cards even if backend is slow.
 */
function generateContextualFallbackCards(topic: string): TabuCard[] {
  const clean = topic.trim();
  const upper = clean.toUpperCase();

  return [
    {
      id: `cst-1-${clean}`,
      word: upper,
      tabooWords: ['Mövzu', 'Ad', 'Tərif', 'Məşhur', 'Əlaqə'],
      category: 'umumi',
      topic: clean,
    },
    {
      id: `cst-2-${clean}`,
      word: `${upper} TARİXİ`,
      tabooWords: ['Yaranış', 'Keçmiş', 'Zaman', 'Qədim', 'Mərhələ'],
      category: 'umumi',
      topic: clean,
    },
    {
      id: `cst-3-${clean}`,
      word: `${upper} ÇEMPİONU`,
      tabooWords: ['Qalib', 'Kubok', 'Birinci yer', 'Lider', 'Uğur'],
      category: 'idman',
      topic: clean,
    },
    {
      id: `cst-4-${clean}`,
      word: `${upper} QAYDALARI`,
      tabooWords: ['Qanun', 'Rejim', 'Şərtlər', 'Pozmaq', 'Nizam'],
      category: 'umumi',
      topic: clean,
    },
    {
      id: `cst-5-${clean}`,
      word: `${upper} AZARKEŞİ`,
      tabooWords: ['Fanat', 'Dəstək', 'Sevgi', 'Alqış', 'Klub'],
      category: 'idman',
      topic: clean,
    },
    {
      id: `cst-6-${clean}`,
      word: `${upper} UĞURU`,
      tabooWords: ['Zəfər', 'Nəticə', 'Məqsəd', 'Qələbə', 'Sevinc'],
      category: 'umumi',
      topic: clean,
    },
  ];
}

/**
 * Get initial deck for an AI topic, combining cache, database, thematic seeds,
 * and contextual generators so the game can start immediately with high quality cards.
 */
export function getInitialTopicCards(topic: string): TabuCard[] {
  const norm = normalizeTopic(topic);
  const found: TabuCard[] = [];
  const seenWords = new Set<string>();

  const addIfNew = (card: TabuCard) => {
    const key = card.word.toUpperCase().trim();
    if (!seenWords.has(key)) {
      seenWords.add(key);
      found.push(card);
    }
  };

  // 1. Check in-memory prefetch cache first (populated by backend AI generation)
  const cached = TOPIC_CARDS_CACHE.get(norm);
  if (cached && cached.length > 0) {
    cached.forEach(addIfNew);
  }

  // 2. Thematic seed dictionary (Galatasaray, Fenerbahçe, Real Madrid, Mətbəx, etc.)
  if (RICH_THEMATIC_SEEDS[norm]) {
    RICH_THEMATIC_SEEDS[norm].forEach(addIfNew);
  }

  // Also check partial keys in seeds (e.g. "galata" matching "galatasaray")
  Object.keys(RICH_THEMATIC_SEEDS).forEach((key) => {
    if (norm.includes(key) || key.includes(norm)) {
      RICH_THEMATIC_SEEDS[key].forEach(addIfNew);
    }
  });

  // 3. Matches from the 1200+ cards main database
  AZERBAIJANI_TABOO_CARDS.forEach((c) => {
    if (c.topic && normalizeTopic(c.topic) === norm) {
      addIfNew(c);
    } else if (
      c.word.toLowerCase().includes(norm) ||
      (c.topic && normalizeTopic(c.topic).includes(norm))
    ) {
      addIfNew(c);
    }
  });

  // 4. If still under 6 cards, generate smart contextual cards
  if (found.length < 6) {
    const contextual = generateContextualFallbackCards(topic);
    contextual.forEach(addIfNew);
  }

  return found;
}
