import React, { createContext, useContext, useState, useRef, ReactNode } from 'react';
import AboutApp from '../apps/AboutApp';
import ProjectsApp from '../apps/ProjectsApp';
import GalleryApp from '../apps/GalleryApp';
import MusicApp from '../apps/MusicApp';
import ContactApp from '../apps/ContactApp';
import TerminalApp from '../apps/TerminalApp';

export type AppID = 'about' | 'projects' | 'gallery' | 'music' | 'contact' | 'terminal';

export interface AppDefinition {
  id: AppID;
  title: string;
  iconUrl: string;
  component: React.FC<{ onClose: () => void }>;
  defaultWidth: number;
  defaultHeight: number;
}

export const APPS: Record<AppID, AppDefinition> = {
  about: {
    id: 'about',
    title: 'ABOUT_ME.EXE',
    iconUrl: 'https://api.iconify.design/lucide/user.svg?color=%23ff33ff&width=48',
    component: AboutApp,
    defaultWidth: 500,
    defaultHeight: 450,
  },
  projects: {
    id: 'projects',
    title: 'PROJECTS.DIR',
    iconUrl: 'https://api.iconify.design/lucide/folder-open.svg?color=%2300ffff&width=48',
    component: ProjectsApp,
    defaultWidth: 700,
    defaultHeight: 500,
  },
  gallery: {
    id: 'gallery',
    title: 'GALLERY.VIEW',
    iconUrl: 'https://api.iconify.design/lucide/image.svg?color=%23ffd700&width=48',
    component: GalleryApp,
    defaultWidth: 750,
    defaultHeight: 550,
  },
  music: {
    id: 'music',
    title: 'SYNTH_AMP.MP3',
    iconUrl: 'https://api.iconify.design/lucide/music.svg?color=%23ff33ff&width=48',
    component: MusicApp,
    defaultWidth: 400,
    defaultHeight: 300,
  },
  contact: {
    id: 'contact',
    title: 'MAIL_CLIENT.COM',
    iconUrl: 'https://api.iconify.design/lucide/mail.svg?color=%2300ffff&width=48',
    component: ContactApp,
    defaultWidth: 500,
    defaultHeight: 600,
  },
  terminal: {
    id: 'terminal',
    title: 'FUN_STUFF.BAT',
    iconUrl: 'https://api.iconify.design/lucide/terminal.svg?color=%2300ff00&width=48',
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
  activeWindowId: AppID | null;
  soundEnabled: boolean;
  toggleSound: () => void;
}

const OSContext = createContext<OSContextType | undefined>(undefined);

export function OSProvider({ children }: { children: ReactNode }) {
  const desktopRef = useRef<HTMLDivElement>(null);
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  const getTopZIndex = () => {
    return windows.length > 0 ? Math.max(...windows.map(w => w.zIndex)) : 10;
  };

  const activeWindowId = windows
    .filter(w => w.isOpen && !w.isMinimized)
    .sort((a, b) => b.zIndex - a.zIndex)[0]?.id || null;

  const openWindow = (id: AppID) => {
    setWindows(prev => {
      const exists = prev.find(w => w.id === id);
      const topZ = getTopZIndex() + 1;
      
      if (exists) {
        return prev.map(w => w.id === id ? { ...w, isOpen: true, isMinimized: false, zIndex: topZ } : w);
      }
      
      return [...prev, {
        id,
        isOpen: true,
        isMinimized: false,
        isMaximized: false,
        zIndex: topZ
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
      if (activeWindowId === id) return prev;
      const topZ = getTopZIndex() + 1;
      return prev.map(w => w.id === id ? { ...w, zIndex: topZ, isMinimized: false } : w);
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
      activeWindowId,
      soundEnabled,
      toggleSound
    }}>
      {children}
    </OSContext.Provider>
  );
}

export function useOS() {
  const context = useContext(OSContext);
  if (!context) throw new Error("useOS must be used within an OSProvider");
  return context;
}
