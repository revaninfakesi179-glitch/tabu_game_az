import React from 'react';
import { Team } from '../types/game';
import { Play, ArrowLeft, Users, User, Shield } from 'lucide-react';

interface TeamsSetupScreenProps {
  teams: [Team, Team]; // [Red team, Blue team]
  onChangeTeams: (teams: [Team, Team]) => void;
  onStartGame: () => void;
  onBack: () => void;
}

export const TeamsSetupScreen: React.FC<TeamsSetupScreenProps> = ({
  teams,
  onChangeTeams,
  onStartGame,
  onBack,
}) => {
  const [redTeam, blueTeam] = teams;

  const updateRedTeam = (updates: Partial<Team>) => {
    onChangeTeams([{ ...redTeam, ...updates }, blueTeam]);
  };

  const updateBlueTeam = (updates: Partial<Team>) => {
    onChangeTeams([redTeam, { ...blueTeam, ...updates }]);
  };

  const updateRedPlayer = (index: 0 | 1, name: string) => {
    const updatedPlayers: [string, string] = [...redTeam.players];
    updatedPlayers[index] = name;
    updateRedTeam({ players: updatedPlayers });
  };

  const updateBluePlayer = (index: 0 | 1, name: string) => {
    const updatedPlayers: [string, string] = [...blueTeam.players];
    updatedPlayers[index] = name;
    updateBlueTeam({ players: updatedPlayers });
  };

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col justify-between pt-1 pb-1 px-2 select-none h-full overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
      {/* 1. Header Area: Frameless Back Button on Top-Left + Centered/Aligned Logo and "Komandalar və oyunçular" (Exact match with Screen 2) */}
      <div className="flex items-center justify-between pt-0.5 pb-1 shrink-0 relative">
        {/* Sleek frameless back button at exact same location and style as screen 2 */}
        <button
          onClick={onBack}
          className="p-1 -ml-1 rounded-lg text-[#18181B] hover:text-[#5C46E8] hover:bg-black/5 active:scale-95 transition-all flex items-center justify-center shrink-0"
          title="Geri"
          aria-label="Geri"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2.8]" />
        </button>

        {/* Logo & Prominent Title - Matches Screen 2 styling and size */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#5C46E8] text-white neo-box-sm flex items-center justify-center shrink-0">
            <Users className="w-4 h-4 stroke-[2.5]" />
          </div>
          <h2 className="font-heading font-black text-lg sm:text-xl text-[#18181B] leading-none tracking-tight">
            Komandalar və oyunçular
          </h2>
        </div>

        {/* Spacer to keep title balanced */}
        <div className="w-6 shrink-0" />
      </div>

      {/* Split Screen Container (Red Left, Blue Right, Angled Divider & VS in center) - Fills available height completely without yellow gaps */}
      <div className="relative rounded-3xl overflow-hidden neo-box border-3 border-[#18181B] my-1 flex-1 flex flex-col w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 relative h-full flex-1 min-h-0">
          {/* ================= LEFT (RED SIDE) ================= */}
          <div className="bg-[#EE5234] p-3.5 sm:p-5 flex flex-col justify-between text-white relative">
            {/* Top: Red Team Name */}
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <Shield className="w-4 h-4 fill-white text-[#EE5234]" />
                <span className="text-[10px] font-black uppercase tracking-wider text-rose-100">
                  Qırmızı Qrup
                </span>
              </div>
              <input
                type="text"
                value={redTeam.name}
                onChange={(e) => updateRedTeam({ name: e.target.value })}
                placeholder="Bura komanda adını daxil edin..."
                className="w-full px-3 py-1.5 bg-white text-[#18181B] placeholder:text-slate-400 placeholder:font-bold placeholder:normal-case rounded-xl font-heading font-black text-sm sm:text-base uppercase neo-box-sm focus:outline-none"
              />
            </div>

            {/* Bottom: 2 Player Names */}
            <div className="mt-3 pt-2.5 border-t-2 border-white/20 space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-rose-100 block">
                Oyunçular (Hər komandada 2 nəfər)
              </span>

              <div className="space-y-1.5">
                <div className="relative">
                  <User className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    value={redTeam.players[0]}
                    onChange={(e) => updateRedPlayer(0, e.target.value)}
                    placeholder="1-ci oyunçunun adını yazın..."
                    className="w-full pl-8 pr-3 py-1.5 bg-white/95 text-[#18181B] placeholder:text-slate-400 placeholder:font-bold placeholder:normal-case rounded-xl font-heading font-extrabold text-xs sm:text-sm neo-box-sm focus:outline-none"
                  />
                </div>

                <div className="relative">
                  <User className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    value={redTeam.players[1]}
                    onChange={(e) => updateRedPlayer(1, e.target.value)}
                    placeholder="2-ci oyunçunun adını yazın..."
                    className="w-full pl-8 pr-3 py-1.5 bg-white/95 text-[#18181B] placeholder:text-slate-400 placeholder:font-bold placeholder:normal-case rounded-xl font-heading font-extrabold text-xs sm:text-sm neo-box-sm focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ================= RIGHT (BLUE SIDE) ================= */}
          <div className="bg-[#3B82F6] p-3.5 sm:p-5 flex flex-col justify-between text-white relative">
            {/* Top: Blue Team Name */}
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <Shield className="w-4 h-4 fill-white text-[#3B82F6]" />
                <span className="text-[10px] font-black uppercase tracking-wider text-blue-100">
                  Göy Qrup
                </span>
              </div>
              <input
                type="text"
                value={blueTeam.name}
                onChange={(e) => updateBlueTeam({ name: e.target.value })}
                placeholder="Bura komanda adını daxil edin..."
                className="w-full px-3 py-1.5 bg-white text-[#18181B] placeholder:text-slate-400 placeholder:font-bold placeholder:normal-case rounded-xl font-heading font-black text-sm sm:text-base uppercase neo-box-sm focus:outline-none"
              />
            </div>

            {/* Bottom: 2 Player Names */}
            <div className="mt-3 pt-2.5 border-t-2 border-white/20 space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-blue-100 block">
                Oyunçular (Hər komandada 2 nəfər)
              </span>

              <div className="space-y-1.5">
                <div className="relative">
                  <User className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    value={blueTeam.players[0]}
                    onChange={(e) => updateBluePlayer(0, e.target.value)}
                    placeholder="1-ci oyunçunun adını yazın..."
                    className="w-full pl-8 pr-3 py-1.5 bg-white/95 text-[#18181B] placeholder:text-slate-400 placeholder:font-bold placeholder:normal-case rounded-xl font-heading font-extrabold text-xs sm:text-sm neo-box-sm focus:outline-none"
                  />
                </div>

                <div className="relative">
                  <User className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    value={blueTeam.players[1]}
                    onChange={(e) => updateBluePlayer(1, e.target.value)}
                    placeholder="2-ci oyunçunun adını yazın..."
                    className="w-full pl-8 pr-3 py-1.5 bg-white/95 text-[#18181B] placeholder:text-slate-400 placeholder:font-bold placeholder:normal-case rounded-xl font-heading font-extrabold text-xs sm:text-sm neo-box-sm focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Diagonal Divider Line & Center "VS" Badge (V in blue, S in red) */}
          <div className="hidden md:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-1.5 bg-[#18181B] -rotate-6 z-10 origin-center pointer-events-none" />

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
            <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-white neo-box flex items-center justify-center shadow-2xl rotate-3">
              <div className="font-heading font-black text-2xl flex items-center tracking-tighter">
                {/* V in Blue, S in Red */}
                <span className="text-[#3B82F6]">V</span>
                <span className="text-[#EE5234]">S</span>
              </div>
            </div>
          </div>
        </div>
      </div>

        {/* Start Game Action Button */}
        <div className="mt-1 pt-1 shrink-0">
          <button
            onClick={onStartGame}
            className="w-full py-2.5 sm:py-3 bg-[#5C46E8] text-white font-heading font-black text-sm sm:text-base rounded-2xl neo-btn flex items-center justify-center gap-2 group active:scale-98 transition-all"
          >
            <Play className="w-5 h-5 fill-white" />
            <span>Oyuna Başla!</span>
          </button>
        </div>
    </div>
  );
};
