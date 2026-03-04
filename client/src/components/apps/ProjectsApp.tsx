import React from 'react';
import { useOS } from '../os/OSProvider';
import { useProjects } from '@/hooks/use-projects';
import { Loader2, AlertCircle } from 'lucide-react';
import FolderApp, { FileItem } from './FolderApp';

export default function ProjectsApp() {
  const { openWindow } = useOS();
  const { data: projects, isLoading, error } = useProjects();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-white text-gray-500">
        <Loader2 className="w-8 h-8 animate-spin mb-2" />
        <p>Scanning local disk...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-full bg-white">
        <div className="win98-inset bg-[#dfdfdf] p-4 text-red-700 flex items-center gap-3 m-4">
          <AlertCircle size={24} />
          <div>
            <p className="font-bold">Disk Error</p>
            <p className="text-xs">The requested directory could not be reached or is corrupted.</p>
          </div>
        </div>
      </div>
    );
  }

  // Map projects to generic FileItems for the FolderApp
  const items: FileItem[] = (projects || []).map((p: any) => ({
    id: p._id as string,
    name: p.title,
    type: 'file',
    // Use an executable or document icon.
    iconUrl: 'https://win98icons.alexmeub.com/icons/png/executable_script-0.png',
    onDoubleClick: () => {
      openWindow('project-details', p);
    }
  }));

  return (
    <FolderApp
      title="Projects"
      items={items}
      path="C:\My Documents\Projects"
      iconUrl="https://win98icons.alexmeub.com/icons/png/directory_closed-4.png"
    />
  );
}

