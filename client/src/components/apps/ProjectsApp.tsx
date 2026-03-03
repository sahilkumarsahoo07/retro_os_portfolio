import React from 'react';
import { useProjects } from '@/hooks/use-projects';
import { ExternalLink, Github, Loader2 } from 'lucide-react';

export default function ProjectsApp() {
  const { data: projects, isLoading, error } = useProjects();

  return (
    <div className="p-6 h-full overflow-y-auto bg-[#090014] text-white">
      <h1 className="text-3xl font-display text-secondary text-shadow-neon-cyan mb-8 border-b-2 border-secondary pb-4">
        PROJECTS.DIR
      </h1>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-64 text-secondary">
          <Loader2 className="w-12 h-12 animate-spin mb-4" />
          <p className="font-display text-xl tracking-widest">LOADING DATA...</p>
        </div>
      ) : error ? (
        <div className="bg-red-900/50 border-2 border-destructive p-4 text-destructive-foreground font-body text-xl">
          ERROR 404: DIRECTORY CORRUPTED OR BACKEND OFFLINE.
        </div>
      ) : projects?.length === 0 ? (
        <div className="text-center font-display text-muted-foreground text-xl">
          NO PROJECTS FOUND
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects?.map(project => (
            <div 
              key={project.id} 
              className="bg-black/60 border border-primary p-4 hover:border-secondary hover:bg-primary/10 transition-all group box-shadow-neon-pink hover:box-shadow-neon-cyan"
            >
              {project.imageUrl && (
                <div className="h-40 overflow-hidden mb-4 border border-primary/50 relative">
                  <div className="absolute inset-0 bg-primary/20 group-hover:bg-transparent transition-colors z-10" />
                  <img 
                    src={project.imageUrl} 
                    alt={project.title} 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" 
                  />
                </div>
              )}
              
              <h2 className="text-2xl font-display text-primary group-hover:text-secondary transition-colors mb-2">
                {project.title}
              </h2>
              
              <p className="font-body text-lg text-white/80 mb-4 line-clamp-3">
                {project.description}
              </p>
              
              {project.tech && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tech.split(',').map(tech => (
                    <span key={tech} className="bg-secondary/20 text-secondary border border-secondary px-2 py-1 text-sm font-display">
                      {tech.trim()}
                    </span>
                  ))}
                </div>
              )}
              
              <div className="flex gap-4 mt-auto pt-4 border-t border-primary/30">
                {project.link && (
                  <a 
                    href={project.link} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center gap-2 text-primary hover:text-white transition-colors font-display text-sm tracking-widest"
                  >
                    <ExternalLink size={16} /> LAUNCH
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
