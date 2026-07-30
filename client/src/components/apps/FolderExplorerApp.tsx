import React, { useState, useCallback, useMemo } from 'react';
import { useOS, DesktopItem, AppID } from '../os/OSProvider';
import {
  ExplorerMenuBar,
  ExplorerToolbar,
  ExplorerAddressBar,
  ExplorerStatusBar,
  ExplorerContent
} from './ExplorerComponents';
import ContextMenu from '../os/ContextMenu';

interface FolderExplorerProps {
  onClose?: () => void;
  params?: {
    item: DesktopItem;
  };
}

export default function FolderExplorerApp({ onClose, params }: FolderExplorerProps) {
  const {
    desktopItems,
    addDesktopItem,
    updateDesktopItem,
    moveToRecycleBin,
    showDeleteConfirm,
    openWindow,
    soundEnabled
  } = useOS();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; targetItemId?: string | null } | null>(null);

  const currentFolderId = params?.item?.id;

  // Resolve current folder item if available
  const currentFolder = useMemo(() => {
    if (!currentFolderId) return null;
    return desktopItems.find(i => i.id === currentFolderId) || params?.item || null;
  }, [currentFolderId, desktopItems, params?.item]);

  // Compute breadcrumb path dynamically (e.g. Desktop\Folder1\Folder2)
  const path = useMemo(() => {
    if (!currentFolder) return 'Desktop\\New Folder';
    const parts: string[] = [currentFolder.name];
    let curr = currentFolder;
    while (curr.parentId) {
      const parent = desktopItems.find(i => i.id === curr.parentId);
      if (parent) {
        parts.unshift(parent.name);
        curr = parent;
      } else {
        break;
      }
    }
    return `Desktop\\${parts.join('\\')}`;
  }, [currentFolder, desktopItems]);

  // Filter items inside this folder
  const itemsInFolder = useMemo(() => {
    if (!currentFolderId) return [];
    return desktopItems.filter(item => item.parentId === currentFolderId);
  }, [desktopItems, currentFolderId]);

  const folderName = currentFolder?.name || 'Folder';

  // Total size estimation
  const totalBytes = useMemo(() => {
    return itemsInFolder.reduce((sum, item) => sum + (item.content?.length || 512), 0);
  }, [itemsInFolder]);

  // Navigation: Up button
  const handleUp = useCallback(() => {
    if (!currentFolder || !currentFolder.parentId) {
      // If at root folder level, close this window (returning to Desktop)
      if (onClose) onClose();
      return;
    }
    const parentFolder = desktopItems.find(i => i.id === currentFolder.parentId);
    if (parentFolder) {
      openWindow('folder-explorer', { item: parentFolder }, parentFolder.id);
    } else if (onClose) {
      onClose();
    }
  }, [currentFolder, desktopItems, openWindow, onClose]);

  // Create new folder inside this folder
  const handleNewFolder = useCallback(() => {
    if (!currentFolderId) return;
    addDesktopItem({
      name: 'New Folder',
      type: 'folder',
      parentId: currentFolderId,
      isRenaming: true
    });
  }, [addDesktopItem, currentFolderId]);

  // Create new text file inside this folder
  const handleNewTextFile = useCallback(() => {
    if (!currentFolderId) return;
    addDesktopItem({
      name: 'New Text Document.txt',
      type: 'file',
      parentId: currentFolderId,
      isRenaming: true
    });
  }, [addDesktopItem, currentFolderId]);

  // Delete selected item inside folder
  const handleDeleteSelected = useCallback(() => {
    if (!selectedId) return;
    const itemToDelete = desktopItems.find(i => i.id === selectedId);
    if (itemToDelete) {
      showDeleteConfirm(itemToDelete);
    }
  }, [selectedId, desktopItems, showDeleteConfirm]);

  // Rename item inside folder
  const handleRename = useCallback((id: string, newName: string) => {
    if (newName.trim()) {
      updateDesktopItem(id, { name: newName, isRenaming: false });
    } else {
      updateDesktopItem(id, { isRenaming: false });
    }
  }, [updateDesktopItem]);

  // Double click handling for items inside folder
  const handleDoubleClickItem = useCallback((item: DesktopItem) => {
    if (item.appId) {
      openWindow(item.appId as AppID);
      return;
    }
    if (item.type === 'folder') {
      openWindow('folder-explorer', { item }, item.id);
      return;
    }
    if (item.name.toLowerCase().endsWith('.txt') || item.type === 'file') {
      openWindow('notepad', { item }, item.id);
      return;
    }
  }, [openWindow]);

  // Context Menu inside folder
  const handleContextMenu = useCallback((e: React.MouseEvent, item?: DesktopItem) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      targetItemId: item ? item.id : null
    });
  }, []);

  return (
    <div
      className="flex flex-col h-full bg-[#c0c0c0] select-none"
      onClick={() => {
        setSelectedId(null);
        setContextMenu(null);
      }}
    >
      <ExplorerMenuBar
        iconUrl="https://win98icons.alexmeub.com/icons/png/directory_open-4.png"
        onNewFolder={handleNewFolder}
        onNewTextFile={handleNewTextFile}
        onDeleteSelected={handleDeleteSelected}
        onClose={onClose}
      />
      <ExplorerToolbar
        onUp={handleUp}
        canGoUp={true}
        onDelete={handleDeleteSelected}
        canDelete={!!selectedId}
      />
      <ExplorerAddressBar path={path} iconUrl="https://win98icons.alexmeub.com/icons/png/directory_closed-4.png" />

      <ExplorerContent
        items={itemsInFolder}
        selectedId={selectedId}
        onSelect={(id) => setSelectedId(id)}
        onDoubleClickItem={handleDoubleClickItem}
        onContextMenu={handleContextMenu}
        onRename={handleRename}
      />

      <ExplorerStatusBar
        objectCount={itemsInFolder.length}
        bytesCount={totalBytes}
        contextName={folderName}
      />

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          targetItemId={contextMenu.targetItemId}
          parentId={currentFolderId}
          onClose={() => setContextMenu(null)}
        />
      )}
    </div>
  );
}
