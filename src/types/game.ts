export type DifficultyMode = 'asan' | 'asand' | 'orta' | 'cetin' | 'cox_cetin';

export interface TabuCard {
  id: string;
  word: string; // Hədəf söz
  tabooWords: string[]; // 5 Qadağan söz
  category: 'baki_azerbaijan' | 'umumi' | 'filmler_senet' | 'elm_texnologiya' | 'idman' | 'ushaq';
  difficulty?: DifficultyMode;
  topic?: string;
}

export interface Team {
  id: 'red' | 'blue';
  name: string;
  color: 'red' | 'blue';
  players: [string, string];
  activeSpeakerIndex: number;
  score: number;
}

export interface GameSettings {
  difficulty: DifficultyMode;
  roundDuration: number; // in seconds (e.g. 45, 60, 90, 120)
  targetScore: number; // e.g. 15, 25, 35, 50
  maxPasses: number; // e.g. 2, 3, 5
  soundEnabled: boolean;
  aiCustomTopicEnabled: boolean;
  selectedAiTopic: string;
  customTopicInput: string;
}

export interface PlayedCardRecord {
  card: TabuCard;
  result: 'correct' | 'taboo' | 'passed';
  timestamp: number;
}

export interface RoundSummary {
  teamId: string;
  teamName: string;
  roundNumber: number;
  correctCount: number;
  tabooCount: number;
  passedCount: number;
  scoreEarned: number;
  cards: PlayedCardRecord[];
}
