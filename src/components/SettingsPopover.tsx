import React, { useState, useRef, useEffect } from 'react';
import { Settings, Volume2, VolumeX, Smartphone, Check, X } from 'lucide-react';

interface SettingsPopoverProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
  vibrationEnabled: boolean;
  onToggleVibration: () => void;
  size?: 'sm' | 'md';
}

export const SettingsPopover: React.FC<SettingsPopoverProps> = ({
  soundEnabled,
  onToggleSound,
  vibrationEnabled,
  onToggleVibration,
  size = 'md',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const btnDimension = size === 'sm' ? 'w-8 h-8' : 'w-9 h-9';
  const iconSize = size === 'sm' ? 'w-4 h-4' : 'w-4 h-4';

  return (
    <div className="relative inline-block" ref={containerRef}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className={`${btnDimension} rounded-xl bg-white neo-box-sm flex items-center justify-center text-[#18181B] hover:bg-slate-50 transition-all active:scale-95`}
        title="Ayarlar"
        aria-label="Ayarlar"
      >
        <Settings className={`${iconSize} stroke-[2.5]`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl neo-box border-3 border-[#18181B] p-2.5 z-50 shadow-xl animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between pb-1.5 mb-2 border-b-2 border-slate-100">
            <span className="font-heading font-black text-xs text-[#18181B] uppercase tracking-wider">
              Ayarlar
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="p-0.5 text-slate-400 hover:text-slate-800"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-1.5">
            {/* Səs toggle */}
            <button
              onClick={onToggleSound}
              className="w-full flex items-center justify-between p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors text-left"
            >
              <div className="flex items-center gap-2">
                {soundEnabled ? (
                  <Volume2 className="w-4 h-4 text-[#5C46E8]" />
                ) : (
                  <VolumeX className="w-4 h-4 text-slate-400" />
                )}
                <span className="font-heading font-bold text-xs text-slate-800">
                  Səs Effektləri
                </span>
              </div>
              <div
                className={`w-8 h-4 rounded-full transition-colors relative neo-box-sm p-0.5 ${
                  soundEnabled ? 'bg-[#5C46E8]' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`w-2.5 h-2.5 rounded-full bg-white transition-transform ${
                    soundEnabled ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </div>
            </button>

            {/* Vibrasiya toggle */}
            <button
              onClick={onToggleVibration}
              className="w-full flex items-center justify-between p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors text-left"
            >
              <div className="flex items-center gap-2">
                <Smartphone
                  className={`w-4 h-4 ${
                    vibrationEnabled ? 'text-[#EE5234]' : 'text-slate-400'
                  }`}
                />
                <span className="font-heading font-bold text-xs text-slate-800">
                  Vibrasiya
                </span>
              </div>
              <div
                className={`w-8 h-4 rounded-full transition-colors relative neo-box-sm p-0.5 ${
                  vibrationEnabled ? 'bg-[#EE5234]' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`w-2.5 h-2.5 rounded-full bg-white transition-transform ${
                    vibrationEnabled ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
