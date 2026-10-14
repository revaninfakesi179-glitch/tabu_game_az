import React from 'react';
import { PlayedCardRecord } from '../types/game';
import { Check, Ban, FastForward, ArrowRight } from 'lucide-react';

interface RoundSummaryModalProps {
  isOpen: boolean;
  teamName: string;
  roundNumber: number;
  records: PlayedCardRecord[];
  onToggleRecordStatus: (index: number) => void;
  onNextRound: () => void;
}

export const RoundSummaryModal: React.FC<RoundSummaryModalProps> = ({
  isOpen,
  teamName,
  roundNumber,
  records,
  onToggleRecordStatus,
  onNextRound,
}) => {
  if (!isOpen) return null;

  const correctCount = records.filter((r) => r.result === 'correct').length;
  const tabooCount = records.filter((r) => r.result === 'taboo').length;
  const passedCount = records.filter((r) => r.result === 'passed').length;
  const netScore = correctCount - tabooCount;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-[#B5A5EC] rounded-[32px] p-5 sm:p-6 max-w-md w-full neo-box-lg border-[#18181B] my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="text-center mb-3">
          <span className="px-3 py-0.5 bg-[#F7C02B] rounded-full neo-box-sm text-[11px] font-heading font-black text-[#18181B] uppercase tracking-wider">
            Raund {roundNumber} Yekunu
          </span>
          <h2 className="font-heading font-black text-2xl text-[#18181B] mt-1">
            {teamName}
          </h2>
          <p className="text-[11px] font-bold text-slate-800">
            Sözün üzərinə toxunaraq nəticəni düzəldə bilərsiniz
          </p>
        </div>

        {/* Score Summary Metrics */}
        <div className="grid grid-cols-3 gap-2 mb-3 text-center">
          <div className="bg-white rounded-2xl p-2 neo-box-sm">
            <span className="block font-heading font-black text-xl text-emerald-600">
              +{correctCount}
            </span>
            <span className="text-[10px] font-bold text-slate-500 uppercase">
              Düzgün
            </span>
          </div>
          <div className="bg-white rounded-2xl p-2 neo-box-sm">
            <span className="block font-heading font-black text-xl text-[#EE5234]">
              -{tabooCount}
            </span>
            <span className="text-[10px] font-bold text-slate-500 uppercase">
              Tabu
            </span>
          </div>
          <div className="bg-white rounded-2xl p-2 neo-box-sm">
            <span className="block font-heading font-black text-xl text-[#18181B]">
              {netScore > 0 ? `+${netScore}` : netScore}
            </span>
            <span className="text-[10px] font-bold text-slate-500 uppercase">
              Xalis Xal
            </span>
          </div>
        </div>

        {/* Word Details & Dispute Resolution */}
        <div className="bg-white rounded-2xl p-3 neo-box-sm mb-4 max-h-48 overflow-y-auto">
          <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-100 text-[11px] font-bold text-slate-500">
            <span>Oynanılan Sözlər ({records.length})</span>
            <span className="text-[10px] text-slate-400">Dəyişmək üçün toxun</span>
          </div>

          {records.length === 0 ? (
            <div className="text-center py-4 text-xs font-bold text-slate-400">
              Heç bir söz cavablandırılmadı
            </div>
          ) : (
            <div className="space-y-1">
              {records.map((record, index) => {
                const isCorrect = record.result === 'correct';
                const isTaboo = record.result === 'taboo';

                return (
                  <div
                    key={index}
                    onClick={() => onToggleRecordStatus(index)}
                    className="flex items-center justify-between p-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors border border-slate-200"
                  >
                    <span className="font-heading font-extrabold text-xs text-[#18181B]">
                      {record.card.word}
                    </span>

                    <div className="flex items-center gap-1">
                      {isCorrect && (
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded-lg flex items-center gap-1">
                          <Check className="w-3 h-3 stroke-[3]" /> Düzgün (+1)
                        </span>
                      )}
                      {isTaboo && (
                        <span className="px-2 py-0.5 bg-rose-100 text-[#EE5234] text-[10px] font-black rounded-lg flex items-center gap-1">
                          <Ban className="w-3 h-3" /> Tabu (-1)
                        </span>
                      )}
                      {!isCorrect && !isTaboo && (
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-black rounded-lg flex items-center gap-1">
                          <FastForward className="w-3 h-3" /> Pas (0)
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* CTA Button */}
        <button
          onClick={onNextRound}
          className="w-full py-3.5 bg-[#5C46E8] text-white font-heading font-black text-sm rounded-2xl neo-btn flex items-center justify-center gap-2"
        >
          <span>Növbəti raunda keç</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
