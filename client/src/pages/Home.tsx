import React, { useState } from 'react';
import { OSProvider } from '@/components/os/OSProvider';
import BootSequence from '@/components/os/BootSequence';
import Desktop from '@/components/os/Desktop';
import Taskbar from '@/components/os/Taskbar';

export default function Home() {
  const [booted, setBooted] = useState(false);

  return (
    <OSProvider>
      <div className="h-screen w-full bg-black overflow-hidden relative">

        {!booted ? (
          <BootSequence onComplete={() => setBooted(true)} />
        ) : (
          <div className="h-full w-full flex flex-col relative animate-in fade-in duration-1000">
            <Desktop />
            <Taskbar />
          </div>
        )}
      </div>
    </OSProvider>
  );
}
