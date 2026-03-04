import React, { useRef, useEffect, useState } from 'react';
import { useOS, AppID } from './OSProvider';

interface ContextMenuProps {
    x: number;
    y: number;
    targetItemId?: string | null;
    onClose: () => void;
}

interface MenuItem {
    label?: string;
    onClick?: () => void;
    hasSubmenu?: boolean;
    submenuItems?: MenuItem[];
    disabled?: boolean;
    bold?: boolean;
    type?: 'separator';
}

export default function ContextMenu({ x, y, targetItemId, onClose }: ContextMenuProps) {
    const menuRef = useRef<HTMLDivElement>(null);
    const { refreshDesktop, arrangeIcons, addDesktopItem, deleteDesktopItem, updateDesktopItem, openWindow, desktopItems, moveToRecycleBin, recycleBinItems, emptyRecycleBin, showSystemDialog, showDeleteConfirm } = useOS();
    const [activeSubmenu, setActiveSubmenu] = useState<number | null>(null);
    const submenuTimer = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    const handleNewFolder = () => {
        const id = addDesktopItem({
            name: 'New Folder',
            type: 'folder',
            x: x,
            y: y,
            isRenaming: true
        });
        onClose();
    };

    const handleNewTextFile = () => {
        addDesktopItem({
            name: 'New Text Document.txt',
            type: 'file',
            x: x,
            y: y,
            isRenaming: true
        });
        onClose();
    };

    const desktopMenuItems: MenuItem[] = [
        { label: 'View', hasSubmenu: true, disabled: true },
        { label: 'Arrange Icons', onClick: () => arrangeIcons() },
        { label: 'Line Up Icons', onClick: () => arrangeIcons() },
        { type: 'separator' },
        { label: 'Refresh', onClick: () => { arrangeIcons(); refreshDesktop(); } },
        { type: 'separator' },
        { label: 'Paste', disabled: true },
        { label: 'Paste Shortcut', disabled: true },
        { type: 'separator' },
        {
            label: 'New',
            hasSubmenu: true,
            submenuItems: [
                { label: 'Folder', onClick: handleNewFolder },
                { label: 'Shortcut', disabled: true },
                { type: 'separator' },
                { label: 'Text Document', onClick: handleNewTextFile },
                { label: 'Bitmap Image', disabled: true },
            ]
        },
        { type: 'separator' },
        { label: 'Properties', bold: true, disabled: true },
    ];

    const targetItem = desktopItems.find(i => i.id === targetItemId);
    const isRecycleBin = targetItem?.appId === 'recycle-bin';

    const iconMenuItems: MenuItem[] = [
        {
            label: 'Open',
            bold: true,
            onClick: () => {
                const { startTransition } = React;
                if (targetItem?.appId) {
                    startTransition(() => {
                        openWindow(targetItem.appId as AppID);
                    });
                } else if (targetItem?.name.toLowerCase().endsWith('.txt')) {
                    startTransition(() => {
                        openWindow('notepad', { item: targetItem }, targetItem.id);
                    });
                } else if (targetItem?.type === 'folder') {
                    startTransition(() => {
                        openWindow('folder-explorer', { item: targetItem }, targetItem.id);
                    });
                }
                onClose();
            }
        },
        { label: 'Explore', disabled: true },
        { label: 'Find...', disabled: true },
        { type: 'separator' },
        { label: 'Send To', hasSubmenu: true, disabled: true },
        { type: 'separator' },
        { label: 'Cut', disabled: true },
        { label: 'Copy', disabled: true },
        { type: 'separator' },
        { label: 'Create Shortcut', disabled: true },
        ...(!isRecycleBin ? [
            {
                label: 'Delete', onClick: () => {
                    if (targetItemId && targetItem) {
                        if (targetItem.isSystem) {
                            showSystemDialog("Error", "You cannot delete this system icon.", "error");
                        } else {
                            // Using standard browser confirm for simplicity of logic flow here, 
                            // though showSystemDialog exists, it doesn't currently support callbacks in its state.
                            showDeleteConfirm(targetItem);
                        }
                    }
                    onClose();
                }
            } as MenuItem,
            { label: 'Rename', onClick: () => { if (targetItemId) updateDesktopItem(targetItemId, { isRenaming: true }); onClose(); } } as MenuItem,
        ] : [
            { label: 'Empty Recycle Bin', disabled: recycleBinItems.length === 0, onClick: () => { emptyRecycleBin(); onClose(); } } as MenuItem,
        ]),
        { type: 'separator' },
        { label: 'Properties', disabled: true },
    ];

    const menuItems = targetItemId ? iconMenuItems : desktopMenuItems;

    const handleMouseEnter = (index: number) => {
        if (submenuTimer.current) clearTimeout(submenuTimer.current);
        setActiveSubmenu(index);
    };

    const handleMouseLeave = () => {
        submenuTimer.current = setTimeout(() => {
            setActiveSubmenu(null);
        }, 300);
    };

    return (
        <div
            ref={menuRef}
            className="win98-menu"
            style={{ left: x, top: y, position: 'fixed', zIndex: 9999 }}
            onMouseLeave={handleMouseLeave}
        >
            <div className="win98-menu-inner">
                {menuItems.map((item, i) => {
                    if (item.type === 'separator') {
                        return <div key={i} className="win98-menu-separator" />;
                    }
                    const isActive = activeSubmenu === i;
                    return (
                        <div
                            key={i}
                            className={`win98-menu-item ${item.disabled ? 'disabled' : ''} ${item.bold ? 'font-bold' : ''} ${isActive && item.hasSubmenu ? 'active' : ''}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                if (!item.disabled && item.onClick) {
                                    item.onClick();
                                }
                            }}
                            onMouseEnter={() => handleMouseEnter(i)}
                        >
                            <span>{item.label}</span>
                            {item.hasSubmenu && (
                                <span className="win98-submenu-arrow">
                                    <svg width="4" height="7" viewBox="0 0 4 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M0 0V7L4 3.5L0 0Z" fill="currentColor" />
                                    </svg>
                                </span>
                            )}
                            {item.hasSubmenu && item.submenuItems && isActive && (
                                <div className="win98-menu win98-submenu" style={{ left: '100%', top: -2 }}>
                                    <div className="win98-menu-inner">
                                        {item.submenuItems.map((subItem, si) => {
                                            if (subItem.type === 'separator') {
                                                return <div key={si} className="win98-menu-separator" />;
                                            }
                                            return (
                                                <div
                                                    key={si}
                                                    className={`win98-menu-item ${subItem.disabled ? 'disabled' : ''}`}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (!subItem.disabled && subItem.onClick) {
                                                            subItem.onClick();
                                                        }
                                                    }}
                                                >
                                                    <span>{subItem.label}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
