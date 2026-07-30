import React, { useState } from 'react';
import { OSProvider, useOS } from '@/components/os/OSProvider';
import BootSequence from '@/components/os/BootSequence';
import Desktop from '@/components/os/Desktop';
import Taskbar from '@/components/os/Taskbar';
import ShutdownDialog from '@/components/os/ShutdownDialog';
import ShutdownScreen from '@/components/os/ShutdownScreen';
import { playShutdownSound } from '@/lib/soundEffects';

function OSContent() {
  const [booted, setBooted] = useState(() => {
    if (typeof window === 'undefined') return false;
    return sessionStorage.getItem('win98-booted') === 'true';
  });

  const {
    isShutdown,
    setIsShutdown,
    isShutdownDialogOpen,
    closeShutdownDialog,
    soundEnabled,
  } = useOS();

  const handleBootComplete = () => {
    sessionStorage.setItem('win98-booted', 'true');
    setBooted(true);
  };

  const handleConfirmShutdown = (action: 'shutdown' | 'restart') => {
    playShutdownSound(soundEnabled);
    sessionStorage.removeItem('win98-booted');
    if (action === 'shutdown') {
      setIsShutdown(true);
    } else if (action === 'restart') {
      setBooted(false);
    }
  };

  const handlePowerOn = () => {
    sessionStorage.removeItem('win98-booted');
    setIsShutdown(false);
    setBooted(false);
  };

  if (isShutdown) {
    return <ShutdownScreen onPowerOn={handlePowerOn} />;
  }

  if (!booted) {
    return <BootSequence onComplete={handleBootComplete} />;
  }

  return (
    <div className="h-full w-full flex flex-col relative animate-in fade-in duration-1000">
      <Desktop />
      <Taskbar />
      <ShutdownDialog
        isOpen={isShutdownDialogOpen}
        onClose={closeShutdownDialog}
        onConfirm={handleConfirmShutdown}
      />
    </div>
  );
}

export default function Home() {
  return (
    <OSProvider>
      <div className="h-screen w-full bg-black overflow-hidden relative">
        <OSContent />
      </div>
    </OSProvider>
  );
}
