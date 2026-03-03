import React from 'react';
import { useGallery } from '@/hooks/use-gallery';
import { Loader2 } from 'lucide-react';

export default function GalleryApp() {
  const { data: images, isLoading, error } = useGallery();

  return (
    <div className="p-6 h-full overflow-y-auto bg-black text-white">
      <div className="sticky top-0 bg-black/90 backdrop-blur pb-4 mb-6 border-b border-accent z-10">
        <h1 className="text-3xl font-display text-accent text-shadow-neon-cyan">
          AESTHETIC_ARCHIVE.VIEW
        </h1>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-64 text-accent">
          <Loader2 className="w-12 h-12 animate-spin mb-4" />
          <p className="font-display text-xl tracking-widest">DECODING IMAGES...</p>
        </div>
      ) : error ? (
        <div className="bg-red-900/50 border-2 border-destructive p-4 text-destructive-foreground font-body text-xl">
          CONNECTION LOST
        </div>
      ) : images?.length === 0 ? (
        <div className="text-center font-display text-muted-foreground text-xl">
          NO IMAGES FOUND
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images?.map(img => (
            <div key={img.id} className="relative group overflow-hidden border-2 border-primary/50 hover:border-secondary transition-colors aspect-square">
              <div className="absolute inset-0 bg-secondary/30 mix-blend-color opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none" />
              <img 
                src={img.url} 
                alt={img.title} 
                className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-500"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black/80 border-t border-secondary p-2 translate-y-full group-hover:translate-y-0 transition-transform z-20">
                <p className="font-display text-secondary text-sm truncate text-center">
                  {img.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
