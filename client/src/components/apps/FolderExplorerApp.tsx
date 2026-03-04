import React, { useState } from 'react';
import { useOS, DesktopItem } from '../os/OSProvider';
import {
    ExplorerMenuBar,
    ExplorerToolbar,
    ExplorerAddressBar,
    ExplorerStatusBar,
    ExplorerContent
} from './ExplorerComponents';

interface FolderExplorerProps {
    onClose?: () => void;
    params?: {
        item: DesktopItem;
    };
}

export default function FolderExplorerApp({ onClose, params }: FolderExplorerProps) {
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const folderName = params?.item?.name || 'Folder';
    const path = `Desktop\\${folderName}`;

    // For now, folders are empty as per requirements
    const items: any[] = [];

    return (
        <div className="flex flex-col h-full bg-[#c0c0c0]" onClick={() => setSelectedId(null)}>
            <ExplorerMenuBar iconUrl="https://win98icons.alexmeub.com/icons/png/directory_open-4.png" />
            <ExplorerToolbar />
            <ExplorerAddressBar path={path} iconUrl="https://win98icons.alexmeub.com/icons/png/directory_closed-4.png" />

            <ExplorerContent
                items={items}
                selectedId={selectedId}
                onSelect={(id) => setSelectedId(id)}
            />

            <ExplorerStatusBar
                objectCount={items.length}
                bytesCount="0"
                contextName={folderName}
            />
        </div>
    );
}
