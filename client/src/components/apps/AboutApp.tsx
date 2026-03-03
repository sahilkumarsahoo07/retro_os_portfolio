import React from 'react';

export default function AboutApp() {
  return (
    <div className="p-6 h-full overflow-y-auto crt-flicker bg-[#090014] text-pink-100 font-body text-xl space-y-6">
      <div className="flex items-center gap-6 border-b border-primary/50 pb-6">
        {/* retro hacker avatar */}
        <img 
          src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=200&h=200&fit=crop" 
          alt="Avatar" 
          className="w-32 h-32 border-4 border-secondary object-cover"
        />
        <div>
          <h1 className="text-4xl font-display text-primary text-shadow-neon-pink">GUEST_USER</h1>
          <p className="text-secondary text-2xl tracking-widest mt-2">&gt; LEVEL 99 NETRUNNER</p>
        </div>
      </div>
      
      <div>
        <h2 className="text-2xl font-display text-accent mb-4">README.TXT</h2>
        <div className="space-y-4 text-white/80 leading-relaxed">
          <p>
            Welcome to my digital space. I am a fullstack developer trapped in a retro timeline. 
            I build highly interactive, beautiful, and slightly nostalgic web experiences.
          </p>
          <p>
            Skills include React, TypeScript, Node.js, and an unhealthy obsession with 
            CSS gradients and glowing elements.
          </p>
          <div className="bg-black/50 p-4 border-l-4 border-primary mt-6 text-primary">
            "We are all just programs in the grand simulation."
          </div>
        </div>
      </div>
    </div>
  );
}
