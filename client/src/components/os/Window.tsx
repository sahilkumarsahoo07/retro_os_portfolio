import React from 'react';
import { motion } from 'framer-motion';
import { Minus, Square, X } from 'lucide-react';
import { useOS, APPS, type WindowState } from './OSProvider';

export default function Window({ windowState }: { windowState: WindowState }) {
  const { 
    closeWindow, 
    minimizeWindow, 
    toggleMaximize, 
    focusWindow, 
    activeWindowId,
    desktopRef 
  } = useOS();

  const app = APPS[windowState.id];
  const isActive = activeWindowId === windowState.id;
  const isMaximized = windowState.isMaximized;

  if (!windowState.isOpen || windowState.isMinimized) return null;

  return (
    <motion.div
      drag={!isMaximized}
      dragConstraints={desktopRef}
      dragElastic={0}
      dragMomentum={false}
      onPointerDown={() => focusWindow(windowState.id)}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ 
        scale: 1, 
        opacity: 1,
        width: isMaximized ? '100%' : app.defaultWidth,
        height: isMaximized ? '100%' : app.defaultHeight,
        x: isMaximized ? 0 : undefined,
        y: isMaximized ? 0 : undefined,
      }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ duration: 0.2 }}
      style={{ 
        zIndex: windowState.zIndex,
        position: 'absolute',
        top: isMaximized ? 0 : '10%',
        left: isMaximized ? 0 : '15%',
      }}
      className={`retro-window ${isActive ? 'ring-2 ring-secondary' : 'opacity-90'}`}
    >
      {/* Titlebar */}
      <div 
        className={`retro-titlebar ${isActive ? '' : 'grayscale'}`}
        onDoubleClick={() => toggleMaximize(windowState.id)}
      >
        <div className="flex items-center gap-2">
          <img src={app.iconUrl} alt="icon" className="w-5 h-5 pointer-events-none" />
          <span className="font-display text-white text-sm tracking-widest">{app.title}</span>
        </div>
        
        <div className="flex items-center gap-1" onPointerDown={e => e.stopPropagation()}>
          <button 
            onClick={() => minimizeWindow(windowState.id)}
            className="w-6 h-6 bg-muted hover:bg-primary flex items-center justify-center border border-primary/50 text-white transition-colors"
          >
            <Minus size={14} strokeWidth={3} />
          </button>
          <button 
            onClick={() => toggleMaximize(windowState.id)}
            className="w-6 h-6 bg-muted hover:bg-secondary flex items-center justify-center border border-secondary/50 text-white transition-colors"
          >
            <Square size={12} strokeWidth={3} />
          </button>
          <button 
            onClick={() => closeWindow(windowState.id)}
            className="w-6 h-6 bg-destructive hover:bg-red-400 flex items-center justify-center border border-destructive text-white transition-colors"
          >
            <X size={14} strokeWidth={3} />
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 bg-black/80 text-foreground overflow-hidden relative cursor-default">
        <app.component onClose={() => closeWindow(windowState.id)} />
      </div>
    </motion.div>
  );
}
