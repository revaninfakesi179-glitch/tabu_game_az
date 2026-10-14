import React from 'react';
import { motion } from 'motion/react';

interface TabuBookMascotProps {
  className?: string;
  isTalking?: boolean;
  showHushGesture?: boolean;
}

export const TabuBookMascot: React.FC<TabuBookMascotProps> = ({
  className = 'w-full h-full',
  isTalking = false,
  showHushGesture = true,
}) => {
  return (
    <div className={`relative ${className} select-none flex items-center justify-center bg-white`}>
      <svg
        viewBox="18 18 166 188"
        className="w-full h-full overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Leather Brown Gradients for authentic antique book */}
          <linearGradient id="leather-cover-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#874720" />
            <stop offset="45%" stopColor="#703615" />
            <stop offset="100%" stopColor="#54250C" />
          </linearGradient>

          <linearGradient id="leather-spine-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3B1807" />
            <stop offset="40%" stopColor="#5B2B11" />
            <stop offset="100%" stopColor="#441E0A" />
          </linearGradient>

          <linearGradient id="page-edges-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#EAD8B3" />
            <stop offset="60%" stopColor="#F9F1DC" />
            <stop offset="100%" stopColor="#DBC49A" />
          </linearGradient>

          <linearGradient id="gold-metal-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="50%" stopColor="#EAB308" />
            <stop offset="100%" stopColor="#A16207" />
          </linearGradient>

          <linearGradient id="ribbon-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#DC2626" />
            <stop offset="100%" stopColor="#991B1B" />
          </linearGradient>
        </defs>

        {/* Clean White Canvas Background */}
        <rect x="18" y="18" width="166" height="188" rx="16" fill="#FFFFFF" />

        {/* Floor Shadow Under Book */}
        <ellipse cx="102" cy="198" rx="60" ry="6.5" fill="#E4E4E7" />
        <ellipse cx="102" cy="198" rx="38" ry="3.5" fill="#D4D4D8" />

        {/* === BOOK STRUCTURE (ANTIQUE LEATHER BOUND SAGE TOME) === */}
        <g id="book-architecture">
          {/* Back Book Cover (Rich Dark Leather Overhang) */}
          <path
            d="M28 58 C28 48 36 40 48 38 L158 38 C166 38 172 44 172 52 L170 184 C170 190 164 196 156 196 L44 196 C34 196 28 188 28 178 Z"
            fill="#3F1B09"
            stroke="#1C0B04"
            strokeWidth="3"
            strokeLinejoin="round"
          />

          {/* Layered Vintage Parchment Page Block */}
          {/* Top Page Edges */}
          <path
            d="M48 42 L154 42 C160 42 164 46 164 52 L164 56 L48 56 Z"
            fill="url(#page-edges-grad)"
            stroke="#1C0B04"
            strokeWidth="2"
          />
          {/* Right Page Edge Block with visible paper layers */}
          <path
            d="M152 46 L165 50 L163 182 C163 186 159 190 154 190 L146 190 L146 52 Z"
            fill="url(#page-edges-grad)"
            stroke="#1C0B04"
            strokeWidth="2"
          />
          {/* Page lines texture along right edge */}
          <line x1="157" y1="58" x2="155" y2="182" stroke="#C8B084" strokeWidth="1" strokeDasharray="2 3" />
          <line x1="160" y1="62" x2="158" y2="178" stroke="#C8B084" strokeWidth="1" strokeDasharray="3 4" />

          {/* Book Spine (Left rounded leather binding with 4 raised ribs) */}
          <g id="book-spine">
            <path
              d="M32 54 C32 44 40 38 50 38 L56 38 L56 194 L48 194 C38 194 32 186 32 176 Z"
              fill="url(#leather-spine-grad)"
              stroke="#1C0B04"
              strokeWidth="2.5"
            />
            {/* Raised Spine Ribs */}
            <rect x="30" y="66" width="26" height="5" rx="2" fill="#2E1306" stroke="#1C0B04" strokeWidth="1.5" />
            <rect x="30" y="98" width="26" height="5" rx="2" fill="#2E1306" stroke="#1C0B04" strokeWidth="1.5" />
            <rect x="30" y="130" width="26" height="5" rx="2" fill="#2E1306" stroke="#1C0B04" strokeWidth="1.5" />
            <rect x="30" y="162" width="26" height="5" rx="2" fill="#2E1306" stroke="#1C0B04" strokeWidth="1.5" />

            {/* Gold foil dots on spine ribs */}
            <circle cx="43" cy="68.5" r="1.2" fill="#FDE047" />
            <circle cx="43" cy="100.5" r="1.2" fill="#FDE047" />
            <circle cx="43" cy="132.5" r="1.2" fill="#FDE047" />
            <circle cx="43" cy="164.5" r="1.2" fill="#FDE047" />
          </g>

          {/* Main Leather Front Cover */}
          <path
            d="M52 40 L148 40 C156 40 162 46 162 54 L158 182 C158 188 152 192 144 192 L52 192 Z"
            fill="url(#leather-cover-grad)"
            stroke="#1C0B04"
            strokeWidth="3"
            strokeLinejoin="round"
          />

          {/* Ornate Gold Filigree Tooling / Border on Cover */}
          <rect
            x="60"
            y="48"
            width="92"
            height="136"
            rx="6"
            fill="none"
            stroke="#D4AF37"
            strokeWidth="1.6"
            strokeDasharray="9 2 2 2"
            opacity="0.9"
          />
          <rect
            x="64"
            y="52"
            width="84"
            height="128"
            rx="4"
            fill="none"
            stroke="#A16207"
            strokeWidth="0.8"
            opacity="0.6"
          />

          {/* Antique Brass Corner Protectors */}
          {/* Top-Right Brass Corner */}
          <path
            d="M136 40 L162 40 L162 66 C158 62 154 56 152 50 C150 46 144 42 136 40 Z"
            fill="url(#gold-metal-grad)"
            stroke="#1C0B04"
            strokeWidth="1.8"
          />
          <circle cx="152" cy="50" r="1.5" fill="#78350F" />

          {/* Bottom-Right Brass Corner */}
          <path
            d="M136 192 L158 192 L158 166 C154 170 150 176 148 182 C146 186 142 190 136 192 Z"
            fill="url(#gold-metal-grad)"
            stroke="#1C0B04"
            strokeWidth="1.8"
          />
          <circle cx="149" cy="182" r="1.5" fill="#78350F" />

          {/* Classic Crimson Silk Bookmark Ribbon (Əlfəcin) */}
          <path
            d="M102 36 L102 19 L116 19 L116 36 L109 29 Z"
            fill="url(#ribbon-grad)"
            stroke="#1C0B04"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {/* Bottom dangling bookmark ribbon tail */}
          <path
            d="M106 190 L106 205 L112 201 L118 205 L118 190 Z"
            fill="url(#ribbon-grad)"
            stroke="#1C0B04"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />

          {/* Embossed Gold TABU Wordmark */}
          <g id="book-title-seal">
            <text
              x="105"
              y="66"
              textAnchor="middle"
              fill="#FDE047"
              fontFamily="Georgia, serif"
              fontWeight="900"
              fontSize="14"
              letterSpacing="3"
              stroke="#54250C"
              strokeWidth="0.8"
            >
              TABU
            </text>
            <path
              d="M86 71 Q 105 74 124 71"
              stroke="#D4AF37"
              strokeWidth="1.4"
              fill="none"
              strokeLinecap="round"
            />
            <circle cx="105" cy="72.5" r="1.6" fill="#FDE047" />
          </g>
        </g>

        {/* === CONFIDENT WISE SAGE FACE (BILGƏ) === */}
        <g id="wise-face">
          {/* Confident, Arched Intellectual Eyebrows (Bilgə və Nüfuzlu) */}
          <path
            d="M72 82 Q82 77 92 81"
            stroke="#1C0B04"
            strokeWidth="3.2"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M118 81 Q128 77 138 82"
            stroke="#1C0B04"
            strokeWidth="3.2"
            strokeLinecap="round"
            fill="none"
          />

          {/* Wise Scholar Spectacles (Round Gold-Rimmed Reading Glasses) */}
          <g id="spectacles">
            {/* Bridge */}
            <path
              d="M97 103 C101 99 109 99 113 103"
              stroke="url(#gold-metal-grad)"
              strokeWidth="3.2"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M97 103 C101 99 109 99 113 103"
              stroke="#1C0B04"
              strokeWidth="1"
              fill="none"
            />

            {/* Left Glass Lens */}
            <circle cx="83" cy="104" r="14.5" fill="#FFFFFF" fillOpacity="0.92" stroke="#1C0B04" strokeWidth="2.8" />
            <circle cx="83" cy="104" r="13" fill="none" stroke="url(#gold-metal-grad)" strokeWidth="2.2" />

            {/* Right Glass Lens */}
            <circle cx="127" cy="104" r="14.5" fill="#FFFFFF" fillOpacity="0.92" stroke="#1C0B04" strokeWidth="2.8" />
            <circle cx="127" cy="104" r="13" fill="none" stroke="url(#gold-metal-grad)" strokeWidth="2.2" />

            {/* Lens Reflections */}
            <path d="M75 96 L81 96 C76 101 75 106 75 111 Z" fill="#FFFFFF" opacity="0.6" />
            <path d="M119 96 L125 96 C120 101 119 106 119 111 Z" fill="#FFFFFF" opacity="0.6" />
          </g>

          {/* Astute, Sharp Eyes */}
          <g id="eyes">
            {/* Left Eye */}
            <ellipse cx="84" cy="104" rx="7" ry="8.5" fill="#1C0B04" />
            <circle cx="82" cy="101" r="2.6" fill="#FFFFFF" />
            <circle cx="86" cy="107" r="1.2" fill="#FFFFFF" />

            {/* Right Eye */}
            <ellipse cx="126" cy="104" rx="7" ry="8.5" fill="#1C0B04" />
            <circle cx="124" cy="101" r="2.6" fill="#FFFFFF" />
            <circle cx="128" cy="107" r="1.2" fill="#FFFFFF" />
          </g>

          {/* Dignified Mouth (NO 'X', and anchored strictly at cy=133) */}
          <g id="mouth">
            {isTalking ? (
              /* Stable SVG-attribute animation anchored firmly at cy=133, never wanders near eyes! */
              <g id="talking-mouth-group">
                <motion.ellipse
                  cx="105"
                  cy="133"
                  rx="6.5"
                  animate={{ ry: [2, 5.5, 2] }}
                  transition={{ duration: 0.22, repeat: Infinity, ease: 'easeInOut' }}
                  fill="#1C0B04"
                />
                <motion.ellipse
                  cx="105"
                  cy="135"
                  rx="3.5"
                  animate={{ ry: [1, 2.4, 1], opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 0.22, repeat: Infinity, ease: 'easeInOut' }}
                  fill="#DC2626"
                />
                <path
                  d="M100 131.5 Q105 130.5 110 131.5"
                  stroke="#FFFFFF"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
              </g>
            ) : showHushGesture ? (
              /* Hush Mouth: Secret composed gentle smile */
              <g id="hush-lips">
                <path
                  d="M99 133 Q105 135 111 133"
                  stroke="#1C0B04"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                  fill="none"
                />
              </g>
            ) : (
              /* Idle Mouth: Confident, wise, warm scholar smile */
              <g id="wise-smile">
                <path
                  d="M95 132 Q105 139 115 132"
                  stroke="#1C0B04"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  fill="none"
                />
                <path d="M94 130 L95 133" stroke="#1C0B04" strokeWidth="2" strokeLinecap="round" />
                <path d="M116 130 L115 133" stroke="#1C0B04" strokeWidth="2" strokeLinecap="round" />
              </g>
            )}
          </g>
        </g>

        {/* === HUSH GESTURE HAND (ONLY RENDERED WHEN HUSHING, NO UNUSED/EMPTY HAND) === */}
        {showHushGesture && (
          <motion.g
            id="hush-gesture-hand"
            animate={{
              y: [0, -4, 0],
              rotate: [-1, 2, -1],
            }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            style={{ originX: '115px', originY: '145px' }}
          >
            {/* White Glove Palm */}
            <ellipse cx="112" cy="140" rx="9" ry="9.5" fill="#FFFFFF" stroke="#1C0B04" strokeWidth="2.6" />
            <ellipse
              cx="118"
              cy="138"
              rx="4"
              ry="5.5"
              fill="#FFFFFF"
              stroke="#1C0B04"
              strokeWidth="2.2"
              transform="rotate(-20 118 138)"
            />
            <path d="M112 143 C114 140 114 136 111 134" stroke="#1C0B04" strokeWidth="1.6" fill="none" />

            {/* Single Raised Index Finger directly at the lips ("ŞŞŞ!" taboo secret) */}
            <rect
              x="102"
              y="114"
              width="7"
              height="24"
              rx="3.5"
              fill="#FFFFFF"
              stroke="#1C0B04"
              strokeWidth="2.6"
            />
            <line x1="104.5" y1="125" x2="106.5" y2="125" stroke="#1C0B04" strokeWidth="1.2" strokeLinecap="round" />
          </motion.g>
        )}
      </svg>
    </div>
  );
};
