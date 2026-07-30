import React, { useState } from 'react';
import { OSProvider, useOS } from '@/components/os/OSProvider';
import BootSequence from '@/components/os/BootSequence';
import Desktop from '@/components/os/Desktop';
import Taskbar from '@/components/os/Taskbar';
import ShutdownDialog from '@/components/os/ShutdownDialog';
import ShutdownScreen from '@/components/os/ShutdownScreen';
import { playShutdownSound } from '@/lib/soundEffects';

function OSContent() {
  const [booted, setBooted] = useState(false);
  const {
    isShutdown,
    setIsShutdown,
    isShutdownDialogOpen,
    closeShutdownDialog,
    soundEnabled,
  } = useOS();

  const handleConfirmShutdown = (action: 'shutdown' | 'restart') => {
    playShutdownSound(soundEnabled);
    if (action === 'shutdown') {
      setIsShutdown(true);
    } else if (action === 'restart') {
      setBooted(false);
    }
  };

  const handlePowerOn = () => {
    setIsShutdown(false);
    setBooted(false);
  };

  if (isShutdown) {
    return <ShutdownScreen onPowerOn={handlePowerOn} />;
  }

  if (!booted) {
    return <BootSequence onComplete={() => setBooted(true)} />;
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
