import React, { useState } from 'react';
import { Play, Pause, SkipForward, SkipBack, Disc } from 'lucide-react';
import { useOS } from '../os/OSProvider';

export default function MusicApp() {
  const [isPlaying, setIsPlaying] = useState(false);
  const { soundEnabled } = useOS();

  return (
    <div className="h-full flex flex-col bg-[#11091f] border-4 border-t-[#3a1d63] border-l-[#3a1d63] border-b-[#0b0514] border-r-[#0b0514]">
      
      {/* LCD Screen */}
      <div className="m-4 bg-black border-2 border-primary p-4 flex gap-4 box-shadow-neon-pink">
        <div className="w-24 h-24 bg-primary/20 flex items-center justify-center border border-primary relative overflow-hidden">
          <Disc 
            className={`w-16 h-16 text-primary ${isPlaying ? 'animate-spin' : ''}`} 
            style={{ animationDuration: '3s' }}
          />
          {/* subtle scanline over cover */}
          <div className="absolute inset-0 pointer-events-none bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,0,0,0.3)_2px,rgba(0,0,0,0.3)_4px)]" />
        </div>
        
        <div className="flex-1 flex flex-col justify-between font-display text-secondary">
          <div>
            <div className="text-sm text-primary animate-pulse">PLAYING</div>
            <div className="text-xl truncate text-shadow-neon-cyan">RESONANCE.MP3</div>
            <div className="text-sm opacity-80 mt-1">HOME</div>
          </div>
          
          <div className="flex items-end justify-between text-xs">
            <span>{isPlaying ? '01:24' : '00:00'}</span>
            <div className="flex-1 mx-2 h-2 bg-secondary/20 border border-secondary relative">
              <div className={`absolute top-0 left-0 h-full bg-secondary ${isPlaying ? 'w-1/3' : 'w-0'} transition-all`} />
            </div>
            <span>04:20</span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="px-6 pb-6 flex items-center justify-center gap-6 mt-auto">
        <button className="w-12 h-12 bg-[#2a1447] border-t border-l border-primary border-r-black border-b-black flex items-center justify-center text-primary hover:text-white active:bg-primary">
          <SkipBack size={24} fill="currentColor" />
        </button>
        
        <button 
          onClick={() => setIsPlaying(!isPlaying)}
          className="w-16 h-16 bg-[#2a1447] border-t border-l border-primary border-r-black border-b-black flex items-center justify-center text-secondary hover:text-white active:bg-secondary"
        >
          {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-2" />}
        </button>
        
        <button className="w-12 h-12 bg-[#2a1447] border-t border-l border-primary border-r-black border-b-black flex items-center justify-center text-primary hover:text-white active:bg-primary">
          <SkipForward size={24} fill="currentColor" />
        </button>
      </div>

      {!soundEnabled && isPlaying && (
        <div className="text-center font-display text-destructive text-sm pb-2 animate-bounce">
          WARNING: SYSTEM AUDIO MUTED
        </div>
      )}
    </div>
  );
}
