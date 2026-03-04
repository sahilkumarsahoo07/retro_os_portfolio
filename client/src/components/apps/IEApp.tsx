import React, { useState } from 'react';

// ─── Shared Toolbar Button ────────────────────────────────────────────────────────
const ToolbarButton = ({ icon, label, disabled = false, onClick }: { icon: React.ReactNode, label: string, disabled?: boolean, onClick?: () => void }) => (
    <button
        className={`flex flex-col items-center justify-center p-1 min-w-[36px] gap-0.5 border border-transparent 
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
const IEMenuBar = () => (
    <div className="flex items-center gap-3 px-1 py-[1px] border-b border-[#dfdfdf] shadow-[0_1px_0_#808080] bg-[#c0c0c0] shrink-0">
        <div className="flex gap-2 text-xs">
            <span className="px-1.5 py-0.5 hover:bg-[#000080] hover:text-white cursor-default"><u>F</u>ile</span>
            <span className="px-1.5 py-0.5 hover:bg-[#000080] hover:text-white cursor-default"><u>E</u>dit</span>
            <span className="px-1.5 py-0.5 hover:bg-[#000080] hover:text-white cursor-default"><u>V</u>iew</span>
            <span className="px-1.5 py-0.5 hover:bg-[#000080] hover:text-white cursor-default">F<u>a</u>vorites</span>
            <span className="px-1.5 py-0.5 hover:bg-[#000080] hover:text-white cursor-default"><u>T</u>ools</span>
            <span className="px-1.5 py-0.5 hover:bg-[#000080] hover:text-white cursor-default"><u>H</u>elp</span>
        </div>
        <div className="ml-auto w-5 h-5 flex items-center justify-center pl-1 relative shrink-0">
            <img src="https://win98icons.alexmeub.com/icons/png/msie1-2.png" alt="IE" className="w-4 h-4 pixelated" />
        </div>
    </div>
);

// ─── Toolbar ───────────────────────────────────────────────────────────────────
const Icons = {
    back: <svg width="16" height="16" viewBox="0 0 16 16"><path fill="#000" d="M8 2L2 8l6 6v-3h6V5H8z" /></svg>,
    forward: <svg width="16" height="16" viewBox="0 0 16 16"><path fill="#000" d="M8 2v3H2v6h6v3l6-6-6-6z" /></svg>,
    stop: <svg width="16" height="16" viewBox="0 0 16 16"><circle cx="8" cy="8" r="6" fill="#f00" stroke="#000" /><path stroke="#fff" strokeWidth="2" d="M5 5l6 6M11 5l-6 6" /></svg>,
    refresh: <svg width="16" height="16" viewBox="0 0 16 16"><path fill="none" stroke="#000" strokeWidth="1.5" d="M12 6A5 5 0 004 8M4 10a5 5 0 008-2" /><path fill="#000" d="M11 3v4h-4zM5 13V9h4z" /></svg>,
    home: <svg width="16" height="16" viewBox="0 0 16 16"><path fill="#000" d="M8 2l-6 6h2v6h3v-4h2v4h3V8h2z" /></svg>,
    search: <svg width="16" height="16" viewBox="0 0 16 16"><circle cx="6" cy="6" r="4" fill="none" stroke="#000" strokeWidth="1.5" /><path stroke="#000" strokeWidth="2" d="M9 9l5 5" /></svg>,
    favorites: <svg width="16" height="16" viewBox="0 0 16 16"><path fill="#ffcc00" stroke="#000" strokeWidth="1" d="M8 1l2 4 5 1-4 3 1 5-4-2-4 2 1-5-4-3 5-1z" /></svg>,
    history: <svg width="16" height="16" viewBox="0 0 16 16"><circle cx="8" cy="8" r="6" fill="none" stroke="#000" strokeWidth="1.5" /><path stroke="#000" strokeWidth="1.5" d="M8 4v4h3" /></svg>,
    print: <svg width="16" height="16" viewBox="0 0 16 16"><rect x="3" y="2" width="10" height="4" fill="#fff" stroke="#000" /><rect x="2" y="6" width="12" height="6" fill="#ccc" stroke="#000" /><rect x="4" y="9" width="8" height="5" fill="#fff" stroke="#000" /></svg>,
};

const IEToolbar = ({ onRefresh }: { onRefresh: () => void }) => (
    <div className="flex items-center p-1 border-b border-[#dfdfdf] shadow-[0_1px_0_#808080] gap-1 overflow-x-auto bg-[#c0c0c0] shrink-0">
        <div className="w-1 h-8 border-l border-[#fff] border-r border-[#808080] mx-0.5 shrink-0" />
        <ToolbarButton icon={Icons.back} label="Back" disabled />
        <ToolbarButton icon={Icons.forward} label="Forward" disabled />
        <ToolbarButton icon={Icons.stop} label="Stop" disabled />
        <ToolbarButton icon={Icons.refresh} label="Refresh" onClick={onRefresh} />
        <ToolbarButton icon={Icons.home} label="Home" disabled />
        <div className="w-1 h-8 border-l border-[#808080] border-r border-[#fff] mx-1 shrink-0 bg-[#dfdfdf]" style={{ boxShadow: 'inset 1px 0 #fff' }} />
        <ToolbarButton icon={Icons.search} label="Search" disabled />
        <ToolbarButton icon={Icons.favorites} label="Favorites" disabled />
        <ToolbarButton icon={Icons.history} label="History" disabled />
        <div className="w-1 h-8 border-l border-[#808080] border-r border-[#fff] mx-1 shrink-0 bg-[#dfdfdf]" style={{ boxShadow: 'inset 1px 0 #fff' }} />
        <ToolbarButton icon={Icons.print} label="Print" disabled />
    </div>
);

// ─── Main Internet Explorer App ────────────────────────────────────────────────
export default function IEApp() {
    const [url, setUrl] = useState('https://web.archive.org/web/19990117032727/http://www.google.com/');
    const [inputValue, setInputValue] = useState(url);
    const [refreshKey, setRefreshKey] = useState(0); // changing key forces iframe reload

    const handleNavigate = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            let targetUrl = inputValue.trim();
            if (!/^https?:\/\//i.test(targetUrl)) {
                targetUrl = `https://${targetUrl}`; // auto prepend https
                setInputValue(targetUrl);
            }
            setUrl(targetUrl);
        }
    };

    const handleRefresh = () => {
        setRefreshKey(prev => prev + 1);
    };

    return (
        <div className="flex flex-col h-full bg-[#c0c0c0] outline-none">
            <IEMenuBar />
            <IEToolbar onRefresh={handleRefresh} />

            {/* Address Bar */}
            <div className="flex items-center p-1 py-1.5 border-b border-[#dfdfdf] shadow-[0_1px_0_#808080] text-sm bg-[#c0c0c0] shrink-0">
                <div className="w-1 h-6 border-l border-[#fff] border-r border-[#808080] mx-0.5 shrink-0" />
                <span className="text-gray-600 px-2 select-none">Address</span>
                <div className="flex-1 bg-white border-2 border-t-[#808080] border-l-[#808080] border-b-[#fff] border-r-[#fff] flex items-center h-[24px]">
                    <img src="https://win98icons.alexmeub.com/icons/png/msie1-2.png" alt="" className="w-4 h-4 ml-1 mr-2 opacity-50 pixelated object-contain shrink-0" />
                    <input
                        type="text"
                        value={inputValue}
                        onChange={e => setInputValue(e.target.value)}
                        onKeyDown={handleNavigate}
                        className="flex-1 text-black outline-none border-none bg-transparent font-sans"
                        spellCheck={false}
                    />
                    <div className="w-4 h-full bg-[#dfdfdf] border-l border-[#dfdfdf] flex items-center justify-center shrink-0 hover:bg-[#c0c0c0] cursor-default">
                        <span className="text-[10px] text-black pt-[1px] font-bold">▼</span>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 bg-white border-t-2 border-l-2 border-[#808080] border-b border-r border-[#fff] relative overflow-hidden">
                <iframe
                    key={refreshKey}
                    src={url}
                    className="w-full h-full border-none outline-none"
                    sandbox="allow-same-origin allow-scripts allow-forms"
                    title="Internet Explorer Content"
                />
            </div>

            {/* Status Bar */}
            <div className="h-5 flex items-center border-t border-[#dfdfdf] shadow-[0_-1px_0_#808080] px-1 gap-1 text-[11px] select-none bg-[#c0c0c0] shrink-0">
                <div className="flex-1 win98-inset px-2 flex items-center text-black">
                    Done
                </div>
                <div className="w-[150px] win98-inset px-2 flex items-center justify-between text-black">
                    <span>Internet</span>
                    <img src="https://win98icons.alexmeub.com/icons/png/network_normal_two_pcs-2.png" alt="" className="w-3 h-3 pixelated" />
                </div>
            </div>
        </div>
    );
}
