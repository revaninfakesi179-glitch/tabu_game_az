import React from 'react';
import { Pause, Play, Clock } from 'lucide-react';

interface TimerProps {
  secondsLeft: number;
  totalDuration: number;
  isPaused: boolean;
  onTogglePause: () => void;
}

export const Timer: React.FC<TimerProps> = ({
  secondsLeft,
  totalDuration,
  isPaused,
  onTogglePause,
}) => {
  const percentage = Math.max(0, (secondsLeft / totalDuration) * 100);
  const isUrgent = secondsLeft <= 10;

  return (
    <div className="w-full max-w-[420px] mx-auto px-1 select-none shrink-0">
      <div className="bg-white neo-box rounded-2xl px-3 py-1.5 flex items-center justify-between gap-2">
        {/* Time Display */}
        <div className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-xl flex items-center justify-center neo-box-sm transition-all ${
              isUrgent
                ? 'bg-[#EE5234] text-white animate-bounce'
                : 'bg-[#F7C02B] text-[#18181B]'
            }`}
          >
            <Clock className="w-4 h-4 stroke-[2.5]" />
          </div>

          <div className="flex items-baseline gap-1">
            <span
              className={`font-heading font-black text-2xl sm:text-3xl tabular-nums leading-none ${
                isUrgent ? 'text-[#EE5234]' : 'text-[#18181B]'
              }`}
            >
              {secondsLeft}
            </span>
            <span className="text-[10px] font-bold text-slate-500">san</span>
          </div>
        </div>

        {/* Progress Bar in center */}
        <div className="flex-1 mx-2">
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
            <div
              className={`h-full transition-all duration-300 rounded-full ${
                isUrgent ? 'bg-[#EE5234]' : 'bg-[#5C46E8]'
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* Pause/Resume Button */}
        <button
          onClick={onTogglePause}
          className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#18181B] neo-box-sm flex items-center justify-center transition-all active:scale-95 shrink-0"
          title={isPaused ? 'Davam etdir' : 'Dayandır'}
        >
          {isPaused ? (
            <Play className="w-3.5 h-3.5 fill-[#18181B]" />
          ) : (
            <Pause className="w-3.5 h-3.5 fill-[#18181B]" />
          )}
        </button>
      </div>
    </div>
  );
};
