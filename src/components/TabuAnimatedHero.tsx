import React from 'react';
import { motion } from 'motion/react';
import { Ban, Check, Sparkles } from 'lucide-react';
import { TabuBookMascot } from './TabuBookMascot';

export const TabuAnimatedHero: React.FC = () => {
  return (
    <div className="relative w-full max-w-[340px] sm:max-w-[390px] h-[230px] sm:h-[250px] flex items-center justify-center select-none -mt-3 sm:-mt-4">
      {/* Floating background decorative aura */}
      <motion.div
        animate={{
          scale: [1, 1.08, 1],
          rotate: [0, 3, -3, 0],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute w-60 h-60 rounded-full bg-[#B5A5EC]/40 blur-2xl -z-10"
      />

      {/* Floating Card 1 (Left tilted - Red Taboo) */}
      <motion.div
        animate={{
          y: [-6, 6, -6],
          rotate: [-14, -10, -14],
        }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -left-2 sm:left-1 top-3 w-24 sm:w-28 h-36 bg-[#EE5234] rounded-2xl neo-box-sm p-2 flex flex-col justify-between text-white shadow-lg pointer-events-none"
      >
        <div className="flex items-center justify-between">
          <span className="text-[8px] font-black uppercase">QADAĞAN</span>
          <Ban className="w-3 h-3" />
        </div>
        <div className="text-center font-heading font-black text-[11px] uppercase bg-white/20 py-0.5 rounded-md">
          TABU!
        </div>
        <div className="space-y-1">
          <div className="w-full h-1 bg-white/40 rounded-full" />
          <div className="w-3/4 h-1 bg-white/40 rounded-full" />
          <div className="w-5/6 h-1 bg-white/40 rounded-full" />
        </div>
      </motion.div>

      {/* Floating Card 2 (Right tilted - Blue Correct) */}
      <motion.div
        animate={{
          y: [6, -6, 6],
          rotate: [12, 16, 12],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -right-2 sm:right-1 top-6 w-24 sm:w-28 h-36 bg-[#5C46E8] rounded-2xl neo-box-sm p-2 flex flex-col justify-between text-white shadow-lg pointer-events-none"
      >
        <div className="flex items-center justify-between">
          <span className="text-[8px] font-black uppercase">TAPILDI</span>
          <Check className="w-3 h-3 stroke-[3]" />
        </div>
        <div className="text-center font-heading font-black text-[11px] uppercase bg-white/20 py-0.5 rounded-md">
          +1 XAL
        </div>
        <div className="space-y-1">
          <div className="w-full h-1 bg-white/40 rounded-full" />
          <div className="w-4/5 h-1 bg-white/40 rounded-full" />
          <div className="w-2/3 h-1 bg-white/40 rounded-full" />
        </div>
      </motion.div>

      {/* Main Center Hero Card Container */}
      <motion.div
        animate={{
          y: [-6, 6, -6],
        }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        className="relative z-10 w-44 sm:w-48 bg-white rounded-3xl neo-box border-4 border-[#18181B] p-2.5 sm:p-3 flex flex-col items-center shadow-xl overflow-visible"
      >
        {/* Top Status Camera/Dots bar */}
        <div className="w-full flex items-center justify-between pb-1 mb-1 border-b-2 border-slate-100">
          <div className="flex items-center -space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F7C02B] border border-[#18181B]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#F7C02B] border border-[#18181B]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#F7C02B] border border-[#18181B]" />
          </div>
          <span className="text-[9px] font-black text-[#5C46E8] uppercase tracking-wider">
            BİLGƏ TABU
          </span>
        </div>

        {/* Wise Scholar Tabu Book Mascot (Brown leather tome) */}
        <div className="w-full h-36 sm:h-38 rounded-2xl overflow-hidden neo-box-sm relative bg-white">
          <TabuBookMascot className="w-full h-full object-cover" showHushGesture={true} isTalking={false} />

          {/* Animated Hush Badge: ŞŞŞŞ! 🤫 */}
          <motion.div
            animate={{
              scale: [0.95, 1.08, 0.95],
              rotate: [-2, 3, -2],
            }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-1 right-1 px-2 py-0.5 bg-[#EE5234] text-white text-[10px] font-heading font-black rounded-full neo-box-sm shadow-md pointer-events-none"
          >
            ŞŞŞŞ! 🤫
          </motion.div>
        </div>
      </motion.div>

      {/* Floating Sparkles */}
      <motion.div
        animate={{
          scale: [0.8, 1.2, 0.8],
          rotate: [0, 180, 360],
        }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute top-2 right-4 text-[#EE5234]"
      >
        <Sparkles className="w-5 h-5 fill-[#EE5234]" />
      </motion.div>
    </div>
  );
};
