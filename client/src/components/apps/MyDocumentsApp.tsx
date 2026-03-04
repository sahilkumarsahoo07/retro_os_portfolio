import React, { useState } from 'react';
import { useOS, AppID } from '../os/OSProvider';
import {
    ExplorerMenuBar,
    ExplorerToolbar,
    ExplorerAddressBar,
    ExplorerStatusBar,
    ExplorerContent,
    ExplorerItem
} from './ExplorerComponents';

export default function MyDocumentsApp({ onClose }: { onClose?: () => void }) {
    const { openWindow } = useOS();
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const items: ExplorerItem[] = [
        {
            id: 'resume',
            name: 'Resume',
            iconUrl: 'https://win98icons.alexmeub.com/icons/png/briefcase-2.png',
            onDoubleClick: () => openWindow('experience') // Temporarily map to experience or a new 'resume' app
        },
        {
            id: 'projects',
            name: 'Projects',
            iconUrl: 'https://win98icons.alexmeub.com/icons/png/directory_open_file_mydocs-4.png',
            onDoubleClick: () => openWindow('projects')
        },
        {
            id: 'experience',
            name: 'Experience',
            iconUrl: 'https://win98icons.alexmeub.com/icons/png/briefcase-2.png',
            onDoubleClick: () => openWindow('experience')
        },
        {
            id: 'skills',
            name: 'Skills',
            iconUrl: 'https://win98icons.alexmeub.com/icons/png/settings_gear-0.png',
            onDoubleClick: () => openWindow('skills')
        },
        {
            id: 'certifications',
            name: 'Certifications',
            iconUrl: 'https://win98icons.alexmeub.com/icons/png/certificate_2-0.png',
            onDoubleClick: () => { } // Will implement sub-navigation or new app
        },
        {
            id: 'achievements',
            name: 'Achievements',
            iconUrl: 'https://win98icons.alexmeub.com/icons/png/medal_gold_3-0.png',
            onDoubleClick: () => { }
        },
        {
            id: 'contact',
            name: 'Contact Info',
            iconUrl: 'https://win98icons.alexmeub.com/icons/png/message_envelope_open-0.png',
            onDoubleClick: () => openWindow('contact')
        },
        {
            id: 'about',
            name: 'About Me',
            iconUrl: 'https://win98icons.alexmeub.com/icons/png/user_computer-0.png',
            onDoubleClick: () => openWindow('about')
        }
    ];

    return (
        <div className="flex flex-col h-full bg-[#c0c0c0]" onClick={() => setSelectedId(null)}>
            <ExplorerMenuBar iconUrl="https://win98icons.alexmeub.com/icons/png/directory_open_file_mydocs-4.png" />
            <ExplorerToolbar />
            <ExplorerAddressBar path="C:\My Documents" iconUrl="https://win98icons.alexmeub.com/icons/png/directory_open_file_mydocs-4.png" />

            <ExplorerContent
                items={items}
                selectedId={selectedId}
                onSelect={(id) => setSelectedId(id)}
            />

            <ExplorerStatusBar
                objectCount={items.length}
                bytesCount="0"
                contextName="My Documents"
            />
        </div>
    );
}
