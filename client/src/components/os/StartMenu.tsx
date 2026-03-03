import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOS, APPS, type AppID } from './OSProvider';

export default function StartMenu({ onClose }: { onClose: () => void }) {
  const { openWindow } = useOS();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        // Only close if not clicking the start button
        if (!(event.target as Element).closest('button')?.textContent?.includes('START')) {
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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.2 }}
        className="fixed bottom-12 left-1 w-80 bg-[#1a0b2e]/95 backdrop-blur-xl border-2 border-primary box-shadow-neon-pink z-[10000] flex flex-col overflow-hidden"
      >
        {/* Banner */}
        <div className="bg-gradient-to-r from-primary to-secondary p-4 flex items-center gap-4">
          {/* random vaporwave aesthetic portrait */}
          <img 
            src="https://images.unsplash.com/photo-1614204424926-196a80bf0be8?w=150&h=150&fit=crop" 
            alt="Profile" 
            className="w-16 h-16 rounded-full border-2 border-white box-shadow-neon-cyan object-cover"
          />
          <div>
            <h2 className="font-display text-2xl text-white text-shadow-neon-pink">SYNTH_OS</h2>
            <p className="text-white/80 font-body text-sm tracking-widest">GUEST_USER // ONLINE</p>
          </div>
        </div>

        {/* Menu Items */}
        <div className="py-2 flex flex-col">
          {(Object.keys(APPS) as AppID[]).map((id) => {
            const app = APPS[id];
            return (
              <button
                key={id}
                onClick={() => handleAppClick(id)}
                className="flex items-center gap-4 px-6 py-3 hover:bg-primary/20 text-left transition-colors group"
              >
                <img src={app.iconUrl} alt="" className="w-8 h-8 group-hover:scale-110 transition-transform" />
                <span className="font-display text-lg text-secondary group-hover:text-white tracking-widest">
                  {app.title}
                </span>
              </button>
            );
          })}
        </div>
        
        {/* Footer */}
        <div className="border-t border-primary/30 p-2 bg-[#090014]">
          <button 
            className="flex items-center gap-2 text-muted-foreground hover:text-destructive w-full px-4 py-2 font-display transition-colors"
            onClick={() => window.location.reload()}
          >
            <span className="text-xl">⏻</span> SHUTDOWN
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
