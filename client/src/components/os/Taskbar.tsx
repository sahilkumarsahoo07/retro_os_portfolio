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
      <div
        className="w-full h-[28px] z-[9999] flex items-center px-[2px] justify-between bg-[#c0c0c0] border-t border-white shrink-0"
      >

        <div className="flex items-center gap-1 h-full py-[1px]">
          {/* Start Button */}
          <button
            onClick={() => setStartOpen(!startOpen)}
            className={`h-[22px] px-1.5 flex items-center gap-1 transition-none
              ${startOpen ? 'win98-inset' : 'win98-button'}`}
          >
            <img src="https://api.iconify.design/logos/microsoft-windows.svg?width=16" alt="" className="w-4 h-4" style={{ imageRendering: 'pixelated' }} />
            <span className="font-bold text-xs">Start</span>
          </button>

          {/* Vertical Separator */}
          <div className="w-[2px] h-[20px] bg-gray-500 border-r border-white mx-1" />

          {/* Open Apps */}
          <div className="flex items-center gap-[4px] h-full overflow-x-hidden ml-1">
            {openWindows.map(w => {
              const app = APPS[w.appId];
              const isActive = activeWindowId === w.id && !w.isMinimized;
              const title = w.appId === 'notepad' && w.params?.item?.name
                ? `${w.params.item.name} - Notepad`
                : w.appId === 'folder-explorer' && w.params?.item?.name
                  ? w.params.item.name
                  : (app?.title || 'Unknown App');

              return (
                <button
                  key={w.id}
                  onClick={() => {
                    if (w.isMinimized) restoreWindow(w.id);
                    else focusWindow(w.id);
                  }}
                  className={`h-[22px] px-2 flex items-center gap-1 min-w-[100px] max-w-[160px] truncate transition-none
                    ${isActive ? 'win98-inset font-bold bg-[#dfdfdf]' : 'win98-button'}`}
                >
                  <img src={app?.iconUrl} alt="" className="w-4 h-4 pixelated" />
                  <span className="truncate text-xs">{title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* System Tray */}
        <div className="flex items-center gap-2 h-[22px] px-2 mr-1 win98-inset bg-[#c0c0c0]">
          <button
            onClick={toggleSound}
            className="hover:opacity-70 transition-none scale-75"
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>
          <div className="text-xs whitespace-nowrap font-bold text-black">
            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>

      {startOpen && <StartMenu onClose={() => setStartOpen(false)} />}
    </>
  );
}
