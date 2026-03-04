import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type BootPhase = 'BIOS' | 'WELCOME' | 'WIN98' | 'DONE';

const BIOS_LOGS = [
  'Award Modular BIOS v4.51PG',
  'Copyright (C) 1984-1998, Award Software, Inc.',
  '',
  'ASUS P2B-DS ACPI BIOS Revision 1014',
  '',
  'Intel Pentium II Processor Detected',
  'CPU Clock: 350MHz',
  'L2 Cache Installed: 512K',
  '',
  'Checking NVRAM...',
  'CMOS Checksum OK',
  '',
  'Detecting System Memory...',
  'Memory Testing : 4096K',
  'Memory Testing : 8192K',
  'Memory Testing : 49152K',
  'Memory Testing : 65536K OK',
  '',
  'Initializing USB Controller ... OK',
  'Initializing PS/2 Keyboard ... OK',
  'Initializing PS/2 Mouse ... OK',
  '',
  'Initializing Video BIOS ... OK',
  '',
  'Mounting Virtual Drive C:\\ ... OK',
  'Mounting Virtual Drive D:\\ ... OK',
  '',
  'Checking Boot Sector...',
  'Boot Sector OK',
  '',
  'Loading Developer Profile : Sahil Kumar ... OK',
  'Initializing Portfolio Environment ... OK',
  '',
  'Preparing Windows 98 Boot Loader...',
  '',
  'Starting Windows 98...',
];

export default function BootSequence({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<BootPhase>('BIOS');
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [visibleChars, setVisibleChars] = useState<number>(0);
  const [showCursor, setShowCursor] = useState(true);

  // Phase 1: BIOS Screen
  useEffect(() => {
    if (phase !== 'BIOS') return;

    if (visibleLines < BIOS_LOGS.length) {
      const line = BIOS_LOGS[visibleLines];

      if (visibleChars < line.length) {
        // Stream text effect, 1 character at a time
        const timeout = setTimeout(() => {
          setVisibleChars(prev => prev + 1);
        }, 2 + Math.random() * 4); // Fast but realistic single-character typing (15-35ms per char)
        return () => clearTimeout(timeout);
      } else {
        // Line complete, pause before next line
        const isMemoryLine = line.startsWith('Memory Testing');
        const delay = isMemoryLine ? 100 : 150; // 120ms-200ms range

        const timeout = setTimeout(() => {
          setVisibleLines(prev => prev + 1);
          setVisibleChars(0);
        }, delay);
        return () => clearTimeout(timeout);
      }
    } else {
      // 2s pause after BIOS finishes so user can see the final blinking cursor
      const timeout = setTimeout(() => {
        setPhase('WELCOME');
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [phase, visibleLines, visibleChars]);

  // Cursor Blinking
  useEffect(() => {
    if (phase !== 'BIOS') return;
    const interval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    return () => clearInterval(interval);
  }, [phase]);

  // Phase 2: Welcome Screen
  useEffect(() => {
    if (phase !== 'WELCOME') return;

    const timeout = setTimeout(() => {
      setPhase('WIN98');
    }, 3000); // 1s stay + fade in/out
    return () => clearTimeout(timeout);
  }, [phase]);

  // Phase 3: Win98 Boot Screen
  useEffect(() => {
    if (phase !== 'WIN98') return;

    const timeout = setTimeout(() => {
      setPhase('DONE');
      setTimeout(onComplete, 500);
    }, 4500); // 4.5s for Win98 screen
    return () => clearTimeout(timeout);
  }, [phase, onComplete]);

  return (
    <div className="fixed inset-0 bg-black z-[99999] overflow-hidden" style={{ cursor: 'none' }}>
      <AnimatePresence mode="wait">
        {phase === 'BIOS' && (
          <motion.div
            key="bios"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 p-4 sm:p-8 md:p-16 font-mono text-[#C0C0C0] text-[10px] sm:text-xs md:text-[14px] leading-tight selection:bg-none tracking-tight overflow-hidden"
          >
            {BIOS_LOGS.slice(0, visibleLines).map((line, i) => {
              const isLastVisible = i === visibleLines - 1;
              const isFinalBiosLine = i === BIOS_LOGS.length - 1;

              return (
                <div key={i} className="min-h-[1.25em] break-words whitespace-pre-wrap">
                  {line}
                  {isLastVisible && isFinalBiosLine && (
                    <span className={showCursor ? 'opacity-100' : 'opacity-0'}>_</span>
                  )}
                </div>
              );
            })}
            {visibleLines < BIOS_LOGS.length && (
              <div className="min-h-[1.25em] break-words whitespace-pre-wrap">
                {BIOS_LOGS[visibleLines].slice(0, visibleChars)}
                <span className={showCursor ? 'opacity-100' : 'opacity-0'}>_</span>
              </div>
            )}
          </motion.div>
        )}

        {phase === 'WELCOME' && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="h-full flex flex-col items-center justify-center text-white font-mono text-center px-4"
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="space-y-8"
            >
              <h1 className="text-3xl md:text-5xl font-bold tracking-wide">Welcome to SahilOS</h1>
              <div className="space-y-2">
                <p className="text-xl md:text-3xl text-gray-300">Created by Sahil Kumar</p>
              </div>
              <p className="text-sm md:text-base text-gray-500 animate-pulse mt-16 pt-8">
                Launching Windows 98 Interface...
              </p>
            </motion.div>
          </motion.div>
        )}

        {(phase === 'WIN98' || phase === 'DONE') && (
          <motion.div
            key="win98"
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === 'DONE' ? 0 : 1 }}
            transition={{ duration: 0.5 }}
            className="h-full w-full flex flex-col items-center justify-between py-12"
          >
            <div className="flex-1 w-full flex flex-col items-center justify-center -mt-16 sm:-mt-16 overflow-hidden px-4">
              <div className="flex items-center gap-3 sm:gap-6 mb-8 transform scale-[0.6] sm:scale-100 md:scale-125 origin-center">
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

            <div className="w-full flex flex-col items-center justify-end mb-8 sm:mb-16 px-4">
              <p className="text-gray-400 text-sm mb-4 font-bold tracking-wide text-center">Starting SahilOS...</p>
              <div className="w-full max-w-[16rem] h-4 border-2 border-[#808080] rounded-sm bg-black relative overflow-hidden">
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
                  <div className="w-1/3 h-full bg-[#000080]" />
                  <div className="w-1/3 h-full bg-[#008080]" />
                  <div className="w-1/3 h-full bg-white" />
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
