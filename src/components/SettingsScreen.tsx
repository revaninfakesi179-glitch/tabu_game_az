import React from 'react';
import { GameSettings, DifficultyMode } from '../types/game';
import { Sliders, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';

interface SettingsScreenProps {
  settings: GameSettings;
  onChangeSettings: (newSettings: GameSettings) => void;
  onNext: () => void;
  onBack: () => void;
}

const DIFFICULTY_OPTIONS: { id: DifficultyMode; label: string; desc: string }[] = [
  { id: 'asan', label: 'Asan', desc: 'Tanış və rahat sözlər' },
  { id: 'orta', label: 'Orta', desc: 'Klassik standart tabu çətinliyi' },
  { id: 'cetin', label: 'Çətin', desc: 'Hiyləgər və düşündürücü qadağalar' },
  { id: 'cox_cetin', label: 'Çox Çətin', desc: 'Ən sərt tabu ustaları üçün' },
];

const TIME_OPTIONS = [45, 60, 90, 120];
const SCORE_OPTIONS = [15, 25, 35, 50];
const PASS_OPTIONS = [2, 3, 5];

// Exactly 5 topics + "Digər..." as requested
const AI_TOPIC_PRESETS = [
  'Mətbəx',
  'Futbol',
  'Məktəb',
  'Coğrafiya',
  'Kino',
  'Digər...',
];

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  settings,
  onChangeSettings,
  onNext,
  onBack,
}) => {
  const handleDifficultyChange = (difficulty: DifficultyMode) => {
    onChangeSettings({ ...settings, difficulty });
  };

  const handleToggleAiTopic = () => {
    onChangeSettings({
      ...settings,
      aiCustomTopicEnabled: !settings.aiCustomTopicEnabled,
    });
  };

  const handleSelectAiTopic = (topic: string) => {
    onChangeSettings({
      ...settings,
      selectedAiTopic: topic,
    });
  };

  const handleCustomTopicInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Letters, digits, spaces, hyphens up to 25 characters
    const filtered = e.target.value
      .replace(/[^a-zA-Z0-9ƏəIıİiÖöĞğÜüÇçŞş\s\-_]/g, '')
      .slice(0, 25);
    onChangeSettings({
      ...settings,
      customTopicInput: filtered,
    });
  };

  const activeDiff = DIFFICULTY_OPTIONS.find((d) => d.id === settings.difficulty);

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col justify-between pt-1 pb-1 px-2 select-none h-full overflow-hidden relative">
      {/* 1. Header Area: Frameless Back Button on Top-Left + Centered/Aligned Logo and "Oyun tənzimləmələri" */}
      <div className="flex items-center justify-between pt-0.5 pb-1 shrink-0 relative">
        {/* Sleek frameless back button (smaller, no frame border, positioned at top-left) */}
        <button
          onClick={onBack}
          className="p-1 -ml-1 rounded-lg text-[#18181B] hover:text-[#5C46E8] hover:bg-black/5 active:scale-95 transition-all flex items-center justify-center shrink-0"
          title="Geri"
          aria-label="Geri"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2.8]" />
        </button>

        {/* Logo & Prominent Title - Full text size preserved, compact vertical footprint */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#5C46E8] text-white neo-box-sm flex items-center justify-center shrink-0">
            <Sliders className="w-4 h-4 stroke-[2.5]" />
          </div>
          <h2 className="font-heading font-black text-lg sm:text-xl text-[#18181B] leading-none tracking-tight">
            Oyun tənzimləmələri
          </h2>
        </div>

        {/* Spacer to keep title balanced */}
        <div className="w-6 shrink-0" />
      </div>

      {/* 2. Modular Panel: Oyun Modu (Difficulty) */}
      <div className="bg-white rounded-2xl p-2 neo-box-sm mb-1 shrink-0">
        <span className="block text-[10px] font-heading font-black text-[#18181B] uppercase tracking-wider mb-1">
          Oyun Modu
        </span>
        <div className="grid grid-cols-4 gap-1">
          {DIFFICULTY_OPTIONS.map((item) => {
            const isSelected = settings.difficulty === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleDifficultyChange(item.id)}
                className={`py-1 px-1 rounded-xl font-heading font-black text-xs transition-all text-center ${
                  isSelected
                    ? 'bg-[#5C46E8] text-white neo-box-sm scale-[1.02]'
                    : 'bg-slate-50 text-slate-800 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Description only shown for the currently selected difficulty */}
        {activeDiff && (
          <div className="mt-0.5 text-center text-[9px] font-bold text-slate-500">
            • {activeDiff.desc}
          </div>
        )}
      </div>

      {/* 3. Modular Panel: Vaxt, Xal və Pas Tənzimləmələri */}
      <div className="bg-white rounded-2xl p-2 neo-box-sm mb-1 shrink-0 space-y-1.5">
        {/* Vaxt */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-heading font-black text-[#18181B] uppercase">
              Raund Vaxtı
            </span>
            <span className="text-[11px] font-black text-[#EE5234]">
              {settings.roundDuration} san
            </span>
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {TIME_OPTIONS.map((time) => (
              <button
                key={time}
                type="button"
                onClick={() =>
                  onChangeSettings({ ...settings, roundDuration: time })
                }
                className={`py-1 rounded-lg font-heading font-black text-xs transition-all ${
                  settings.roundDuration === time
                    ? 'bg-[#EE5234] text-white neo-box-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {time}s
              </button>
            ))}
          </div>
        </div>

        {/* Xal */}
        <div className="border-t border-slate-100 pt-1.5">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-heading font-black text-[#18181B] uppercase">
              Qələbə Xalı
            </span>
            <span className="text-[11px] font-black text-[#5C46E8]">
              {settings.targetScore} xal
            </span>
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {SCORE_OPTIONS.map((score) => (
              <button
                key={score}
                type="button"
                onClick={() =>
                  onChangeSettings({ ...settings, targetScore: score })
                }
                className={`py-1 rounded-lg font-heading font-black text-xs transition-all ${
                  settings.targetScore === score
                    ? 'bg-[#F7C02B] text-[#18181B] neo-box-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {score}x
              </button>
            ))}
          </div>
        </div>

        {/* Pas */}
        <div className="border-t border-slate-100 pt-1.5">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-heading font-black text-[#18181B] uppercase">
              Pas Sayı
            </span>
            <span className="text-[11px] font-black text-[#5C46E8]">
              {settings.maxPasses} pas
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {PASS_OPTIONS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() =>
                  onChangeSettings({ ...settings, maxPasses: p })
                }
                className={`py-1 rounded-lg font-heading font-black text-xs transition-all ${
                  settings.maxPasses === p
                    ? 'bg-[#5C46E8] text-white neo-box-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {p} Pas
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Modular Panel: AI ilə Özəl Mövzu */}
      <div className="bg-white rounded-2xl p-2 neo-box-sm mb-1 transition-all shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-lg bg-[#F7C02B] text-[#18181B] neo-box-sm flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-[#EE5234]" />
            </div>
            <div>
              <span className="font-heading font-black text-xs text-[#18181B] block leading-tight">
                AI ilə Özəl Mövzu
              </span>
              <span className="text-[8.5px] font-bold text-slate-500">
                Seçilmiş mövzuya uyğun kartlar
              </span>
            </div>
          </div>

          {/* Toggle Switch */}
          <button
            type="button"
            onClick={handleToggleAiTopic}
            className={`w-9 h-5 rounded-full transition-colors relative neo-box-sm p-0.5 ${
              settings.aiCustomTopicEnabled ? 'bg-[#5C46E8]' : 'bg-slate-300'
            }`}
          >
            <div
              className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                settings.aiCustomTopicEnabled ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* 5 Presets + "Digər..." (3 per row) when enabled */}
        {settings.aiCustomTopicEnabled && (
          <div className="mt-1.5 pt-1.5 border-t border-slate-100 animate-in fade-in duration-150">
            <div className="grid grid-cols-3 gap-1">
              {AI_TOPIC_PRESETS.map((topic) => {
                const isSelected = settings.selectedAiTopic === topic;
                return (
                  <button
                    key={topic}
                    type="button"
                    onClick={() => handleSelectAiTopic(topic)}
                    className={`py-1 px-0.5 text-center font-heading font-black text-[10px] rounded-lg transition-all ${
                      isSelected
                        ? 'bg-[#EE5234] text-white neo-box-sm'
                        : 'bg-slate-50 text-slate-800 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {topic}
                  </button>
                );
              })}
            </div>

            {/* When "Digər..." is selected -> Manual text input */}
            {settings.selectedAiTopic === 'Digər...' && (
              <div className="mt-1.5 p-1.5 bg-slate-50 rounded-xl border border-slate-200 animate-in fade-in duration-150">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-[8.5px] font-heading font-black text-[#18181B] uppercase">
                    Öz mövzunu yaz (Maks 25 simvol)
                  </span>
                  <span className="text-[8.5px] font-bold text-slate-500">
                    {settings.customTopicInput.length}/25
                  </span>
                </div>
                <input
                  type="text"
                  maxLength={25}
                  value={settings.customTopicInput}
                  onChange={handleCustomTopicInput}
                  placeholder="Məs: Qalatasaray, Avtomobil, Kosmos..."
                  className="w-full px-2 py-1 bg-white border border-slate-300 rounded-lg font-heading font-black text-[11px] text-[#18181B] uppercase focus:outline-none focus:border-[#5C46E8]"
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* 5. Növbəti Düyməsi */}
      <div className="pt-0.5 pb-0.5 shrink-0">
        <button
          onClick={onNext}
          className="w-full py-2.5 sm:py-3 bg-[#5C46E8] text-white font-heading font-black text-sm sm:text-base rounded-2xl neo-btn flex items-center justify-center gap-1.5 group active:scale-98 transition-all"
        >
          <span>Növbəti</span>
          <ArrowRight className="w-4 h-4 stroke-[3] group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
