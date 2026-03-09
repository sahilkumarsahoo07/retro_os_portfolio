import React, { useState, useRef, useCallback, startTransition } from 'react';
import {
  useOS,
  type DesktopItem,
  type AppID,
  LARGE_CELL_W,
  LARGE_CELL_H,
  SMALL_CELL_W,
  SMALL_CELL_H,
  GRID_PADDING
} from './OSProvider';
import Window from './Window';
import { AnimatePresence } from 'framer-motion';
import ContextMenu from './ContextMenu';
import Win98Dialog from './Win98Dialog';
import DeleteConfirmDialog from '../apps/DeleteConfirmDialog';

export default function Desktop() {
  const {
    windows,
    desktopRef,
    openWindow,
    desktopItems,
    updateDesktopItem,
    recycleRef,
    recycleBinHovered,
    setRecycleBinHovered,
    dropOnRecycleBin,
    bulkMoveToRecycleBin,
    recycleBinItems,
    systemDialog,
    closeSystemDialog,
    desktopIconSize,
  } = useOS();

  const CELL_W = desktopIconSize === 'small' ? SMALL_CELL_W : LARGE_CELL_W;
  const CELL_H = desktopIconSize === 'small' ? SMALL_CELL_H : LARGE_CELL_H;

  const pixelToCell = useCallback((x: number, y: number): { col: number; row: number } => {
    return {
      col: Math.round((x - GRID_PADDING) / CELL_W),
      row: Math.round((y - GRID_PADDING) / CELL_H),
    };
  }, [CELL_W, CELL_H]);

  const cellToPixel = useCallback((col: number, row: number): { x: number; y: number } => {
    return {
      x: GRID_PADDING + col * CELL_W,
      y: GRID_PADDING + row * CELL_H,
    };
  }, [CELL_W, CELL_H]);

  const findFreeCell = useCallback((
    targetCol: number,
    targetRow: number,
    occupiedCells: Set<string>,
    maxCols: number,
    maxRows: number
  ): { col: number; row: number } => {
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
  }, []);

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

  // ── Keyboard Shortcuts (Delete) ───────────────────────────────────────────
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle delete if it's the Delete key and items are selected
      if (e.key === 'Delete' && selectedItems.length > 0) {
        // Find if any selected items are non-system
        const deletableIds = desktopItems
          .filter(i => selectedItems.includes(i.id) && !(i.isSystem && i.appId))
          .map(i => i.id);

        if (deletableIds.length > 0) {
          bulkMoveToRecycleBin(deletableIds);
          setSelectedItems([]);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedItems, desktopItems, bulkMoveToRecycleBin]);

  // ── Grid-snapped drag with recycle bin hit-test ───────────────────────────
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

    const isOverRecycleBin = (clientX: number, clientY: number) => {
      if (!recycleRef?.current) return false;
      const rect = recycleRef.current.getBoundingClientRect();
      return clientX >= rect.left && clientX <= rect.right &&
        clientY >= rect.top && clientY <= rect.bottom;
    };

    const onPointerMove = (ev: PointerEvent) => {
      const desktopRect = desktopRef.current?.getBoundingClientRect();
      if (!desktopRect) return;
      const newX = Math.max(0, Math.min(initialX + ev.clientX - startMouseX, desktopRect.width - CELL_W));
      const newY = Math.max(0, Math.min(initialY + ev.clientY - startMouseY, desktopRect.height - CELL_H));
      iconEl.style.left = `${newX}px`;
      iconEl.style.top = `${newY}px`;

      // Highlight recycle bin when hovering over it (skip if this IS the recycle bin)
      if (draggedItem.appId !== 'recycle-bin') {
        setRecycleBinHovered(isOverRecycleBin(ev.clientX, ev.clientY));
      }
    };

    const onPointerUp = (ev: PointerEvent) => {
      setRecycleBinHovered(false);
      document.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerup', onPointerUp);

      // ── Drop on recycle bin ──────────────────────────────────────────────
      if (draggedItem.appId !== 'recycle-bin' && isOverRecycleBin(ev.clientX, ev.clientY)) {
        // Reset DOM styles immediately. If item is deleted it unmounts,
        // if it stays (protected), it smoothly animates back to original location.
        iconEl.style.left = `${initialX}px`;
        iconEl.style.top = `${initialY}px`;
        iconEl.style.transition = 'left 0.15s ease, top 0.15s ease';

        dropOnRecycleBin(draggedItem.id);
        try { iconEl.releasePointerCapture(ev.pointerId); } catch { }
        return;
      }

      // ── Drop on desktop — snap to grid ───────────────────────────────────
      const desktopRect = desktopRef.current?.getBoundingClientRect();
      if (!desktopRect) return;

      const dropX = parseInt(iconEl.style.left, 10);
      const dropY = parseInt(iconEl.style.top, 10);

      const maxCols = Math.floor((desktopRect.width - GRID_PADDING) / CELL_W);
      const maxRows = Math.floor((desktopRect.height - GRID_PADDING) / CELL_H);

      const { col: targetCol, row: targetRow } = pixelToCell(dropX, dropY);
      const clampedCol = Math.max(0, Math.min(targetCol, maxCols - 1));
      const clampedRow = Math.max(0, Math.min(targetRow, maxRows - 1));

      const occupiedCells = new Set<string>();
      const itemAtTarget = desktopItems.find(item => {
        if (item.id === draggedItem.id) return false;
        const { col, row } = pixelToCell(item.x, item.y);
        return col === clampedCol && row === clampedRow;
      });

      desktopItems.forEach(item => {
        if (item.id === draggedItem.id) return;
        if (itemAtTarget && item.id === itemAtTarget.id) return;
        const { col, row } = pixelToCell(item.x, item.y);
        occupiedCells.add(`${col},${row}`);
      });

      const snappedPos = cellToPixel(clampedCol, clampedRow);
      iconEl.style.left = `${snappedPos.x}px`;
      iconEl.style.top = `${snappedPos.y}px`;
      updateDesktopItem(draggedItem.id, { x: snappedPos.x, y: snappedPos.y });

      if (itemAtTarget) {
        occupiedCells.add(`${clampedCol},${clampedRow}`);
        const { col: freeCol, row: freeRow } = findFreeCell(clampedCol, clampedRow, occupiedCells, maxCols, maxRows);
        const freePos = cellToPixel(freeCol, freeRow);
        updateDesktopItem(itemAtTarget.id, { x: freePos.x, y: freePos.y });
      }

      iconEl.style.transition = 'left 0.15s ease, top 0.15s ease';
      try { iconEl.releasePointerCapture(ev.pointerId); } catch { }
    };

    document.addEventListener('pointermove', onPointerMove);
    document.addEventListener('pointerup', onPointerUp);
  }, [desktopRef, desktopItems, updateDesktopItem, recycleRef, setRecycleBinHovered, dropOnRecycleBin]);

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

      {/* ── Desktop Icons — z-10, pointer-events inside ─────────────────── */}
      <div className="absolute inset-0 select-none z-10 pointer-events-none">
        {desktopItems.map((item) => {
          const isSelected = selectedItems.includes(item.id);
          const isRenaming = item.isRenaming;
          const isRecycleBin = item.appId === 'recycle-bin';

          return (
            <div
              key={item.id}
              // Attach shared recycleRef to the recycle bin icon
              ref={isRecycleBin ? (node) => {
                (recycleRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
              } : undefined}
              style={{
                position: 'absolute',
                left: item.x,
                top: item.y,
                width: CELL_W - 10,
                touchAction: 'none',
                transition: isRenaming ? 'none' : 'left 0.15s ease, top 0.15s ease',
              }}
              className={`flex flex-col items-center cursor-default pointer-events-auto
                ${isRecycleBin && recycleBinHovered ? 'drop-shadow-[0_0_6px_rgba(255,255,0,0.9)]' : ''}
              `}
              onPointerDown={(e) => {
                if (e.button !== 0 || isRenaming) return;
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

                // If it has a specific appId, open that
                if (item.appId) {
                  startTransition(() => {
                    openWindow(item.appId as AppID);
                  });
                  return;
                }

                // If it's a .txt file, open in Notepad
                if (item.name.toLowerCase().endsWith('.txt')) {
                  startTransition(() => {
                    openWindow('notepad', { item }, item.id);
                  });
                  return;
                }

                // If it's a folder, open in Explorer
                if (item.type === 'folder') {
                  startTransition(() => {
                    openWindow('folder-explorer', { item }, item.id);
                  });
                  return;
                }
              }}
            >
              <div className={`flex items-center justify-center mb-1 transition-transform duration-100
                ${desktopIconSize === 'small' ? 'w-10 h-10' : 'w-12 h-12'}
                ${isRecycleBin && recycleBinHovered ? 'scale-110' : ''}
                ${isSelected ? 'opacity-70' : ''}
              `}>
                <img
                  src={
                    isRecycleBin
                      ? (recycleBinItems.length > 0
                        ? 'https://win98icons.alexmeub.com/icons/png/recycle_bin_full-4.png'
                        : 'https://win98icons.alexmeub.com/icons/png/recycle_bin_empty-4.png')
                      : (item.name.toLowerCase().endsWith('.txt')
                        ? 'https://win98icons.alexmeub.com/icons/png/notepad_file-0.png'
                        : (item.type === 'folder'
                          ? 'https://win98icons.alexmeub.com/icons/png/directory_closed-4.png'
                          : item.iconUrl))
                  }
                  alt={item.name}
                  draggable={false}
                  className={`pointer-events-none pixelated
                    ${desktopIconSize === 'small' ? 'w-8 h-8' : 'w-10 h-10'}
                    ${isSelected ? 'brightness-50 sepia-100 hue-rotate-[200deg] saturate-200' : ''}
                  `}
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
                    if (e.key === 'Enter') handleRename(item.id, e.currentTarget.value);
                    else if (e.key === 'Escape') updateDesktopItem(item.id, { isRenaming: false });
                  }}
                  onBlur={(e) => handleRename(item.id, e.target.value)}
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

      {/* ── Windows — rendered DIRECTLY in desktopRef, no wrapper div ──────
           This is the key fix: Window uses desktopRef.getBoundingClientRect()
           for position math. If windows live in a child div instead of directly
           inside desktopRef, even a 1px border/padding difference causes offset. */}
      <AnimatePresence>
        {windows.filter(w => w.isOpen && !w.isMinimized).map(w => (
          <Window key={w.id} windowState={w} />
        ))}
      </AnimatePresence>

      {/* Context Menu */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          targetItemId={contextMenu.targetItemId}
          onClose={() => setContextMenu(null)}
        />
      )}

      {/* System Error Dialog */}
      {systemDialog && (
        <Win98Dialog
          title={systemDialog.title}
          message={systemDialog.message}
          iconType={systemDialog.iconType}
          onClose={closeSystemDialog}
        />
      )}

      {/* Custom Delete Confirmation Dialog */}
      <DeleteConfirmDialog />
    </div>
  );
}