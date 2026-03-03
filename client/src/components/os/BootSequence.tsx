import React, { useState, useEffect } from 'react';
import { useOS } from './OSProvider';

import { motion } from 'framer-motion';

export default function BootSequence({ onComplete }: { onComplete: () => void }) {
  const [done, setDone] = useState(false);

  useEffect(() => {
    // 3.5 seconds for the boot screen
    const timer = setTimeout(() => {
      setDone(true);
      setTimeout(onComplete, 500); // 500ms fade transition
    }, 3500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 bg-black z-[99999] flex flex-col items-center justify-between py-12 transition-opacity duration-500 ${done ? 'opacity-0' : 'opacity-100'}`}
      style={{ cursor: 'none' }}
    >
      <div className="flex-1 flex flex-col items-center justify-center -mt-16">
        {/* Windows 98 Logo Group */}
        <div className="flex items-center gap-6 mb-8 transform scale-125">
          {/* Classic 4-color flag (simplified vector approximation) */}
          <div className="grid grid-cols-2 gap-1 w-16 h-16 origin-center" style={{ transform: 'skewY(-15deg)' }}>
            <div className="bg-[#ff3300] w-full h-full rounded-tl-full shadow-inner border border-black/20" />
            <div className="bg-[#00a200] w-full h-full rounded-tr-full shadow-inner border border-black/20" />
            <div className="bg-[#0033ff] w-full h-full rounded-bl-full shadow-inner border border-black/20" />
            <div className="bg-[#ffcc00] w-full h-full rounded-br-full shadow-inner border border-black/20" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-white font-bold text-5xl tracking-tighter" style={{ fontFamily: "'Arial Black', Impact, sans-serif" }}>
              Microsoft<sup className="text-sm font-normal align-super text-gray-400">&reg;</sup>
            </h1>
            <h2 className="text-white font-bold text-6xl tracking-tighter -mt-2" style={{ fontFamily: "'Arial Black', Impact, sans-serif" }}>
              Windows<span className="text-gray-400 font-normal">98</span>
            </h2>
          </div>
        </div>
      </div>

      {/* Loading Bar Area */}
      <div className="w-full flex flex-col items-center justify-end mb-16">
        <p className="text-gray-400 text-sm mb-4 font-bold tracking-wide">Starting SahilOS...</p>
        <div className="w-64 h-4 border-2 border-[#808080] rounded-sm bg-black relative overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 h-full flex"
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{
              repeat: Infinity,
              duration: 2,
              ease: 'linear'
            }}
            style={{ width: '40%' }}
          >
            {/* Multicolored loading segments matching the Win98 style */}
            <div className="w-1/3 h-full bg-[#000080]" />
            <div className="w-1/3 h-full bg-[#008080]" />
            <div className="w-1/3 h-full bg-white" />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
