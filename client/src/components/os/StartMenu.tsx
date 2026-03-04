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
        className="fixed bottom-[28px] left-0 z-[10000] flex bg-[#c0c0c0] win98-outset p-[2px] shadow-[2px_2px_4px_rgba(0,0,0,0.3)]"

      >
        {/* Vertical Banner */}
        <div className="w-[28px] bg-gradient-to-t from-[#000080] to-[#1084d0] flex items-end justify-center py-2 shrink-0">
          <span
            className="text-white font-bold text-[18px] leading-none tracking-widest pointer-events-none select-none"
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
        <div className="flex flex-col py-[2px] pl-[1px] min-w-[180px]">
          {(['my-computer', 'about', 'contact', 'terminal'] as AppID[]).map((id) => {
            const app = APPS[id];
            if (!app) return null; // Safety check in case an ID is invalid

            return (
              <button
                key={id}
                onClick={() => handleAppClick(id)}
                className="flex items-center gap-3 px-3 py-[6px] hover:bg-[#000080] hover:text-white text-black w-full text-left outline-none pr-8 cursor-pointer"
              >
                <img src={app.iconUrl} alt="" className="w-8 h-8 pointer-events-none" style={{ imageRendering: 'pixelated' }} />
                <span className="text-sm font-bold truncate leading-none mt-1">{app.title}</span>
              </button>
            );
          })}

          <div className="flex-1" />

          {/* Separator - Thin line with highlight and shadow */}
          <div className="h-[2px] border-t border-[#808080] border-b border-white mx-1 my-[2px]" />

          <button
            className="flex items-center gap-3 px-3 py-[6px] hover:bg-[#000080] hover:text-white text-black w-full text-left outline-none pr-8 cursor-pointer"
            onClick={() => window.location.reload()}
          >
            <div className="w-8 h-8 flex items-center justify-center shrink-0">
              <Power size={24} className="stroke-current" />
            </div>
            <span className="text-sm font-bold truncate leading-none mt-1">Shut Down...</span>
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
