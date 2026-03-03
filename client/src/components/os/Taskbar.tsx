import React, { useState, useEffect } from 'react';
import { useOS, APPS } from './OSProvider';
import { Volume2, VolumeX } from 'lucide-react';
import StartMenu from './StartMenu';

export default function Taskbar() {
  const { windows, restoreWindow, focusWindow, activeWindowId, soundEnabled, toggleSound } = useOS();
  const [time, setTime] = useState(new Date());
  const [startOpen, setStartOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const openWindows = windows.filter(w => w.isOpen);

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 h-12 bg-[#1a0b2e] border-t-2 border-primary z-[9999] flex items-center px-1 justify-between shadow-[0_-5px_20px_rgba(255,51,255,0.3)]">
        
        <div className="flex items-center gap-2 h-full py-1">
          {/* Start Button */}
          <button
            onClick={() => setStartOpen(!startOpen)}
            className={`h-full px-4 font-display text-lg tracking-widest border-2 flex items-center gap-2 transition-all
              ${startOpen 
                ? 'bg-primary border-white text-white box-shadow-neon-pink' 
                : 'bg-transparent border-primary text-primary hover:bg-primary/20'}`}
          >
            <span className="text-xl">🚀</span> START
          </button>

          {/* Open Apps */}
          <div className="flex items-center gap-1 overflow-x-auto px-2">
            {openWindows.map(w => {
              const app = APPS[w.id];
              const isActive = activeWindowId === w.id && !w.isMinimized;
              return (
                <button
                  key={w.id}
                  onClick={() => {
                    if (w.isMinimized) restoreWindow(w.id);
                    else focusWindow(w.id);
                  }}
                  className={`h-9 px-3 border-2 flex items-center gap-2 max-w-[150px] truncate transition-all
                    ${isActive 
                      ? 'bg-secondary border-white text-[#1a0b2e] box-shadow-neon-cyan font-bold' 
                      : 'bg-[#090014] border-secondary/50 text-secondary hover:bg-secondary/20'}`}
                >
                  <img src={app.iconUrl} alt="" className="w-4 h-4" />
                  <span className="truncate text-sm font-display">{app.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* System Tray */}
        <div className="flex items-center gap-4 h-full px-4 border-l-2 border-primary/30">
          <button 
            onClick={toggleSound}
            className="text-secondary hover:text-white transition-colors"
          >
            {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>
          <div className="text-primary font-display text-xl tracking-widest text-shadow-neon-pink">
            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>

      {startOpen && <StartMenu onClose={() => setStartOpen(false)} />}
    </>
  );
}
