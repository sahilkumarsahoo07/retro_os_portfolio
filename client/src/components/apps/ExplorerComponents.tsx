import React from 'react';

// ─── Shared Toolbar Button ────────────────────────────────────────────────────────
export const ToolbarButton = ({ icon, label, disabled = false, onClick }: { icon: React.ReactNode, label: string, disabled?: boolean, onClick?: () => void }) => (
    <button
        className={`flex flex-col items-center justify-center p-1 min-w-[40px] gap-0.5 border border-transparent 
      ${disabled ? 'opacity-50 grayscale cursor-default' : 'hover:win98-outset active:win98-inset active:p-[3px] active:pr-[5px] active:pb-[1px]'}`}
        disabled={disabled}
        onClick={onClick}
    >
        <div className="w-5 h-5 flex items-center justify-center pointer-events-none">
            {icon}
        </div>
        <span className="text-[10px] pointer-events-none">{label}</span>
    </button>
);

// ─── Menu Bar ──────────────────────────────────────────────────────────────────
export const ExplorerMenuBar = ({ iconUrl }: { iconUrl?: string }) => (
    <div className="flex items-center gap-3 px-1 py-[1px] border-b border-[#dfdfdf] shadow-[0_1px_0_#808080] bg-[#c0c0c0] shrink-0">
        <div className="flex gap-2 text-xs">
            <span className="px-1.5 py-0.5 hover:bg-[#000080] hover:text-white cursor-default"><u>F</u>ile</span>
            <span className="px-1.5 py-0.5 hover:bg-[#000080] hover:text-white cursor-default"><u>E</u>dit</span>
            <span className="px-1.5 py-0.5 hover:bg-[#000080] hover:text-white cursor-default"><u>V</u>iew</span>
            <span className="px-1.5 py-0.5 hover:bg-[#000080] hover:text-white cursor-default"><u>G</u>o</span>
            <span className="px-1.5 py-0.5 hover:bg-[#000080] hover:text-white cursor-default">F<u>a</u>vorites</span>
            <span className="px-1.5 py-0.5 hover:bg-[#000080] hover:text-white cursor-default"><u>H</u>elp</span>
        </div>
        {iconUrl && (
            <div className="ml-auto w-5 h-5 flex items-center justify-center pl-1 relative shrink-0">
                <img src={iconUrl} alt="Windows" className="w-4 h-4 pixelated opacity-50" />
            </div>
        )}
    </div>
);

// ─── Toolbar ───────────────────────────────────────────────────────────────────
const Icons = {
    back: <svg width="16" height="16" viewBox="0 0 16 16"><path fill="#000" d="M8 2L2 8l6 6v-3h6V5H8z" /></svg>,
    forward: <svg width="16" height="16" viewBox="0 0 16 16"><path fill="#000" d="M8 2v3H2v6h6v3l6-6-6-6z" /></svg>,
    up: <svg width="16" height="16" viewBox="0 0 16 16"><path fill="#000" d="M8 2l-6 6h3v6h6V8h3z" /></svg>,
    cut: <svg width="16" height="16" viewBox="0 0 16 16"><path fill="none" stroke="#000" strokeWidth="1.5" d="M3 12a2 2 0 100 4 2 2 0 000-4zm10 0a2 2 0 100 4 2 2 0 000-4z" /><path fill="none" stroke="#000" strokeWidth="1.5" d="M5 14l8-10M11 14L3 4" /></svg>,
    copy: <svg width="16" height="16" viewBox="0 0 16 16"><rect x="2" y="2" width="8" height="10" fill="none" stroke="#000" /><rect x="5" y="5" width="8" height="10" fill="none" stroke="#000" strokeDasharray="1 1" /></svg>,
    paste: <svg width="16" height="16" viewBox="0 0 16 16"><rect x="3" y="2" width="10" height="12" fill="#fff" stroke="#000" /><rect x="6" y="1" width="4" height="3" fill="#000" /></svg>,
    undo: <svg width="16" height="16" viewBox="0 0 16 16"><path fill="none" stroke="#000" strokeWidth="1.5" d="M12 12A5 5 0 004 8v1" /><path fill="#000" d="M2 9l2 3 2-3z" /></svg>,
    delete: <svg width="16" height="16" viewBox="0 0 16 16"><path fill="none" stroke="#000" strokeWidth="1.5" d="M3 3l10 10M13 3L3 13" /></svg>,
    properties: <svg width="16" height="16" viewBox="0 0 16 16"><rect x="2" y="4" width="12" height="8" fill="#fff" stroke="#000" /><circle cx="5" cy="8" r="1.5" fill="#000" /></svg>,
    views: <svg width="16" height="16" viewBox="0 0 16 16"><rect x="2" y="2" width="5" height="4" fill="#000" /><rect x="2" y="8" width="5" height="4" fill="#000" /><rect x="9" y="4" width="5" height="6" fill="#000" /></svg>,
};

export const ExplorerToolbar = ({ onViewChange }: { onViewChange?: () => void }) => (
    <div className="flex items-center p-1 border-b border-[#dfdfdf] shadow-[0_1px_0_#808080] gap-1 overflow-x-auto bg-[#c0c0c0] shrink-0">
        <div className="w-1 h-8 border-l border-[#fff] border-r border-[#808080] mx-0.5 shrink-0" />
        <ToolbarButton icon={Icons.back} label="Back" disabled />
        <ToolbarButton icon={Icons.forward} label="Forward" disabled />
        <ToolbarButton icon={Icons.up} label="Up" onClick={() => { }} />
        <div className="w-1 h-8 border-l border-[#808080] border-r border-[#fff] mx-1 shrink-0 bg-[#dfdfdf]" style={{ boxShadow: 'inset 1px 0 #fff' }} />
        <ToolbarButton icon={Icons.cut} label="Cut" disabled />
        <ToolbarButton icon={Icons.copy} label="Copy" disabled />
        <ToolbarButton icon={Icons.paste} label="Paste" disabled />
        <ToolbarButton icon={Icons.undo} label="Undo" disabled />
        <div className="w-1 h-8 border-l border-[#808080] border-r border-[#fff] mx-1 shrink-0 bg-[#dfdfdf]" style={{ boxShadow: 'inset 1px 0 #fff' }} />
        <ToolbarButton icon={Icons.delete} label="Delete" disabled />
        <ToolbarButton icon={Icons.properties} label="Properties" disabled />
        <div className="w-1 h-8 border-l border-[#808080] border-r border-[#fff] mx-1 shrink-0 bg-[#dfdfdf]" style={{ boxShadow: 'inset 1px 0 #fff' }} />
        <div
            className="flex flex-col items-center justify-center p-1 min-w-[40px] gap-0.5 hover:win98-outset active:win98-inset border border-transparent cursor-pointer"
            onClick={onViewChange}
        >
            <div className="w-5 h-5 flex items-center justify-center pointer-events-none">
                {Icons.views}
            </div>
            <span className="text-[10px] pointer-events-none flex items-center">Views <span className="ml-[1px] text-[8px]">▼</span></span>
        </div>
    </div>
);

// ─── Address Bar ───────────────────────────────────────────────────────────────
export const ExplorerAddressBar = ({ path, iconUrl }: { path: string, iconUrl?: string }) => (
    <div className="flex items-center p-1 py-1.5 border-b border-[#dfdfdf] shadow-[0_1px_0_#808080] text-sm bg-[#c0c0c0] shrink-0">
        <div className="w-1 h-6 border-l border-[#fff] border-r border-[#808080] mx-0.5 shrink-0" />
        <span className="text-gray-600 px-2 select-none">Address</span>
        <div className="flex-1 bg-white border-2 border-t-[#808080] border-l-[#808080] border-b-[#fff] border-r-[#fff] flex items-center px-1 h-[22px]">
            {iconUrl && <img src={iconUrl} alt="" className="w-4 h-4 mr-1 pixelated object-contain" />}
            <span className="truncate flex-1 text-black">{path}</span>
            <div className="w-4 h-4 bg-[#dfdfdf] border border-[#808080] flex items-center justify-center ml-1 shrink-0 shadow-[inset_-1px_-1px_0_#000]">
                <span className="text-[10px] text-black">▼</span>
            </div>
        </div>
    </div>
);

// ─── Status Bar ────────────────────────────────────────────────────────────────
export const ExplorerStatusBar = ({ objectCount, bytesCount, contextName }: { objectCount: number, bytesCount: number | string, contextName: string }) => (
    <div className="h-6 flex items-center border-t border-[#dfdfdf] shadow-[0_-1px_0_#808080] px-1 gap-1 text-[11px] select-none bg-[#c0c0c0] shrink-0">
        <div className="flex-1 win98-inset px-2 flex items-center text-black">
            {objectCount} object(s)
        </div>
        <div className="w-[120px] win98-inset px-2 flex items-center text-black">
            {bytesCount} bytes
        </div>
        <div className="flex-1 max-w-[200px] win98-inset px-2 flex items-center text-black">
            {contextName}
        </div>
    </div>
);

// ─── Content Area ──────────────────────────────────────────────────────────────
export interface ExplorerItem {
    id: string;
    name: string;
    iconUrl: string;
    onClick?: () => void;
    onDoubleClick?: () => void;
}

export const ExplorerContent = ({
    items,
    selectedId,
    onSelect
}: {
    items: ExplorerItem[],
    selectedId: string | null,
    onSelect: (id: string) => void
}) => (
    <div className="flex-1 bg-white border-2 border-t-[#808080] border-l-[#808080] border-b-[#fff] border-r-[#fff] m-1 overflow-auto p-2" onClick={() => onSelect?.('')}>
        {items.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500 text-sm italic select-none">
                This folder is empty.
            </div>
        ) : (
            <div className="flex flex-wrap gap-6 content-start">
                {items.map(item => (
                    <div
                        key={item.id}
                        className="flex flex-col items-center w-20 p-1 group"
                        onClick={(e) => {
                            e.stopPropagation();
                            onSelect?.(item.id);
                            item.onClick?.();
                        }}
                        onDoubleClick={(e) => {
                            e.stopPropagation();
                            item.onDoubleClick?.();
                        }}
                    >
                        <div className="relative">
                            <img
                                src={item.iconUrl}
                                alt={item.name}
                                className={`w-10 h-10 mb-1 pixelated ${selectedId === item.id ? 'brightness-50 sepia-100 hue-rotate-[200deg] saturate-200' : ''}`}
                            />
                            {selectedId === item.id && (
                                <div className="absolute inset-0 bg-[#00008033] pointer-events-none" />
                            )}
                        </div>
                        <span className={`text-xs px-1 text-center leading-tight break-words max-w-full
                        ${selectedId === item.id ? 'bg-[#000080] text-white border border-dotted border-white' : 'text-black'}`}
                        >
                            {item.name}
                        </span>
                    </div>
                ))}
            </div>
        )}
    </div>
);
