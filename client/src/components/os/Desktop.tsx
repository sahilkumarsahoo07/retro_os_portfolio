import React, { useState, useRef, useCallback } from 'react';
import { useOS, type DesktopItem } from './OSProvider';
import Window from './Window';
import { AnimatePresence } from 'framer-motion';
import ContextMenu from './ContextMenu';

// Grid cell dimensions - matches Win98 icon size
const CELL_W = 90;
const CELL_H = 90;
const GRID_PADDING = 8;

/** Convert pixel coords → nearest grid cell {col, row} */
function pixelToCell(x: number, y: number): { col: number; row: number } {
  return {
    col: Math.round((x - GRID_PADDING) / CELL_W),
    row: Math.round((y - GRID_PADDING) / CELL_H),
  };
}

/** Convert grid cell → top-left pixel coords */
function cellToPixel(col: number, row: number): { x: number; y: number } {
  return {
    x: GRID_PADDING + col * CELL_W,
    y: GRID_PADDING + row * CELL_H,
  };
}

/** Find the nearest free cell, spiraling outward from the target */
function findFreeCell(
  targetCol: number,
  targetRow: number,
  occupiedCells: Set<string>,
  maxCols: number,
  maxRows: number
): { col: number; row: number } {
  for (let radius = 0; radius <= Math.max(maxCols, maxRows); radius++) {
    for (let dc = -radius; dc <= radius; dc++) {
      for (let dr = -radius; dr <= radius; dr++) {
        if (Math.abs(dc) !== radius && Math.abs(dr) !== radius) continue;
        const col = targetCol + dc;
        const row = targetRow + dr;
        if (col < 0 || row < 0 || col >= maxCols || row >= maxRows) continue;
        const key = `${col},${row}`;
        if (!occupiedCells.has(key)) return { col, row };
      }
    }
  }
  return { col: targetCol, row: targetRow };
}

export default function Desktop() {
  const {
    windows,
    desktopRef,
    openWindow,
    desktopItems,
    updateDesktopItem,
  } = useOS();

  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; targetItemId?: string | null } | null>(null);
  const [selection, setSelection] = useState<{
    startX: number; startY: number; endX: number; endY: number;
  } | null>(null);
  const isSelecting = useRef(false);
  const lastClickTime = useRef<{ [id: string]: number }>({});

  const handleRename = (id: string, newName: string) => {
    if (newName.trim()) {
      updateDesktopItem(id, { name: newName, isRenaming: false });
    } else {
      updateDesktopItem(id, { isRenaming: false });
    }
  };

  // ── Lasso selection ──────────────────────────────────────────────────────
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0 || e.target !== desktopRef.current) return;

    // Save any active renames
    desktopItems.forEach(item => {
      if (item.isRenaming) {
        updateDesktopItem(item.id, { isRenaming: false });
      }
    });

    setSelectedItems([]);
    isSelecting.current = true;
    const rect = desktopRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setSelection({ startX: x, startY: y, endX: x, endY: y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isSelecting.current || !selection) return;
    const rect = desktopRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setSelection(prev => prev ? { ...prev, endX: x, endY: y } : null);
    const left = Math.min(selection.startX, x);
    const top = Math.min(selection.startY, y);
    const right = Math.max(selection.startX, x);
    const bottom = Math.max(selection.startY, y);
    setSelectedItems(
      desktopItems
        .filter(item => {
          const cx = item.x + 40;
          const cy = item.y + 30;
          return cx >= left && cx <= right && cy >= top && cy <= bottom;
        })
        .map(i => i.id)
    );
  };

  const handleMouseUp = () => {
    isSelecting.current = false;
    setSelection(null);
  };

  // ── Grid-snapped drag with displacement ─────────────────────────────────
  const handleIconDragStart = useCallback((
    e: React.PointerEvent,
    draggedItem: DesktopItem,
    iconEl: HTMLElement
  ) => {
    e.preventDefault();
    e.stopPropagation();
    iconEl.setPointerCapture(e.pointerId);

    const startMouseX = e.clientX;
    const startMouseY = e.clientY;
    const initialX = draggedItem.x;
    const initialY = draggedItem.y;

    // Ghost follow cursor directly (no snap during drag for responsiveness)
    const onPointerMove = (ev: PointerEvent) => {
      const desktopRect = desktopRef.current?.getBoundingClientRect();
      if (!desktopRect) return;
      const newX = Math.max(0, Math.min(initialX + ev.clientX - startMouseX, desktopRect.width - CELL_W));
      const newY = Math.max(0, Math.min(initialY + ev.clientY - startMouseY, desktopRect.height - CELL_H));
      iconEl.style.left = `${newX}px`;
      iconEl.style.top = `${newY}px`;
    };

    const onPointerUp = (ev: PointerEvent) => {
      const desktopRect = desktopRef.current?.getBoundingClientRect();
      if (!desktopRect) {
        document.removeEventListener('pointermove', onPointerMove);
        document.removeEventListener('pointerup', onPointerUp);
        return;
      }

      const dropX = parseInt(iconEl.style.left, 10);
      const dropY = parseInt(iconEl.style.top, 10);

      const maxCols = Math.floor((desktopRect.width - GRID_PADDING) / CELL_W);
      const maxRows = Math.floor((desktopRect.height - GRID_PADDING) / CELL_H);

      // Snap drop position to nearest grid cell
      const { col: targetCol, row: targetRow } = pixelToCell(dropX, dropY);
      const clampedCol = Math.max(0, Math.min(targetCol, maxCols - 1));
      const clampedRow = Math.max(0, Math.min(targetRow, maxRows - 1));

      // Build occupied cell map (excluding the dragged item itself)
      const occupiedCells = new Set<string>();
      const itemAtTarget: DesktopItem | undefined = desktopItems.find(item => {
        if (item.id === draggedItem.id) return false;
        const { col, row } = pixelToCell(item.x, item.y);
        return col === clampedCol && row === clampedRow;
      });

      desktopItems.forEach(item => {
        if (item.id === draggedItem.id) return;
        if (itemAtTarget && item.id === itemAtTarget.id) return; // will be displaced
        const { col, row } = pixelToCell(item.x, item.y);
        occupiedCells.add(`${col},${row}`);
      });

      // Place dragged item at the snapped target cell
      const snappedPos = cellToPixel(clampedCol, clampedRow);
      iconEl.style.left = `${snappedPos.x}px`;
      iconEl.style.top = `${snappedPos.y}px`;
      updateDesktopItem(draggedItem.id, { x: snappedPos.x, y: snappedPos.y });

      // If another icon was at that cell, find it the nearest free spot
      if (itemAtTarget) {
        occupiedCells.add(`${clampedCol},${clampedRow}`); // now taken by dragged item
        const { col: freeCol, row: freeRow } = findFreeCell(
          clampedCol, clampedRow, occupiedCells, maxCols, maxRows
        );
        const freePos = cellToPixel(freeCol, freeRow);
        updateDesktopItem(itemAtTarget.id, { x: freePos.x, y: freePos.y });
      }

      try { iconEl.releasePointerCapture(ev.pointerId); } catch { }
      document.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerup', onPointerUp);
    };

    document.addEventListener('pointermove', onPointerMove);
    document.addEventListener('pointerup', onPointerUp);
  }, [desktopRef, desktopItems, updateDesktopItem]);

  return (
    <div
      ref={desktopRef}
      className="flex-1 relative w-full overflow-hidden bg-[#008080]"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onContextMenu={(e) => {
        e.preventDefault();
        setContextMenu({ x: e.clientX, y: e.clientY, targetItemId: null });
      }}
    >
      {/* Lasso selection rect */}
      {selection && (
        <div
          className="win98-selection-rect"
          style={{
            position: 'absolute',
            left: Math.min(selection.startX, selection.endX),
            top: Math.min(selection.startY, selection.endY),
            width: Math.abs(selection.startX - selection.endX),
            height: Math.abs(selection.startY - selection.endY),
            zIndex: 5,
          }}
        />
      )}

      {/* Desktop Icons */}
      <div className="absolute inset-0 select-none z-10 pointer-events-none">
        {desktopItems.map((item) => {
          const isSelected = selectedItems.includes(item.id);
          const isRenaming = item.isRenaming;

          return (
            <div
              key={item.id}
              style={{
                position: 'absolute',
                left: item.x,
                top: item.y,
                width: CELL_W - 10,
                touchAction: 'none',
                // Smooth slide when displaced by another icon
                transition: isRenaming ? 'none' : 'left 0.15s ease, top 0.15s ease',
              }}
              className="flex flex-col items-center cursor-default pointer-events-auto"
              onPointerDown={(e) => {
                if (e.button !== 0 || isRenaming) return;
                // Disable transition during active drag so it tracks cursor precisely
                (e.currentTarget as HTMLElement).style.transition = 'none';
                handleIconDragStart(e, item, e.currentTarget as HTMLElement);
              }}
              onContextMenu={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setSelectedItems([item.id]);
                setContextMenu({ x: e.clientX, y: e.clientY, targetItemId: item.id });
              }}
              onClick={(e) => {
                e.stopPropagation();

                const now = Date.now();
                const lastClick = lastClickTime.current[item.id] || 0;
                const delta = now - lastClick;

                if (isSelected && delta > 500 && delta < 2000 && !isRenaming) {
                  updateDesktopItem(item.id, { isRenaming: true });
                } else {
                  setSelectedItems(prev =>
                    e.ctrlKey
                      ? prev.includes(item.id) ? prev.filter(i => i !== item.id) : [...prev, item.id]
                      : [item.id]
                  );
                }

                lastClickTime.current[item.id] = now;
                setContextMenu(null);
              }}
              onDoubleClick={(e) => {
                e.stopPropagation();
                if (isRenaming) return;
                if (item.appId) openWindow(item.appId);
              }}
            >
              <div className={`w-12 h-12 flex items-center justify-center mb-1 ${isSelected ? 'opacity-70' : ''}`}>
                <img
                  src={item.iconUrl}
                  alt={item.name}
                  draggable={false}
                  className={`w-10 h-10 pointer-events-none pixelated ${isSelected ? 'brightness-50 sepia-100 hue-rotate-[200deg] saturate-200' : ''}`}
                />
              </div>

              {isRenaming ? (
                <input
                  autoFocus
                  className="win98-rename-input"
                  defaultValue={item.name}
                  onFocus={(e) => {
                    const val = e.target.value;
                    const dotIndex = val.lastIndexOf('.');
                    e.target.setSelectionRange(0, dotIndex > 0 ? dotIndex : val.length);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleRename(item.id, e.currentTarget.value);
                    } else if (e.key === 'Escape') {
                      updateDesktopItem(item.id, { isRenaming: false });
                    }
                  }}
                  onBlur={(e) => {
                    handleRename(item.id, e.target.value);
                  }}
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <span className={`win98-icon-label ${isSelected ? 'win98-icon-label-selected' : ''}`}>
                  {item.name}
                </span>
              )}
            </div>
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
          targetItemId={contextMenu.targetItemId}
          onClose={() => setContextMenu(null)}
        />
      )}
    </div>
  );
}