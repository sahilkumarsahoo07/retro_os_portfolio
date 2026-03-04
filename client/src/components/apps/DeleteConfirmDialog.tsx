import React from 'react';
import { useOS } from '../os/OSProvider';

export default function DeleteConfirmDialog() {
    const { deleteConfirm, hideDeleteConfirm, moveToRecycleBin, permanentlyDelete } = useOS();
    const { isOpen, item, isPermanent } = deleteConfirm;

    if (!isOpen || !item) return null;

    const handleConfirm = () => {
        if (isPermanent) {
            permanentlyDelete(item.id);
        } else {
            moveToRecycleBin(item.id);
        }
        hideDeleteConfirm();
    };

    const title = item.type === 'folder' ? 'Confirm Folder Delete' : 'Confirm File Delete';

    // Custom message based on location logic
    const message = isPermanent
        ? `Are you sure you want to permanently delete '${item.name}'?`
        : `Are you sure you want to move '${item.name}' to the Recycle Bin?`;

    return (
        <div className="fixed inset-0 z-[100001] flex items-center justify-center bg-transparent pointer-events-auto">
            <div
                className="win98-window shadow-[4px_4px_15px_rgba(0,0,0,0.5)] w-[360px] animate-in fade-in zoom-in-95 duration-100"
                onKeyDown={(e) => {
                    if (e.key === 'Escape') hideDeleteConfirm();
                    if (e.key === 'Enter') handleConfirm();
                }}
            >
                {/* Titlebar */}
                <div className="h-[18px] px-1 py-[2px] m-[2px] bg-[#000080] flex items-center justify-between select-none">
                    <div className="flex items-center gap-1 overflow-hidden">
                        <span className="text-white text-[11px] font-bold pl-1 truncate whitespace-nowrap">{title}</span>
                    </div>
                    <button
                        className="w-4 h-3.5 bg-[#c0c0c0] border-t border-l border-white border-r border-b border-black flex items-center justify-center active:border-t-black active:border-l-black active:border-b-white active:border-r-white active:pt-0.5 active:pl-0.5"
                        onClick={hideDeleteConfirm}
                    >
                        <span className="text-[9px] leading-none font-bold">X</span>
                    </button>
                </div>

                {/* Body */}
                <div className="flex items-start gap-4 p-4 bg-[#c0c0c0]">
                    {/* Warning Icon SVG */}
                    <div className="shrink-0 mt-1">
                        <svg width="32" height="32" viewBox="0 0 32 32">
                            <polygon points="16,2 30,30 2,30" fill="#FFCC00" stroke="#000" strokeWidth="1.5" />
                            <rect x="14.5" y="12" width="3" height="10" fill="#000" />
                            <rect x="14.5" y="24" width="3" height="3" fill="#000" />
                        </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-[12px] text-black leading-tight break-words py-1">
                            {message}
                        </p>
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-2 p-3 bg-[#c0c0c0]">
                    <button
                        autoFocus
                        className="win98-button min-w-[75px] h-[23px] text-xs focus:outline focus:outline-1 focus:outline-black focus:outline-offset-1 active:bg-[#dfdfdf]"
                        onClick={handleConfirm}
                    >
                        Yes
                    </button>
                    <button
                        className="win98-button min-w-[75px] h-[23px] text-xs focus:outline focus:outline-1 focus:outline-black focus:outline-offset-1 active:bg-[#dfdfdf]"
                        onClick={hideDeleteConfirm}
                    >
                        No
                    </button>
                </div>
            </div>
        </div>
    );
}
