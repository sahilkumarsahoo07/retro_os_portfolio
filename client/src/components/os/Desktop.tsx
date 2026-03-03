import React from 'react';
import { useOS, APPS, type AppID } from './OSProvider';
import Window from './Window';
import { AnimatePresence } from 'framer-motion';

export default function Desktop() {
  const { windows, desktopRef, openWindow } = useOS();

  return (
    <div ref={desktopRef} className="relative w-full h-[calc(100vh-3rem)] overflow-hidden">
      
      {/* Vaporwave Background Elements */}
      <div className="synthwave-bg absolute inset-0 -z-10" />
      <div className="synthwave-sun absolute -z-10" />
      <div className="synthwave-grid absolute -z-10" />

      {/* Desktop Icons */}
      <div className="p-6 flex flex-col gap-6 flex-wrap h-full content-start">
        {(Object.keys(APPS) as AppID[]).map((id) => {
          const app = APPS[id];
          return (
            <div 
              key={id}
              onDoubleClick={() => openWindow(id)}
              className="flex flex-col items-center gap-2 w-24 cursor-pointer group"
            >
              <div className="w-14 h-14 bg-black/40 border border-transparent group-hover:border-secondary group-hover:bg-primary/20 flex items-center justify-center backdrop-blur-sm transition-all shadow-lg">
                <img src={app.iconUrl} alt={app.title} className="w-8 h-8 group-hover:scale-110 transition-transform" />
              </div>
              <span className="bg-black/60 px-1 text-center font-body text-white text-sm tracking-wider border border-transparent group-hover:border-primary group-hover:text-primary transition-colors">
                {app.title}
              </span>
            </div>
          );
        })}
      </div>

      {/* Windows */}
      <AnimatePresence>
        {windows.map(w => (
          <Window key={w.id} windowState={w} />
        ))}
      </AnimatePresence>
      
    </div>
  );
}
