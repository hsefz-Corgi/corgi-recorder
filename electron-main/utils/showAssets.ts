import { BrowserWindow } from 'electron';

export default async function showAssets(path: string) {
    return new Promise<void>(resolve => {
        const window = new BrowserWindow({
            width: 800,
            height: 450,
            show: false
        });
        window.setAlwaysOnTop(true, 'screen-saver');
        window.setPosition(0, 0);
        if (path.includes('http') || path.includes('https'))
            window.loadURL(path);
        else
            window.loadFile(path);
        window.setMenu(null);
        window.on('ready-to-show', () => window.show());
        window.on('closed', resolve);
        window.title = path;
    });
}