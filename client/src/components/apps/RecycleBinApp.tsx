import React, { useState, useRef, useEffect } from 'react';
import { useOS, type RecycleBinItem } from '../os/OSProvider';

// ─── Per-item context menu ───────────────────────────────────────────────────
function ItemContextMenu({
    x,
    y,
    item,
    onClose,
    onRestore,
    onDelete,
}: {
    x: number;
    y: number;
    item: RecycleBinItem;
    onClose: () => void;
    onRestore: () => void;
    onDelete: () => void;
}) {
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) onClose();
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [onClose]);

    return (
        <div
            ref={ref}
            className="win98-menu"
            style={{ left: x, top: y, position: 'fixed', zIndex: 99999 }}
        >
            <div className="win98-menu-inner">
                <div
                    className="win98-menu-item font-bold"
                    onClick={() => { onRestore(); onClose(); }}
                >
                    Restore
                </div>
                <div
                    className="win98-menu-item"
                    onClick={() => { onDelete(); onClose(); }}
                >
                    Delete Permanently
                </div>
                <div className="win98-menu-separator" />
                <div className="win98-menu-item disabled">Properties</div>
            </div>
        </div>
    );
}

// ─── Main RecycleBin App ─────────────────────────────────────────────────────
export default function RecycleBinApp({ onClose }: { onClose: () => void }) {
    const { recycleBinItems, restoreFromRecycleBin, permanentlyDelete, emptyRecycleBin, showDeleteConfirm } = useOS();

    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [contextMenu, setContextMenu] = useState<{
        x: number; y: number; item: RecycleBinItem;
    } | null>(null);
    const [confirmEmpty, setConfirmEmpty] = useState(false);
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

    const formatDate = (ts: number) => {
        const d = new Date(ts);
        return d.toLocaleDateString('en-US', {
            month: '2-digit', day: '2-digit', year: 'numeric',
        }) + ' ' + d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="flex flex-col h-full bg-[#c0c0c0]" onClick={() => setSelectedId(null)}>

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
                                const isSelected = selectedId === item.id;
                                return (
                                    <tr
                                        key={item.id}
                                        className={`cursor-default border-b border-[#e0e0e0] ${isSelected ? 'bg-[#000080] text-white' : 'hover:bg-[#d4d4d4] text-black'}`}
                                        onClick={e => { e.stopPropagation(); setSelectedId(item.id); }}
                                        onDoubleClick={() => { restoreFromRecycleBin(item.id); }}
                                        onContextMenu={e => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            setSelectedId(item.id);
                                            setContextMenu({ x: e.clientX, y: e.clientY, item });
                                        }}
                                    >
                                        <td className="px-2 py-0.5 flex items-center gap-1.5">
                                            <img
                                                src={item.iconUrl}
                                                alt=""
                                                className={`w-4 h-4 pixelated shrink-0 ${isSelected ? '' : ''}`}
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
                    {selectedId ? '1 object(s) selected' : ' '}
                </div>
            </div>

            {/* ── Per-item context menu ──────────────────────────────────────── */}
            {contextMenu && (
                <ItemContextMenu
                    x={contextMenu.x}
                    y={contextMenu.y}
                    item={contextMenu.item}
                    onClose={() => setContextMenu(null)}
                    onRestore={() => restoreFromRecycleBin(contextMenu.item.id)}
                    onDelete={() => showDeleteConfirm(contextMenu.item, true)}
                />
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
                            <button className="win98-button min-w-[75px] h-[23px] text-xs" onClick={() => { emptyRecycleBin(); setConfirmEmpty(false); }}>Yes</button>
                            <button className="win98-button min-w-[75px] h-[23px] text-xs" onClick={() => setConfirmEmpty(false)}>No</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
