import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOS, APPS, type AppID } from './OSProvider';
import { Power } from 'lucide-react';

export default function StartMenu({ onClose }: { onClose: () => void }) {
  const { openWindow } = useOS();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        if (!(event.target as Element).closest('button')?.textContent?.toLowerCase().includes('start')) {
          onClose();
        }
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleAppClick = (id: AppID) => {
    openWindow(id);
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        ref={menuRef}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        transition={{ duration: 0.1 }}
        className="fixed bottom-[28px] left-0 z-[10000] flex overflow-hidden w-64 bg-[#c0c0c0] win98-window"
      >
        {/* Vertical Banner */}
        <div className="w-8 bg-gradient-to-t from-[#000080] to-[#1084d0] flex items-end justify-center py-2">
          <span
            className="text-white font-bold text-xl select-none"
            style={{
              writingMode: 'vertical-rl',
              transform: 'rotate(180deg)',
              textShadow: '1px 1px #000'
            }}
          >
            Windows<span className="font-normal opacity-80"> 98</span>
          </span>
        </div>

        {/* Menu Items */}
        <div className="flex-1 flex flex-col py-1">
          <div className="flex flex-col border-b border-[#808080] mb-1">
            {(Object.keys(APPS) as AppID[]).map((id) => {
              const app = APPS[id];
              return (
                <button
                  key={id}
                  onClick={() => handleAppClick(id)}
                  className="flex items-center gap-3 px-3 py-1.5 hover:bg-[#000080] hover:text-white group transition-none text-left"
                >
                  <img src={app.iconUrl} alt="" className="w-8 h-8 pointer-events-none" style={{ imageRendering: 'pixelated' }} />
                  <span className="text-sm font-bold">{app.title}</span>
                </button>
              );
            })}
          </div>

          <button
            className="flex items-center gap-3 px-3 py-2 hover:bg-[#000080] hover:text-white group transition-none text-left"
            onClick={() => window.location.reload()}
          >
            <div className="w-8 h-8 flex items-center justify-center">
              <Power size={20} />
            </div>
            <span className="text-sm font-bold">Shut Down...</span>
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
