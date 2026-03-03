import FolderApp, { FileItem } from './FolderApp';

export default function MyComputerApp() {
    const items: FileItem[] = [
        {
            id: 'drive-c',
            name: 'Local Disk (C:)',
            type: 'folder',
            iconUrl: 'https://win98icons.alexmeub.com/icons/png/drive_hard-2.png',
            onClick: () => { }
        },
        {
            id: 'drive-d',
            name: 'CD-ROM Disc (D:)',
            type: 'folder',
            iconUrl: 'https://win98icons.alexmeub.com/icons/png/drive_cd-1.png',
            onClick: () => { }
        },
        {
            id: 'control-panel',
            name: 'Control Panel',
            type: 'folder',
            iconUrl: 'https://win98icons.alexmeub.com/icons/png/settings_gear-0.png',
            onClick: () => { }
        },
        {
            id: 'printers',
            name: 'Printers',
            type: 'folder',
            iconUrl: 'https://win98icons.alexmeub.com/icons/png/printer-1.png',
            onClick: () => { }
        }
    ];

    return (
        <FolderApp
            title="My Computer"
            items={items}
            path="My Computer"
            iconUrl="https://win98icons.alexmeub.com/icons/png/computer_explorer-5.png"
        />
    );
}
