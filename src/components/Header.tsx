import React from 'react';
import { HelpCircle, RotateCcw } from 'lucide-react';
import { SettingsPopover } from './SettingsPopover';

interface HeaderProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
  vibrationEnabled: boolean;
  onToggleVibration: () => void;
  onOpenRules: () => void;
  onResetGame: () => void;
  showReset?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  soundEnabled,
  onToggleSound,
  vibrationEnabled,
  onToggleVibration,
  onOpenRules,
  onResetGame,
  showReset = false,
}) => {
  return (
    <header className="w-full bg-[#B5A5EC] neo-box border-b-3 border-[#18181B] px-3 sm:px-4 py-1.5 shrink-0 z-20">
      <div className="max-w-xl mx-auto flex items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-[#EE5234] neo-box-sm flex items-center justify-center font-heading font-black text-white text-sm">
            T
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-heading font-black text-base text-[#18181B] tracking-tight">
              TABU AZ
            </span>
            <span className="text-[8px] font-bold text-slate-800 uppercase tracking-wider">
              söz oyunu
            </span>
          </div>
        </div>

        {/* Actions (Help, Settings Popover, Reset) */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenRules}
            className="w-7 h-7 rounded-xl bg-white neo-box-sm flex items-center justify-center text-[#18181B] hover:bg-slate-50 transition-all active:scale-95"
            title="Qaydalar"
            aria-label="Qaydalar"
          >
            <HelpCircle className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>

          <SettingsPopover
            soundEnabled={soundEnabled}
            onToggleSound={onToggleSound}
            vibrationEnabled={vibrationEnabled}
            onToggleVibration={onToggleVibration}
            size="sm"
          />

          {showReset && (
            <button
              onClick={onResetGame}
              className="flex items-center gap-1 px-2 py-1 bg-[#5C46E8] text-white text-[11px] font-bold rounded-xl neo-btn-sm whitespace-nowrap"
              title="Əsas Menyuya Qayıt"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Menyu</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
