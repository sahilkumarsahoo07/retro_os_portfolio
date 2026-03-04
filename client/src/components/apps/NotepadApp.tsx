import React, { useState, useEffect } from 'react';
import { useOS, DesktopItem } from '../os/OSProvider';

interface NotepadProps {
    onClose: () => void;
    params?: {
        item: DesktopItem;
    };
}

export default function NotepadApp({ onClose, params }: NotepadProps) {
    const { updateDesktopItem, openWindow } = useOS();
    const [content, setContent] = useState(params?.item?.content || '');
    const [isDirty, setIsDirty] = useState(false);

    useEffect(() => {
        if (params?.item?.content !== undefined) {
            setContent(params.item.content);
        }
    }, [params?.item?.content]);

    const handleSave = () => {
        if (params?.item?.id) {
            updateDesktopItem(params.item.id, { content });
            setIsDirty(false);
        }
    };

    const fileName = params?.item?.name || 'Untitled.txt';

    const menuItems = [
        {
            label: 'File', items: ['New', 'Open', 'Save', 'Save As', 'Exit'], action: (item: string) => {
                if (item === 'Save') handleSave();
                if (item === 'Exit' && onClose) onClose();
            }
        },
        { label: 'Edit', items: ['Undo', 'Cut', 'Copy', 'Paste', 'Delete', 'Select All', 'Time/Date'] },
        { label: 'Search', items: ['Find...', 'Find Next'] },
        { label: 'Help', items: ['Help Topics', 'About Notepad'] }
    ];

    return (
        <div className="flex flex-col h-full bg-[#c0c0c0] font-sans text-[11px] overflow-hidden">
            {/* Menu Bar */}
            <div className="flex gap-4 px-2 py-0.5 border-b border-[#808080] bg-[#c0c0c0] h-6 shrink-0">
                <div className="flex gap-2">
                    <span
                        className="px-1.5 py-0.5 hover:bg-[#000080] hover:text-white cursor-default"
                        onClick={handleSave}
                    ><u>F</u>ile</span>
                    <span className="px-1.5 py-0.5 hover:bg-[#000080] hover:text-white cursor-default"><u>E</u>dit</span>
                    <span className="px-1.5 py-0.5 hover:bg-[#000080] hover:text-white cursor-default"><u>S</u>earch</span>
                    <span className="px-1.5 py-0.5 hover:bg-[#000080] hover:text-white cursor-default"><u>H</u>elp</span>
                </div>
            </div>

            {/* Editor Area */}
            <div className="flex-1 bg-white border-2 border-t-[#808080] border-l-[#808080] border-b-[#fff] border-r-[#fff] m-[1px] relative">
                <textarea
                    value={content}
                    onChange={(e) => {
                        setContent(e.target.value);
                        setIsDirty(true);
                    }}
                    spellCheck={false}
                    className="absolute inset-0 w-full h-full p-1 outline-none resize-none bg-white text-black selection:bg-[#000080] selection:text-white font-mono text-sm custom-scrollbar"
                    style={{ scrollbarWidth: 'thin' }}
                />
            </div>
        </div>
    );
}
