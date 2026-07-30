import React from 'react';
import { Power } from 'lucide-react';

interface ShutdownScreenProps {
  onPowerOn: () => void;
}

export default function ShutdownScreen({ onPowerOn }: ShutdownScreenProps) {
  return (
    <div
      onClick={onPowerOn}
      className="fixed inset-0 bg-black z-[999999] flex flex-col items-center justify-center cursor-pointer select-none overflow-hidden p-6 font-mono"
    >
      {/* CRT Scanline Effect Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] opacity-40" />

      <div className="relative z-10 flex flex-col items-center text-center max-w-xl animate-in fade-in duration-700">
        {/* Iconic Windows 98 Amber Warning Text */}
        <h1
          className="text-[#ff9900] text-2xl md:text-4xl font-bold tracking-widest leading-relaxed mb-8 uppercase"
          style={{
            fontFamily: '"MS Sans Serif", Tahoma, monospace, sans-serif',
            textShadow: '0 0 10px rgba(255, 153, 0, 0.6), 2px 2px 0px #804000',
          }}
        >
          It is now safe to turn off your computer.
        </h1>

        {/* Interactive Power Button */}
        <div className="mt-8 flex flex-col items-center gap-3 group">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPowerOn();
            }}
            className="w-16 h-16 rounded-full bg-[#111] border-2 border-[#ff9900] flex items-center justify-center text-[#ff9900] shadow-[0_0_15px_rgba(255,153,0,0.4)] group-hover:scale-110 group-hover:bg-[#ff9900] group-hover:text-black transition-all duration-200 cursor-pointer"
            title="Power On"
          >
            <Power size={32} />
          </button>
          <span className="text-[#ff9900]/70 text-xs tracking-wider uppercase group-hover:text-[#ff9900] transition-colors">
            Click to Power On
          </span>
        </div>
      </div>

      <div className="absolute bottom-6 text-[#ff9900]/40 text-xs">
        Press any key or click anywhere to restart
      </div>
    </div>
  );
}
