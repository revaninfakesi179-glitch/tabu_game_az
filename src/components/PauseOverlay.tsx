import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Volume2, VolumeX, Smartphone, HelpCircle, RotateCcw, Home } from 'lucide-react';

interface PauseOverlayProps {
  isOpen: boolean;
  onResume: () => void;
  onRestartMatch: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  vibrationEnabled: boolean;
  onToggleVibration: () => void;
  onOpenRules: () => void;
  onResetGame: () => void;
}

export const PauseOverlay: React.FC<PauseOverlayProps> = ({
  isOpen,
  onResume,
  onRestartMatch,
  soundEnabled,
  onToggleSound,
  vibrationEnabled,
  onToggleVibration,
  onOpenRules,
  onResetGame,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-[#18181B]/85 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 select-none"
      >
        {/* Top Header: Centered 2-line title and guidance + Top Right "Oyuna davam et" with Triangle PLAY icon */}
        <div className="w-full max-w-lg mx-auto flex items-center justify-between gap-2 pt-2 relative">
          {/* Spacer on the left to perfectly center the middle text */}
          <div className="w-24 sm:w-36 shrink-0 hidden sm:block" />

          {/* Center Title: "Oyun dayandırılıb" only */}
          <div className="flex-1 text-center px-1">
            <h2 className="font-heading font-black text-xl sm:text-2xl text-white tracking-wide leading-tight">
              Oyun dayandırılıb
            </h2>
          </div>

          {/* Top Right: "Oyuna davam et" with Play Triangle Logo */}
          <div className="shrink-0">
            <button
              onClick={onResume}
              className="flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 bg-[#5C46E8] hover:bg-[#4E39DC] text-white rounded-2xl neo-btn text-xs sm:text-sm font-heading font-black active:scale-95 transition-all shadow-lg"
              title="Oyuna davam et"
            >
              <Play className="w-4 h-4 fill-white stroke-[2.5]" />
              <span className="whitespace-nowrap">Oyuna davam et</span>
            </button>
          </div>
        </div>

        {/* Center: Settings, Rules, Restart Match & Menu Options */}
        <div className="w-full max-w-sm mx-auto my-auto py-2">
          <div className="bg-white rounded-3xl p-5 neo-box-lg border-3 border-[#18181B] shadow-2xl flex flex-col gap-2.5">
            <div className="text-center pb-1.5 border-b-2 border-slate-100">
              <span className="font-heading font-black text-lg text-[#18181B] uppercase tracking-wide">
                Ayarlar və Seçimlər
              </span>
            </div>

            {/* Option 1: Eyni ayarlarla yenidən başla */}
            <button
              onClick={onRestartMatch}
              className="w-full py-2.5 sm:py-3 px-3.5 rounded-2xl bg-[#EEF2FF] hover:bg-[#E0E7FF] text-[#4338CA] neo-box-sm border-2 border-[#18181B] flex items-center justify-between font-heading font-bold text-xs sm:text-sm transition-all active:scale-98"
            >
              <div className="flex items-center gap-2.5">
                <RotateCcw className="w-4.5 h-4.5 text-[#4F46E5] stroke-[2.5]" />
                <span>Eyni ayarlarla yenidən başla</span>
              </div>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-lg bg-[#4F46E5] text-white">
                Sıfırla
              </span>
            </button>

            {/* Option 2: Sound Toggle */}
            <button
              onClick={onToggleSound}
              className={`w-full py-2.5 sm:py-3 px-3.5 rounded-2xl neo-box-sm border-2 border-[#18181B] flex items-center justify-between font-heading font-bold text-xs sm:text-sm transition-all active:scale-98 ${
                soundEnabled
                  ? 'bg-[#EBF5FF] text-[#1D4ED8]'
                  : 'bg-slate-100 text-slate-500'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {soundEnabled ? (
                  <Volume2 className="w-4.5 h-4.5 text-[#2563EB]" />
                ) : (
                  <VolumeX className="w-4.5 h-4.5 text-slate-400" />
                )}
                <span>Səs effektləri</span>
              </div>
              <span
                className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-lg ${
                  soundEnabled ? 'bg-[#2563EB] text-white' : 'bg-slate-300 text-slate-700'
                }`}
              >
                {soundEnabled ? 'Açıq' : 'Bağlı'}
              </span>
            </button>

            {/* Option 3: Vibration Toggle */}
            <button
              onClick={onToggleVibration}
              className={`w-full py-2.5 sm:py-3 px-3.5 rounded-2xl neo-box-sm border-2 border-[#18181B] flex items-center justify-between font-heading font-bold text-xs sm:text-sm transition-all active:scale-98 ${
                vibrationEnabled
                  ? 'bg-[#ECFDF5] text-[#047857]'
                  : 'bg-slate-100 text-slate-500'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Smartphone className="w-4.5 h-4.5 text-[#059669]" />
                <span>Vibrasiya</span>
              </div>
              <span
                className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-lg ${
                  vibrationEnabled ? 'bg-[#059669] text-white' : 'bg-slate-300 text-slate-700'
                }`}
              >
                {vibrationEnabled ? 'Açıq' : 'Bağlı'}
              </span>
            </button>

            {/* Option 4: Game Rules */}
            <button
              onClick={onOpenRules}
              className="w-full py-2.5 sm:py-3 px-3.5 rounded-2xl bg-[#FFFBEB] hover:bg-[#FEF3C7] text-[#B45309] neo-box-sm border-2 border-[#18181B] flex items-center justify-between font-heading font-bold text-xs sm:text-sm transition-all active:scale-98"
            >
              <div className="flex items-center gap-2.5">
                <HelpCircle className="w-4.5 h-4.5 text-[#D97706]" />
                <span>Oyun qaydaları</span>
              </div>
              <span className="text-[10px] font-black bg-[#D97706] text-white px-2 py-0.5 rounded-lg">
                Bax
              </span>
            </button>

            {/* Option 5: Return to Main Menu */}
            <button
              onClick={onResetGame}
              className="w-full py-2.5 sm:py-3 px-3.5 rounded-2xl bg-[#FEE2E2] hover:bg-[#FECACA] text-[#B91C1C] neo-box-sm border-2 border-[#18181B] flex items-center justify-between font-heading font-bold text-xs sm:text-sm transition-all active:scale-98"
            >
              <div className="flex items-center gap-2.5">
                <Home className="w-4.5 h-4.5 text-[#DC2626]" />
                <span>Əsas menyuya qayıt</span>
              </div>
              <span className="text-[10px] font-black bg-[#DC2626] text-white px-2 py-0.5 rounded-lg">
                Çıxış
              </span>
            </button>
          </div>
        </div>

        {/* Empty bottom spacer (yellow button removed as requested) */}
        <div className="h-2" />
      </motion.div>
    </AnimatePresence>
  );
};
