import React, { createContext, useContext, useState, useRef, ReactNode, useEffect, useCallback } from 'react';
import AboutApp from '../apps/AboutApp';
import ProjectsApp from '../apps/ProjectsApp';
import GalleryApp from '../apps/GalleryApp';
import MusicApp from '../apps/MusicApp';
import ContactApp from '../apps/ContactApp';
import TerminalApp from '../apps/TerminalApp';
import MyComputerApp from '../apps/MyComputerApp';
import MyDocumentsApp from '../apps/MyDocumentsApp';
import RecycleBinApp from '../apps/RecycleBinApp';
import IEApp from '../apps/IEApp';
import ProjectDetailsApp from '../apps/ProjectDetailsApp';
import { v4 as uuidv4 } from 'uuid';

export type AppID = 'my-computer' | 'my-documents' | 'network' | 'recycle-bin' | 'ie' | 'about' | 'projects' | 'experience' | 'skills' | 'contact' | 'terminal' | 'certifications' | 'achievements' | 'project-details' | 'notepad' | 'folder-explorer';

export type DesktopItemType = 'file' | 'folder' | 'shortcut' | 'app';

export interface DesktopItem {
  id: string;
  appId?: AppID;
  name: string;
  type: DesktopItemType;
  iconUrl: string;
  x: number;
  y: number;
  isRenaming?: boolean;
  isSystem?: boolean;
  content?: string;
}

export interface RecycleBinItem extends DesktopItem {
  originalLocation: string;
  deletedAt: number;    // unix timestamp ms
  originalX: number;
  originalY: number;
}

export interface AppDefinition {
  id: AppID;
  title: string;
  iconUrl: string;
  component: React.FC<{ onClose: () => void; type?: string; params?: any }>;
  defaultWidth: number;
  defaultHeight: number;
  showMenuBar?: boolean;
}

const WIN98_ICONS = {
  computer: 'https://win98icons.alexmeub.com/icons/png/computer_explorer-5.png',
  documents: 'https://win98icons.alexmeub.com/icons/png/directory_open_file_mydocs-4.png',
  network: 'https://win98icons.alexmeub.com/icons/png/network_normal_two_pcs-2.png',
  recycleFull: 'https://win98icons.alexmeub.com/icons/png/recycle_bin_full-4.png',
  recycleEmpty: 'https://win98icons.alexmeub.com/icons/png/recycle_bin_empty-4.png',
  ie: 'https://win98icons.alexmeub.com/icons/png/msie1-2.png',
  user: 'https://win98icons.alexmeub.com/icons/png/user_computer-0.png',
  folder: 'https://win98icons.alexmeub.com/icons/png/directory_closed-4.png',
  briefcase: 'https://win98icons.alexmeub.com/icons/png/briefcase-2.png',
  gear: 'https://win98icons.alexmeub.com/icons/png/settings_gear-0.png',
  mail: 'https://win98icons.alexmeub.com/icons/png/message_envelope_open-0.png',
  terminal: 'https://win98icons.alexmeub.com/icons/png/console_prompt-0.png',
  notepad: 'https://win98icons.alexmeub.com/icons/png/notepad_file-0.png'
};

export const APPS: Record<AppID, AppDefinition> = {
  'my-computer': {
    id: 'my-computer',
    title: 'My Computer',
    iconUrl: WIN98_ICONS.computer,
    component: MyComputerApp,
    defaultWidth: 600,
    defaultHeight: 450,
    showMenuBar: false,
  },
  'my-documents': {
    id: 'my-documents',
    title: 'My Documents',
    iconUrl: WIN98_ICONS.documents,
    component: MyDocumentsApp,
    defaultWidth: 600,
    defaultHeight: 450,
    showMenuBar: false,
  },
  'network': {
    id: 'network',
    title: 'Network Neighborhood',
    iconUrl: WIN98_ICONS.network,
    component: MyComputerApp,
    defaultWidth: 600,
    defaultHeight: 450,
    showMenuBar: false,
  },
  'recycle-bin': {
    id: 'recycle-bin',
    title: 'Recycle Bin',
    iconUrl: WIN98_ICONS.recycleEmpty,
    component: RecycleBinApp,
    defaultWidth: 640,
    defaultHeight: 420,
    showMenuBar: false,
  },
  'ie': {
    id: 'ie',
    title: 'Internet Explorer',
    iconUrl: WIN98_ICONS.ie,
    component: IEApp,
    defaultWidth: 800,
    defaultHeight: 600,
    showMenuBar: false,
  },
  about: {
    id: 'about',
    title: 'About Sahil',
    iconUrl: WIN98_ICONS.user,
    component: AboutApp,
    defaultWidth: 600,
    defaultHeight: 450,
    showMenuBar: true,
  },
  projects: {
    id: 'projects',
    title: 'Projects',
    iconUrl: WIN98_ICONS.folder,
    component: ProjectsApp,
    defaultWidth: 800,
    defaultHeight: 600,
    showMenuBar: false,
  },
  experience: {
    id: 'experience',
    title: 'Experience',
    iconUrl: WIN98_ICONS.briefcase,
    component: AboutApp,
    defaultWidth: 600,
    defaultHeight: 500,
    showMenuBar: true,
  },
  skills: {
    id: 'skills',
    title: 'Skills',
    iconUrl: WIN98_ICONS.gear,
    component: AboutApp,
    defaultWidth: 500,
    defaultHeight: 450,
    showMenuBar: true,
  },
  contact: {
    id: 'contact',
    title: 'Contact',
    iconUrl: WIN98_ICONS.mail,
    component: ContactApp,
    defaultWidth: 500,
    defaultHeight: 600,
    showMenuBar: true,
  },
  terminal: {
    id: 'terminal',
    title: 'MS-DOS Prompt',
    iconUrl: WIN98_ICONS.terminal,
    component: TerminalApp,
    defaultWidth: 600,
    defaultHeight: 400,
    showMenuBar: false,
  },
  certifications: {
    id: 'certifications',
    title: 'Certifications',
    iconUrl: 'https://win98icons.alexmeub.com/icons/png/certificate_2-0.png',
    component: AboutApp, // Will update AboutApp to handle this
    defaultWidth: 500,
    defaultHeight: 450,
    showMenuBar: true,
  },
  achievements: {
    id: 'achievements',
    title: 'Achievements',
    iconUrl: 'https://win98icons.alexmeub.com/icons/png/medal_gold_3-0.png',
    component: AboutApp,
    defaultWidth: 500,
    defaultHeight: 450,
    showMenuBar: true,
  },
  'project-details': {
    id: 'project-details',
    title: 'Project Details',
    iconUrl: 'https://win98icons.alexmeub.com/icons/png/executable_script-0.png',
    component: ProjectDetailsApp as any, // Cast to any because the interface is slightly different in params, though we updated AppDefinition
    defaultWidth: 500,
    defaultHeight: 550,
    showMenuBar: false,
  },
  notepad: {
    id: 'notepad',
    title: 'Notepad',
    iconUrl: WIN98_ICONS.notepad,
    component: React.lazy(() => import('../apps/NotepadApp')) as any,
    defaultWidth: 500,
    defaultHeight: 400,
    showMenuBar: true,
  },
  'folder-explorer': {
    id: 'folder-explorer',
    title: 'Folder',
    iconUrl: WIN98_ICONS.folder,
    component: React.lazy(() => import('../apps/FolderExplorerApp')) as any,
    defaultWidth: 600,
    defaultHeight: 450,
    showMenuBar: false,
  }
};

export interface SystemDialogState {
  title: string;
  message: string;
  iconType: 'error' | 'warning' | 'info';
}

export const LARGE_CELL_W = 90;
export const LARGE_CELL_H = 100;
export const SMALL_CELL_W = 75;
export const SMALL_CELL_H = 80;
export const GRID_PADDING = 16;

export type DesktopIconSize = 'large' | 'small';

export interface DeleteConfirmState {
  isOpen: boolean;
  item: DesktopItem | null;
  isPermanent?: boolean;
}

export interface WindowState {
  id: string; // Instance ID
  appId: AppID;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  lastTrigger?: 'open' | 'restore' | 'minimize' | 'close' | 'load' | 'refresh';
  params?: any;
}

interface OSContextType {
  windows: WindowState[];
  desktopRef: React.RefObject<HTMLDivElement>;
  openWindow: (appId: AppID, params?: any, instanceId?: string) => void;
  closeWindow: (instanceId: string) => void;
  minimizeWindow: (instanceId: string) => void;
  restoreWindow: (instanceId: string) => void;
  toggleMaximize: (instanceId: string) => void;
  focusWindow: (instanceId: string) => void;
  updateWindowSize: (instanceId: string, width: number, height: number) => void;
  updateWindowPosition: (instanceId: string, x: number, y: number) => void;
  desktopItems: DesktopItem[];
  setDesktopItems: React.Dispatch<React.SetStateAction<DesktopItem[]>>;
  addDesktopItem: (item: Partial<DesktopItem>) => string;
  updateDesktopItem: (id: string, updates: Partial<DesktopItem>) => void;
  deleteDesktopItem: (id: string | string[]) => void;
  moveToRecycleBin: (id: string) => void;
  bulkMoveToRecycleBin: (ids: string[]) => void;
  restoreFromRecycleBin: (id: string) => void;
  permanentlyDelete: (id: string) => void;
  bulkRestoreFromRecycleBin: (ids: string[]) => void;
  bulkPermanentlyDelete: (ids: string[]) => void;
  emptyRecycleBin: () => void;
  recycleBinItems: RecycleBinItem[];
  refreshDesktop: () => void;
  arrangeIcons: () => void;
  activeWindowId: string | null;
  soundEnabled: boolean;
  toggleSound: () => void;
  recycleRef: React.RefObject<HTMLDivElement>;
  recycleBinHovered: boolean;
  setRecycleBinHovered: React.Dispatch<React.SetStateAction<boolean>>;
  dropOnRecycleBin: (id: string) => void;
  systemDialog: SystemDialogState | null;
  showSystemDialog: (title: string, message: string, iconType?: 'error' | 'warning' | 'info') => void;
  closeSystemDialog: () => void;
  deleteConfirm: DeleteConfirmState;
  showDeleteConfirm: (item: DesktopItem, isPermanent?: boolean) => void;
  hideDeleteConfirm: () => void;
  desktopIconSize: DesktopIconSize;
  setDesktopIconSize: (size: DesktopIconSize) => void;
}

const OSContext = createContext<OSContextType | undefined>(undefined);

const TASKBAR_H = 28;

/** Clamp a window's x/y so it stays fully within the viewport */
function clampWindowPosition(
  x: number,
  y: number,
  width: number,
  height: number,
  vpWidth: number,
  vpHeight: number
): { x: number; y: number } {
  const clampedX = Math.max(0, Math.min(x, vpWidth - width));
  const clampedY = Math.max(0, Math.min(y, vpHeight - height));
  return { x: clampedX, y: clampedY };
}

export function OSProvider({ children }: { children: ReactNode }) {
  const desktopRef = useRef<HTMLDivElement>(null);

  const [windows, setWindows] = useState<WindowState[]>(() => {
    if (typeof window === 'undefined') return [];
    const saved = localStorage.getItem('win98-windows');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // On page load, reset the lastTrigger to 'load' so they don't replay the open animation
        return parsed.map((w: any) => ({ ...w, lastTrigger: 'load' }));
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  const [desktopItems, setDesktopItems] = useState<DesktopItem[]>(() => {
    if (typeof window === 'undefined') return [];

    const saved = localStorage.getItem('win98-desktop-items');
    if (saved) {
      const items = JSON.parse(saved);
      return items.filter((i: any) => i.id !== 'default-folder-explorer');
    }

    // Initial default items if nothing is saved
    return (Object.keys(APPS) as AppID[])
      .filter(id => !['terminal', 'certifications', 'achievements', 'project-details', 'notepad', 'folder-explorer'].includes(id))
      .map((id, i) => ({
        id: `default-${id}`,
        appId: id,
        name: APPS[id].title,
        type: 'app' as DesktopItemType,
        iconUrl: APPS[id].iconUrl,
        isSystem: true,
        x: 16 + Math.floor(i / Math.max(1, Math.floor((window.innerHeight - 80) / 98))) * 90,
        y: 16 + (i % Math.max(1, Math.floor((window.innerHeight - 80) / 98))) * 98
      }));
  });

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const [recycleBinItems, setRecycleBinItems] = useState<RecycleBinItem[]>(() => {
    if (typeof window === 'undefined') return [];
    const saved = localStorage.getItem('win98-recycle-bin');
    return saved ? JSON.parse(saved) : [];
  });

  const recycleRef = useRef<HTMLDivElement>(null);
  const [recycleBinHovered, setRecycleBinHovered] = useState(false);
  const [systemDialog, setSystemDialog] = useState<SystemDialogState | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<DeleteConfirmState>({ isOpen: false, item: null });
  const [desktopIconSize, setDesktopIconSize] = useState<DesktopIconSize>(() => {
    if (typeof window === 'undefined') return 'large';
    const saved = localStorage.getItem('win98-desktop-icon-size');
    return (saved as DesktopIconSize) || 'large';
  });

  const showSystemDialog = useCallback((title: string, message: string, iconType: 'error' | 'warning' | 'info' = 'error') => {
    setSystemDialog({ title, message, iconType });
  }, []);

  const closeSystemDialog = useCallback(() => {
    setSystemDialog(null);
  }, []);

  const showDeleteConfirm = useCallback((item: DesktopItem, isPermanent: boolean = false) => {
    setDeleteConfirm({ isOpen: true, item, isPermanent });
  }, []);

  const hideDeleteConfirm = useCallback(() => {
    setDeleteConfirm({ isOpen: false, item: null });
  }, []);

  // Persist recycleBinItems
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem('win98-recycle-bin', JSON.stringify(recycleBinItems));
    }, 500);
    return () => clearTimeout(timer);
  }, [recycleBinItems]);

  const moveToRecycleBin = useCallback((id: string) => {
    setDesktopItems(prev => {
      const item = prev.find(i => i.id === id);
      if (!item) return prev;
      const recycleBinEntry: RecycleBinItem = {
        ...item,
        originalLocation: 'Desktop',
        deletedAt: Date.now(),
        originalX: item.x,
        originalY: item.y,
      };
      setRecycleBinItems(rb => [...rb, recycleBinEntry]);
      return prev.filter(i => i.id !== id);
    });
    setRecycleBinHovered(false);
  }, []);

  const bulkMoveToRecycleBin = useCallback((ids: string[]) => {
    setDesktopItems(prev => {
      const itemsToMove = prev.filter(i => ids.includes(i.id) && !(i.isSystem && i.appId));
      if (itemsToMove.length === 0) return prev;

      const recycleBinEntries: RecycleBinItem[] = itemsToMove.map(item => ({
        ...item,
        originalLocation: 'Desktop',
        deletedAt: Date.now(),
        originalX: item.x,
        originalY: item.y,
      }));

      setRecycleBinItems(rb => [...rb, ...recycleBinEntries]);
      return prev.filter(i => !itemsToMove.some(m => m.id === i.id));
    });
    setRecycleBinHovered(false);
  }, []);

  const restoreFromRecycleBin = useCallback((id: string) => {
    setRecycleBinItems(prev => {
      const item = prev.find(i => i.id === id);
      if (!item) return prev;
      const { originalLocation: _loc, deletedAt: _at, originalX, originalY, ...desktopItem } = item;
      setDesktopItems(d => [...d, { ...desktopItem, x: originalX, y: originalY, isRenaming: false }]);
      return prev.filter(i => i.id !== id);
    });
  }, []);

  const permanentlyDelete = useCallback((id: string) => {
    setRecycleBinItems(prev => prev.filter(i => i.id !== id));
  }, []);

  const bulkRestoreFromRecycleBin = useCallback((ids: string[]) => {
    setRecycleBinItems(prev => {
      const itemsToRestore = prev.filter(i => ids.includes(i.id));
      const desktopItemsToStore = itemsToRestore.map(({ originalLocation: _loc, deletedAt: _at, originalX, originalY, ...desktopItem }) => ({
        ...desktopItem,
        x: originalX,
        y: originalY,
        isRenaming: false
      }));
      setDesktopItems(d => [...d, ...desktopItemsToStore]);
      return prev.filter(i => !ids.includes(i.id));
    });
  }, []);

  const bulkPermanentlyDelete = useCallback((ids: string[]) => {
    setRecycleBinItems(prev => prev.filter(i => !ids.includes(i.id)));
  }, []);

  const emptyRecycleBin = useCallback(() => {
    setRecycleBinItems([]);
  }, []);

  const dropOnRecycleBin = useCallback((id: string) => {
    setDesktopItems(prev => {
      const item = prev.find(i => i.id === id);
      if (item?.isSystem && item?.appId) {
        showSystemDialog("Error", "You cannot delete this system icon.", "error");
        setRecycleBinHovered(false);
        return prev;
      }
      moveToRecycleBin(id);
      return prev;
    });
  }, [moveToRecycleBin, showSystemDialog]);

  // ─── Responsive: re-clamp all open windows when viewport resizes ───────────
  useEffect(() => {
    const handleResize = () => {
      const rect = desktopRef.current?.getBoundingClientRect();
      const vpW = rect && rect.width > 0 ? rect.width : window.innerWidth;
      const vpH = rect && rect.height > 0 ? rect.height : window.innerHeight - TASKBAR_H;

      setWindows(prev =>
        prev.map(w => {
          if (!w.isOpen || w.isMinimized || w.isMaximized) return w;

          const defaultW = APPS[w.appId]?.defaultWidth || 600;
          const defaultH = APPS[w.appId]?.defaultHeight || 450;

          let targetW = w.width ?? defaultW;
          let targetH = w.height ?? defaultH;

          // Auto-scale down if window is larger than mobile viewport constraints
          if (vpW < 768) {
            targetW = Math.min(targetW, vpW * 0.9);
            targetH = Math.min(targetH, vpH * 0.7);
          } else {
            targetW = Math.min(targetW, vpW);
            targetH = Math.min(targetH, vpH);
          }

          const curX = w.x ?? 0;
          const curY = w.y ?? 0;
          const { x, y } = clampWindowPosition(curX, curY, targetW, targetH, vpW, vpH);

          if (x === curX && y === curY && targetW === w.width && targetH === w.height) return w;
          return { ...w, x, y, width: targetW, height: targetH };
        })
      );
    };

    window.addEventListener('resize', handleResize);
    // Use timeout on mount to ensure desktopRef is populated
    const timer = setTimeout(handleResize, 50);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Debounced persistence for windows
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem('win98-windows', JSON.stringify(windows));
    }, 500);
    return () => clearTimeout(timer);
  }, [windows]);

  // Debounced persistence for desktop items
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem('win98-desktop-items', JSON.stringify(desktopItems));
    }, 500);
    return () => clearTimeout(timer);
  }, [desktopItems]);

  // Immediate persistence on page reload/close to prevent loss of dragging data
  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.setItem('win98-windows', JSON.stringify(windows));
      localStorage.setItem('win98-desktop-items', JSON.stringify(desktopItems));
      localStorage.setItem('win98-recycle-bin', JSON.stringify(recycleBinItems));
      localStorage.setItem('win98-desktop-icon-size', desktopIconSize);
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [windows, desktopItems, recycleBinItems, desktopIconSize]);

  // Restore dedicated window positions precisely on app load
  useEffect(() => {
    const saved = localStorage.getItem("win98-window-positions");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setWindows(prev =>
          prev.map(win => ({
            ...win,
            x: parsed[win.id]?.x ?? win.x,
            y: parsed[win.id]?.y ?? win.y
          }))
        );
      } catch (e) {
        console.error("Failed to parse window positions", e);
      }
    }
  }, []);

  const getTopZIndex = () => {
    return windows.length > 0 ? Math.max(...windows.map(w => w.zIndex)) : 10;
  };

  const activeWindowId = windows
    .filter(w => w.isOpen && !w.isMinimized)
    .sort((a, b) => b.zIndex - a.zIndex)[0]?.id || null;

  const getCenteredPosition = (width: number, height: number, index: number) => {
    const rect = desktopRef.current?.getBoundingClientRect();
    const desktopWidth = rect && rect.width > 0 ? rect.width : window.innerWidth;
    const desktopHeight = rect && rect.height > 0 ? rect.height : window.innerHeight - TASKBAR_H;

    const offsetX = (index % 5) * 20;
    const offsetY = (index % 5) * 20;
    const x = Math.min(Math.max(0, (desktopWidth - width) / 2) + offsetX, Math.max(0, desktopWidth - width));
    const y = Math.min(Math.max(0, (desktopHeight - height) / 2) + offsetY, Math.max(0, desktopHeight - height));

    return { x, y };
  };

  const openWindow = (appId: AppID, params?: any, instanceId?: string) => {
    const id = instanceId || appId;
    setWindows(prev => {
      const exists = prev.find(w => w.id === id);
      const topZ = getTopZIndex() + 10;

      const app = APPS[appId];
      const rect = desktopRef.current?.getBoundingClientRect();
      const vpW = rect && rect.width > 0 ? rect.width : window.innerWidth;
      const vpH = rect && rect.height > 0 ? rect.height : window.innerHeight - TASKBAR_H;

      let winW = app?.defaultWidth || 600;
      let winH = app?.defaultHeight || 450;

      if (vpW < 768) {
        winW = Math.min(winW, vpW * 0.9);
        winH = Math.min(winH, vpH * 0.7);
      } else {
        winW = Math.min(winW, vpW);
        winH = Math.min(winH, vpH);
      }

      if (exists) {
        let curW = exists.width ?? winW;
        let curH = exists.height ?? winH;
        if (vpW < 768) {
          curW = Math.min(curW, vpW * 0.9);
          curH = Math.min(curH, vpH * 0.7);
        }

        const { x, y } = clampWindowPosition(exists.x ?? 0, exists.y ?? 0, curW, curH, vpW, vpH);
        return prev.map(w => w.id === id ? {
          ...w,
          isOpen: true,
          isMinimized: false,
          zIndex: topZ,
          x,
          y,
          width: curW,
          height: curH,
          lastTrigger: w.isOpen ? 'restore' : 'open',
          params: params || w.params
        } : w);
      }

      const savedPositionsStr = localStorage.getItem('win98-window-positions');
      let savedX, savedY;
      if (savedPositionsStr) {
        try {
          const parsed = JSON.parse(savedPositionsStr);
          if (parsed[id]) {
            savedX = parsed[id].x;
            savedY = parsed[id].y;
          }
        } catch (e) { }
      }

      const defaultPos = getCenteredPosition(winW, winH, prev.filter(w => w.isOpen).length);
      const targetX = savedX !== undefined ? savedX : defaultPos.x;
      const targetY = savedY !== undefined ? savedY : defaultPos.y;

      const clamped = clampWindowPosition(targetX, targetY, winW, winH, vpW, vpH);

      return [...prev, {
        id,
        appId,
        isOpen: true,
        isMinimized: false,
        isMaximized: false,
        zIndex: topZ,
        width: winW,
        height: winH,
        x: clamped.x,
        y: clamped.y,
        lastTrigger: 'open',
        params,
      }];
    });
  };

  const closeWindow = (instanceId: string) => {
    setWindows(prev => prev.map(w => w.id === instanceId ? { ...w, isOpen: false, lastTrigger: 'close' } : w));
  };

  const minimizeWindow = (instanceId: string) => {
    setWindows(prev => prev.map(w => w.id === instanceId ? { ...w, isMinimized: true, lastTrigger: 'minimize' } : w));
  };

  const restoreWindow = (instanceId: string) => {
    setWindows(prev => {
      const w = prev.find(window => window.id === instanceId);
      if (!w) return prev;
      const topZ = getTopZIndex() + 1;
      return prev.map(w => {
        if (w.id !== instanceId) return w;

        const rect = desktopRef.current?.getBoundingClientRect();
        const vpW = rect && rect.width > 0 ? rect.width : window.innerWidth;
        const vpH = rect && rect.height > 0 ? rect.height : window.innerHeight - TASKBAR_H;

        let winW = w.width ?? (APPS[w.appId]?.defaultWidth ?? 600);
        let winH = w.height ?? (APPS[w.appId]?.defaultHeight ?? 450);

        if (vpW < 768) {
          winW = Math.min(winW, vpW * 0.9);
          winH = Math.min(winH, vpH * 0.7);
        }

        const { x, y } = clampWindowPosition(w.x ?? 0, w.y ?? 0, winW, winH, vpW, vpH);
        return { ...w, isMinimized: false, zIndex: topZ, x, y, width: winW, height: winH, lastTrigger: 'restore' };
      });
    });
  };

  const toggleMaximize = (instanceId: string) => {
    setWindows(prev => {
      const topZ = getTopZIndex() + 1;
      return prev.map(w => w.id === instanceId ? { ...w, isMaximized: !w.isMaximized, zIndex: topZ } : w);
    });
  };

  const focusWindow = (instanceId: string) => {
    setWindows(prev => {
      const topZ = getTopZIndex() + 10;
      return prev.map(w => w.id === instanceId ? { ...w, zIndex: topZ, isMinimized: false } : w);
    });
  };

  const updateWindowSize = (instanceId: string, width: number, height: number) => {
    setWindows(prev => prev.map(w => w.id === instanceId ? { ...w, width, height } : w));
  };

  const updateWindowPosition = (instanceId: string, x: number, y: number) => {
    if (isNaN(x) || isNaN(y)) return;

    // Persist position exactly as requested
    try {
      const saved = localStorage.getItem('win98-window-positions');
      const positions = saved ? JSON.parse(saved) : {};
      positions[instanceId] = { x, y };
      localStorage.setItem('win98-window-positions', JSON.stringify(positions));
    } catch (e) {
      console.error("Failed to save independent window position", e);
    }

    setWindows(prev => prev.map(w => w.id === instanceId ? { ...w, x, y } : w));
  };

  const addDesktopItem = (item: Partial<DesktopItem>) => {
    const id = uuidv4();
    setDesktopItems(prev => [...prev.map(i => ({ ...i, isRenaming: false })), {
      id,
      name: item.name || 'New Item',
      type: item.type || 'folder',
      iconUrl: item.iconUrl || 'https://win98icons.alexmeub.com/icons/png/directory_closed-4.png',
      x: item.x || 100,
      y: item.y || 100,
      isRenaming: item.isRenaming || false,
      isSystem: false, // Ensure user-created items are NOT system items
      ...item
    }]);
    return id;
  };

  const updateDesktopItem = (id: string, updates: Partial<DesktopItem>) => {
    setDesktopItems(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
  };

  const deleteDesktopItem = (id: string | string[]) => {
    const idsToDelete = Array.isArray(id) ? id : [id];
    setDesktopItems(prev => prev.filter(item => !idsToDelete.includes(item.id)));
  };

  const refreshDesktop = () => {
    setWindows(prev => prev.map(w => ({ ...w, lastTrigger: 'refresh' })));
    setRefreshKey(prev => prev + 1);
  };

  const arrangeIcons = () => {
    setDesktopItems(prev => {
      const CELL_W = desktopIconSize === 'small' ? SMALL_CELL_W : LARGE_CELL_W;
      const CELL_H = desktopIconSize === 'small' ? SMALL_CELL_H : LARGE_CELL_H;
      const maxH = window.innerHeight - 80;
      const iconsPerCol = Math.max(1, Math.floor((maxH - GRID_PADDING) / CELL_H));

      return prev.map((item, i) => {
        const col = Math.floor(i / iconsPerCol);
        const row = i % iconsPerCol;
        return {
          ...item,
          x: GRID_PADDING + col * CELL_W,
          y: GRID_PADDING + row * CELL_H
        };
      });
    });
  };

  const toggleSound = () => setSoundEnabled(prev => !prev);

  return (
    <OSContext.Provider value={{
      windows,
      desktopRef,
      openWindow,
      closeWindow,
      minimizeWindow,
      restoreWindow,
      toggleMaximize,
      focusWindow,
      updateWindowSize,
      updateWindowPosition,
      desktopItems,
      setDesktopItems,
      addDesktopItem,
      updateDesktopItem,
      deleteDesktopItem,
      moveToRecycleBin,
      bulkMoveToRecycleBin,
      restoreFromRecycleBin,
      permanentlyDelete,
      bulkRestoreFromRecycleBin,
      bulkPermanentlyDelete,
      emptyRecycleBin,
      recycleBinItems,
      refreshDesktop,
      arrangeIcons,
      activeWindowId,
      soundEnabled,
      toggleSound,
      recycleRef,
      recycleBinHovered,
      setRecycleBinHovered,
      dropOnRecycleBin,
      systemDialog,
      showSystemDialog,
      closeSystemDialog,
      deleteConfirm,
      showDeleteConfirm,
      hideDeleteConfirm,
      desktopIconSize,
      setDesktopIconSize,
    }}>
      <div key={refreshKey} className="theme-win98 contents">
        {children}
      </div>
    </OSContext.Provider>
  );
}

export function useOS() {
  const context = useContext(OSContext);
  if (!context) throw new Error("useOS must be used within an OSProvider");
  return context;
}