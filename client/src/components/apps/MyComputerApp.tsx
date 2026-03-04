import React, { useState } from 'react';
import { useOS } from '../os/OSProvider';
import {
    ExplorerMenuBar,
    ExplorerToolbar,
    ExplorerAddressBar,
    ExplorerStatusBar,
    ExplorerContent,
    ExplorerItem
} from './ExplorerComponents';

export default function MyComputerApp({ onClose }: { onClose?: () => void }) {
    const { openWindow } = useOS();
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const items: ExplorerItem[] = [
        {
            id: 'drive-c',
            name: 'Local Disk (C:)',
            iconUrl: 'https://win98icons.alexmeub.com/icons/png/drive_hard-2.png',
            onDoubleClick: () => openWindow('my-documents')
        },
        {
            id: 'drive-d',
            name: 'CD-ROM Disc (D:)',
            iconUrl: 'https://win98icons.alexmeub.com/icons/png/drive_cd-1.png',
        },
        {
            id: 'control-panel',
            name: 'Control Panel',
            iconUrl: 'https://win98icons.alexmeub.com/icons/png/settings_gear-0.png',
            onDoubleClick: () => openWindow('skills') // Mock navigation
        },
        {
            id: 'printers',
            name: 'Printers',
            iconUrl: 'https://win98icons.alexmeub.com/icons/png/printer-1.png',
        }
    ];

    return (
        <div className="flex flex-col h-full bg-[#c0c0c0]" onClick={() => setSelectedId(null)}>
            <ExplorerMenuBar iconUrl="https://win98icons.alexmeub.com/icons/png/computer_explorer-5.png" />
            <ExplorerToolbar />
            <ExplorerAddressBar path="My Computer" iconUrl="https://win98icons.alexmeub.com/icons/png/computer_explorer-5.png" />

            <ExplorerContent
                items={items}
                selectedId={selectedId}
                onSelect={(id) => setSelectedId(id)}
            />

            <ExplorerStatusBar
                objectCount={items.length}
                bytesCount="0"
                contextName="My Computer"
            />
        </div>
    );
}
