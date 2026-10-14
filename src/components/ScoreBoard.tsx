import React from 'react';
import { Team } from '../types/game';
import { Trophy, MessageCircle, Ear, Pause } from 'lucide-react';

interface ScoreBoardProps {
  teams: [Team, Team];
  activeTeamIndex: number;
  currentRound: number;
  secondsLeft: number;
  onPause: () => void;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({
  teams,
  activeTeamIndex,
  currentRound,
  secondsLeft,
  onPause,
}) => {
  const activeTeam = teams[activeTeamIndex];
  const speakerName = activeTeam.players[activeTeam.activeSpeakerIndex] || '1-ci Oyunçu';
  const guesserName = activeTeam.players[1 - activeTeam.activeSpeakerIndex] || '2-ci Oyunçu';

  const isRedActive = activeTeamIndex === 0;
  const isUrgent = secondsLeft <= 10;

  const redTeam = teams[0];
  const blueTeam = teams[1];

  return (
    <div className="w-full max-w-lg mx-auto px-1 select-none shrink-0 mb-1">
      {/* 1. Top-Left: Small frameless "Raund 1" text with logo directly above the team bar */}
      <div className="flex items-center gap-1.5 mb-1 px-1">
        <Trophy className="w-3.5 h-3.5 text-[#18181B] stroke-[2.5]" />
        <span className="font-heading font-black text-xs sm:text-sm text-[#18181B] tracking-wide">
          Raund {currentRound}
        </span>
      </div>

      {/* 2. Narrow Unified Red & Blue Bar (90/10 Ratio: 90% for active team, 10% for waiting team)
             Waiting team: If score === 0 show NOTHING; if score > 0 show score */}
      <div className="w-full h-9 sm:h-10 rounded-2xl border-2 border-[#18181B] neo-box-sm overflow-hidden flex transition-all duration-300">
        {/* Red Segment */}
        <div
          className={`h-full flex items-center transition-all duration-300 ${
            isRedActive
              ? 'w-[90%] bg-[#EE5234] text-white px-3 justify-between'
              : 'w-[10%] bg-[#EE5234] text-white px-0.5 justify-center'
          }`}
        >
          {isRedActive ? (
            <>
              <span className="font-heading font-black text-xs sm:text-sm uppercase tracking-wide truncate pr-1">
                {redTeam.name || 'Qırmızı'}
              </span>
              <span className="font-heading font-black text-sm sm:text-base tabular-nums bg-black/25 px-2 py-0.5 rounded-lg shrink-0">
                {redTeam.score}
              </span>
            </>
          ) : (
            // In waiting mode: show nothing if score is 0; show score only if score > 0
            redTeam.score > 0 ? (
              <span className="font-heading font-black text-[11px] sm:text-xs tabular-nums text-white">
                {redTeam.score}
              </span>
            ) : null
          )}
        </div>

        {/* Blue Segment */}
        <div
          className={`h-full flex items-center transition-all duration-300 ${
            !isRedActive
              ? 'w-[90%] bg-[#3B82F6] text-white px-3 justify-between'
              : 'w-[10%] bg-[#3B82F6] text-white px-0.5 justify-center'
          }`}
        >
          {!isRedActive ? (
            <>
              <span className="font-heading font-black text-xs sm:text-sm uppercase tracking-wide truncate pr-1">
                {blueTeam.name || 'Göy'}
              </span>
              <span className="font-heading font-black text-sm sm:text-base tabular-nums bg-black/25 px-2 py-0.5 rounded-lg shrink-0">
                {blueTeam.score}
              </span>
            </>
          ) : (
            // In waiting mode: show nothing if score is 0; show score only if score > 0
            blueTeam.score > 0 ? (
              <span className="font-heading font-black text-[11px] sm:text-xs tabular-nums text-white">
                {blueTeam.score}
              </span>
            ) : null
          )}
        </div>
      </div>

      {/* 3. Row below the team bar:
             Timer is STRICTLY FIXED at horizontal center (absolute left-1/2) so long names never shift it!
             Left side: Player roles constrained to left half with ellipsis
             Right side: Pause button
      */}
      <div className="relative flex items-center justify-between mt-2 px-0.5 h-12">
        {/* Left: 1st player explains with logo, 2nd player guesses with logo (constrained so timer never shifts) */}
        <div className="max-w-[calc(50%-28px)] flex flex-col justify-center min-w-0 pr-1">
          <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-heading font-bold text-[#18181B] truncate">
            <MessageCircle className="w-3.5 h-3.5 text-[#5C46E8] shrink-0 stroke-[2.5]" />
            <span className="truncate">
              <span className="font-black text-[#18181B]">{speakerName}</span> izah edir
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-heading font-bold text-slate-700 truncate mt-0.5">
            <Ear className="w-3.5 h-3.5 text-slate-500 shrink-0 stroke-[2.5]" />
            <span className="truncate">
              <span className="font-extrabold text-slate-800">{guesserName}</span> tapır
            </span>
          </div>
        </div>

        {/* Center: Square Time Box - Mathematically locked to the exact horizontal center! */}
        <div
          className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 bg-white rounded-2xl neo-box border-2 border-[#18181B] flex flex-col items-center justify-center shrink-0 z-10 ${
            isUrgent ? 'animate-bounce border-[#EE5234]' : ''
          }`}
          title="Qalan vaxt"
        >
          <span
            className={`font-heading font-black text-xl sm:text-2xl tabular-nums leading-none ${
              isUrgent ? 'text-[#EE5234]' : 'text-[#18181B]'
            }`}
          >
            {secondsLeft}
          </span>
          <span className="text-[8px] font-bold text-slate-400 uppercase leading-none mt-0.5">
            san
          </span>
        </div>

        {/* Right: Pause Button at far right */}
        <div className="ml-auto shrink-0 z-10">
          <button
            onClick={onPause}
            className="w-11 h-11 sm:w-12 sm:h-12 bg-white hover:bg-slate-50 text-[#18181B] rounded-2xl neo-box border-2 border-[#18181B] flex items-center justify-center active:scale-95 transition-all shadow-xs"
            title="Oyunu dayandır (Pauza)"
            aria-label="Oyunu dayandır"
          >
            <Pause className="w-5 h-5 fill-[#18181B] stroke-[#18181B]" />
          </button>
        </div>
      </div>
    </div>
  );
};
