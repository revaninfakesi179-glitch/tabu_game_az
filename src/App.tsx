import React, { useState, useEffect, useCallback } from 'react';
import { TabuCard, Team, GameSettings, PlayedCardRecord, DifficultyMode } from './types/game';
import { AZERBAIJANI_TABOO_CARDS } from './data/azerbaijaniCards';
import { getInitialTopicCards, fetchAiCardsFromBackend, preloadAiTopicCards } from './utils/aiDeckService';
import { sound } from './utils/soundEffects';
import { haptics } from './utils/haptics';
import { Header } from './components/Header';
import { SettingsTopBar } from './components/SettingsTopBar';
import { SettingsPopover } from './components/SettingsPopover';
import { HomeCurvedTitle } from './components/HomeCurvedTitle';
import { TabuAnimatedHero } from './components/TabuAnimatedHero';
import { SettingsScreen } from './components/SettingsScreen';
import { TeamsSetupScreen } from './components/TeamsSetupScreen';
import { ScoreBoard } from './components/ScoreBoard';
import { Timer } from './components/Timer';
import { GameCard } from './components/GameCard';
import { PauseOverlay } from './components/PauseOverlay';
import { RoundSummaryModal } from './components/RoundSummaryModal';
import { GameOverModal } from './components/GameOverModal';
import { RulesModal } from './components/RulesModal';
import { Play, HelpCircle, Loader2, Sparkles } from 'lucide-react';

type ScreenState = 'HOME' | 'SETTINGS' | 'TEAMS' | 'PLAYING';

const INITIAL_SETTINGS: GameSettings = {
  difficulty: 'orta',
  roundDuration: 60,
  targetScore: 25,
  maxPasses: 3,
  soundEnabled: true,
  aiCustomTopicEnabled: false,
  selectedAiTopic: 'Mətbəx',
  customTopicInput: '',
};

const INITIAL_TEAMS: [Team, Team] = [
  {
    id: 'red',
    name: '',
    color: 'red',
    players: ['', ''],
    activeSpeakerIndex: 0,
    score: 0,
  },
  {
    id: 'blue',
    name: '',
    color: 'blue',
    players: ['', ''],
    activeSpeakerIndex: 0,
    score: 0,
  },
];

export default function App() {
  // Navigation screen
  const [currentScreen, setCurrentScreen] = useState<ScreenState>('HOME');
  const [settings, setSettings] = useState<GameSettings>(INITIAL_SETTINGS);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [teams, setTeams] = useState<[Team, Team]>(INITIAL_TEAMS);
  const [activeTeamIndex, setActiveTeamIndex] = useState<0 | 1>(0);
  const [currentRound, setCurrentRound] = useState(1);

  // Cards & game engine
  const [allCards, setAllCards] = useState<TabuCard[]>(AZERBAIJANI_TABOO_CARDS);
  const [activeDeck, setActiveDeck] = useState<TabuCard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  const isFetchingAiCardsRef = React.useRef(false);
  const seenCardWordsRef = React.useRef<Set<string>>(new Set());

  // Helper to extract currently selected AI topic
  const getActiveAiTopic = useCallback(() => {
    if (!settings.aiCustomTopicEnabled) return null;
    const t =
      settings.selectedAiTopic === 'Digər...'
        ? settings.customTopicInput.trim()
        : settings.selectedAiTopic.trim();
    return t || 'Mətbəx';
  }, [settings.aiCustomTopicEnabled, settings.selectedAiTopic, settings.customTopicInput]);

  // Round loop
  const [secondsLeft, setSecondsLeft] = useState(INITIAL_SETTINGS.roundDuration);
  const [passesRemaining, setPassesRemaining] = useState(INITIAL_SETTINGS.maxPasses);
  const [roundScore, setRoundScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [playedCardsInRound, setPlayedCardsInRound] = useState<PlayedCardRecord[]>([]);
  const [actionTrigger, setActionTrigger] = useState<'correct' | 'taboo' | 'pass' | null>(null);

  // Modals & Loaders
  const [isRoundSummaryOpen, setIsRoundSummaryOpen] = useState(false);
  const [isGameOverOpen, setIsGameOverOpen] = useState(false);
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isGeneratingAiDeck, setIsGeneratingAiDeck] = useState(false);
  const [aiGeneratingTopic, setAiGeneratingTopic] = useState('');

  // Toggle vibration
  const handleToggleVibration = () => {
    const nextVal = !vibrationEnabled;
    setVibrationEnabled(nextVal);
    haptics.setEnabled(nextVal);
    if (nextVal) {
      haptics.trigger(40);
    }
  };

  // Toggle sound
  const handleToggleSound = () => {
    const toggled = !settings.soundEnabled;
    setSettings((prev) => ({ ...prev, soundEnabled: toggled }));
    sound.setMuted(!toggled);
    if (vibrationEnabled) haptics.trigger(25);
  };

  // Shuffle deck
  const shuffleDeck = useCallback((deck: TabuCard[]) => {
    const arr = [...deck];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, []);

  // Filter deck based on difficulty and AI topic with strict deduplication
  const prepareDeck = useCallback(() => {
    const topic = getActiveAiTopic();

    if (settings.aiCustomTopicEnabled && topic) {
      const topicSeedCards = getInitialTopicCards(topic);
      // Filter out cards that were already seen in this session
      const unseen = topicSeedCards.filter(
        (c) => !seenCardWordsRef.current.has(c.word.toUpperCase().trim())
      );
      const chosen = unseen.length >= 8 ? unseen : topicSeedCards;
      return shuffleDeck(chosen);
    }

    let pool = [...allCards];

    // Filter strictly by difficulty
    if (settings.difficulty === 'asan') {
      const easy = pool.filter((c) => c.difficulty === 'asand' || c.difficulty === 'asan');
      if (easy.length >= 15) pool = easy;
    } else if (settings.difficulty === 'orta') {
      const medium = pool.filter((c) => c.difficulty === 'orta' || !c.difficulty);
      if (medium.length >= 15) pool = medium;
    } else if (settings.difficulty === 'cetin') {
      const hard = pool.filter((c) => c.difficulty === 'cetin');
      if (hard.length >= 15) pool = hard;
    } else if (settings.difficulty === 'cox_cetin') {
      const veryHard = pool.filter((c) => c.difficulty === 'cetin' || c.difficulty === 'orta');
      if (veryHard.length >= 15) pool = veryHard;
    }

    // Filter out already seen cards so players don't get duplicate cards
    const unseenPool = pool.filter(
      (c) => !seenCardWordsRef.current.has(c.word.toUpperCase().trim())
    );
    const finalDeck = unseenPool.length >= 20 ? unseenPool : pool;
    return shuffleDeck(finalDeck);
  }, [allCards, settings, shuffleDeck, getActiveAiTopic]);

  // Start the match
  const handleStartMatch = async () => {
    const topic = getActiveAiTopic();

    // If AI custom topic mode is enabled, ensure cards are ready
    if (settings.aiCustomTopicEnabled && topic) {
      const currentSeeds = getInitialTopicCards(topic);
      if (currentSeeds.length < 8) {
        setIsGeneratingAiDeck(true);
        setAiGeneratingTopic(topic);
        try {
          const timeoutPromise = new Promise<TabuCard[]>((res) => setTimeout(() => res([]), 3500));
          await Promise.race([preloadAiTopicCards(topic), timeoutPromise]);
        } catch (e) {
          console.warn('Error preloading cards:', e);
        } finally {
          setIsGeneratingAiDeck(false);
        }
      }
    }

    const deck = prepareDeck();
    setActiveDeck(deck);
    setCurrentCardIndex(0);
    setActiveTeamIndex(0);
    setCurrentRound(1);

    // If AI topic mode is enabled, continuously fetch extra Gemini AI cards in background
    if (topic) {
      const existing = deck.map((c) => c.word);
      fetchAiCardsFromBackend(topic, existing, 15).then((freshCards) => {
        if (freshCards.length > 0) {
          setActiveDeck((prev) => {
            const currentWords = new Set(prev.map((c) => c.word.toUpperCase().trim()));
            const nonDupes = freshCards.filter((c) => !currentWords.has(c.word.toUpperCase().trim()));
            nonDupes.forEach((c) => seenCardWordsRef.current.add(c.word.toUpperCase().trim()));
            return [...prev, ...nonDupes];
          });
        }
      });
    }
    
    // Provide nice defaults if left blank
    const finalizedRedTeam: Team = {
      ...teams[0],
      name: teams[0].name.trim() || 'Qırmızı Komanda',
      players: [
        teams[0].players[0]?.trim() || '1-ci Oyunçu',
        teams[0].players[1]?.trim() || '2-ci Oyunçu',
      ],
      score: 0,
      activeSpeakerIndex: 0,
    };

    const finalizedBlueTeam: Team = {
      ...teams[1],
      name: teams[1].name.trim() || 'Göy Komanda',
      players: [
        teams[1].players[0]?.trim() || '1-ci Oyunçu',
        teams[1].players[1]?.trim() || '2-ci Oyunçu',
      ],
      score: 0,
      activeSpeakerIndex: 0,
    };

    setTeams([finalizedRedTeam, finalizedBlueTeam]);
    setSecondsLeft(settings.roundDuration);
    setPassesRemaining(settings.maxPasses);
    setRoundScore(0);
    setStreak(0);
    setIsPaused(false);
    setPlayedCardsInRound([]);
    setIsRoundSummaryOpen(false);
    setIsGameOverOpen(false);
    sound.setMuted(!settings.soundEnabled);
    haptics.trigger(50);
    setCurrentScreen('PLAYING');
  };

  // Next round transition
  const handleNextRound = () => {
    const highestScore = Math.max(...teams.map((t) => t.score));
    if (highestScore >= settings.targetScore) {
      sound.playVictoryFanfare();
      haptics.triggerPattern([100, 50, 100]);
      setIsRoundSummaryOpen(false);
      setIsGameOverOpen(true);
      return;
    }

    const nextTeamIdx = (activeTeamIndex === 0 ? 1 : 0) as 0 | 1;
    let nextRoundNum = currentRound;
    if (nextTeamIdx === 0) {
      nextRoundNum += 1;
    }

    // Alternate speaker for the team
    setTeams((prev) => {
      const copy: [Team, Team] = [{ ...prev[0] }, { ...prev[1] }];
      const activeT = copy[activeTeamIndex];
      activeT.activeSpeakerIndex = activeT.activeSpeakerIndex === 0 ? 1 : 0;
      return copy;
    });

    // Advance to a fresh word so the previous round's unfinished card is NEVER repeated
    advanceCard();

    setActiveTeamIndex(nextTeamIdx);
    setCurrentRound(nextRoundNum);
    setSecondsLeft(settings.roundDuration);
    setPassesRemaining(settings.maxPasses);
    setRoundScore(0);
    setStreak(0);
    setPlayedCardsInRound([]);
    setIsPaused(false);
    setIsRoundSummaryOpen(false);
  };

  // Restart match with the same settings & teams
  const handleRestartMatch = () => {
    const deck = prepareDeck();
    setActiveDeck(deck);
    setCurrentCardIndex(0);
    setActiveTeamIndex(0);
    setCurrentRound(1);
    setTeams((prev) => [
      { ...prev[0], score: 0, activeSpeakerIndex: 0 },
      { ...prev[1], score: 0, activeSpeakerIndex: 0 },
    ]);
    setSecondsLeft(settings.roundDuration);
    setPassesRemaining(settings.maxPasses);
    setRoundScore(0);
    setStreak(0);
    setIsPaused(false);
    setPlayedCardsInRound([]);
    setIsRoundSummaryOpen(false);
    setIsGameOverOpen(false);
    sound.setMuted(!settings.soundEnabled);
    haptics.trigger(45);

    // Pre-fetch fresh AI cards for the restarted match
    const topic = getActiveAiTopic();
    if (topic) {
      const existing = deck.map((c) => c.word);
      fetchAiCardsFromBackend(topic, existing, 15).then((freshCards) => {
        if (freshCards.length > 0) {
          setActiveDeck((prev) => {
            const currentWords = new Set(prev.map((c) => c.word.toUpperCase().trim()));
            const nonDupes = freshCards.filter((c) => !currentWords.has(c.word.toUpperCase().trim()));
            nonDupes.forEach((c) => seenCardWordsRef.current.add(c.word.toUpperCase().trim()));
            return [...prev, ...nonDupes];
          });
        }
      });
    }
  };

  // Timer loop
  useEffect(() => {
    if (currentScreen !== 'PLAYING' || isPaused || isRoundSummaryOpen || isGameOverOpen) {
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          sound.playRoundEnd();
          haptics.triggerPattern([60, 40, 60]);
          setIsRoundSummaryOpen(true);
          return 0;
        }

        if (prev <= 10) {
          sound.playTick(true);
          haptics.trigger(15);
        } else if (prev % 10 === 0) {
          sound.playTick(false);
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentScreen, isPaused, isRoundSummaryOpen, isGameOverOpen]);

  const currentCard = activeDeck[currentCardIndex] || allCards[0];

  // Advance card smoothly with infinite deck replenishment
  const advanceCard = useCallback(() => {
    // Record current card as seen
    const current = activeDeck[currentCardIndex];
    if (current?.word) {
      seenCardWordsRef.current.add(current.word.toUpperCase().trim());
    }

    setCurrentCardIndex((prevIndex) => {
      const nextIndex = prevIndex + 1;
      const remaining = activeDeck.length - (nextIndex + 1);

      // Trigger automatic background AI generation when remaining cards are low
      const topic = getActiveAiTopic();
      if (topic && remaining <= 6 && !isFetchingAiCardsRef.current) {
        isFetchingAiCardsRef.current = true;
        const existingWords = Array.from(seenCardWordsRef.current);
        fetchAiCardsFromBackend(topic, existingWords, 12)
          .then((newCards) => {
            if (newCards.length > 0) {
              setActiveDeck((currentDeck) => {
                const wordsInDeck = new Set(currentDeck.map((c) => c.word.toUpperCase().trim()));
                const toAdd = newCards.filter(
                  (c) =>
                    !wordsInDeck.has(c.word.toUpperCase().trim()) &&
                    !seenCardWordsRef.current.has(c.word.toUpperCase().trim())
                );
                toAdd.forEach((c) => seenCardWordsRef.current.add(c.word.toUpperCase().trim()));
                return [...currentDeck, ...toAdd];
              });
            }
          })
          .finally(() => {
            isFetchingAiCardsRef.current = false;
          });
      }

      // If card index reaches or exceeds deck size before async fetch finishes:
      if (nextIndex >= activeDeck.length) {
        if (topic) {
          const extra = getInitialTopicCards(topic).filter(
            (c) => !seenCardWordsRef.current.has(c.word.toUpperCase().trim())
          );
          const toAdd = extra.length > 0 ? extra : getInitialTopicCards(topic);
          setActiveDeck((cur) => [...cur, ...shuffleDeck(toAdd)]);
        } else {
          const extra = allCards.filter(
            (c) => !seenCardWordsRef.current.has(c.word.toUpperCase().trim())
          );
          const toAdd = extra.length > 0 ? extra : allCards;
          setActiveDeck((cur) => [...cur, ...shuffleDeck(toAdd)]);
        }
      }

      return nextIndex;
    });
  }, [activeDeck, currentCardIndex, getActiveAiTopic, allCards, shuffleDeck]);

  // Actions
  const handleCorrect = () => {
    if (currentScreen !== 'PLAYING' || isPaused || isRoundSummaryOpen) return;
    sound.playCorrect();
    haptics.trigger(35);
    setActionTrigger('correct');
    setTimeout(() => setActionTrigger(null), 250);

    setStreak((s) => s + 1);
    setRoundScore((r) => r + 1);

    setTeams((prev) => {
      const copy: [Team, Team] = [{ ...prev[0] }, { ...prev[1] }];
      copy[activeTeamIndex].score += 1;
      return copy;
    });

    setPlayedCardsInRound((prev) => [
      ...prev,
      { card: currentCard, result: 'correct', timestamp: Date.now() },
    ]);

    advanceCard();
  };

  const handleTaboo = () => {
    if (currentScreen !== 'PLAYING' || isPaused || isRoundSummaryOpen) return;
    sound.playTaboo();
    haptics.triggerTabooError();
    setActionTrigger('taboo');
    setTimeout(() => setActionTrigger(null), 300);

    setStreak(0);
    setRoundScore((r) => r - 1);

    setTeams((prev) => {
      const copy: [Team, Team] = [{ ...prev[0] }, { ...prev[1] }];
      copy[activeTeamIndex].score = Math.max(0, copy[activeTeamIndex].score - 1);
      return copy;
    });

    setPlayedCardsInRound((prev) => [
      ...prev,
      { card: currentCard, result: 'taboo', timestamp: Date.now() },
    ]);

    advanceCard();
  };

  const handlePass = () => {
    if (currentScreen !== 'PLAYING' || isPaused || isRoundSummaryOpen || passesRemaining <= 0) {
      return;
    }
    sound.playPass();
    haptics.trigger(25);
    setActionTrigger('pass');
    setTimeout(() => setActionTrigger(null), 200);

    setPassesRemaining((p) => p - 1);
    setStreak(0);

    setPlayedCardsInRound((prev) => [
      ...prev,
      { card: currentCard, result: 'passed', timestamp: Date.now() },
    ]);

    advanceCard();
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        isRulesOpen ||
        isRoundSummaryOpen ||
        isGameOverOpen ||
        currentScreen !== 'PLAYING'
      ) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        handleCorrect();
      } else if (e.key === 't' || e.key === 'T' || e.code === 'ArrowDown') {
        e.preventDefault();
        handleTaboo();
      } else if (e.key === 'p' || e.key === 'P' || e.code === 'ArrowLeft') {
        e.preventDefault();
        handlePass();
      } else if (e.code === 'Escape') {
        setIsPaused((p) => !p);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  // Dispute resolution in round summary
  const handleToggleRecordStatus = (index: number) => {
    setPlayedCardsInRound((prev) => {
      const copy = [...prev];
      const record = copy[index];
      const oldResult = record.result;
      let nextResult: 'correct' | 'taboo' | 'passed';

      if (oldResult === 'correct') nextResult = 'taboo';
      else if (oldResult === 'taboo') nextResult = 'passed';
      else nextResult = 'correct';

      copy[index] = { ...record, result: nextResult };

      let scoreDelta = 0;
      if (oldResult === 'correct' && nextResult === 'taboo') scoreDelta = -2;
      else if (oldResult === 'correct' && nextResult === 'passed') scoreDelta = -1;
      else if (oldResult === 'taboo' && nextResult === 'passed') scoreDelta = +1;
      else if (oldResult === 'taboo' && nextResult === 'correct') scoreDelta = +2;
      else if (oldResult === 'passed' && nextResult === 'correct') scoreDelta = +1;
      else if (oldResult === 'passed' && nextResult === 'taboo') scoreDelta = -1;

      setTeams((teamList) => {
        const teamCopy: [Team, Team] = [{ ...teamList[0] }, { ...teamList[1] }];
        teamCopy[activeTeamIndex].score = Math.max(0, teamCopy[activeTeamIndex].score + scoreDelta);
        return teamCopy;
      });

      return copy;
    });
  };

  const activeTeam = teams[activeTeamIndex];

  return (
    <div className="bg-[#F7C02B] text-slate-900 flex flex-col font-sans select-none h-screen max-h-screen overflow-hidden">
      {/* Top Header - Controlled per screen */}
      {currentScreen === 'SETTINGS' && (
        <SettingsTopBar
          soundEnabled={settings.soundEnabled}
          onToggleSound={handleToggleSound}
          vibrationEnabled={vibrationEnabled}
          onToggleVibration={handleToggleVibration}
          onOpenRules={() => setIsRulesOpen(true)}
        />
      )}

      {currentScreen === 'TEAMS' && (
        <SettingsTopBar
          soundEnabled={settings.soundEnabled}
          onToggleSound={handleToggleSound}
          vibrationEnabled={vibrationEnabled}
          onToggleVibration={handleToggleVibration}
          onOpenRules={() => setIsRulesOpen(true)}
          customSpeechText="Tərəfləri seçməyin vaxtıdır !"
          showRulesButton={false}
        />
      )}

      {/* Main Screen Router */}
      <main className="flex-1 flex flex-col items-center justify-between px-3 sm:px-4 py-2 overflow-hidden relative">
        {/* ================= 1. HOME SCREEN ================= */}
        {currentScreen === 'HOME' && (
          <div className="w-full max-w-md h-full flex flex-col items-center justify-between py-1 relative animate-in fade-in zoom-in-95 duration-200">
            {/* Top floating controls: Help (?) and Settings Popover (Sound & Vibration) */}
            <div className="w-full flex items-center justify-end gap-2 pt-1 px-1 z-30">
              <button
                onClick={() => setIsRulesOpen(true)}
                className="w-9 h-9 rounded-xl bg-white neo-box-sm flex items-center justify-center text-[#18181B] hover:bg-slate-50 transition-all active:scale-95"
                title="Qaydalar"
                aria-label="Qaydalar"
              >
                <HelpCircle className="w-4 h-4 stroke-[2.5]" />
              </button>

              <SettingsPopover
                soundEnabled={settings.soundEnabled}
                onToggleSound={handleToggleSound}
                vibrationEnabled={vibrationEnabled}
                onToggleVibration={handleToggleVibration}
                size="md"
              />
            </div>

            {/* Curved Arched TABU AZ Title (Enlarged and lowered onto animation) */}
            <HomeCurvedTitle />

            {/* Center: Raised Animation with Tabu Book Mascot */}
            <TabuAnimatedHero />

            {/* Bottom: Subtitle directly above "Oyuna başla" button, slightly smaller */}
            <div className="w-full pb-3 px-1 flex flex-col items-center gap-1.5">
              <span className="font-heading font-black text-[10px] sm:text-[11px] text-[#18181B]/85 uppercase tracking-widest drop-shadow-xs select-none">
                Azərbaycanın #1 tabu oyunu
              </span>
              <button
                onClick={() => {
                  haptics.trigger(40);
                  setCurrentScreen('SETTINGS');
                }}
                className="w-full py-4 sm:py-5 bg-[#5C46E8] text-white font-heading font-black text-xl sm:text-2xl rounded-2xl neo-btn flex items-center justify-center gap-2 group active:scale-98 transition-all shadow-xl"
              >
                <Play className="w-7 h-7 fill-white stroke-[2.5]" />
                <span>Oyuna başla</span>
              </button>
            </div>
          </div>
        )}

        {/* ================= 2. SETTINGS SCREEN ================= */}
        {currentScreen === 'SETTINGS' && (
          <SettingsScreen
            settings={settings}
            onChangeSettings={setSettings}
            onNext={() => {
              haptics.trigger(40);
              const topic = getActiveAiTopic();
              if (settings.aiCustomTopicEnabled && topic) {
                preloadAiTopicCards(topic);
              }
              setCurrentScreen('TEAMS');
            }}
            onBack={() => setCurrentScreen('HOME')}
          />
        )}

        {/* ================= 3. TEAMS SETUP SCREEN ================= */}
        {currentScreen === 'TEAMS' && (
          <TeamsSetupScreen
            teams={teams}
            onChangeTeams={setTeams}
            onStartGame={handleStartMatch}
            onBack={() => setCurrentScreen('SETTINGS')}
          />
        )}

        {/* ================= 4. ACTIVE GAMEPLAY SCREEN ================= */}
        {currentScreen === 'PLAYING' && (
          <div className="w-full h-full max-w-lg flex flex-col justify-between py-0.5 animate-in fade-in duration-150">
            {/* Top Redesigned Bar: Round indicator, 70/30 Narrow Team Bar, Roles + Square Time + Pause Button */}
            <ScoreBoard
              teams={teams}
              activeTeamIndex={activeTeamIndex}
              currentRound={currentRound}
              secondsLeft={secondsLeft}
              onPause={() => setIsPaused(true)}
            />

            {/* Spacious White Taboo Game Card Panel */}
            <GameCard
              card={currentCard}
              onCorrect={handleCorrect}
              onTaboo={handleTaboo}
              onPass={handlePass}
              passesRemaining={passesRemaining}
              totalPasses={settings.maxPasses}
              isPaused={isPaused}
              actionTrigger={actionTrigger}
              activeTeamColor={activeTeam.color}
            />
          </div>
        )}
      </main>

      {/* Full-Screen Pause Overlay */}
      <PauseOverlay
        isOpen={isPaused && currentScreen === 'PLAYING' && !isRoundSummaryOpen && !isGameOverOpen}
        onResume={() => setIsPaused(false)}
        onRestartMatch={handleRestartMatch}
        soundEnabled={settings.soundEnabled}
        onToggleSound={handleToggleSound}
        vibrationEnabled={vibrationEnabled}
        onToggleVibration={handleToggleVibration}
        onOpenRules={() => setIsRulesOpen(true)}
        onResetGame={() => {
          setIsPaused(false);
          setCurrentScreen('HOME');
        }}
      />

      {/* Round Summary Modal */}
      <RoundSummaryModal
        isOpen={isRoundSummaryOpen}
        teamName={activeTeam.name}
        roundNumber={currentRound}
        records={playedCardsInRound}
        onToggleRecordStatus={handleToggleRecordStatus}
        onNextRound={handleNextRound}
      />

      {/* Game Over Celebration Modal */}
      <GameOverModal
        isOpen={isGameOverOpen}
        teams={teams}
        onRestartSameSettings={handleRestartMatch}
        onReturnToMenu={() => {
          setIsGameOverOpen(false);
          setCurrentScreen('HOME');
        }}
      />

      {/* Rules Modal */}
      <RulesModal
        isOpen={isRulesOpen}
        onClose={() => setIsRulesOpen(false)}
      />

      {/* AI Card Generation Loading Modal */}
      {isGeneratingAiDeck && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full neo-box text-center flex flex-col items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-[#5C46E8] text-white flex items-center justify-center neo-box-sm shadow-lg animate-bounce">
                <Sparkles className="w-8 h-8 text-[#F7C02B]" />
              </div>
              <div className="absolute -top-1 -right-1 px-1.5 py-0.5 rounded-full bg-[#EE5234] text-white text-[10px] font-black border-2 border-white shadow-xs">
                AI
              </div>
            </div>

            <div>
              <h3 className="font-heading font-black text-lg text-[#18181B] mb-1">
                Süni İntellekt Hazırlayır
              </h3>
              <p className="text-xs font-bold text-slate-500">
                "{aiGeneratingTopic.toUpperCase()}" mövzusunda yeni və maraqlı Tabu kartları generasiya olunur...
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-heading font-black text-[#5C46E8]">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Bir neçə saniyəyə oyun başlayır...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
