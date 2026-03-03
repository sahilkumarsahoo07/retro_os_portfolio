import React, { useState, useRef, useEffect } from 'react';
import { useOS, APPS, type AppID, type DesktopItem } from './OSProvider';
import Window from './Window';
import { AnimatePresence, motion } from 'framer-motion';
import ContextMenu from './ContextMenu';

export default function Desktop() {
  const {
    windows,
    desktopRef,
    openWindow,
    desktopItems,
    updateDesktopItem,
    refreshDesktop
  } = useOS();

  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number } | null>(null);

  // Selection Lasso State
  const [selection, setSelection] = useState<{ startX: number, startY: number, endX: number, endY: number } | null>(null);
  const isSelecting = useRef(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left click
    if (e.target !== desktopRef.current) return;

    setSelectedItems([]);
    isSelecting.current = true;
    const rect = desktopRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setSelection({ startX: x, startY: y, endX: x, endY: y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isSelecting.current || !selection) return;

    const rect = desktopRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setSelection(prev => prev ? { ...prev, endX: x, endY: y } : null);

    // Calculate selection rectangle
    const left = Math.min(selection.startX, x);
    const top = Math.min(selection.startY, y);
    const right = Math.max(selection.startX, x);
    const bottom = Math.max(selection.startY, y);

    // Find items within rect
    const newlySelected = desktopItems.filter(item => {
      const itemX = item.x + 40; // centered-ish check
      const itemY = item.y + 30;
      return itemX >= left && itemX <= right && itemY >= top && itemY <= bottom;
    }).map(item => item.id);

    setSelectedItems(newlySelected);
  };

  const handleMouseUp = () => {
    isSelecting.current = false;
    setSelection(null);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const closeContextMenu = () => setContextMenu(null);

  return (
    <div
      ref={desktopRef}
      className="relative w-full h-[calc(100vh-28px)] overflow-hidden bg-[#008080]"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onContextMenu={handleContextMenu}
    >
      {/* Selection Rect */}
      {selection && (
        <div
          className="win98-selection-rect"
          style={{
            left: Math.min(selection.startX, selection.endX),
            top: Math.min(selection.startY, selection.endY),
            width: Math.abs(selection.startX - selection.endX),
            height: Math.abs(selection.startY - selection.endY),
          }}
        />
      )}

      {/* Desktop Icons */}
      <div className="absolute inset-0 p-4 select-none z-10 pointer-events-none">
        {desktopItems.map((item) => {
          const isSelected = selectedItems.includes(item.id);

          return (
            <motion.div
              key={item.id}
              drag
              dragMomentum={false}
              dragElastic={0}
              onDragEnd={(_, info) => {
                updateDesktopItem(item.id, { x: item.x + info.offset.x, y: item.y + info.offset.y });
              }}
              onClick={(e) => {
                e.stopPropagation();
                if (e.ctrlKey) {
                  setSelectedItems(prev => prev.includes(item.id) ? prev.filter(i => i !== item.id) : [...prev, item.id]);
                } else {
                  setSelectedItems([item.id]);
                }
                closeContextMenu();
              }}
              onDoubleClick={(e) => {
                e.stopPropagation();
                if (item.appId) openWindow(item.appId);
              }}
              className="absolute w-20 flex flex-col items-center cursor-default pointer-events-auto group"
              style={{ left: item.x, top: item.y, x: 0, y: 0 }}
            >
              <div
                className={`w-12 h-12 flex items-center justify-center mb-1 transition-none
                  ${isSelected ? 'opacity-70' : ''}`}
              >
                <img
                  src={item.iconUrl}
                  alt={item.name}
                  className={`w-10 h-10 pointer-events-none transition-none pixelated
                    ${isSelected ? 'brightness-50 sepia-100 hue-rotate-[200deg] saturate-200' : ''}`}
                />
              </div>
              <span className={`win98-icon-label ${isSelected ? 'win98-icon-label-selected' : ''}`}>
                {item.name}
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* Windows Layer */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        <AnimatePresence>
          {windows.filter(w => w.isOpen && !w.isMinimized).map(w => (
            <Window key={w.id} windowState={w} />
          ))}
        </AnimatePresence>
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={closeContextMenu}
        />
      )}

    </div>
  );
}
