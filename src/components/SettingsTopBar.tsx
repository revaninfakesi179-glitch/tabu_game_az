import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle } from 'lucide-react';
import { SettingsPopover } from './SettingsPopover';
import { TabuBookMascot } from './TabuBookMascot';

interface SettingsTopBarProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
  vibrationEnabled: boolean;
  onToggleVibration: () => void;
  onOpenRules: () => void;
  customSpeechText?: string;
  showRulesButton?: boolean;
}

export const SettingsTopBar: React.FC<SettingsTopBarProps> = ({
  soundEnabled,
  onToggleSound,
  vibrationEnabled,
  onToggleVibration,
  onOpenRules,
  customSpeechText,
  showRulesButton = true,
}) => {
  const [speechText, setSpeechText] = useState('');
  const [showBubble, setShowBubble] = useState(false);
  const [isTalking, setIsTalking] = useState(false);
  const fullText = customSpeechText || 'Oyun qaydalarını təyin et !';

  // 1-second delay for initial typewriter effect
  useEffect(() => {
    const initialTimer = setTimeout(() => {
      setShowBubble(true);
      let currentIndex = 0;
      const typeInterval = setInterval(() => {
        if (currentIndex <= fullText.length) {
          setSpeechText(fullText.slice(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(typeInterval);
        }
      }, 45);

      return () => clearInterval(typeInterval);
    }, 1000);

    return () => clearTimeout(initialTimer);
  }, [fullText]);

  // Talking Cycle: 4.5 seconds talking, then 3.5 seconds silent pause, looping continuously!
  useEffect(() => {
    let timer: NodeJS.Timeout;

    const runTalkingCycle = () => {
      setIsTalking(true);

      timer = setTimeout(() => {
        setIsTalking(false);

        timer = setTimeout(() => {
          runTalkingCycle();
        }, 3500);
      }, 4500);
    };

    runTalkingCycle();

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full bg-[#B5A5EC] neo-box border-b-3 border-[#18181B] px-3 sm:px-4 py-2 shrink-0 z-30 relative overflow-visible">
      <div className="max-w-xl mx-auto flex items-center justify-between gap-3 relative">
        {/* Left: Tabu Book Mascot Floating Avatar & TABU AZ Branding */}
        <div className="flex items-center gap-3 relative">
          {/* Stationary White Frame with Floating Book Inside (frame size unchanged: w-14 h-14 / sm:w-16 sm:h-16) */}
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white neo-box-sm flex items-center justify-center relative overflow-hidden shrink-0 shadow-xs border-2 border-[#18181B]">
            {/* Book Mascot Moving INSIDE the frame: slightly smaller, calm/gentle motion (duration 4.5s instead of fast) */}
            <motion.div
              className="w-full h-full flex items-center justify-center p-0.5"
              animate={{
                y: [-4, 4, -4],
                scale: [0.96, 1.01, 0.96],
              }}
              transition={{
                duration: 4.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <TabuBookMascot
                className="w-full h-full object-contain"
                showHushGesture={false}
                isTalking={isTalking}
              />
            </motion.div>
          </div>

          {/* Speech Bubble & TABU AZ Branding */}
          <div className="flex flex-col justify-center relative">
            {/* Speech Bubble: Emerges right from beside mascot's mouth upwards over TABU AZ */}
            <AnimatePresence>
              {showBubble && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.7, y: 4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  transition={{ type: 'spring', stiffness: 380, damping: 24 }}
                  className="absolute -top-4 sm:-top-5 -left-2 z-40 pointer-events-none whitespace-nowrap"
                >
                  <div className="relative flex items-end">
                    {/* Tiny speech dots rising from near book's mouth upwards to bubble */}
                    <div className="flex items-center -mr-0.5 mb-1 space-x-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-white border border-[#18181B]" />
                      <span className="w-2.5 h-2.5 rounded-full bg-white border border-[#18181B] -mb-1" />
                    </div>

                    {/* Cartoon Puffy Cloud Bubble */}
                    <div className="relative bg-white text-[#18181B] rounded-[20px] px-3 py-1 neo-box-sm border-2 border-[#18181B] shadow-lg flex items-center">
                      {/* Speech text - Clean and readable, no overlapping lines */}
                      <span className="relative z-10 font-heading font-black text-[10px] sm:text-[11px] text-[#18181B] tracking-tight">
                        {speechText}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* TABU AZ & söz oyunu Text in Top Bar */}
            <div className={`flex flex-col leading-none transition-all duration-300 ${showBubble ? 'pt-3.5 sm:pt-4' : 'pt-0'}`}>
              <span className="font-heading font-black text-base sm:text-lg text-[#18181B] tracking-tight">
                TABU AZ
              </span>
              <span className="text-[9px] font-bold text-slate-800 uppercase tracking-wider">
                söz oyunu
              </span>
            </div>
          </div>
        </div>

        {/* Right: Help & Settings Popover Buttons */}
        <div className="flex items-center gap-1.5 shrink-0 z-30">
          {showRulesButton && (
            <button
              onClick={onOpenRules}
              className="w-8 h-8 rounded-xl bg-white neo-box-sm flex items-center justify-center text-[#18181B] hover:bg-slate-50 transition-all active:scale-95"
              title="Qaydalar"
              aria-label="Qaydalar"
            >
              <HelpCircle className="w-4 h-4 stroke-[2.5]" />
            </button>
          )}

          <SettingsPopover
            soundEnabled={soundEnabled}
            onToggleSound={onToggleSound}
            vibrationEnabled={vibrationEnabled}
            onToggleVibration={onToggleVibration}
            size="sm"
          />
        </div>
      </div>
    </div>
  );
};
