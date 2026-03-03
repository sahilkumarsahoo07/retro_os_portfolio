import React, { useRef, useEffect } from 'react';
import { useOS } from './OSProvider';

interface ContextMenuProps {
    x: number;
    y: number;
    onClose: () => void;
}

export default function ContextMenu({ x, y, onClose }: ContextMenuProps) {
    const menuRef = useRef<HTMLDivElement>(null);
    const { refreshDesktop, arrangeIcons, addDesktopItem } = useOS();

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    const menuItems = [
        { label: 'View', hasSubmenu: true },
        { label: 'Arrange Icons', onClick: () => arrangeIcons() },
        { label: 'Line Up Icons', onClick: () => arrangeIcons() },
        { type: 'separator' },
        { label: 'Refresh', onClick: () => { arrangeIcons(); refreshDesktop(); } },
        { type: 'separator' },
        { label: 'Paste' },
        { label: 'Paste Shortcut', disabled: true },
        { type: 'separator' },
        { label: 'New', hasSubmenu: true, onClick: () => addDesktopItem({ name: 'New Folder', type: 'folder' }) },
        { type: 'separator' },
        { label: 'Properties', bold: true },
    ];

    return (
        <div
            ref={menuRef}
            className="win98-menu"
            style={{ left: x, top: y }}
        >
            <div className="win98-menu-inner">
                {menuItems.map((item, i) => {
                    if (item.type === 'separator') {
                        return <div key={i} className="win98-menu-separator" />;
                    }
                    return (
                        <div
                            key={i}
                            className={`win98-menu-item ${item.disabled ? 'disabled' : ''} ${item.bold ? 'font-bold' : ''}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                if (!item.disabled) {
                                    if (item.onClick) item.onClick();
                                    onClose();
                                }
                            }}
                        >
                            <span>{item.label}</span>
                            {item.hasSubmenu && (
                                <span className="win98-submenu-arrow">
                                    <svg width="4" height="7" viewBox="0 0 4 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M0 0V7L4 3.5L0 0Z" fill="currentColor" />
                                    </svg>
                                </span>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
