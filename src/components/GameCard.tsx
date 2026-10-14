import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TabuCard } from '../types/game';
import { CATEGORY_LABELS } from '../data/azerbaijaniCards';
import { haptics } from '../utils/haptics';
import { Check, Ban, FastForward, ShieldAlert, Tag } from 'lucide-react';

interface GameCardProps {
  card: TabuCard;
  onCorrect: () => void;
  onTaboo: () => void;
  onPass: () => void;
  passesRemaining: number;
  totalPasses: number;
  isPaused: boolean;
  actionTrigger?: 'correct' | 'taboo' | 'pass' | null;
  activeTeamColor?: 'red' | 'blue';
}

export const GameCard: React.FC<GameCardProps> = ({
  card,
  onCorrect,
  onTaboo,
  onPass,
  passesRemaining,
  totalPasses,
  isPaused,
  actionTrigger,
}) => {
  const categoryName = CATEGORY_LABELS[card.category] || 'Ümumi';

  const handleTabooClick = () => {
    if (isPaused) return;
    haptics.triggerTabooError();
    onTaboo();
  };

  return (
    <div className="relative w-full max-w-lg mx-auto flex-1 min-h-0 flex flex-col justify-between select-none">
      {/* Spacious Main White Card Panel - Replaces multiple outer layers */}
      <AnimatePresence mode="wait">
        <motion.div
          key={card.id}
          initial={{ scale: 0.96, opacity: 0, y: 10 }}
          animate={
            actionTrigger === 'taboo'
              ? { x: [-10, 10, -6, 6, -3, 3, 0], transition: { duration: 0.3 } }
              : actionTrigger === 'correct'
              ? { scale: [1, 1.03, 1], y: [0, -6, 0], transition: { duration: 0.25 } }
              : { scale: 1, opacity: 1, y: 0, transition: { type: 'spring', stiffness: 350, damping: 25 } }
          }
          exit={{ scale: 0.94, opacity: 0, y: -12, transition: { duration: 0.12 } }}
          className="bg-white rounded-[28px] sm:rounded-[32px] p-3.5 sm:p-5 neo-box-lg border-3 border-[#18181B] flex-1 flex flex-col justify-between relative overflow-hidden"
        >
          {/* Top Category Badge */}
          <div className="flex items-center justify-between border-b-2 border-slate-100 pb-2">
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 bg-slate-100 rounded-full text-slate-700 text-[10px] sm:text-xs font-heading font-black">
              <Tag className="w-3 h-3 text-[#5C46E8]" />
              <span>{categoryName}</span>
            </div>

            <span className="text-[10px] sm:text-xs font-black text-[#5C46E8] tracking-widest uppercase">
              HƏDƏF SÖZ
            </span>
          </div>

          {/* Main Target Word */}
          <div className="text-center py-2 sm:py-3 my-auto">
            <h2 className="font-heading font-black text-2xl sm:text-4xl text-[#18181B] tracking-tight leading-tight uppercase px-1 drop-shadow-xs">
              {card.word}
            </h2>
          </div>

          {/* Forbidden Taboo Words Box */}
          <div className="w-full bg-[#FFF1F2] rounded-2xl p-2.5 sm:p-3.5 border-2 border-[#FECDD3] my-auto">
            <div className="flex items-center justify-center gap-1.5 mb-2 text-[#E11D48]">
              <ShieldAlert className="w-4 h-4" />
              <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider">
                Qadağan Sözlər
              </span>
            </div>

            <div className="space-y-1.5 sm:space-y-2">
              {card.tabooWords.map((taboo, idx) => (
                <div
                  key={idx}
                  className="w-full py-1.5 px-3 bg-white rounded-xl border border-rose-200 text-center font-heading font-bold text-xs sm:text-sm text-slate-800 shadow-2xs flex items-center justify-between"
                >
                  <span className="text-[10px] font-bold text-rose-300 w-4 text-left">
                    {idx + 1}
                  </span>
                  <span className="font-extrabold uppercase tracking-wide text-[#18181B]">
                    {taboo}
                  </span>
                  <span className="w-4" />
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Action Controls: TABU (-1 Xal with wrong buzz), PAS, DÜZGÜN (+1 Xal) */}
      <div className="mt-2.5 grid grid-cols-3 gap-2 shrink-0">
        {/* TABU Button */}
        <button
          onClick={handleTabooClick}
          disabled={isPaused}
          className="flex flex-col items-center justify-center py-2.5 sm:py-3 px-1 bg-[#EE5234] text-white rounded-2xl neo-btn font-heading font-black text-xs sm:text-sm active:translate-y-1 transition-all disabled:opacity-50"
          title="Tabu! Qadağan söz deyildi (-1 Xal)"
        >
          <Ban className="w-5 h-5 mb-0.5" />
          <span>TABU</span>
          <span className="text-[9px] font-bold opacity-90">-1 XAL</span>
        </button>

        {/* PAS Button */}
        <button
          onClick={onPass}
          disabled={isPaused || passesRemaining <= 0}
          className="flex flex-col items-center justify-center py-2.5 sm:py-3 px-1 bg-[#F7C02B] text-[#18181B] rounded-2xl neo-btn font-heading font-black text-xs sm:text-sm active:translate-y-1 transition-all disabled:opacity-40"
          title={`Pas et (${passesRemaining} qalıb)`}
        >
          <FastForward className="w-5 h-5 mb-0.5" />
          <span>PAS</span>
          <span className="text-[9px] font-bold">
            {passesRemaining}/{totalPasses}
          </span>
        </button>

        {/* DÜZGÜN Button */}
        <button
          onClick={onCorrect}
          disabled={isPaused}
          className="flex flex-col items-center justify-center py-2.5 sm:py-3 px-1 bg-[#5C46E8] text-white rounded-2xl neo-btn font-heading font-black text-xs sm:text-sm active:translate-y-1 transition-all disabled:opacity-50"
          title="Düzgün! Söz tapıldı (+1 Xal)"
        >
          <Check className="w-5 h-5 mb-0.5 stroke-[3]" />
          <span>DÜZGÜN</span>
          <span className="text-[9px] font-bold opacity-90">+1 XAL</span>
        </button>
      </div>
    </div>
  );
};
