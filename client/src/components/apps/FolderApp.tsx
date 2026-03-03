import React, { useState } from 'react';
import { AppID } from '../os/OSProvider';

// Helper for standard Windows 98 toolbar buttons
const ToolbarButton = ({ icon, label, disabled = false }: { icon: React.ReactNode, label: string, disabled?: boolean }) => (
    <button
        className={`flex flex-col items-center justify-center p-1 min-w-[40px] gap-0.5 border border-transparent 
      ${disabled ? 'opacity-50 grayscale cursor-default' : 'hover:win98-outset active:win98-inset active:p-[3px] active:pr-[5px] active:pb-[1px]'}`}
        disabled={disabled}
    >
        <div className="w-5 h-5 flex items-center justify-center pointer-events-none">
            {icon}
        </div>
        <span className="text-[10px] pointer-events-none">{label}</span>
    </button>
);

export interface FileItem {
    id: string;
    name: string;
    type: 'folder' | 'file';
    iconUrl: string;
    onClick?: () => void;
    onDoubleClick?: () => void;
    size?: string;
    modified?: string;
}

interface FolderAppProps {
    title: string;
    items: FileItem[];
    path?: string;
    iconUrl?: string;
}

export default function FolderApp({ title, items, path, iconUrl }: FolderAppProps) {
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'icon' | 'list'>('icon');

    const currentPath = path || `C:\\Windows\\Desktop\\${title}`;

    // Basic SVG approximations for the standard Win98 toolbar icons
    const icons = {
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

    return (
        <div className="flex flex-col h-full bg-[#c0c0c0] win98-window" onClick={() => setSelectedId(null)}>

            {/* 1. Menu Bar */}
            <div className="flex items-center gap-3 px-1 py-[1px] border-b border-[#dfdfdf] shadow-[0_1px_0_#808080]">
                <div className="flex gap-2 text-xs">
                    <span className="px-1.5 py-0.5 hover:bg-[#000080] hover:text-white cursor-default"><u>F</u>ile</span>
                    <span className="px-1.5 py-0.5 hover:bg-[#000080] hover:text-white cursor-default"><u>E</u>dit</span>
                    <span className="px-1.5 py-0.5 hover:bg-[#000080] hover:text-white cursor-default"><u>V</u>iew</span>
                    <span className="px-1.5 py-0.5 hover:bg-[#000080] hover:text-white cursor-default"><u>G</u>o</span>
                    <span className="px-1.5 py-0.5 hover:bg-[#000080] hover:text-white cursor-default">F<u>a</u>vorites</span>
                    <span className="px-1.5 py-0.5 hover:bg-[#000080] hover:text-white cursor-default"><u>H</u>elp</span>
                </div>
                {iconUrl && (
                    <div className="ml-auto w-5 h-5 flex items-center justify-center border-l border-[#808080] pl-1 relative shrink-0">
                        {/* Small animated windows icon placeholder usually seen in top right */}
                        <div className="w-4 h-4 bg-gray-400 border border-gray-600"></div>
                    </div>
                )}
            </div>

            {/* 2. Standard Toolbar */}
            <div className="flex items-center p-1 border-b border-[#dfdfdf] shadow-[0_1px_0_#808080] gap-1 overflow-x-auto">
                <div className="w-1 h-8 border-l border-[#fff] border-r border-[#808080] mx-0.5 shrink-0" />

                <ToolbarButton icon={icons.back} label="Back" disabled />
                <ToolbarButton icon={icons.forward} label="Forward" disabled />
                <ToolbarButton icon={icons.up} label="Up" />

                <div className="w-1 h-8 border-l border-[#808080] border-r border-[#fff] mx-1 shrink-0 bg-[#dfdfdf]" style={{ boxShadow: 'inset 1px 0 #fff' }} />

                <ToolbarButton icon={icons.cut} label="Cut" disabled />
                <ToolbarButton icon={icons.copy} label="Copy" disabled />
                <ToolbarButton icon={icons.paste} label="Paste" disabled />
                <ToolbarButton icon={icons.undo} label="Undo" disabled />

                <div className="w-1 h-8 border-l border-[#808080] border-r border-[#fff] mx-1 shrink-0 bg-[#dfdfdf]" style={{ boxShadow: 'inset 1px 0 #fff' }} />

                <ToolbarButton icon={icons.delete} label="Delete" disabled />
                <ToolbarButton icon={icons.properties} label="Properties" disabled />

                <div className="w-1 h-8 border-l border-[#808080] border-r border-[#fff] mx-1 shrink-0 bg-[#dfdfdf]" style={{ boxShadow: 'inset 1px 0 #fff' }} />

                <div
                    className="flex flex-col items-center justify-center p-1 min-w-[40px] gap-0.5 hover:win98-outset active:win98-inset border border-transparent cursor-pointer"
                    onClick={() => setViewMode(v => v === 'icon' ? 'list' : 'icon')}
                >
                    <div className="w-5 h-5 flex items-center justify-center pointer-events-none">
                        {icons.views}
                    </div>
                    <span className="text-[10px] pointer-events-none flex items-center">Views <span className="ml-[1px] text-[8px]">▼</span></span>
                </div>
            </div>

            {/* 3. Address Bar */}
            <div className="flex items-center p-1 py-1.5 border-b border-[#dfdfdf] shadow-[0_1px_0_#808080] text-sm">
                <div className="w-1 h-6 border-l border-[#fff] border-r border-[#808080] mx-0.5 shrink-0" />
                <span className="text-gray-600 px-2 select-none">Address</span>
                <div className="flex-1 bg-white border-2 border-t-[#808080] border-l-[#808080] border-b-[#fff] border-r-[#fff] flex items-center px-1">
                    {iconUrl && <img src={iconUrl} alt="" className="w-4 h-4 mr-1 pixelated" />}
                    <span className="truncate flex-1">{currentPath}</span>
                    <div className="w-4 h-4 bg-[#dfdfdf] border border-[#808080] flex items-center justify-center ml-1 shrink-0 shadow-[inset_-1px_-1px_0_#000]">
                        <span className="text-[10px]">▼</span>
                    </div>
                </div>
            </div>

            {/* 4. Main Content Area */}
            <div className="flex-1 bg-white border-2 border-t-[#808080] border-l-[#808080] border-b-[#fff] border-r-[#fff] m-1 overflow-auto p-2">

                {viewMode === 'icon' ? (
                    // Icon View
                    <div className="flex flex-wrap gap-6 content-start">
                        {items.map(item => (
                            <div
                                key={item.id}
                                className="flex flex-col items-center w-20 p-1"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedId(item.id);
                                    item.onClick?.();
                                }}
                                onDoubleClick={(e) => {
                                    e.stopPropagation();
                                    item.onDoubleClick?.();
                                }}
                            >
                                <img
                                    src={item.iconUrl}
                                    alt={item.name}
                                    className={`w-10 h-10 mb-1 pixelated ${selectedId === item.id ? 'brightness-50 sepia-100 hue-rotate-[200deg] saturate-200' : ''}`}
                                />
                                <span className={`text-xs px-1 text-center leading-tight
                  ${selectedId === item.id ? 'bg-[#000080] text-white border border-dotted border-white' : 'text-black'}`}
                                >
                                    {item.name}
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    // List View
                    <div className="flex flex-col w-full text-xs">
                        {items.map(item => (
                            <div
                                key={item.id}
                                className={`flex items-center px-1 py-0.5 cursor-default
                  ${selectedId === item.id ? 'bg-[#000080] text-white' : 'text-black hover:bg-gray-100'}`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedId(item.id);
                                    item.onClick?.();
                                }}
                                onDoubleClick={(e) => {
                                    e.stopPropagation();
                                    item.onDoubleClick?.();
                                }}
                            >
                                <img
                                    src={item.iconUrl}
                                    alt={item.name}
                                    className={`w-4 h-4 mr-2 pixelated ${selectedId === item.id ? 'brightness-75' : ''}`}
                                />
                                <span className="flex-1 truncate">{item.name}</span>
                            </div>
                        ))}
                    </div>
                )}

                {items.length === 0 && (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 select-none">
                        <img
                            src="https://win98icons.alexmeub.com/icons/png/search_file_3-0.png"
                            alt="Empty"
                            className="w-12 h-12 mb-2 opacity-50 pixelated"
                        />
                        <span>This folder is empty.</span>
                    </div>
                )}
            </div>

            {/* 5. Status Bar */}
            <div className="h-6 flex items-center border-t border-[#dfdfdf] shadow-[0_-1px_0_#808080] px-1 gap-1 text-xs shrink-0">
                <div className="flex-1 win98-inset px-2 flex items-center truncate">
                    {items.length} object(s)
                </div>
                <div className="w-1/4 min-w-[100px] win98-inset px-2 flex items-center">
                    {selectedId ? '1 object(s) selected' : '0 bytes'}
                </div>
                <div className="w-1/4 min-w-[100px] win98-inset px-2 flex items-center justify-center">
                    <span className="w-3 h-3 bg-blue-100 border border-blue-400 mr-1 shadow-inner"></span> My Computer
                </div>
            </div>

        </div>
    );
}
