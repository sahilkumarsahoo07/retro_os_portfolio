import React from 'react';

export type DialogIconType = 'error' | 'warning' | 'info';

interface Win98DialogProps {
    title: string;
    message: string;
    iconType?: DialogIconType;
    onClose: () => void;
}

export default function Win98Dialog({ title, message, iconType = 'error', onClose }: Win98DialogProps) {
    let iconSvg = null;

    if (iconType === 'error') {
        iconSvg = (
            <svg width="32" height="32" viewBox="0 0 32 32" className="shrink-0 mt-0.5">
                <circle cx="16" cy="16" r="14" fill="#FF0000" stroke="#000" strokeWidth="1.5" />
                <line x1="10" y1="10" x2="22" y2="22" stroke="#FFF" strokeWidth="4" strokeLinecap="square" />
                <line x1="22" y1="10" x2="10" y2="22" stroke="#FFF" strokeWidth="4" strokeLinecap="square" />
            </svg>
        );
    } else if (iconType === 'warning') {
        iconSvg = (
            <svg width="32" height="32" viewBox="0 0 32 32" className="shrink-0 mt-0.5">
                <polygon points="16,2 30,30 2,30" fill="#FFCC00" stroke="#000" strokeWidth="1.5" />
                <rect x="14.5" y="12" width="3" height="10" fill="#000" />
                <rect x="14.5" y="24" width="3" height="3" fill="#000" />
            </svg>
        );
    } else if (iconType === 'info') {
        iconSvg = (
            <svg width="32" height="32" viewBox="0 0 32 32" className="shrink-0 mt-0.5">
                <circle cx="16" cy="16" r="14" fill="#FFF" stroke="#000" strokeWidth="1.5" />
                <circle cx="16" cy="16" r="12" fill="#000080" />
                <rect x="14.5" y="14" width="3" height="8" fill="#FFF" />
                <rect x="14.5" y="8" width="3" height="3" fill="#FFF" />
            </svg>
        );
    }

    return (
        <div className="fixed inset-0 z-[100000] flex items-center justify-center bg-transparent">
            <div className="win98-window shadow-[4px_4px_15px_rgba(0,0,0,0.5)] w-[320px] active:scale-[0.99] transition-transform duration-75">
                {/* Titlebar */}
                <div className="h-[18px] px-1 py-[2px] m-[2px] bg-[#000080] flex items-center justify-between select-none">
                    <span className="text-white text-[11px] font-bold pl-1">{title}</span>
                    <button
                        className="w-4 h-3.5 bg-[#c0c0c0] border-t border-l border-white border-r border-b border-black flex items-center justify-center active:border-t-black active:border-l-black active:border-b-white active:border-r-white active:pt-0.5 active:pl-0.5"
                        onClick={onClose}
                    >
                        <span className="text-[9px] leading-none font-bold">X</span>
                    </button>
                </div>

                {/* Body */}
                <div className="flex items-start gap-4 p-5 bg-[#c0c0c0]">
                    {iconSvg}
                    <p className="text-[12px] text-black leading-relaxed mt-1 whitespace-pre-line">{message}</p>
                </div>

                {/* Buttons */}
                <div className="flex justify-center gap-2 pb-5 bg-[#c0c0c0]">
                    <button
                        autoFocus
                        className="win98-button min-w-[75px] text-[12px] focus:outline focus:outline-1 focus:outline-black focus:outline-offset-1"
                        onClick={onClose}
                    >
                        OK
                    </button>
                </div>
            </div>
        </div>
    );
}
