import React from 'react';
import { HelpCircle, X, Check, Ban, FastForward, Trophy } from 'lucide-react';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[#B5A5EC] rounded-[36px] p-5 sm:p-7 max-w-lg w-full neo-box-lg border-[#18181B] my-6 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-black/10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white neo-box-sm flex items-center justify-center text-[#5C46E8]">
              <HelpCircle className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="font-heading font-black text-xl text-[#18181B]">
                Tabu Oyun Qaydaları
              </h2>
              <p className="text-xs font-bold text-slate-800">
                Necə oynamalı və xal toplamalı?
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white neo-box-sm flex items-center justify-center text-slate-800 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Rules Body */}
        <div className="mt-4 space-y-3">
          <div className="bg-white rounded-2xl p-4 neo-box-sm">
            <div className="flex items-center gap-2 text-sm font-heading font-black text-[#18181B] mb-1">
              <span className="w-6 h-6 rounded-lg bg-[#F7C02B] flex items-center justify-center text-xs font-black">
                1
              </span>
              <span>Məqsəd Nədir?</span>
            </div>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              İzah edən oyunçu kartdakı əsas <strong>Hədəf Sözü</strong> öz komanda yoldaşlarına anlatmalıdır. Rəqib komandadan bir nəfər isə ekrana baxaraq qaydaların pozulmamasına nəzarət edir.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-4 neo-box-sm">
            <div className="flex items-center gap-2 text-sm font-heading font-black text-[#EE5234] mb-1">
              <span className="w-6 h-6 rounded-lg bg-[#EE5234] text-white flex items-center justify-center text-xs font-black">
                2
              </span>
              <span>Qadağalar (Tabu)</span>
            </div>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              Kartın altında qeyd olunan <strong>5 qadağan olunmuş sözün</strong> heç birini, həmçinin hədəf sözün kökünü, şəkilçilərini və ya başqa dildə birbaşa tərcüməsini işlətmək qadağandır!
            </p>
          </div>

          <div className="bg-white rounded-2xl p-4 neo-box-sm">
            <div className="flex items-center gap-2 text-sm font-heading font-black text-[#5C46E8] mb-1.5">
              <span className="w-6 h-6 rounded-lg bg-[#5C46E8] text-white flex items-center justify-center text-xs font-black">
                3
              </span>
              <span>Düymələr və Xallar</span>
            </div>
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center gap-2 text-emerald-700 font-bold">
                <Check className="w-4 h-4 stroke-[3]" />
                <span><strong>DÜZGÜN (+1 Xal):</strong> Komanda sözü tapdıqda basılır.</span>
              </div>
              <div className="flex items-center gap-2 text-[#EE5234] font-bold">
                <Ban className="w-4 h-4" />
                <span><strong>TABU (-1 Xal):</strong> Qadağan söz deyildikdə basılır.</span>
              </div>
              <div className="flex items-center gap-2 text-amber-700 font-bold">
                <FastForward className="w-4 h-4" />
                <span><strong>PAS (0 Xal):</strong> Söz çox çətin olduqda (raundda 3 pas hüququ).</span>
              </div>
            </div>
          </div>

          <div className="bg-[#F7C02B] rounded-2xl p-3.5 neo-box-sm flex items-center gap-2.5">
            <Trophy className="w-6 h-6 text-[#18181B] shrink-0" />
            <div className="text-xs font-bold text-[#18181B]">
              <strong>Qalib:</strong> Təyin olunmuş hədəf xala (məs: 25 xal) ilk çatan komanda qalib gəlir!
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 text-center">
          <button
            onClick={onClose}
            className="w-full py-3 bg-[#5C46E8] text-white font-heading font-black text-sm rounded-2xl neo-btn"
          >
            Anladım, Oyuna Başla!
          </button>
        </div>
      </div>
    </div>
  );
};
