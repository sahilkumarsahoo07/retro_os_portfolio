import React, { useState } from 'react';
import { useOS } from './OSProvider';

interface ShutdownDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (action: 'shutdown' | 'restart') => void;
}

export default function ShutdownDialog({ isOpen, onClose, onConfirm }: ShutdownDialogProps) {
  const [action, setAction] = useState<'shutdown' | 'restart'>('shutdown');

  if (!isOpen) return null;

  const handleOk = () => {
    onConfirm(action);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100001] flex items-center justify-center bg-black/20 pointer-events-auto select-none">
      <div className="win98-window shadow-[4px_4px_15px_rgba(0,0,0,0.5)] w-[360px] animate-in fade-in zoom-in-95 duration-100">
        {/* Titlebar */}
        <div className="h-[18px] px-1 py-[2px] m-[2px] bg-[#000080] flex items-center justify-between">
          <span className="text-white text-[11px] font-bold pl-1 truncate">Shut Down Windows</span>
          <button
            className="w-4 h-3.5 bg-[#c0c0c0] border-t border-l border-white border-r border-b border-black flex items-center justify-center active:border-t-black active:border-l-black active:border-b-white active:border-r-white active:pt-0.5 active:pl-0.5"
            onClick={onClose}
          >
            <span className="text-[9px] leading-none font-bold">X</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 bg-[#c0c0c0]">
          <div className="flex items-start gap-4 mb-4">
            {/* Computer Shutdown Icon */}
            <div className="w-10 h-10 shrink-0 flex items-center justify-center">
              <img
                src="https://win98icons.alexmeub.com/icons/png/shut_down_cool-4.png"
                alt="Shutdown"
                className="w-8 h-8 pointer-events-none"
                style={{ imageRendering: 'pixelated' }}
                onError={(e) => {
                  // Fallback icon if image fails to load
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div className="flex-1">
              <p className="text-[12px] font-bold text-black mb-3">What do you want the computer to do?</p>

              <div className="flex flex-col gap-2.5 pl-1 text-[12px] text-black">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="shutdown-action"
                    checked={action === 'shutdown'}
                    onChange={() => setAction('shutdown')}
                    className="accent-[#000080]"
                  />
                  <span>Shut down</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="shutdown-action"
                    checked={action === 'restart'}
                    onChange={() => setAction('restart')}
                    className="accent-[#000080]"
                  />
                  <span>Restart</span>
                </label>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-2 border-t border-[#808080]">
            <button
              autoFocus
              className="win98-button min-w-[75px] h-[23px] text-xs focus:outline focus:outline-1 focus:outline-black active:bg-[#dfdfdf]"
              onClick={handleOk}
            >
              OK
            </button>
            <button
              className="win98-button min-w-[75px] h-[23px] text-xs focus:outline focus:outline-1 focus:outline-black active:bg-[#dfdfdf]"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
