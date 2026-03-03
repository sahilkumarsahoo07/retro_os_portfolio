import React, { createContext, useContext, useState, useRef, ReactNode, useEffect } from 'react';
import AboutApp from '../apps/AboutApp';
import ProjectsApp from '../apps/ProjectsApp';
import GalleryApp from '../apps/GalleryApp';
import MusicApp from '../apps/MusicApp';
import ContactApp from '../apps/ContactApp';
import TerminalApp from '../apps/TerminalApp';
import MyComputerApp from '../apps/MyComputerApp';
import { v4 as uuidv4 } from 'uuid';

export type AppID = 'my-computer' | 'my-documents' | 'network' | 'recycle-bin' | 'ie' | 'about' | 'projects' | 'experience' | 'skills' | 'contact' | 'terminal';

export type DesktopItemType = 'file' | 'folder' | 'shortcut' | 'app';

export interface DesktopItem {
  id: string;
  appId?: AppID;
  name: string;
  type: DesktopItemType;
  iconUrl: string;
  x: number;
  y: number;
}

export interface AppDefinition {
  id: AppID;
  title: string;
  iconUrl: string;
  component: React.FC<{ onClose: () => void }>;
  defaultWidth: number;
  defaultHeight: number;
}

// Authentic Windows 98 Icon URIs (using public Win98 icon repository sources or data URIs for stability)
const WIN98_ICONS = {
  computer: 'https://win98icons.alexmeub.com/icons/png/computer_explorer-5.png',
  documents: 'https://win98icons.alexmeub.com/icons/png/directory_open_file_mydocs-4.png',
  network: 'https://win98icons.alexmeub.com/icons/png/network_normal_two_pcs-2.png',
  recycle: 'https://win98icons.alexmeub.com/icons/png/recycle_bin_empty-4.png',
  ie: 'https://win98icons.alexmeub.com/icons/png/msie1-2.png',
  user: 'https://win98icons.alexmeub.com/icons/png/user_computer-0.png',
  folder: 'https://win98icons.alexmeub.com/icons/png/directory_closed-4.png',
  briefcase: 'https://win98icons.alexmeub.com/icons/png/briefcase-2.png',
  gear: 'https://win98icons.alexmeub.com/icons/png/settings_gear-0.png',
  mail: 'https://win98icons.alexmeub.com/icons/png/message_envelope_open-0.png',
  terminal: 'https://win98icons.alexmeub.com/icons/png/console_prompt-0.png'
};

export const APPS: Record<AppID, AppDefinition> = {
  'my-computer': {
    id: 'my-computer',
    title: 'My Computer',
    iconUrl: WIN98_ICONS.computer,
    component: MyComputerApp,
    defaultWidth: 600,
    defaultHeight: 450,
  },
  'my-documents': {
    id: 'my-documents',
    title: 'My Documents',
    iconUrl: WIN98_ICONS.documents,
    component: MyComputerApp,
    defaultWidth: 600,
    defaultHeight: 450,
  },
  'network': {
    id: 'network',
    title: 'Network Neighborhood',
    iconUrl: WIN98_ICONS.network,
    component: MyComputerApp,
    defaultWidth: 600,
    defaultHeight: 450,
  },
  'recycle-bin': {
    id: 'recycle-bin',
    title: 'Recycle Bin',
    iconUrl: WIN98_ICONS.recycle,
    component: MyComputerApp,
    defaultWidth: 600,
    defaultHeight: 450,
  },
  'ie': {
    id: 'ie',
    title: 'Internet Explorer',
    iconUrl: WIN98_ICONS.ie,
    component: MyComputerApp,
    defaultWidth: 800,
    defaultHeight: 600,
  },
  about: {
    id: 'about',
    title: 'About Sahil',
    iconUrl: WIN98_ICONS.user,
    component: AboutApp,
    defaultWidth: 600,
    defaultHeight: 450,
  },
  projects: {
    id: 'projects',
    title: 'Projects',
    iconUrl: WIN98_ICONS.folder,
    component: ProjectsApp,
    defaultWidth: 800,
    defaultHeight: 600,
  },
  experience: {
    id: 'experience',
    title: 'Experience',
    iconUrl: WIN98_ICONS.briefcase,
    component: AboutApp,
    defaultWidth: 600,
    defaultHeight: 500,
  },
  skills: {
    id: 'skills',
    title: 'Skills',
    iconUrl: WIN98_ICONS.gear,
    component: AboutApp,
    defaultWidth: 500,
    defaultHeight: 450,
  },
  contact: {
    id: 'contact',
    title: 'Contact',
    iconUrl: WIN98_ICONS.mail,
    component: ContactApp,
    defaultWidth: 500,
    defaultHeight: 600,
  },
  terminal: {
    id: 'terminal',
    title: 'MS-DOS Prompt',
    iconUrl: WIN98_ICONS.terminal,
    component: TerminalApp,
    defaultWidth: 600,
    defaultHeight: 400,

  }
};

export interface WindowState {
  id: AppID;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  width?: number;
  height?: number;
  x?: number;
  y?: number;
}

interface OSContextType {
  windows: WindowState[];
  desktopRef: React.RefObject<HTMLDivElement>;
  openWindow: (id: AppID) => void;
  closeWindow: (id: AppID) => void;
  minimizeWindow: (id: AppID) => void;
  restoreWindow: (id: AppID) => void;
  toggleMaximize: (id: AppID) => void;
  focusWindow: (id: AppID) => void;
  updateWindowSize: (id: AppID, width: number, height: number) => void;
  updateWindowPosition: (id: AppID, x: number, y: number) => void;
  desktopItems: DesktopItem[];
  setDesktopItems: React.Dispatch<React.SetStateAction<DesktopItem[]>>;
  addDesktopItem: (item: Partial<DesktopItem>) => void;
  updateDesktopItem: (id: string, updates: Partial<DesktopItem>) => void;
  deleteDesktopItem: (id: string | string[]) => void;
  refreshDesktop: () => void;
  arrangeIcons: () => void;
  activeWindowId: AppID | null;
  soundEnabled: boolean;
  toggleSound: () => void;
}

const OSContext = createContext<OSContextType | undefined>(undefined);

export function OSProvider({ children }: { children: ReactNode }) {
  const desktopRef = useRef<HTMLDivElement>(null);

  // Initialization from localStorage
  const [windows, setWindows] = useState<WindowState[]>(() => {
    if (typeof window === 'undefined') return [];
    const saved = localStorage.getItem('win98-windows');
    return saved ? JSON.parse(saved) : [];
  });

  const [desktopItems, setDesktopItems] = useState<DesktopItem[]>(() => {
    if (typeof window === 'undefined') return [];
    const saved = localStorage.getItem('win98-desktop-items');
    if (saved) return JSON.parse(saved);

    // Default icons if none saved
    return (Object.keys(APPS) as AppID[])
      .filter(id => id !== 'terminal')
      .map((id, i) => ({
        id: `default-${id}`,
        appId: id,
        name: APPS[id].title,
        type: 'app',
        iconUrl: APPS[id].iconUrl,
        x: 20,
        y: 20 + (i * 85)
      }));
  });

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  // Debounced Persistence
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem('win98-windows', JSON.stringify(windows));
    }, 500);
    return () => clearTimeout(timer);
  }, [windows]);

  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem('win98-desktop-items', JSON.stringify(desktopItems));
    }, 500);
    return () => clearTimeout(timer);
  }, [desktopItems]);

  const getTopZIndex = () => {
    return windows.length > 0 ? Math.max(...windows.map(w => w.zIndex)) : 10;
  };

  const activeWindowId = windows
    .filter(w => w.isOpen && !w.isMinimized)
    .sort((a, b) => b.zIndex - a.zIndex)[0]?.id || null;

  const getCenteredPosition = (width: number, height: number, index: number) => {
    if (typeof window === 'undefined') return { x: 50, y: 50 };
    const desktopWidth = window.innerWidth;
    const desktopHeight = window.innerHeight - 28;

    const x = Math.max(0, (desktopWidth - width) / 2) + (index * 20);
    const y = Math.max(0, (desktopHeight - height) / 2) + (index * 20);

    return { x, y };
  };

  const openWindow = (id: AppID) => {
    console.log(`[OS] Opening window: ${id}`);
    setWindows(prev => {
      const exists = prev.find(w => w.id === id);
      const topZ = getTopZIndex() + 10;

      if (exists) {
        return prev.map(w => w.id === id ? { ...w, isOpen: true, isMinimized: false, zIndex: topZ } : w);
      }

      const app = APPS[id];
      const pos = getCenteredPosition(app.defaultWidth, app.defaultHeight, prev.filter(w => w.isOpen).length);

      return [...prev, {
        id,
        isOpen: true,
        isMinimized: false,
        isMaximized: false,
        zIndex: topZ,
        width: app.defaultWidth,
        height: app.defaultHeight,
        x: pos.x,
        y: pos.y,
      }];
    });
  };

  const closeWindow = (id: AppID) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isOpen: false } : w));
  };

  const minimizeWindow = (id: AppID) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isMinimized: true } : w));
  };

  const restoreWindow = (id: AppID) => {
    setWindows(prev => {
      const topZ = getTopZIndex() + 1;
      return prev.map(w => w.id === id ? { ...w, isMinimized: false, zIndex: topZ } : w);
    });
  };

  const toggleMaximize = (id: AppID) => {
    setWindows(prev => {
      const topZ = getTopZIndex() + 1;
      return prev.map(w => w.id === id ? { ...w, isMaximized: !w.isMaximized, zIndex: topZ } : w);
    });
  };

  const focusWindow = (id: AppID) => {
    setWindows(prev => {
      // Always bring to front even if it is the active one, to fix potential z-index collisions
      const topZ = getTopZIndex() + 10;
      return prev.map(w => w.id === id ? { ...w, zIndex: topZ, isMinimized: false } : w);
    });
  };

  const updateWindowSize = (id: AppID, width: number, height: number) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, width, height } : w));
  };

  const updateWindowPosition = (id: AppID, x: number, y: number) => {
    if (isNaN(x) || isNaN(y)) return;
    setWindows(prev => prev.map(w => w.id === id ? { ...w, x, y } : w));
  };

  const addDesktopItem = (item: Partial<DesktopItem>) => {
    setDesktopItems(prev => [...prev, {
      id: uuidv4(),
      name: item.name || 'New Item',
      type: item.type || 'folder',
      iconUrl: item.iconUrl || 'https://win98icons.alexmeub.com/icons/png/directory_closed-4.png',
      x: item.x || 100,
      y: item.y || 100,
      ...item
    }]);
  };

  const updateDesktopItem = (id: string, updates: Partial<DesktopItem>) => {
    setDesktopItems(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
  };

  const deleteDesktopItem = (id: string | string[]) => {
    const idsToDelete = Array.isArray(id) ? id : [id];
    setDesktopItems(prev => prev.filter(item => !idsToDelete.includes(item.id)));
  };

  const refreshDesktop = () => {
    setRefreshKey(prev => prev + 1);
  };

  const arrangeIcons = () => {
    setDesktopItems(prev => {
      const gridX = 85;
      const gridY = 85;
      const startX = 20;
      const startY = 20;
      const maxH = window.innerHeight - 80;

      return prev.map((item, i) => {
        const iconsPerCol = Math.floor(maxH / gridY);
        const col = Math.floor(i / iconsPerCol);
        const row = i % iconsPerCol;

        return {
          ...item,
          x: startX + (col * gridX),
          y: startY + (row * gridY)
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
      refreshDesktop,
      arrangeIcons,
      activeWindowId,
      soundEnabled,
      toggleSound
    }}>
      <div
        key={refreshKey}
        className="theme-win98 contents"
      >
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
