import React, { useState, useEffect } from 'react';

const BOOT_LINES = [
  "SYNTH_OS BIOS Version 1.0.4",
  "Copyright (C) 1985-1999 Megacorp Inc.",
  "",
  "CPU: Replit Quantum Processor 4000",
  "Memory Test : 640000K OK",
  "",
  "Detecting Primary Master ... OK",
  "Detecting Primary Slave  ... NONE",
  "",
  "Loading vaporwave drivers ................... DONE",
  "Initializing CRT overlay .................... DONE",
  "Mounting /dev/neon_grid ..................... DONE",
  "Booting into graphic environment...",
];

export default function BootSequence({ onComplete }: { onComplete: () => void }) {
  const [visibleLines, setVisibleLines] = useState<string[]>([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let currentLine = 0;
    
    const interval = setInterval(() => {
      if (currentLine < BOOT_LINES.length) {
        setVisibleLines(prev => [...prev, BOOT_LINES[currentLine]]);
        currentLine++;
      } else {
        clearInterval(interval);
        setTimeout(() => setDone(true), 1000);
        setTimeout(() => onComplete(), 1500); // Wait for fade out
      }
    }, 200);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 bg-black z-[99999] p-8 transition-opacity duration-500 ${done ? 'opacity-0' : 'opacity-100'}`}>
      <div className="font-body text-xl text-green-400 font-bold whitespace-pre-wrap tracking-wider">
        {visibleLines.map((line, i) => (
          <div key={i}>{line}</div>
        ))}
        {!done && <div className="animate-pulse">_</div>}
      </div>
    </div>
  );
}
