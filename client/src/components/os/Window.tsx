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
    desktopItems,
  } = useOS();

  const windowRef = useRef<HTMLDivElement>(null);
  const app = APPS[windowState.appId];
  const isActive = activeWindowId === windowState.id;
  const isMaximized = windowState.isMaximized;

  // Find origin icon position if this window was just opened
  const getIconPosition = () => {
    const icon = desktopItems.find(item => item.appId === windowState.id);
    if (icon) return { x: icon.x + 40, y: icon.y + 40 }; // Target center of icon
    return { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  };

  const iconPos = getIconPosition();
  const lastTrigger = windowState.lastTrigger || 'open';

  const [localSize, setLocalSize] = useState({
    width: windowState.width || (app?.defaultWidth || 600),
    height: windowState.height || (app?.defaultHeight || 450)
  });

  const [isResizing, setIsResizing] = useState(false);
  // Use a ref instead of state to track dragging — avoids re-render that causes flicker
  const isDraggingRef = useRef(false);

  useEffect(() => {
    if (windowState.width && windowState.height) {
      setLocalSize({ width: windowState.width, height: windowState.height });
    }
  }, [windowState.width, windowState.height]);

  // --- High Precision Direct-DOM Dragging ---
  const handleDragStart = (e: React.PointerEvent) => {
    if (isMaximized || isResizing || (e.target as HTMLElement).closest('button')) return;

    e.preventDefault();
    focusWindow(windowState.id);

    const winEl = windowRef.current;
    if (!winEl) return;

    // ✅ FIX: Immediately pin the element's style position to its CURRENT position
    // This must happen BEFORE we do anything else, so Framer Motion never sees a gap
    const currentLeft = windowState.x ?? 0;
    const currentTop = windowState.y ?? 0;
    winEl.style.left = `${currentLeft}px`;
    winEl.style.top = `${currentTop}px`;

    isDraggingRef.current = true;

    // Capture pointer to ensure we get moves even if cursor leaves window
    winEl.setPointerCapture(e.pointerId);

    const startX = e.clientX;
    const startY = e.clientY;

    const onPointerMove = (moveEvent: PointerEvent) => {
      if (!desktopRef.current || !winEl) return;

      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;

      let newLeft = currentLeft + deltaX;
      let newTop = currentTop + deltaY;

      // Clamping logic
      const desktopRect = desktopRef.current.getBoundingClientRect();
      const winWidth = winEl.offsetWidth;
      const winHeight = winEl.offsetHeight;

      const vpW = desktopRect.width > 0 ? desktopRect.width : window.innerWidth;
      const vpH = desktopRect.height > 0 ? desktopRect.height : window.innerHeight - 28;

      newLeft = Math.max(0, Math.min(newLeft, vpW - winWidth));
      newTop = Math.max(0, Math.min(newTop, vpH - winHeight));

      // DIRECT DOM UPDATE: Bypass React state for 1:1 tracking
      winEl.style.left = `${newLeft}px`;
      winEl.style.top = `${newTop}px`;
    };

    const onPointerUp = (upEvent: PointerEvent) => {
      isDraggingRef.current = false;

      // Sync final position back to global state
      const finalLeft = parseInt(winEl.style.left);
      const finalTop = parseInt(winEl.style.top);
      updateWindowPosition(windowState.id, finalLeft, finalTop);

      try { winEl.releasePointerCapture(upEvent.pointerId); } catch { }
      document.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerup', onPointerUp);
    };

    document.addEventListener('pointermove', onPointerMove);
    document.addEventListener('pointerup', onPointerUp);
  };

  // --- Resize logic ---
  const handleResizeStart = (e: React.PointerEvent, direction: string) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    focusWindow(windowState.id);

    const winEl = windowRef.current;
    if (!winEl || !desktopRef.current) return;

    winEl.setPointerCapture(e.pointerId);

    const desktopRect = desktopRef.current.getBoundingClientRect();
    const startX = e.clientX;
    const startY = e.clientY;

    const startWidth = winEl.offsetWidth;
    const startHeight = winEl.offsetHeight;
    const startLeft = windowState.x ?? 0;
    const startTop = windowState.y ?? 0;

    let animationFrameId: number;

    const onPointerMove = (moveEvent: PointerEvent) => {
      if (!winEl) return;

      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;

      let newWidth = startWidth;
      let newHeight = startHeight;
      let newLeft = startLeft;
      let newTop = startTop;

      const vpW = desktopRect.width > 0 ? desktopRect.width : window.innerWidth;
      const vpH = desktopRect.height > 0 ? desktopRect.height : window.innerHeight - 28;

      // Handle directions with boundary constraints
      if (direction.includes('e')) {
        const maxWidth = vpW - startLeft;
        newWidth = Math.max(300, Math.min(startWidth + deltaX, maxWidth));
      }
      if (direction.includes('w')) {
        const potentialWidth = Math.max(300, startWidth - deltaX);
        const maxPotentialLeft = startLeft + (startWidth - 300);
        newLeft = Math.max(0, Math.min(startLeft + deltaX, maxPotentialLeft));
        newWidth = startWidth + (startLeft - newLeft);
      }
      if (direction.includes('s')) {
        const maxHeight = vpH - startTop;
        newHeight = Math.max(200, Math.min(startHeight + deltaY, maxHeight));
      }
      if (direction.includes('n')) {
        const potentialHeight = Math.max(200, startHeight - deltaY);
        const maxPotentialTop = startTop + (startHeight - 200);
        newTop = Math.max(0, Math.min(startTop + deltaY, maxPotentialTop));
        newHeight = startHeight + (startTop - newTop);
      }

      if (animationFrameId) cancelAnimationFrame(animationFrameId);

      animationFrameId = requestAnimationFrame(() => {
        // Direct DOM Update tied to browser paint
        winEl.style.width = `${newWidth}px`;
        winEl.style.height = `${newHeight}px`;
        winEl.style.left = `${newLeft}px`;
        winEl.style.top = `${newTop}px`;
      });
    };

    const onPointerUp = (upEvent: PointerEvent) => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      setIsResizing(false);

      const finalWidth = winEl.offsetWidth;
      const finalHeight = winEl.offsetHeight;
      const finalLeft = parseInt(winEl.style.left);
      const finalTop = parseInt(winEl.style.top);

      setLocalSize({ width: finalWidth, height: finalHeight });
      updateWindowSize(windowState.id, finalWidth, finalHeight);
      updateWindowPosition(windowState.id, finalLeft, finalTop);

      try { winEl.releasePointerCapture(upEvent.pointerId); } catch { }
      document.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerup', onPointerUp);
    };

    document.addEventListener('pointermove', onPointerMove);
    document.addEventListener('pointerup', onPointerUp);
  };

  if (!windowState.isOpen || windowState.isMinimized) return null;

  const variants = {
    initial: {
      opacity: (lastTrigger === 'load' || lastTrigger === 'refresh') ? 1 : (lastTrigger === 'restore' ? 0.6 : 0),
      scale: (lastTrigger === 'load' || lastTrigger === 'refresh') ? 1 : (lastTrigger === 'restore' ? 0.85 : 0.7),
      x: lastTrigger === 'open' ? (iconPos.x - (windowState.x ?? 0)) : (lastTrigger === 'restore' ? 0 : 0),
      y: lastTrigger === 'open' ? (iconPos.y - (windowState.y ?? 0)) : (lastTrigger === 'restore' ? 100 : 0),
      transition: { duration: 0 }
    },
    animate: {
      opacity: 1,
      scale: 1,
      x: 0,
      y: 0,
      width: isMaximized ? '100%' : localSize.width,
      height: isMaximized ? '100%' : localSize.height,
      left: isMaximized ? 0 : (windowState.x ?? 0),
      top: isMaximized ? 0 : (windowState.y ?? 0),
    },
    exit: {
      opacity: 0,
      scale: lastTrigger === 'minimize' ? 0.8 : 0.85,
      y: lastTrigger === 'minimize' ? 200 : 0,
      transition: { duration: 0.12, ease: "easeIn" }
    }
  };

  return (
    <motion.div
      ref={windowRef}
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{
        duration: 0.15,
        ease: "easeOut",
        width: { duration: isResizing ? 0 : 0.12 },
        height: { duration: isResizing ? 0 : 0.12 },
        left: { duration: 0 },
        top: { duration: 0 },
        x: { duration: 0.15 },
        y: { duration: 0.15 }
      }}
      style={{
        zIndex: windowState.zIndex,
        position: 'absolute',
        pointerEvents: 'auto',
        touchAction: 'none',
        boxSizing: 'border-box'
      }}
      className="win98-window shadow-[4px_4px_15px_rgba(0,0,0,0.4)] flex flex-col"
      onPointerDown={() => focusWindow(windowState.id)}
    >
      {/* Resize Handles - Only visible if not maximized */}
      {!isMaximized && (
        <>
          {/* NS: vertical double-arrow */}
          <div className="absolute top-0 left-4 right-4 h-1.5 z-[60] -mt-[1px] cursor-ns-resize" onPointerDown={e => handleResizeStart(e, 'n')} />
          <div className="absolute bottom-0 left-4 right-4 h-1.5 z-[60] -mb-[1px] cursor-ns-resize" onPointerDown={e => handleResizeStart(e, 's')} />
          {/* EW: horizontal double-arrow */}
          <div className="absolute left-0 top-4 bottom-4 w-1.5 z-[60] -ml-[1px] cursor-ew-resize" onPointerDown={e => handleResizeStart(e, 'w')} />
          <div className="absolute right-0 top-4 bottom-4 w-1.5 z-[60] -mr-[1px] cursor-ew-resize" onPointerDown={e => handleResizeStart(e, 'e')} />

          {/* NW-SE corner */}
          <div className="absolute top-0 left-0 w-4 h-4 z-[70] cursor-nwse-resize" onPointerDown={e => handleResizeStart(e, 'nw')} />
          {/* NE-SW corner */}
          <div className="absolute top-0 right-0 w-4 h-4 z-[70] cursor-nesw-resize" onPointerDown={e => handleResizeStart(e, 'ne')} />
          <div className="absolute bottom-0 left-0 w-4 h-4 z-[70] cursor-nesw-resize" onPointerDown={e => handleResizeStart(e, 'sw')} />
          <div className="absolute bottom-0 right-0 w-4 h-4 z-[70] cursor-nwse-resize" onPointerDown={e => handleResizeStart(e, 'se')} />
        </>
      )}

      {/* Titlebar — 4-way move arrow */}
      <div
        className={`h-[18px] px-1 py-[2px] m-[2px] flex items-center justify-between select-none 
          ${isActive ? 'bg-[#000080]' : 'bg-[#808080]'}
          ${isMaximized ? '' : 'cursor-move'}`}
        onPointerDown={handleDragStart}
        onDoubleClick={() => toggleMaximize(windowState.id)}
      >
        <div className="flex items-center gap-1 overflow-hidden pointer-events-none text-white">
          {app?.iconUrl && <img src={app.iconUrl} alt="" className="w-4 h-4 pixelated flex-shrink-0" />}
          <span className="text-[11px] font-bold truncate leading-tight mt-[1px]">
            {windowState.appId === 'notepad' && windowState.params?.item?.name
              ? `${windowState.params.item.name} - Notepad`
              : windowState.appId === 'folder-explorer' && windowState.params?.item?.name
                ? windowState.params.item.name
                : (app?.title || 'Unknown App')}
          </span>
        </div>

        <div className="flex items-center gap-[2px] pl-1 pr-[2px] relative z-[80]" onPointerDown={e => e.stopPropagation()}>
          <button
            onClick={() => minimizeWindow(windowState.id)}
            className="win98-title-button"
            title="Minimize"
          >
            <svg width="6" height="2" viewBox="0 0 6 2" fill="none" xmlns="http://www.w3.org/2000/svg" className="mt-[7px]">
              <rect width="6" height="2" fill="black" />
            </svg>
          </button>

          <button
            onClick={() => toggleMaximize(windowState.id)}
            className="win98-title-button"
            title={isMaximized ? "Restore" : "Maximize"}
          >
            {isMaximized ? (
              <svg width="9" height="9" viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 0H9V1H2V0Z" fill="black" />
                <path d="M2 1H3V6H2V1Z" fill="black" />
                <path d="M8 1H9V6H8V1Z" fill="black" />
                <path d="M2 5H9V6H2V5Z" fill="black" />
                <path d="M0 3H7V4H0V3Z" fill="black" />
                <path d="M0 4H1V9H0V4Z" fill="black" />
                <path d="M6 4H7V9H6V4Z" fill="black" />
                <path d="M0 8H7V9H0V8Z" fill="black" />
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
            className="win98-title-button"
            title="Close"
          >
            <svg width="8" height="7" viewBox="0 0 8 7" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 0H2V1H3V2H5V1H6V0H8V1H7V2H6V3H5V4H6V5H7V6H8V7H6V6H5V5H3V6H2V7H0V6H1V5H2V4H3V3H2V2H1V1H0V0Z" fill="black" />
            </svg>
          </button>
        </div>
      </div>

      {/* Menu bar */}
      {app?.showMenuBar && (
        <div className="bg-[#c0c0c0] px-1 py-0.5 mx-[2px] border-b border-[#dfdfdf] flex gap-2 text-[11px] select-none">
          <span className="cursor-default px-1 hover:bg-[#000080] hover:text-white"><u>F</u>ile</span>
          <span className="cursor-default px-1 hover:bg-[#000080] hover:text-white"><u>E</u>dit</span>
          <span className="cursor-default px-1 hover:bg-[#000080] hover:text-white"><u>V</u>iew</span>
          <span className="cursor-default px-1 hover:bg-[#000080] hover:text-white"><u>H</u>elp</span>
        </div>
      )}

      {/* Content Area */}
      <div className="flex-1 overflow-auto relative cursor-default bg-white border-t-2 border-l-2 border-[#808080] border-r border-b border-white m-[2px]">
        {app?.component && (
          <app.component
            onClose={() => closeWindow(windowState.id)}
            type={windowState.id}
            params={windowState.params}
          />
        )}
      </div>
    </motion.div>
  );
}