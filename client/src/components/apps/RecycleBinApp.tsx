import React, { useState, useRef, useEffect } from 'react';
import { useOS, type RecycleBinItem } from '../os/OSProvider';

// ─── Per-item context menu ───────────────────────────────────────────────────
function ItemContextMenu({
    x,
    y,
    selectedItems,
    onClose,
    onRestore,
    onDelete,
}: {
    x: number;
    y: number;
    selectedItems: RecycleBinItem[];
    onClose: () => void;
    onRestore: (ids: string[]) => void;
    onDelete: (items: RecycleBinItem[]) => void;
}) {
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) onClose();
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [onClose]);

    const isMultiple = selectedItems.length > 1;

    return (
        <div
            ref={ref}
            className="win98-menu"
            style={{ left: x, top: y, position: 'fixed', zIndex: 99999 }}
        >
            <div className="win98-menu-inner">
                <div
                    className="win98-menu-item font-bold"
                    onClick={() => { onRestore(selectedItems.map(i => i.id)); onClose(); }}
                >
                    {isMultiple ? `Restore ${selectedItems.length} items` : 'Restore'}
                </div>
                <div
                    className="win98-menu-item"
                    onClick={() => { onDelete(selectedItems); onClose(); }}
                >
                    {isMultiple ? `Delete ${selectedItems.length} items permanently` : 'Delete Permanently'}
                </div>
                <div className="win98-menu-separator" />
                <div className="win98-menu-item disabled">Properties</div>
            </div>
        </div>
    );
}

// ─── Main RecycleBin App ─────────────────────────────────────────────────────
export default function RecycleBinApp({ onClose }: { onClose: () => void }) {
    const { recycleBinItems, restoreFromRecycleBin, permanentlyDelete, emptyRecycleBin, showDeleteConfirm, bulkRestoreFromRecycleBin, bulkPermanentlyDelete } = useOS();

    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [lastSelectedId, setLastSelectedId] = useState<string | null>(null);
    const [contextMenu, setContextMenu] = useState<{
        x: number; y: number; items: RecycleBinItem[];
    } | null>(null);
    const [confirmEmpty, setConfirmEmpty] = useState(false);
    const [bulkDeleteItems, setBulkDeleteItems] = useState<RecycleBinItem[] | null>(null);
    const [fileMenuOpen, setFileMenuOpen] = useState(false);

    const fileMenuRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (!fileMenuOpen) return;
        const handler = (e: MouseEvent) => {
            if (fileMenuRef.current && !fileMenuRef.current.contains(e.target as Node)) {
                setFileMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [fileMenuOpen]);

    // Handle Ctrl+A for Select All and Delete for bulk deletion
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
                e.preventDefault();
                setSelectedIds(recycleBinItems.map(item => item.id));
            } else if (e.key === 'Delete' && selectedIds.length > 0) {
                const itemsToDelete = recycleBinItems.filter(i => selectedIds.includes(i.id));
                setBulkDeleteItems(itemsToDelete);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [recycleBinItems, selectedIds]);

    const formatDate = (ts: number) => {
        const d = new Date(ts);
        return d.toLocaleDateString('en-US', {
            month: '2-digit', day: '2-digit', year: 'numeric',
        }) + ' ' + d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    };

    const handleItemClick = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (e.ctrlKey || e.metaKey) {
            setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
            setLastSelectedId(id);
        } else if (e.shiftKey && lastSelectedId) {
            const currentIndex = recycleBinItems.findIndex(i => i.id === id);
            const lastIndex = recycleBinItems.findIndex(i => i.id === lastSelectedId);
            const start = Math.min(currentIndex, lastIndex);
            const end = Math.max(currentIndex, lastIndex);
            const newSelection = recycleBinItems.slice(start, end + 1).map(i => i.id);
            setSelectedIds(newSelection);
        } else {
            setSelectedIds([id]);
            setLastSelectedId(id);
        }
    };

    return (
        <div className="flex flex-col h-full bg-[#c0c0c0]" onClick={() => setSelectedIds([])}>

            {/* ── File menu bar ─────────────────────────────────────────────── */}
            <div className="relative flex items-center gap-3 px-1 py-[1px] border-b border-[#dfdfdf] shadow-[0_1px_0_#808080] text-[12px] select-none">
                <div ref={fileMenuRef} className="relative">
                    <span
                        className={`px-1.5 py-0.5 cursor-default ${fileMenuOpen ? 'bg-[#000080] text-white' : 'hover:bg-[#000080] hover:text-white'}`}
                        onClick={(e) => { e.stopPropagation(); setFileMenuOpen(v => !v); }}
                    >
                        <u>F</u>ile
                    </span>
                    {fileMenuOpen && (
                        <div
                            className="win98-menu absolute left-0 top-full z-[99999]"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="win98-menu-inner">
                                {selectedIds.length > 0 && (
                                    <>
                                        <div
                                            className="win98-menu-item"
                                            onClick={() => {
                                                bulkRestoreFromRecycleBin(selectedIds);
                                                setFileMenuOpen(false);
                                                setSelectedIds([]);
                                            }}
                                        >
                                            Restore
                                        </div>
                                        <div
                                            className="win98-menu-item"
                                            onClick={() => {
                                                const items = recycleBinItems.filter(i => selectedIds.includes(i.id));
                                                setBulkDeleteItems(items);
                                                setFileMenuOpen(false);
                                            }}
                                        >
                                            Delete
                                        </div>
                                        <div className="win98-menu-separator" />
                                    </>
                                )}
                                <div
                                    className={`win98-menu-item ${recycleBinItems.length === 0 ? 'disabled' : ''}`}
                                    onClick={() => {
                                        if (recycleBinItems.length === 0) return;
                                        setFileMenuOpen(false);
                                        setConfirmEmpty(true);
                                    }}
                                >
                                    Empty Recycle Bin
                                </div>
                                <div className="win98-menu-separator" />
                                <div
                                    className="win98-menu-item"
                                    onClick={() => { setFileMenuOpen(false); onClose(); }}
                                >
                                    Close
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <span className="px-1.5 py-0.5 cursor-default hover:bg-[#000080] hover:text-white disabled opacity-50"><u>E</u>dit</span>
                <span className="px-1.5 py-0.5 cursor-default hover:bg-[#000080] hover:text-white disabled opacity-50"><u>V</u>iew</span>
                <span className="px-1.5 py-0.5 cursor-default hover:bg-[#000080] hover:text-white disabled opacity-50"><u>H</u>elp</span>
            </div>

            {/* ── Main content — list view ───────────────────────────────────── */}
            <div className="flex-1 bg-white border-2 border-t-[#808080] border-l-[#808080] border-b-[#fff] border-r-[#fff] m-1 overflow-auto">

                {recycleBinItems.length === 0 ? (
                    // ── Empty state ──────────────────────────────────────────────
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 select-none gap-2">
                        <img
                            src="https://win98icons.alexmeub.com/icons/png/recycle_bin_empty-4.png"
                            alt="Empty"
                            className="w-16 h-16 opacity-40 pixelated"
                        />
                        <span className="text-[12px]">Recycle Bin is empty.</span>
                    </div>
                ) : (
                    // ── List header + rows ───────────────────────────────────────
                    <table className="w-full text-[11px] border-collapse select-none">
                        <thead>
                            <tr className="bg-[#c0c0c0] border-b border-[#808080]">
                                <th className="text-left px-2 py-0.5 font-normal border-r border-[#808080] w-[200px]">Name</th>
                                <th className="text-left px-2 py-0.5 font-normal border-r border-[#808080] w-[140px]">Original Location</th>
                                <th className="text-left px-2 py-0.5 font-normal border-r border-[#808080] w-[160px]">Date Deleted</th>
                                <th className="text-left px-2 py-0.5 font-normal">Type</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recycleBinItems.map(item => {
                                const isSelected = selectedIds.includes(item.id);
                                return (
                                    <tr
                                        key={item.id}
                                        className={`cursor-default border-b border-[#e0e0e0] ${isSelected ? 'bg-[#000080] text-white' : 'hover:bg-[#d4d4d4] text-black'}`}
                                        onClick={e => handleItemClick(e, item.id)}
                                        onDoubleClick={() => { restoreFromRecycleBin(item.id); }}
                                        onContextMenu={e => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            let newSelected = selectedIds;
                                            if (!selectedIds.includes(item.id)) {
                                                newSelected = [item.id];
                                                setSelectedIds([item.id]);
                                                setLastSelectedId(item.id);
                                            }
                                            const items = recycleBinItems.filter(i => newSelected.includes(i.id));
                                            setContextMenu({ x: e.clientX, y: e.clientY, items });
                                        }}
                                    >
                                        <td className="px-2 py-0.5 flex items-center gap-1.5">
                                            <img
                                                src={item.iconUrl}
                                                alt=""
                                                className="w-4 h-4 pixelated shrink-0"
                                            />
                                            <span className="truncate">{item.name}</span>
                                        </td>
                                        <td className="px-2 py-0.5">{item.originalLocation}</td>
                                        <td className="px-2 py-0.5">{formatDate(item.deletedAt)}</td>
                                        <td className="px-2 py-0.5 capitalize">{item.type}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>

            {/* ── Status bar ────────────────────────────────────────────────── */}
            <div className="h-6 flex items-center border-t border-[#dfdfdf] shadow-[0_-1px_0_#808080] px-1 gap-1 text-[11px] select-none shrink-0">
                <div className="flex-1 win98-inset px-2 flex items-center">
                    {recycleBinItems.length} object{recycleBinItems.length !== 1 ? 's' : ''}
                </div>
                <div className="w-1/3 min-w-[120px] win98-inset px-2 flex items-center">
                    {selectedIds.length > 0 ? `${selectedIds.length} object(s) selected` : ' '}
                </div>
            </div>

            {/* ── Multi-item context menu ──────────────────────────────────────── */}
            {contextMenu && (
                <ItemContextMenu
                    x={contextMenu.x}
                    y={contextMenu.y}
                    selectedItems={contextMenu.items}
                    onClose={() => setContextMenu(null)}
                    onRestore={(ids) => {
                        bulkRestoreFromRecycleBin(ids);
                        setSelectedIds([]);
                    }}
                    onDelete={(items) => {
                        if (items.length === 1) {
                            showDeleteConfirm(items[0], true);
                        } else {
                            setBulkDeleteItems(items);
                        }
                    }}
                />
            )}

            {/* Bulk Delete confirmation */}
            {bulkDeleteItems && (
                <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-transparent pointer-events-auto">
                    <div className="win98-window shadow-[4px_4px_15px_rgba(0,0,0,0.5)] w-[360px]">
                        <div className="h-[18px] px-1 py-[2px] m-[2px] bg-[#000080] flex items-center justify-between select-none">
                            <span className="text-white text-[11px] font-bold pl-1 uppercase whitespace-nowrap">Confirm Multiple File Delete</span>
                            <button className="w-4 h-3.5 bg-[#c0c0c0] border-t border-l border-white border-r border-b border-black flex items-center justify-center" onClick={() => setBulkDeleteItems(null)}>
                                <span className="text-[9px] leading-none font-bold">X</span>
                            </button>
                        </div>
                        <div className="flex items-start gap-4 p-4 bg-[#c0c0c0]">
                            <div className="shrink-0 mt-1">
                                <svg width="32" height="32" viewBox="0 0 32 32">
                                    <polygon points="16,2 30,30 2,30" fill="#FFCC00" stroke="#000" strokeWidth="1.5" />
                                    <rect x="14.5" y="12" width="3" height="10" fill="#000" />
                                    <rect x="14.5" y="24" width="3" height="3" fill="#000" />
                                </svg>
                            </div>
                            <p className="text-[12px] text-black leading-tight py-1">
                                Are you sure you want to delete these {bulkDeleteItems.length} items?
                            </p>
                        </div>
                        <div className="flex justify-end gap-2 p-3 bg-[#c0c0c0]">
                            <button className="win98-button min-w-[75px] h-[23px] text-xs" onClick={() => {
                                bulkPermanentlyDelete(bulkDeleteItems.map(i => i.id));
                                setBulkDeleteItems(null);
                                setSelectedIds([]);
                            }}>Yes</button>
                            <button className="win98-button min-w-[75px] h-[23px] text-xs" onClick={() => setBulkDeleteItems(null)}>No</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Empty Recycle Bin confirmation */}
            {confirmEmpty && (
                <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-transparent pointer-events-auto">
                    <div className="win98-window shadow-[4px_4px_15px_rgba(0,0,0,0.5)] w-[360px]">
                        <div className="h-[18px] px-1 py-[2px] m-[2px] bg-[#000080] flex items-center justify-between select-none">
                            <span className="text-white text-[11px] font-bold pl-1 uppercase whitespace-nowrap">Confirm File Delete</span>
                            <button className="w-4 h-3.5 bg-[#c0c0c0] border-t border-l border-white border-r border-b border-black flex items-center justify-center" onClick={() => setConfirmEmpty(false)}>
                                <span className="text-[9px] leading-none font-bold">X</span>
                            </button>
                        </div>
                        <div className="flex items-start gap-4 p-4 bg-[#c0c0c0]">
                            <div className="shrink-0 mt-1">
                                <svg width="32" height="32" viewBox="0 0 32 32">
                                    <polygon points="16,2 30,30 2,30" fill="#FFCC00" stroke="#000" strokeWidth="1.5" />
                                    <rect x="14.5" y="12" width="3" height="10" fill="#000" />
                                    <rect x="14.5" y="24" width="3" height="3" fill="#000" />
                                </svg>
                            </div>
                            <p className="text-[12px] text-black leading-tight py-1">
                                Are you sure you want to permanently delete all of the items in the Recycle Bin?
                            </p>
                        </div>
                        <div className="flex justify-end gap-2 p-3 bg-[#c0c0c0]">
                            <button className="win98-button min-w-[75px] h-[23px] text-xs" onClick={() => { emptyRecycleBin(); setConfirmEmpty(false); setSelectedIds([]); }}>Yes</button>
                            <button className="win98-button min-w-[75px] h-[23px] text-xs" onClick={() => setConfirmEmpty(false)}>No</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
