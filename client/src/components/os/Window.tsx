import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useOS, APPS, type WindowState } from './OSProvider';

export default function Window({ windowState }: { windowState: WindowState }) {
  const {
    closeWindow,
    minimizeWindow,
    toggleMaximize,
    focusWindow,
    activeWindowId,
    desktopRef,
    updateWindowSize,
    updateWindowPosition,
  } = useOS();

  const app = APPS[windowState.id];
  const isActive = activeWindowId === windowState.id;
  const isMaximized = windowState.isMaximized;

  const windowRef = useRef<HTMLDivElement>(null);

  // Local state for size
  const [localSize, setLocalSize] = useState({
    width: windowState.width || (app?.defaultWidth || 600),
    height: windowState.height || (app?.defaultHeight || 450)
  });

  const [isResizing, setIsResizing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Refs for dragging to avoid stale closure issues and minimize lag
  const dragStart = useRef({ mouseX: 0, mouseY: 0, windowX: 0, windowY: 0 });

  useEffect(() => {
    if (windowState.width && windowState.height) {
      setLocalSize({ width: windowState.width, height: windowState.height });
    }
  }, [windowState.width, windowState.height]);

  // --- Resize Logic ---
  const handleResizeStart = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    focusWindow(windowState.id);

    (e.target as HTMLElement).setPointerCapture(e.pointerId);

    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = localSize.width;
    const startHeight = localSize.height;

    const onPointerMove = (moveEvent: PointerEvent) => {
      const newWidth = Math.max(300, startWidth + (moveEvent.clientX - startX));
      const newHeight = Math.max(200, startHeight + (moveEvent.clientY - startY));
      setLocalSize({ width: newWidth, height: newHeight });
    };

    const onPointerUp = (upEvent: PointerEvent) => {
      setIsResizing(false);
      updateWindowSize(windowState.id, localSize.width, localSize.height);
      (upEvent.target as HTMLElement).releasePointerCapture(upEvent.pointerId);
      document.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerup', onPointerUp);
    };

    document.addEventListener('pointermove', onPointerMove);
    document.addEventListener('pointerup', onPointerUp);
  };

  // --- Drag Logic ---
  const handleDragStart = (e: React.PointerEvent) => {
    if (isMaximized || isResizing) return;
    if ((e.target as HTMLElement).closest('button')) return;

    setIsDragging(true);
    focusWindow(windowState.id);

    // Use capture on the titlebar to ensure we receive moves even if fast
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);

    dragStart.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      windowX: windowState.x || 0,
      windowY: windowState.y || 0
    };
  };

  const handleDragMove = (e: React.PointerEvent) => {
    if (!isDragging) return;

    const desktop = desktopRef.current;
    if (!desktop) return;

    const desktopRect = desktop.getBoundingClientRect();

    // Use actual element size for clamping, fallback to localSize
    const windowWidth = windowRef.current?.offsetWidth || localSize.width;
    const windowHeight = windowRef.current?.offsetHeight || localSize.height;

    // Delta calculation is much more stable than absolute clientX
    const deltaX = e.clientX - dragStart.current.mouseX;
    const deltaY = e.clientY - dragStart.current.mouseY;

    let newX = dragStart.current.windowX + deltaX;
    let newY = dragStart.current.windowY + deltaY;

    // Strict clamping within desktop boundaries
    newX = Math.max(0, Math.min(newX, desktopRect.width - windowWidth));
    newY = Math.max(0, Math.min(newY, desktopRect.height - windowHeight));

    updateWindowPosition(windowState.id, newX, newY);
  };

  const handleDragEnd = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
  };

  if (!windowState.isOpen || windowState.isMinimized) return null;

  return (
    <motion.div
      ref={windowRef}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{
        opacity: 1,
        scale: 1,
        width: isMaximized ? '100%' : localSize.width,
        height: isMaximized ? '100%' : localSize.height,
        left: isMaximized ? 0 : windowState.x,
        top: isMaximized ? 0 : windowState.y,
        x: 0,
        y: 0
      }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{
        duration: isDragging ? 0 : 0.1,
        width: { duration: 0.15 },
        height: { duration: 0.15 },
        left: { duration: isDragging ? 0 : 0.15 },
        top: { duration: isDragging ? 0 : 0.15 }
      }}
      style={{
        zIndex: windowState.zIndex,
        position: 'absolute',
        pointerEvents: 'auto',
        willChange: isDragging ? 'left, top' : 'auto',
        touchAction: 'none' // Prevent browser gestures during drag
      }}
      className="win98-window shadow-[4px_4px_15px_rgba(0,0,0,0.4)] flex flex-col"
      onPointerDown={() => focusWindow(windowState.id)}
    >
      {/* Titlebar */}
      <div
        className={`h-[18px] px-1 py-[2px] m-[2px] flex items-center justify-between select-none 
          ${isActive ? 'bg-[#000080]' : 'bg-[#808080]'}
          ${isMaximized ? '' : 'cursor-default'}`}
        onPointerDown={handleDragStart}
        onPointerMove={handleDragMove}
        onPointerUp={handleDragEnd}
        onDoubleClick={() => toggleMaximize(windowState.id)}
        style={{ touchAction: 'none' }}
      >
        <div className="flex items-center gap-1 overflow-hidden">
          {app?.iconUrl && <img src={app.iconUrl} alt="" className="w-4 h-4 pixelated flex-shrink-0" />}
          <span className="text-white text-[11px] font-bold truncate leading-tight mt-[1px]">
            {app?.title || 'Unknown App'}
          </span>
        </div>

        <div className="flex items-center gap-[2px] pl-1" onPointerDown={e => e.stopPropagation()}>
          <button
            onClick={() => minimizeWindow(windowState.id)}
            className="win98-button w-[14px] h-[14px] flex items-center justify-center p-0"
            aria-label="Minimize"
          >
            <svg width="6" height="2" viewBox="0 0 6 2" fill="none" xmlns="http://www.w3.org/2000/svg" className="mt-[6px]">
              <rect width="6" height="2" fill="black" />
            </svg>
          </button>

          <button
            onClick={() => toggleMaximize(windowState.id)}
            className="win98-button w-[14px] h-[14px] flex items-center justify-center p-0"
            aria-label={isMaximized ? "Restore" : "Maximize"}
          >
            {isMaximized ? (
              <svg width="8" height="9" viewBox="0 0 8 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 0H8V6H7V7H1V1H2V0Z" fill="#C0C0C0" />
                <path d="M2 0H8V1H2V0Z" fill="black" />
                <path d="M7 1H8V6H7V1Z" fill="black" />
                <path d="M1 3H7V4H1V3Z" fill="black" />
                <path d="M1 3H2V8H1V3Z" fill="black" />
                <path d="M1 8H7V9H1V8Z" fill="black" />
                <path d="M6 4H7V8H6V4Z" fill="black" />
              </svg>
            ) : (
              <svg width="9" height="9" viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 0H9V2H0V0Z" fill="black" />
                <path d="M0 2H1V9H0V2Z" fill="black" />
                <path d="M8 2H9V9H8V2Z" fill="black" />
                <path d="M0 8H9V9H0V8Z" fill="black" />
              </svg>
            )}
          </button>

          <div className="w-[2px]"></div>

          <button
            onClick={(e) => { e.stopPropagation(); closeWindow(windowState.id); }}
            className="win98-button w-[14px] h-[14px] flex items-center justify-center p-0"
            aria-label="Close"
          >
            <svg width="8" height="7" viewBox="0 0 8 7" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 0H2V1H3V2H5V1H6V0H8V1H7V2H6V3H5V4H6V5H7V6H8V7H6V6H5V5H3V6H2V7H0V6H1V5H2V4H3V3H2V2H1V1H0V0Z" fill="black" />
            </svg>
          </button>
        </div>
      </div>

      {/* Menu bar */}
      {windowState.id !== 'terminal' && (
        <div className="bg-[#c0c0c0] px-1 py-0.5 mx-[2px] border-b border-[#dfdfdf] flex gap-2 text-[11px] select-none">
          <span className="cursor-default px-1 hover:bg-[#000080] hover:text-white"><u>F</u>ile</span>
          <span className="cursor-default px-1 hover:bg-[#000080] hover:text-white"><u>E</u>dit</span>
          <span className="cursor-default px-1 hover:bg-[#000080] hover:text-white"><u>V</u>iew</span>
          <span className="cursor-default px-1 hover:bg-[#000080] hover:text-white"><u>H</u>elp</span>
        </div>
      )}

      {/* Content Area */}
      <div className="flex-1 overflow-auto relative cursor-default bg-white border-t-2 border-l-2 border-[#808080] border-r border-b border-white m-[2px]">
        {app?.component && <app.component onClose={() => closeWindow(windowState.id)} />}
      </div>

      {/* Resize Handle */}
      {!isMaximized && (
        <div
          className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize z-50 flex items-end justify-end pointer-events-auto"
          onPointerDown={handleResizeStart}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" className="opacity-40 mb-[1px] mr-[1px]">
            <path d="M9 9H7V7h2v2zm0-4H7V3h2v2zm-4 4H3V7h2v2zm4-8H7V1h2v2z" fill="#000" />
          </svg>
        </div>
      )}
    </motion.div>
  );
}
