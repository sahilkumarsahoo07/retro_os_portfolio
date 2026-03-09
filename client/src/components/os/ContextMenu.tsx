import React, { useRef, useEffect, useState, useCallback } from 'react';
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
    checked?: boolean;
}

export default function ContextMenu({ x, y, targetItemId, onClose }: ContextMenuProps) {
    const menuRef = useRef<HTMLDivElement>(null);
    const {
        refreshDesktop,
        arrangeIcons,
        addDesktopItem,
        deleteDesktopItem,
        updateDesktopItem,
        openWindow,
        desktopItems,
        moveToRecycleBin,
        recycleBinItems,
        emptyRecycleBin,
        showSystemDialog,
        showDeleteConfirm,
        desktopIconSize,
        setDesktopIconSize
    } = useOS();
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

    const handleNewFolder = useCallback(() => {
        addDesktopItem({
            name: 'New Folder',
            type: 'folder',
            x: x,
            y: y,
            isRenaming: true
        });
        onClose();
    }, [addDesktopItem, x, y, onClose]);

    const handleNewTextFile = useCallback(() => {
        addDesktopItem({
            name: 'New Text Document.txt',
            type: 'file',
            x: x,
            y: y,
            isRenaming: true
        });
        onClose();
    }, [addDesktopItem, x, y, onClose]);

    const desktopMenuItems: MenuItem[] = [
        {
            label: 'View',
            hasSubmenu: true,
            submenuItems: [
                {
                    label: 'Large Icons',
                    onClick: () => { setDesktopIconSize('large'); onClose(); refreshDesktop(); },
                    checked: desktopIconSize === 'large'
                },
                {
                    label: 'Small Icons',
                    onClick: () => { setDesktopIconSize('small'); onClose(); refreshDesktop(); },
                    checked: desktopIconSize === 'small'
                },
            ]
        },
        { label: 'Arrange Icons', onClick: () => { arrangeIcons(); onClose(); } },
        // { label: 'Line Up Icons', onClick: () => { arrangeIcons(); onClose(); } },
        { type: 'separator' },
        { label: 'Refresh', onClick: () => { arrangeIcons(); refreshDesktop(); onClose(); } },
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
                        if (targetItem.isSystem && targetItem.appId) {
                            showSystemDialog("Error", "You cannot delete this system icon.", "error");
                        } else {
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
                            className={`win98-menu-item-container relative`}
                            onMouseEnter={() => handleMouseEnter(i)}
                        >
                            <div
                                className={`win98-menu-item ${item.disabled ? 'disabled' : ''} ${item.bold ? 'font-bold' : ''} ${isActive && item.hasSubmenu ? 'active' : ''}`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (!item.disabled && item.onClick) {
                                        item.onClick();
                                    }
                                }}
                            >
                                <div className="flex items-center gap-2">
                                    {item.checked !== undefined && (
                                        <div className="w-3 h-3 flex items-center justify-center">
                                            {item.checked && (
                                                <span className="text-[10px]">●</span>
                                            )}
                                        </div>
                                    )}
                                    <span>{item.label}</span>
                                </div>
                                {item.hasSubmenu && (
                                    <span className="win98-submenu-arrow">
                                        <svg width="4" height="7" viewBox="0 0 4 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M0 0V7L4 3.5L0 0Z" fill="currentColor" />
                                        </svg>
                                    </span>
                                )}
                            </div>

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
                                                    <div className="flex items-center gap-2">
                                                        {subItem.checked !== undefined && (
                                                            <div className="w-3 h-3 flex items-center justify-center">
                                                                {subItem.checked && (
                                                                    <span className="text-[10px]">●</span>
                                                                )}
                                                            </div>
                                                        )}
                                                        <span>{subItem.label}</span>
                                                    </div>
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
