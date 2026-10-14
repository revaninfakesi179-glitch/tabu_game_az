import React from 'react';
import { motion } from 'motion/react';

export const HomeCurvedTitle: React.FC = () => {
  return (
    <div className="relative w-full max-w-[380px] sm:max-w-[440px] flex flex-col items-center justify-center text-center select-none pt-0">
      {/* Enlarged Curved SVG Text shifted slightly down towards the animation */}
      <motion.div
        animate={{
          y: [-3, 3, -3],
          scale: [0.99, 1.02, 0.99],
        }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        className="w-full h-[115px] sm:h-[130px] relative flex items-center justify-center"
      >
        <svg
          viewBox="0 0 400 125"
          className="w-full h-full overflow-visible drop-shadow-[0_6px_0_#18181B]"
        >
          {/* Smooth curved arc path */}
          <path
            id="titleCurve"
            d="M 15,110 Q 200,20 385,110"
            fill="transparent"
          />

          {/* Background stroke layer for thick bold comic outline */}
          <text className="font-heading font-black tracking-wider text-[60px] sm:text-[68px]">
            <textPath
              href="#titleCurve"
              startOffset="50%"
              textAnchor="middle"
              fill="#5C46E8"
              stroke="#18181B"
              strokeWidth="14"
              strokeLinejoin="round"
              strokeLinecap="round"
            >
              TABU AZ
            </textPath>
          </text>

          {/* Front fill layer with crisp white letters */}
          <text className="font-heading font-black tracking-wider text-[60px] sm:text-[68px]">
            <textPath
              href="#titleCurve"
              startOffset="50%"
              textAnchor="middle"
              fill="#FFFFFF"
            >
              TABU AZ
            </textPath>
          </text>
        </svg>
      </motion.div>
    </div>
  );
};
