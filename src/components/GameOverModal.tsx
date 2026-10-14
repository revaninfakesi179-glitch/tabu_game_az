import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Team } from '../types/game';
import { Trophy, RotateCcw, Award, Home } from 'lucide-react';

interface GameOverModalProps {
  isOpen: boolean;
  teams: Team[];
  onRestartSameSettings: () => void;
  onReturnToMenu: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  isOpen,
  teams,
  onRestartSameSettings,
  onReturnToMenu,
}) => {
  useEffect(() => {
    if (isOpen) {
      // Fire confetti bursts!
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#F7C02B', '#5C46E8', '#EE5234', '#B5A5EC'],
        });
      } catch {
        // Fallback safe
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Sort teams by score descending
  const sortedTeams = [...teams].sort((a, b) => b.score - a.score);
  const winner = sortedTeams[0];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#B5A5EC] rounded-[36px] p-6 sm:p-8 max-w-md w-full neo-box-lg border-[#18181B] text-center animate-in zoom-in-95 duration-200">
        {/* Trophy icon */}
        <div className="w-20 h-20 mx-auto rounded-3xl bg-[#F7C02B] neo-box flex items-center justify-center mb-4">
          <Trophy className="w-10 h-10 text-[#18181B] stroke-[2.5]" />
        </div>

        <span className="px-3 py-1 bg-white rounded-full neo-box-sm text-xs font-heading font-black text-[#18181B] uppercase tracking-wider">
          Oyun Başa Çatdı!
        </span>

        <h2 className="font-heading font-black text-3xl sm:text-4xl text-[#18181B] mt-2 mb-1">
          {winner.name} Qalib Gəldi!
        </h2>
        <p className="text-xs font-bold text-slate-800 mb-6">
          Əla oyun nümayiş etdirdiniz, təbriklər!
        </p>

        {/* Team Leaderboard Rankings */}
        <div className="space-y-2.5 mb-6">
          {sortedTeams.map((team, idx) => (
            <div
              key={team.id}
              className={`flex items-center justify-between p-3.5 rounded-2xl neo-box-sm ${
                idx === 0 ? 'bg-white ring-2 ring-[#5C46E8]' : 'bg-white/80'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black ${
                    idx === 0
                      ? 'bg-[#F7C02B] text-[#18181B]'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {idx === 0 ? <Award className="w-4 h-4" /> : idx + 1}
                </div>
                <span className="font-heading font-extrabold text-sm sm:text-base text-[#18181B]">
                  {team.name}
                </span>
              </div>

              <div className="text-right">
                <span className="font-heading font-black text-xl text-[#18181B] tabular-nums">
                  {team.score}
                </span>
                <span className="text-[10px] font-bold text-slate-500 uppercase ml-1">
                  xal
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons: Eyni seçimlərlə yenidən oyna & Menyuya qayıt */}
        <div className="space-y-2.5">
          <button
            onClick={onRestartSameSettings}
            className="w-full py-3.5 bg-[#5C46E8] text-white font-heading font-black text-sm sm:text-base rounded-2xl neo-btn flex items-center justify-center gap-2 hover:bg-[#4E39DC] transition-all"
          >
            <RotateCcw className="w-5 h-5 stroke-[2.5]" />
            <span>Eyni seçimlərlə yenidən oyna</span>
          </button>

          <button
            onClick={onReturnToMenu}
            className="w-full py-3 bg-white text-[#18181B] font-heading font-black text-sm rounded-2xl neo-box-sm flex items-center justify-center gap-2 hover:bg-slate-100 transition-all border-2 border-[#18181B]"
          >
            <Home className="w-4.5 h-4.5 text-[#18181B] stroke-[2.5]" />
            <span>Menyuya qayıt</span>
          </button>
        </div>
      </div>
    </div>
  );
};
